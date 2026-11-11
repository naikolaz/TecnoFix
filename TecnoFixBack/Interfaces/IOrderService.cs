using TecnoFixBack.DTOs;

namespace TecnoFixBack.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> CreateOrderAsync(CreateOrderDto dto);
    Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync();
    Task<OrderResponseDto?> GetOrderByIdAsync(int id);
    Task<IEnumerable<OrderResponseDto>> GetOrdersByClientIdAsync(int clientId);
    Task<bool> StartDiagnosisAsync(int orderId, int technicianId);
    Task<OrderResponseDto?> SaveDiagnosisAndBudgetAsync(int orderId, UpdateDiagnosisDto dto, int technicianId);
}