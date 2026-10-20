using TecnoFixBack.Models;

namespace TecnoFixBack.Interfaces;

public interface ITokenService
{
    (string Token, DateTime Expiracion) GenerarToken(User usuario);
}
