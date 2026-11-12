using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TecnoFixBack.DTOs;
using TecnoFixBack.Interfaces;

namespace TecnoFixBack.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador,Técnico")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
            return NotFound(new { message = $"No se encontró la orden con id {id}." });

        return Ok(order);
    }

    [HttpGet("cliente/{clientId:int}")]
    public async Task<IActionResult> GetOrdersByClientId(int clientId)
    {
        var orders = await _orderService.GetOrdersByClientIdAsync(clientId);
        return Ok(orders);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _orderService.CreateOrderAsync(dto);
            return CreatedAtAction(nameof(GetOrderById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno al crear la orden.", detail = ex.Message });
        }
    }

    // PUT: api/Order/{id}/start-diagnosis
    [HttpPut("{id:int}/start-diagnosis")]
    [Authorize(Roles = "Técnico")]
    public async Task<IActionResult> StartDiagnosis(int id)
    {

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("id")?.Value;
        if (!int.TryParse(userIdString, out int technicianId))
        {
            return Unauthorized(new { message = "Token inválido o sin ID de usuario." });
        }

        var success = await _orderService.StartDiagnosisAsync(id, technicianId);
        
        if (!success)
            return BadRequest(new { message = "No se pudo iniciar el diagnóstico. Verifique que la orden exista y esté en estado 'Recibida'." });

        return Ok(new { message = "Orden en diagnóstico." });
    }

    // PUT: api/Order/{id}/diagnosis
    [HttpPut("{id:int}/diagnosis")]
    [Authorize(Roles = "Técnico")]
    public async Task<IActionResult> SaveDiagnosis(int id, [FromBody] UpdateDiagnosisDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("id")?.Value;
        if (!int.TryParse(userIdString, out int technicianId))
        {
            return Unauthorized(new { message = "Token inválido o sin ID de usuario." });
        }

        try
        {
            var result = await _orderService.SaveDiagnosisAndBudgetAsync(id, dto, technicianId);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno al guardar el diagnóstico.", detail = ex.Message });
        }
    }
}
