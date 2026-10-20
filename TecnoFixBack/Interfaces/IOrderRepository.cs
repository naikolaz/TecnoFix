using TecnoFixBack.Models;

namespace TecnoFixBack.Interfaces;

public interface IOrderRepository
{
    Task<Order> CreateOrderAsync(Order order, OrderLog initialLog);
    Task<bool> ClientExistsAsync(int clientId);
}