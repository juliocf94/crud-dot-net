using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class EmployeeCreateDto
{
    [Required(ErrorMessage = "Code is required")]
    [Range(10_000_000, 99_999_999, ErrorMessage = "CodeEmployee must have exactly 8 digits")]
    public long CodeEmployee { get; set; }

    [Required]
    [StringLength(80)]
    public string NameEmployee { get; set; } = string.Empty;

    [Required]
    [StringLength(80)]
    public string LastNameEmployee { get; set; } = string.Empty;

    public DateTime? Birthdate { get; set; }
}