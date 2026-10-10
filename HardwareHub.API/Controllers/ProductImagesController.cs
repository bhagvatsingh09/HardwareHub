
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HardwareHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductImagesController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public ProductImagesController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> Upload([FromForm] IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest(new { message = "Please select an image." });
        }

        if (image.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "Image must be 5 MB or smaller." });
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new
            {
                message = "Only JPG, JPEG, PNG, and WebP images are allowed."
            });
        }

        if (image.ContentType is not ("image/jpeg" or "image/png" or "image/webp"))
        {
            return BadRequest(new { message = "Invalid image content type." });
        }

        var uploadFolder = Path.Combine(
            _environment.ContentRootPath,
            "wwwroot",
            "uploads",
            "products");

        Directory.CreateDirectory(uploadFolder);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadFolder, fileName);

        await using (var stream = new FileStream(filePath, FileMode.CreateNew))
        {
            await image.CopyToAsync(stream);
        }

        var imageUrl =
            $"{Request.Scheme}://{Request.Host}/uploads/products/{fileName}";

        return Ok(new { imageUrl });
    }
}
