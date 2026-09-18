// 1. FALTABAN LAS IMPORTACIONES (using)
using Microsoft.EntityFrameworkCore;
using TecnoFixBack.src.Data;
using TecnoFixBack.src.interfaces;
using TecnoFixBack.src.Repositories;
using TecnoFixBack.src.services;

var builder = WebApplication.CreateBuilder(args);

// 2. AGREGAR SOPORTE PARA CONTROLADORES (Vital para tu AuthController)
builder.Services.AddControllers();

// 3. CAMBIAR SQL SERVER POR POSTGRESQL (Para tu base de datos en Neon)
builder.Services.AddDbContext<TecnoFixContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("NeonDB")));

// Inyección de dependencias
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmailService, EmailService>(); // Nota: Asegúrate de que tus clases se llamen Service o Services, pero que coincidan
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 4. MAPEAR LOS CONTROLADORES (Reemplazamos el WeatherForecast por esto)
app.MapControllers();

app.Run();