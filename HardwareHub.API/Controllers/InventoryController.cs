using HardwareHub.Application.DTOs;
using HardwareHub.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HardwareHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly InventoryService _inventoryService;

    public InventoryController(InventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpPut("{productId:guid}/increase")]
    public async Task<IActionResult> IncreaseStock(
        Guid productId,
        UpdateStockDto request)
    {
        var result = await _inventoryService
            .IncreaseStockAsync(productId, request.Quantity);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Product does not exist or quantity is invalid."
            });
        }

        return Ok(new
        {
            message = "Stock increased successfully."
        });
    }

    [HttpPut("{productId:guid}/decrease")]
    public async Task<IActionResult> DecreaseStock(
        Guid productId,
        UpdateStockDto request)
    {
        var result = await _inventoryService
            .DecreaseStockAsync(productId, request.Quantity);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Product does not exist, quantity is invalid, or stock is insufficient."
            });
        }

        return Ok(new
        {
            message = "Stock decreased successfully."
        });
    }

    [HttpGet("low-stock")]
    public async Task<ActionResult<List<LowStockProductDto>>> GetLowStock()
    {
        var products = await _inventoryService.GetLowStockProductsAsync();

        return Ok(products);
    }
}