using TecnoFixBack.src.model;

namespace TecnoFixBack.src.interfaces;

public interface IUserRepository
{
    Task<bool> ExisteEmailAsync(string email);
    Task<bool> ExisteRutAsync(string rut);

    Task<User?> ObtenerPorEmailAsync(string email);

    Task CrearUsuarioAsync(User user);
}