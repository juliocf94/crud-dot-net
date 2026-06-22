using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class EmployeeCreateDto
{
    [Required]
    [StringLength(80)]
    public string NameEmployee { get; set; } = string.Empty;

    [Required]
    [StringLength(80)]
    public string LastNameEmployee { get; set; } = string.Empty;

    public DateTime? Birthdate { get; set; }
}