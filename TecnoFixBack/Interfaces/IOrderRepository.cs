using TecnoFixBack.Models;

namespace TecnoFixBack.Interfaces;

public interface IOrderRepository
{
    Task<Order> CreateAsync(Order order);
    Task<IEnumerable<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task<IEnumerable<Order>> GetByClientIdAsync(int clientId);
}