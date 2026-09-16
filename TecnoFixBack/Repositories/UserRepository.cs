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
        return await _context.Usuarios.AnyAsync(u => u.Email == email);
    }

    public async Task<bool> ExisteRutAsync(string rut)
    {
        return await _context.Usuarios.AnyAsync(u => u.Rut == rut);
    }

    public async Task CrearUsuarioAsync(User user)
    {
        await _context.Usuarios.AddAsync(user);
        await _context.SaveChangesAsync();
    }
}