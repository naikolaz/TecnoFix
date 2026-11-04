using TecnoFixBack.Models;

namespace TecnoFixBack.Interfaces;

public interface ITokenService
{
    (string Token, DateTime Expiration) GenerateToken(User user);
}
