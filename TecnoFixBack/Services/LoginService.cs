using TecnoFixBack.src.DTOs;
using TecnoFixBack.src.interfaces;

namespace TecnoFixBack.src.services;

public class LoginService : ILoginService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public LoginService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    /// <summary>
    /// USU-001: valida el correo y la contraseña contra la base de datos.
    /// Retorna null si el correo no existe o la contraseña no coincide con el hash almacenado,
    /// sin distinguir cuál de los dos falló para no revelar qué correos están registrados.
    /// </summary>
    public async Task<LoginResponseDto?> IniciarSesionAsync(LoginDto dto)
    {
        var user = await _userRepository.ObtenerPorEmailAsync(dto.Email);

        if (user is null || !PasswordEsCorrecta(dto.Password, user.password))
            return null;

        var (token, expiracion) = _tokenService.GenerarToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Expiracion = expiracion,
            ID = user.ID,
            name = user.name,
            email = user.email,
            role = user.role.name
        };
    }

    private static bool PasswordEsCorrecta(string passwordIngresada, string passwordHasheada)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(passwordIngresada, passwordHasheada);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            return false;
        }
    }
}
