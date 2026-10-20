using TecnoFixBack.DTOs;

namespace TecnoFixBack.Interfaces;

public interface IAuthService
{
    Task<string> RegisterClientAsync(RegistroClienteDto dto);
    Task<string> RegisterTechnicianAsync(RegistroTecnicoDto dto);
}

