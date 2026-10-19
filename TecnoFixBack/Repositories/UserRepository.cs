using Microsoft.EntityFrameworkCore;
using TecnoFixBack.src.Data;
using TecnoFixBack.src.interfaces;
using TecnoFixBack.src.model;

namespace TecnoFixBack.src.Repositories;

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
        return await _context.Set<User>().AnyAsync(u => u.email.ToLower() == emailNormalizado);
    }

    public async Task<bool> ExisteRutAsync(string rut)
    {
        return await _context.Set<User>().AnyAsync(u => u.RUT == rut);
    }

    public async Task CrearUsuarioAsync(User user)
    {
        await _context.Set<User>().AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> ObtenerPorEmailAsync(string email)
    {
        var emailNormalizado = email.Trim().ToLower();

        return await _context.Set<User>()
            .AsNoTracking()
            .Include(u => u.role)
            .FirstOrDefaultAsync(u => u.email.ToLower() == emailNormalizado);
    }
}