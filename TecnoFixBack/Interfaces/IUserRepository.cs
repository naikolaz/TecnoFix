using TecnoFixBack.Models;

namespace TecnoFixBack.Interfaces;

public interface IUserRepository
{
    Task<bool> EmailExistsAsync(string email);
    Task<bool> RutExistsAsync(string rut);
    Task CreateUserAsync(User user);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetClientsAsync(CancellationToken cancellationToken = default);
}
