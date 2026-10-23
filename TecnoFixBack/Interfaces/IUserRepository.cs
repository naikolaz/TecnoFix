using TecnoFixBack.Models;
    
namespace TecnoFixBack.Interfaces;

public interface IUserRepository
{
    Task<bool> ExisteEmailAsync(string email);
    Task<bool> ExisteRutAsync(string rut);
    Task CrearUsuarioAsync(User user);
    Task<User?> ObtenerPorEmailAsync(string email);
    Task<User?> ObtenerPorIdAsync(int id);
}
