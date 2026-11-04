using TecnoFixBack.DTOs;

namespace TecnoFixBack.Interfaces;

public interface ILoginService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
}
