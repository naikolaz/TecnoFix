using TecnoFixBack.src.DTOs;

namespace TecnoFixBack.src.interfaces;

public interface ILoginService
{
    Task<LoginResponseDto?> IniciarSesionAsync(LoginDto dto);
}
