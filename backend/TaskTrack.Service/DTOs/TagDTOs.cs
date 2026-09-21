using System.ComponentModel.DataAnnotations;

namespace TaskTrack.Service.DTOs;

public class TagDto
{
    public int TagId { get; set; }
    public string TagName { get; set; } = string.Empty;
    public string? Color { get; set; }
}

public class CreateTagDto
{
    [Required(ErrorMessage = "TagName is required")]
    [StringLength(50, ErrorMessage = "TagName cannot exceed 50 characters")]
    public string TagName { get; set; } = string.Empty;

    [RegularExpression(@"^#([A-Fa-f0-9]{6})$", ErrorMessage = "Color must be a valid hex color (e.g. #3B82F6)")]
    public string? Color { get; set; }
}

public class UpdateTagDto
{
    [Required(ErrorMessage = "TagName is required")]
    [StringLength(50, ErrorMessage = "TagName cannot exceed 50 characters")]
    public string TagName { get; set; } = string.Empty;

    [RegularExpression(@"^#([A-Fa-f0-9]{6})$", ErrorMessage = "Color must be a valid hex color (e.g. #3B82F6)")]
    public string? Color { get; set; }
}
