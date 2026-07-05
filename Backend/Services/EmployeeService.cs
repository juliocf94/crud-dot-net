using Backend.Data;
using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

using System.Data;
using System.Data.Common;

namespace Backend.Services;

public class EmployeeService : IEmployeeService
{
    private readonly AppDbContext _context;

    public EmployeeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<EmployeeResponseDto>> GetPagedAsync(
        EmployeePagedRequestDto request)
    {
        var connection = _context.Database.GetDbConnection();

        var command = connection.CreateCommand();

        command.CommandText = "sp_Employees_GetPaged";
        command.CommandType = CommandType.StoredProcedure;

        var pageParameter = command.CreateParameter();
        pageParameter.ParameterName = "@Page";
        pageParameter.Value = request.Page;
        pageParameter.DbType = DbType.Int32;
        command.Parameters.Add(pageParameter);

        var pageSizeParameter = command.CreateParameter();
        pageSizeParameter.ParameterName = "@PageSize";
        pageSizeParameter.Value = request.PageSize;
        pageSizeParameter.DbType = DbType.Int32;
        command.Parameters.Add(pageSizeParameter);

        var searchParameter = command.CreateParameter();
        searchParameter.ParameterName = "@Search";
        searchParameter.Value = request.Search ?? string.Empty;
        searchParameter.DbType = DbType.String;
        command.Parameters.Add(searchParameter);

        await connection.OpenAsync();

        var reader = await command.ExecuteReaderAsync();

        var response = new PagedResponse<EmployeeResponseDto>
        {
            Page = request.Page,
            PageSize = request.PageSize
        };

        if (await reader.ReadAsync())
        {
            response.Total = reader.GetInt32(0);
        }

        await reader.NextResultAsync();

        while (await reader.ReadAsync())
        {
            response.Data.Add(new EmployeeResponseDto
            {
                IdEmployee = reader.GetInt32(0),
                NameEmployee = reader.GetString(1),
                LastNameEmployee = reader.GetString(2),
                Birthdate = reader.IsDBNull(3)
                    ? null
                    : reader.GetDateTime(3),
                StatusEmployee = reader.GetString(4)[0],
                CreateAt = reader.GetDateTime(5)
            });
        }

        await reader.DisposeAsync();
        await command.DisposeAsync();
        await connection.CloseAsync();

        return response;
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