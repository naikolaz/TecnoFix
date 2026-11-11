using TecnoFixBack.DTOs;
using TecnoFixBack.Interfaces;

namespace TecnoFixBack.Services;

public class LoginService : ILoginService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public LoginService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);

        if (user is null || !VerifyPassword(dto.Password, user.password))
            return null;

        var (token, expiration) = _tokenService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Expiracion = expiration,
            ID = user.ID,
            name = user.name,
            email = user.email,
            role = user.role.name
        };
    }

    private static bool VerifyPassword(string inputPassword, string hashedPassword)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(inputPassword, hashedPassword);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            return false;
        }
    }
}
