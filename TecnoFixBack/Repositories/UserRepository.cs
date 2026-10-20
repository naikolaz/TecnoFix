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
        return await _context.Usuarios.AnyAsync(u => u.email.ToLower() == emailNormalizado);
    }

    public async Task<bool> ExisteRutAsync(string RUT)
    {
        return await _context.Usuarios.AnyAsync(u => u.RUT == RUT);
    }

    public async Task CrearUsuarioAsync(User user)
    {
        await _context.Usuarios.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> ObtenerPorEmailAsync(string email)
    {
        var emailNormalizado = email.Trim().ToLower();

        return await _context.Usuarios
            .AsNoTracking()
            .Include(u => u.role)
            .FirstOrDefaultAsync(u => u.email.ToLower() == emailNormalizado);
    }
}