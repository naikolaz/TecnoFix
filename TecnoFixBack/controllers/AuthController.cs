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
    private readonly IUserRepository _userRepository; // Se usa la interfaz

    public AuthController(IAuthService authService, ILoginService loginService, IUserRepository userRepository)
    {
        _authService = authService;
        _loginService = loginService;
        _userRepository = userRepository; // Se inyecta la interfaz
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var respuesta = await _loginService.IniciarSesionAsync(dto);

        if (respuesta is null)
            return Unauthorized(new { error = "Correo electrónico o contraseña incorrectos" });

        return Ok(respuesta);
    }

    [Authorize]
    [HttpGet("sesion")]
    public IActionResult ObtenerSesion()
    {
        return Ok(new
        {
            id = User.FindFirstValue(ClaimTypes.NameIdentifier),
            nombreCompleto = User.FindFirstValue("nombreCompleto"),
            email = User.FindFirstValue(ClaimTypes.Email),
            rol = User.FindFirstValue(ClaimTypes.Role)
        });
    }

    [HttpPost("registrar-cliente")]
    public async Task<IActionResult> RegistrarCliente([FromBody] RegistroClienteDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); 
        }

        try
        {
            var resultado = await _authService.RegisterClientAsync(dto);
            return Ok(new { message = resultado });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    
    [Authorize(Roles = "Administrador")]
    [HttpPost("registrar-tecnico")]
    public async Task<IActionResult> RegistrarTecnico([FromBody] RegistroTecnicoDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var resultado = await _authService.RegisterTechnicianAsync(dto);
            return Ok(new { mensaje = resultado });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("clientes")]
    [Authorize]
    public async Task<IActionResult> ObtenerClientes()
    {
        try
        {
            var clientes = await _userRepository.ObtenerClientesAsync();

            var resultado = clientes.Select(c => new
            {
                id = c.ID,
                name = c.name,
                email = c.email,
                rut = c.RUT,
                telephoneNumber = c.telephoneNumber
            });

            return Ok(resultado);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno al obtener clientes.", detail = ex.Message });
        }
    }
}