using TecnoFixBack.src.model;

namespace TecnoFixBack.src.interfaces;

public interface IUserRepository
{
    Task<bool> ExisteEmailAsync(string email);
    Task<bool> ExisteRutAsync(string rut);
    Task CrearUsuarioAsync(User user);
    Task<User?> ObtenerPorEmailAsync(string email);
}
