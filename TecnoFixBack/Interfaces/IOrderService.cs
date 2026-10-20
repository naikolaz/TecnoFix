using TecnoFixBack.DTOs;

using TecnoFixBack.Models;


namespace TecnoFixBack.Interfaces;

public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderDto dto, int currentUserId);
}