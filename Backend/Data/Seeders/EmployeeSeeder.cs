using Backend.Data.Factories;

namespace Backend.Data.Seeders;

public static class EmployeeSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Employees.Any())
            return;

        var employees = EmployeeFactory
            .Create()
            .Generate(200000);

        context.Employees.AddRange(employees);

        context.SaveChanges();
    }
}