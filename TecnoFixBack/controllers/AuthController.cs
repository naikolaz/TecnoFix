using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecnoFixBack.DTOs;
using TecnoFixBack.Interfaces;

namespace TecnoFixBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILoginService _loginService;
    private readonly IUserRepository _userRepository;

    public AuthController(IAuthService authService, ILoginService loginService, IUserRepository userRepository)
    {
        _authService = authService;
        _loginService = loginService;
        _userRepository = userRepository;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await _loginService.LoginAsync(dto);

        if (response is null)
            return Unauthorized(new { error = "Correo electrónico o contraseña incorrectos" });

        return Ok(response);
    }

    [Authorize]
    [HttpGet("sesion")]
    public IActionResult GetSession()
    {
        return Ok(new
        {
            id = User.FindFirstValue(ClaimTypes.NameIdentifier),
            nombreCompleto = User.FindFirstValue("nombreCompleto") ?? User.FindFirstValue(ClaimTypes.Name) ?? string.Empty,
            email = User.FindFirstValue(ClaimTypes.Email),
            rol = User.FindFirstValue(ClaimTypes.Role)
        });
    }

    [HttpPost("registrar-cliente")]
    public async Task<IActionResult> RegisterClient([FromBody] RegistroClienteDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _authService.RegisterClientAsync(dto);
            return Ok(new { message = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    
    [Authorize(Roles = "Administrador")]
    [HttpPost("registrar-tecnico")]
    public async Task<IActionResult> RegisterTechnician([FromBody] RegistroTecnicoDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _authService.RegisterTechnicianAsync(dto);
            return Ok(new { mensaje = result, message = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("clientes")]
    [Authorize]
    public async Task<IActionResult> GetClients(CancellationToken cancellationToken)
    {
        try
        {
            var clients = await _userRepository.GetClientsAsync(cancellationToken);

            var result = clients.Select(c => new
            {
                id = c.ID,
                name = c.name,
                nombreCompleto = c.name,
                email = c.email,
                rut = c.RUT,
                telephoneNumber = c.telephoneNumber
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno al obtener clientes.", detail = ex.Message });
        }
    }
}
