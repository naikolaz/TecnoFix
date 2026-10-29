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

    public async Task<bool> ExisteEmailAsync(string email)
    {
        var emailNormalizado = email.Trim().ToLower();
        return await _context.Users.AnyAsync(u => u.email.ToLower() == emailNormalizado);
    }

    public async Task<bool> ExisteRutAsync(string RUT)
    {
        return await _context.Users.AnyAsync(u => u.RUT == RUT);
    }

    public async Task CrearUsuarioAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> ObtenerPorEmailAsync(string email)
    {
        var emailNormalizado = email.Trim().ToLower();

        return await _context.Users
            .AsNoTracking()
            .Include(u => u.role)
            .FirstOrDefaultAsync(u => u.email.ToLower() == emailNormalizado);
    }

  public async Task<User?> ObtenerPorIdAsync(int id)
{
    return await _context.Users.FindAsync(id);
}

public async Task<IEnumerable<User>> ObtenerClientesAsync()
{
    return await _context.Users
        .Where(u => u.idRole == 2) // Solo clientes
        .OrderBy(u => u.name)
        .ToListAsync();
}

public async Task<IEnumerable<User>> ObtenerClientesAsync(CancellationToken cancellationToken = default)
{
    return await _context.Users
        .Where(u => u.idRole == 2)
        .OrderBy(u => u.name)
        .ToListAsync(cancellationToken);
}
}