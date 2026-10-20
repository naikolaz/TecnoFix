using Microsoft.EntityFrameworkCore;
using TecnoFixBack.Data;
using TecnoFixBack.Interfaces;
using TecnoFixBack.Models;

namespace TecnoFixBack.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly TecnoFixContext _context;

    public OrderRepository(TecnoFixContext context)
    {
        _context = context;
    }

    public async Task<bool> ClientExistsAsync(int clientId)
    {
        return await _context.Usuarios.AnyAsync(u => u.ID == clientId && u.idRole == 2);
    }

    public async Task<Order> CreateOrderAsync(Order order, OrderLog initialLog)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            initialLog.orderId = order.id;
            await _context.Loggers.AddAsync(initialLog);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return order;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}