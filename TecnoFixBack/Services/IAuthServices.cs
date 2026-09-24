using TecnoFixBack.src.DTOs;

namespace TecnoFixBack.src.interfaces;

public interface IAuthService
{
    Task<string> RegistrarClienteAsync(RegistroClienteDto dto);
   Task<string> RegistrarTecnicoAsync(RegistroTecnicoDto dto);
}

