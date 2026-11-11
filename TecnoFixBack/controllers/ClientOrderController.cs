using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecnoFixBack.DTOs;
using TecnoFixBack.Exceptions;
using TecnoFixBack.Interfaces;

namespace TecnoFixBack.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Cliente")]
public class ClientOrderController : ControllerBase
{
    private readonly IClientOrderService _clientOrderService;

    public ClientOrderController(IClientOrderService clientOrderService)
    {
        _clientOrderService = clientOrderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        if (!TryGetClientId(out int clientId))
            return Unauthorized(new { message = "La sesión no es válida" });

        var orders = await _clientOrderService.GetOrdersAsync(clientId);
        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public Task<IActionResult> GetMyOrder(int id)
    {
        return RunForOrderAsync(clientId => _clientOrderService.GetOrderAsync(id, clientId));
    }

    [HttpPost("{id:int}/approve-budget")]
    public Task<IActionResult> ApproveBudget(int id)
    {
        return RunForOrderAsync(clientId => _clientOrderService.ApproveBudgetAsync(id, clientId));
    }

    [HttpPost("{id:int}/reject-budget")]
    public Task<IActionResult> RejectBudget(int id)
    {
        return RunForOrderAsync(clientId => _clientOrderService.RejectBudgetAsync(id, clientId));
    }

    private async Task<IActionResult> RunForOrderAsync(Func<int, Task<ClientOrderDto>> operation)
    {
        if (!TryGetClientId(out int clientId))
            return Unauthorized(new { message = "La sesión no es válida" });

        try
        {
            var order = await operation(clientId);
            return Ok(order);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (BusinessRuleException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private bool TryGetClientId(out int clientId)
    {
        return int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out clientId);
    }
}
