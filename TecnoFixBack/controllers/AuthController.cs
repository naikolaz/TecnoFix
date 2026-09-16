using Microsoft.AspNetCore.Mvc;
using TecnoFixBack.src.DTOs;
using TecnoFixBack.src.interfaces;

namespace TecnoFixBack.src.controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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