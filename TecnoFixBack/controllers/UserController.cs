using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecnoFixBack.Interfaces;

namespace TecnoFixBack.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // O [Authorize(Roles = "Administrador")] según tus requerimientos
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet("clients")]
   public async Task<IActionResult> GetClients(CancellationToken cancellationToken)
{
        try
        {
           var clients = await _userRepository.ObtenerClientesAsync(cancellationToken);
            // Mapear a DTO para evitar referencias circulares en JSON
            var clientDtos = clients.Select(c => new 
            {
                c.ID,
                c.name,
                c.email,
                c.RUT,
                c.telephoneNumber
            });

            return Ok(clientDtos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener la lista de clientes.", detail = ex.Message });
        }
    }
}