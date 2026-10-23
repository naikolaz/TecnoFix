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
    // Usar _context.Users.FindAsync o userRepository.ObtenerPorIdAsync
    var client = await _context.Users.FindAsync(dto.ClientId);
    
    // Usar client.idRole o client.IdRole según esté definido en User.cs
    if (client == null || client.idRole != 2)
    {
        throw new ArgumentException("The specified client does not exist or is not registered as a client.");
    }

    string brandAndModelFormatted = await ProcessAndNormalizeBrandAndModelAsync(dto.Brand, dto.Model);

    var order = new Order
    {
        clientId = dto.ClientId,
        deviceType = dto.DeviceType,
        brandAndModel = brandAndModelFormatted,
        serialNumber = dto.SerialNumber,
        issueDescription = dto.IssueDescription,
        accessories = dto.Accessories,
        status = "Ingresado",
        createdAt = DateTime.UtcNow
    };

    var createdOrder = await _orderRepository.CreateAsync(order);

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

        // 1. Buscar o registrar la Marca sin duplicar por mayúsculas/minúsculas
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

        // 2. Si se especificó un modelo, buscarlo o registrarlo asociado a esa marca
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

   
}