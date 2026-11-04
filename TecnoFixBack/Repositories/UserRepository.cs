using Microsoft.EntityFrameworkCore;
using TecnoFixBack.Data;
using TecnoFixBack.Interfaces;
using TecnoFixBack.Models;

namespace TecnoFixBack.Repositories;

public class UserRepository : IUserRepository
{
    private readonly TecnoFixContext _context;

    public UserRepository(TecnoFixContext context)
    {
        _context = context;
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLower();
        return await _context.Users.AnyAsync(u => u.email.ToLower() == normalizedEmail);
    }

    public async Task<bool> RutExistsAsync(string rut)
    {
        return await _context.Users.AnyAsync(u => u.RUT == rut);
    }

    public async Task CreateUserAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLower();

        return await _context.Users
            .AsNoTracking()
            .Include(u => u.role)
            .FirstOrDefaultAsync(u => u.email.ToLower() == normalizedEmail);
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<IEnumerable<User>> GetClientsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Where(u => u.idRole == 2) // Role 2: Client
            .OrderBy(u => u.name)
            .ToListAsync(cancellationToken);
    }
}
