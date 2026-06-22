using Backend.DTOs;

namespace Backend.Interfaces;

public interface IEmployeeService
{
    Task<object> GetPagedAsync(EmployeePagedRequestDto request);

    Task<EmployeeResponseDto?> GetByIdAsync(int id);

    Task<EmployeeResponseDto> CreateAsync(EmployeeCreateDto dto);

    Task<bool> UpdateAsync(int id, EmployeeUpdateDto dto);

    Task<bool> SoftDeleteAsync(int id);
}