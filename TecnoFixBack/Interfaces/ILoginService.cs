using TecnoFixBack.DTOs;

namespace TecnoFixBack.Interfaces;
public interface ILoginService
{
    Task<LoginResponseDto?> IniciarSesionAsync(LoginDto dto);
}
