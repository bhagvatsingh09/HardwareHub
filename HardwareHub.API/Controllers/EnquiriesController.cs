using HardwareHub.Application.DTOs;
using HardwareHub.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HardwareHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnquiriesController : ControllerBase
{
    private readonly EnquiryService _service;

    public EnquiriesController(EnquiryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<EnquiryDto>>> GetAll()
    {
        var enquiries = await _service.GetAllAsync();

        return Ok(enquiries);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EnquiryDto>> GetById(Guid id)
    {
        var enquiry = await _service.GetByIdAsync(id);

        if (enquiry is null)
            return NotFound();

        return Ok(enquiry);
    }

    [HttpPost]
    public async Task<ActionResult<EnquiryDto>> Create(
        CreateEnquiryDto request)
    {
        var enquiry = await _service.CreateAsync(request);

        if (enquiry is null)
        {
            return BadRequest(new
            {
                message = "Product does not exist."
            });
        }

        return CreatedAtAction(
            nameof(GetById),
            new { id = enquiry.Id },
            enquiry);
    }

    [HttpPut("{id:guid}/status")]
    public async Task<ActionResult<EnquiryDto>> UpdateStatus(
        Guid id,
        UpdateEnquiryStatusDto request)
    {
        var enquiry = await _service.UpdateStatusAsync(id, request);

        if (enquiry is null)
            return NotFound();

        return Ok(enquiry);
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