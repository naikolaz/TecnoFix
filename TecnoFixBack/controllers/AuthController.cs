using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecnoFixBack.src.DTOs;
using TecnoFixBack.src.interfaces;

namespace TecnoFixBack.src.controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILoginService _loginService;

    public AuthController(IAuthService authService, ILoginService loginService)
    {
        _authService = authService;
        _loginService = loginService;
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
            nombreCompleto = User.FindFirstValue(ClaimTypes.Name),
            email = User.FindFirstValue(ClaimTypes.Email),
            rol = User.FindFirstValue(ClaimTypes.Role)
        });
    }

    [HttpPost("registrar-cliente")]
    public async Task<IActionResult> RegistrarCliente([FromBody] RegistroClienteDto dto)
    {
        if (!ModelState.IsValid)
        {
            // Retorna los mensajes de validación definidos en el DTO (ej. "Debe completar el campo X")
            return BadRequest(ModelState); 
        }

        try
        {
            var resultado = await _authService.RegistrarClienteAsync(dto);
            return Ok(new { message = resultado });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
