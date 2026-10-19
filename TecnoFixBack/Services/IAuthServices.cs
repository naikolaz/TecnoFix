using TecnoFixBack.src.DTOs;

namespace TecnoFixBack.src.interfaces;

public interface IAuthService
{
    Task<string> RegisterClientAsync(RegistroClienteDto dto);
    Task<string> RegisterTechnicianAsync(RegistroTecnicoDto dto);
}

