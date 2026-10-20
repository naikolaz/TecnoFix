using TecnoFixBack.DTOs;
using TecnoFixBack.Interfaces;
using TecnoFixBack.Models;

namespace TecnoFixBack.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderDto dto, int currentUserId)
    {
        if (!await _orderRepository.ClientExistsAsync(dto.ClientId))
        {
            throw new Exception("The specified client does not exist or is not registered as a client.");
        }

        var newOrder = new Order
        {
            clientId = dto.ClientId,
            deviceType = dto.DeviceType,
            brandAndModel = dto.DeviceBrand,
            serialNumber = dto.serialNumber,
            issueDescription = dto.ProblemDescription,
            accessories = dto.accessories,
            status = "Ingresado",
            createdAt = DateTime.UtcNow
        };

    var initialLog = new OrderLog
{
    action = $"Order created in system by user ID: {currentUserId}",
    date = DateTime.UtcNow
};

return await _orderRepository.CreateOrderAsync(newOrder, initialLog);
    }
}