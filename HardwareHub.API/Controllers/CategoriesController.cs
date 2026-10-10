
using HardwareHub.Application.Services;
using HardwareHub.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace HardwareHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _service;

    public CategoriesController(CategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetAll()
    {
        var categories = await _service.GetAllAsync();
        return Ok(categories);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Category>> GetById(Guid id)
    {
        var category = await _service.GetByIdAsync(id);

        if (category is null)
            return NotFound();

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<Category>> Create(
        CategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Category name is required.");

        var category = await _service.CreateAsync(
            request.Name,
            request.Description ?? string.Empty);

        return CreatedAtAction(
            nameof(GetById),
            new { id = category.Id },
            category);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        CategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Category name is required.");

        var updated = await _service.UpdateAsync(
            id,
            request.Name,
            request.Description ?? string.Empty);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> SetStatus(
        Guid id,
        CategoryStatusRequest request)
    {
        var updated = await _service.SetActiveStatusAsync(
            id,
            request.IsActive);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    // Retained for compatibility; this deactivates, not permanently deletes.
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}

public record CategoryRequest(
    string Name,
    string? Description);

public record CategoryStatusRequest(
    bool IsActive);