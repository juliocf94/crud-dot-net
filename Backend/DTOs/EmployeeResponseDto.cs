namespace Backend.DTOs;

public class EmployeeResponseDto
{
    public int IdEmployee { get; set; }

    public string NameEmployee { get; set; } = string.Empty;

    public string LastNameEmployee { get; set; } = string.Empty;

    public DateTime? Birthdate { get; set; }

    public char StatusEmployee { get; set; }

    public DateTime CreateAt { get; set; }
}