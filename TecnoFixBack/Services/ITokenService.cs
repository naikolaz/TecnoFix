using TecnoFixBack.src.model;

namespace TecnoFixBack.src.interfaces;

public interface ITokenService
{
    (string Token, DateTime Expiracion) GenerarToken(User usuario);
}
