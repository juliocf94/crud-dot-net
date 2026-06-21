using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Employee
{
    [Key]
    public int IdEmployee { get; set; }

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