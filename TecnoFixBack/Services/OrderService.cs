using Microsoft.EntityFrameworkCore;
using TecnoFixBack.Data;
using TecnoFixBack.DTOs;
using TecnoFixBack.Interfaces;
using TecnoFixBack.Models;

namespace TecnoFixBack.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUserRepository _userRepository;
    private readonly TecnoFixContext _context;

    public OrderService(
        IOrderRepository orderRepository, 
        IUserRepository userRepository, 
        TecnoFixContext context)
    {
        _orderRepository = orderRepository;
        _userRepository = userRepository;
        _context = context;
    }

    public async Task<OrderResponseDto> CreateOrderAsync(CreateOrderDto dto)
    {
        var client = await _context.Users.FindAsync(dto.ClientId);
        
        // idRole 2 corresponds to Client
        if (client == null || client.idRole != 2)
        {
            throw new ArgumentException("El cliente especificado no existe o no tiene rol de cliente.");
        }

        string brandAndModelFormatted = await ProcessAndNormalizeBrandAndModelAsync(dto.Brand, dto.Model);

        // ORD-001 requirement: Assign status «Recibida» and record receipt timestamp
        var order = new Order
        {
            clientId = dto.ClientId,
            deviceType = dto.DeviceType,
            brandAndModel = brandAndModelFormatted,
            serialNumber = dto.SerialNumber,
            issueDescription = dto.IssueDescription,
            accessories = dto.Accessories,
            status = "Recibida",
            createdAt = DateTime.UtcNow
        };

        // ORD-001 requirement: Record first event in the audit log (bitácora)
        var initialLog = new OrderLog
        {
            action = "Recepción de equipo - Estado: Recibida",
            date = DateTime.UtcNow
        };

        var createdOrder = await _orderRepository.CreateOrderAsync(order, initialLog);

        return MapToDto(createdOrder, client);
    }

    public async Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return orders.Select(o => MapToDto(o, o.client));
    }

    public async Task<OrderResponseDto?> GetOrderByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null) return null;
        return MapToDto(order, order.client);
    }

    public async Task<IEnumerable<OrderResponseDto>> GetOrdersByClientIdAsync(int clientId)
    {
        var orders = await _orderRepository.GetByClientIdAsync(clientId);
        return orders.Select(o => MapToDto(o, o.client));
    }

    private async Task<string> ProcessAndNormalizeBrandAndModelAsync(string rawBrand, string? rawModel)
    {
        if (string.IsNullOrWhiteSpace(rawBrand)) return string.Empty;

        string cleanBrandName = rawBrand.Trim();
        string cleanModelName = rawModel?.Trim() ?? string.Empty;

        // 1. Search or register Brand case-insensitively
        var brand = await _context.Brands
            .FirstOrDefaultAsync(b => b.Name.ToLower() == cleanBrandName.ToLower());

        if (brand == null)
        {
            string formattedBrand = System.Globalization.CultureInfo.CurrentCulture.TextInfo
                .ToTitleCase(cleanBrandName.ToLower());

            brand = new Brand { Name = formattedBrand };
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
        }

        // 2. If a model was specified, search or register it linked to that brand
        if (!string.IsNullOrWhiteSpace(cleanModelName))
        {
            var model = await _context.Models
                .FirstOrDefaultAsync(m => m.BrandId == brand.Id && m.Name.ToLower() == cleanModelName.ToLower());

            if (model == null)
            {
                _context.Models.Add(new DeviceModel
                {
                    Name = cleanModelName,
                    BrandId = brand.Id
                });
                await _context.SaveChangesAsync();
            }
        }

        return string.IsNullOrWhiteSpace(cleanModelName) 
            ? brand.Name 
            : $"{brand.Name} {cleanModelName}";
    }

    private static OrderResponseDto MapToDto(Order order, User? client)
    {
        return new OrderResponseDto
        {
            Id = order.id,
            ClientId = order.clientId,
            ClientName = client?.name ?? "Desconocido",
            ClientEmail = client?.email ?? string.Empty,
            DeviceType = order.deviceType,
            BrandAndModel = order.brandAndModel,
            SerialNumber = order.serialNumber,
            IssueDescription = order.issueDescription,
            Accessories = order.accessories,
            Status = order.status,
            CreatedAt = order.createdAt
        };
    }

    public async Task<bool> StartDiagnosisAsync(int orderId, int technicianId)
    {
        var order = await _context.Orders.FindAsync(orderId);
        
        if (order == null || order.status != "Recibida")
        {
            return false; // Solo puede pasar a En diagnóstico si está Recibida
        }

        order.status = "En diagnóstico";

        var log = new OrderLog
        {
            orderId = order.id,
            action = "Inicio de diagnóstico técnico",
            date = DateTime.UtcNow
        };

        _context.Loggers.Add(log);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<OrderResponseDto?> SaveDiagnosisAndBudgetAsync(int orderId, UpdateDiagnosisDto dto, int technicianId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        
        if (order == null || (order.status != "Recibida" && order.status != "En diagnóstico"))
        {
            throw new ArgumentException("La orden debe estar 'Recibida' o 'En diagnóstico' para registrar presupuesto.");
        }

        // Registrar datos del diagnóstico
        order.technicalDiagnosis = dto.TechnicalDiagnosis;
        order.laborCost = dto.LaborCost;
        order.partsCost = dto.PartsCost;
        order.totalCost = dto.LaborCost + dto.PartsCost; // Cálculo del total (IVA incluido)
        order.status = "Presupuestada";

        // Registrar en bitácora
        var log = new OrderLog
        {
            orderId = order.id,
            action = $"Presupuesto generado. Total: {order.totalCost:C}",
            date = DateTime.UtcNow
        };

        _context.Loggers.Add(log);
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();

        return MapToDto(order, order.client);
    }

    

    
}
