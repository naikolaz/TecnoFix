using TecnoFixBack.Models;

namespace TecnoFixBack.Interfaces;

public interface IOrderRepository
{
    Task<Order> CreateAsync(Order order);
    Task<Order> CreateOrderAsync(Order order, OrderLog initialLog);
    Task<IEnumerable<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task<IEnumerable<Order>> GetByClientIdAsync(int clientId);
}
