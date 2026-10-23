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
        return await _context.Users.AnyAsync(u => u.ID == clientId && u.idRole == 2);
    }

    public async Task<Order> CreateAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
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

    public async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await _context.Orders
            .Include(o => o.client)
            .OrderByDescending(o => o.id)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByClientIdAsync(int clientId)
    {
        return await _context.Orders
            .Include(o => o.client)
            .Where(o => o.clientId == clientId)
            .OrderByDescending(o => o.id)
            .ToListAsync();
    }


    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.client)
            .FirstOrDefaultAsync(o => o.id == id);
    }

    private async Task<string> ProcessAndNormalizeBrandAndModelAsync(string rawBrand, string rawModel)
{
    if (string.IsNullOrWhiteSpace(rawBrand)) return string.Empty;

    string cleanBrandName = rawBrand.Trim();
    string cleanModelName = rawModel?.Trim() ?? string.Empty;

    // 1. Buscar o registrar la Marca (Case-insensitive)
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
}
