using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecnoFixBack.DTOs;
using TecnoFixBack.Interfaces;

namespace TecnoFixBack.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                           ?? User.FindFirst("sub")?.Value;

            if (!int.TryParse(userIdClaim, out int currentUserId))
            {
                return Unauthorized(new { message = "Invalid user credentials in token." });
            }

            var createdOrder = await _orderService.CreateOrderAsync(dto, currentUserId);
            return Ok(new { message = "Order created successfully.", orderId = createdOrder.id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}