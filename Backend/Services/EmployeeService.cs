using Backend.Data;
using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class EmployeeService : IEmployeeService
{
    private readonly AppDbContext _context;

    public EmployeeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<object> GetPagedAsync(EmployeePagedRequestDto request)
    {
        var query = _context.Employees
            .Where(x => x.StatusEmployee == 'A')
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(x =>
                x.NameEmployee.Contains(request.Search) ||
                x.LastNameEmployee.Contains(request.Search));
        }

        var total = await query.CountAsync();

        var data = await query
            .OrderBy(x => x.IdEmployee)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new EmployeeResponseDto
            {
                IdEmployee = x.IdEmployee,
                NameEmployee = x.NameEmployee,
                LastNameEmployee = x.LastNameEmployee,
                Birthdate = x.Birthdate,
                StatusEmployee = x.StatusEmployee,
                CreateAt = x.CreateAt
            })
            .ToListAsync();

        return new
        {
            total,
            request.Page,
            request.PageSize,
            data
        };
    }

    public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Employees
            .Where(x =>
                x.IdEmployee == id &&
                x.StatusEmployee == 'A')
            .Select(x => new EmployeeResponseDto
            {
                IdEmployee = x.IdEmployee,
                NameEmployee = x.NameEmployee,
                LastNameEmployee = x.LastNameEmployee,
                Birthdate = x.Birthdate,
                StatusEmployee = x.StatusEmployee,
                CreateAt = x.CreateAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<EmployeeResponseDto> CreateAsync(EmployeeCreateDto dto)
    {
        var employee = new Employee
        {
            NameEmployee = dto.NameEmployee,
            LastNameEmployee = dto.LastNameEmployee,
            Birthdate = dto.Birthdate
        };

        _context.Employees.Add(employee);

        await _context.SaveChangesAsync();

        return new EmployeeResponseDto
        {
            IdEmployee = employee.IdEmployee,
            NameEmployee = employee.NameEmployee,
            LastNameEmployee = employee.LastNameEmployee,
            Birthdate = employee.Birthdate,
            StatusEmployee = employee.StatusEmployee,
            CreateAt = employee.CreateAt
        };
    }

    public async Task<bool> UpdateAsync(int id, EmployeeUpdateDto dto)
    {
        var employee =
            await _context.Employees.FindAsync(id);

        if (employee == null)
            return false;

        employee.NameEmployee = dto.NameEmployee;
        employee.LastNameEmployee = dto.LastNameEmployee;
        employee.Birthdate = dto.Birthdate;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> SoftDeleteAsync(int id)
    {
        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
            return false;

        employee.StatusEmployee = 'I';

        await _context.SaveChangesAsync();

        return true;
    }

}