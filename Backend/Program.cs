using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Backend.Interfaces;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options => {
    options.AddPolicy(name: MyAllowSpecificOrigins, policy => {
        policy.WithOrigins("http://localhost:5000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

builder.Services.AddScoped<IEmployeeService, EmployeeService>();

var app = builder.Build();

app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}{context.Request.QueryString}");

    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Console.WriteLine("EXCEPCIÓN:");
        Console.WriteLine(ex);
        throw;
    }

    Console.WriteLine($"Status: {context.Response.StatusCode}");
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseSwagger();

app.UseSwaggerUI();

app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

app.Run();