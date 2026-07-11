namespace Backend.Data.Seeders;

public static class SeederRunner
{
    public static void Seed(AppDbContext context)
    {
        EmployeeSeeder.Seed(context);

        // ProductSeeder.Seed(context);
        // UserSeeder.Seed(context);
        // RoleSeeder.Seed(context);
    }
}