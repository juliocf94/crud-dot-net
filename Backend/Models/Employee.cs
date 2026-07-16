using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

[Index(nameof(CodeEmployee), IsUnique = true)]
public class Employee
{
    [Key]
    public int IdEmployee { get; set; }

    [Required]
    public long CodeEmployee { get; set; }

    [Required]
    [MaxLength(80)]
    public string NameEmployee { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string LastNameEmployee { get; set; } = string.Empty;

    public DateTime? Birthdate { get; set; }

    public char StatusEmployee { get; set; } = 'A';

    public DateTime CreateAt { get; set; } = DateTime.Now;
}