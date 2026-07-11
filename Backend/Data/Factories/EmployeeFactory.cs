using Bogus;
using Backend.Models;

namespace Backend.Data.Factories;

public static class EmployeeFactory
{
    public static Faker<Employee> Create()
    {
        return new Faker<Employee>()
            .RuleFor(e => e.NameEmployee, f => f.Name.FirstName())
            .RuleFor(e => e.LastNameEmployee, f => f.Name.LastName())
            .RuleFor(e => e.Birthdate, f => f.Date.Past(35))
            .RuleFor(e => e.StatusEmployee, 'A')
            .RuleFor(e => e.CreateAt, _ => DateTime.Now);
    }
}