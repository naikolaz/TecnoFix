using TecnoFixBack.DTOs;

namespace TecnoFixBack.Interfaces;

public interface IClientOrderService
{
    Task<IEnumerable<ClientOrderDto>> GetOrdersAsync(int clientId);
    Task<ClientOrderDto> GetOrderAsync(int orderId, int clientId);
    Task<ClientOrderDto> ApproveBudgetAsync(int orderId, int clientId);
    Task<ClientOrderDto> RejectBudgetAsync(int orderId, int clientId);
}
