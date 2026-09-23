using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TecnoFixBack.src.interfaces;
using TecnoFixBack.src.model;

namespace TecnoFixBack.src.services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Genera un JWT firmado con HMAC-SHA256 que incluye el id, correo, nombre y rol del usuario.
    /// El frontend lo envía en el encabezado Authorization para acceder a las funcionalidades según su rol.
    /// </summary>
    public (string Token, DateTime Expiracion) GenerarToken(User usuario)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new(ClaimTypes.Email, usuario.Email),
            new(ClaimTypes.Name, usuario.NombreCompleto),
            new(ClaimTypes.Role, usuario.Rol.Name)
        };

        var clave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credenciales = new SigningCredentials(clave, SecurityAlgorithms.HmacSha256);
        var minutos = _configuration.GetValue("Jwt:ExpiracionMinutos", 120);
        var expiracion = DateTime.UtcNow.AddMinutes(minutos);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiracion,
            signingCredentials: credenciales);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiracion);
    }
}
