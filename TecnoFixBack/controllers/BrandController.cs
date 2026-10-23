using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TecnoFixBack.Data;

namespace TecnoFixBack.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BrandController : ControllerBase
{
    private readonly TecnoFixContext _context;

    public BrandController(TecnoFixContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetBrands()
    {
        var brands = await _context.Brands
            .OrderBy(b => b.Name)
            .Select(b => new { b.Id, b.Name })
            .ToListAsync();

        return Ok(brands);
    }

    [HttpGet("{brandId:int}/models")]
    public async Task<IActionResult> GetModelsByBrand(int brandId)
    {
        var models = await _context.Models
            .Where(m => m.BrandId == brandId)
            .OrderBy(m => m.Name)
            .Select(m => new { m.Id, m.Name })
            .ToListAsync();

        return Ok(models);
    }
}