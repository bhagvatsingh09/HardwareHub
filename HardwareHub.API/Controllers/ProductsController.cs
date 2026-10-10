using HardwareHub.Application.DTOs;
using HardwareHub.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HardwareHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _service;

    public ProductsController(ProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetAll(
    [FromQuery] ProductFilterDto filter)
    {
        var products = await _service.SearchAsync(filter);

        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetById(Guid id)
    {
        var product = await _service.GetByIdAsync(id);

        if (product is null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(
        CreateProductDto request)
    {
        var createdProduct = await _service.CreateAsync(request);

        if (createdProduct is null)
        {
            return BadRequest(new
            {
                message = "Category does not exist."
            });
        }

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdProduct.Id },
            createdProduct);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductDto>> Update(
        Guid id,
        UpdateProductDto request)
    {
        var updatedProduct = await _service.UpdateAsync(id, request);

        if (updatedProduct is null)
        {
            return BadRequest(new
            {
                message = "Product or category does not exist."
            });
        }

        return Ok(updatedProduct);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}