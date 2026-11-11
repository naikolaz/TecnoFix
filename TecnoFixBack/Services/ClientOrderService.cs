using TecnoFixBack.DTOs;
using TecnoFixBack.Exceptions;
using TecnoFixBack.Interfaces;
using TecnoFixBack.Models;

namespace TecnoFixBack.Services;

public class ClientOrderService : IClientOrderService
{
    private const string BudgetNotAvailableMessage = "El presupuesto no está disponible para su aprobación";
    private const string OrderNotFoundMessage = "No se encontró la orden solicitada";
    private const string ApprovedAction = "Presupuesto aprobado por el cliente";
    private const string RejectedAction = "Presupuesto rechazado por el cliente";

    private readonly IOrderRepository _orderRepository;

    public ClientOrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<IEnumerable<ClientOrderDto>> GetOrdersAsync(int clientId)
    {
        var orders = await _orderRepository.GetByClientIdAsync(clientId);
        return orders.Select(MapToDto);
    }

    public async Task<ClientOrderDto> GetOrderAsync(int orderId, int clientId)
    {
        var order = await GetOwnedOrderAsync(orderId, clientId);
        return MapToDto(order);
    }

    public Task<ClientOrderDto> ApproveBudgetAsync(int orderId, int clientId)
    {
        return DecideBudgetAsync(orderId, clientId, OrderStatus.InRepair, ApprovedAction);
    }

    public Task<ClientOrderDto> RejectBudgetAsync(int orderId, int clientId)
    {
        return DecideBudgetAsync(orderId, clientId, OrderStatus.Rejected, RejectedAction);
    }

    private async Task<ClientOrderDto> DecideBudgetAsync(int orderId, int clientId, string newStatus, string action)
    {
        var order = await GetOwnedOrderAsync(orderId, clientId);

        if (order.status != OrderStatus.Budgeted)
            throw new BusinessRuleException(BudgetNotAvailableMessage);

        var decisionLog = new OrderLog
        {
            action = $"{action} - Estado: {newStatus}",
            date = DateTime.UtcNow
        };

        var statusChanged = await _orderRepository.ChangeStatusAsync(order, newStatus, decisionLog);

        if (!statusChanged)
            throw new BusinessRuleException(BudgetNotAvailableMessage);

        return MapToDto(order);
    }

    private async Task<Order> GetOwnedOrderAsync(int orderId, int clientId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);

        if (order is null || order.clientId != clientId)
            throw new KeyNotFoundException(OrderNotFoundMessage);

        return order;
    }

    private static ClientOrderDto MapToDto(Order order)
    {
        return new ClientOrderDto
        {
            Id = order.id,
            DeviceType = order.deviceType,
            BrandAndModel = order.brandAndModel,
            SerialNumber = order.serialNumber,
            IssueDescription = order.issueDescription,
            Accessories = order.accessories,
            Status = order.status,
            CreatedAt = order.createdAt,
            CanDecideBudget = order.status == OrderStatus.Budgeted,
            Budget = MapBudget(order)
        };
    }

    private static BudgetDto? MapBudget(Order order)
    {
        if (order.laborCost is null || order.partsCost is null)
            return null;

        return new BudgetDto
        {
            Diagnosis = order.diagnosis ?? string.Empty,
            LaborCost = order.laborCost.Value,
            PartsCost = order.partsCost.Value,
            TotalCost = order.laborCost.Value + order.partsCost.Value
        };
    }
}
