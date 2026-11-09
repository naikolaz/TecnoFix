using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TecnoFixBack.Data;
using TecnoFixBack.Interfaces;
using TecnoFixBack.Repositories;
using TecnoFixBack.Services;
<<<<<<< HEAD
using TecnoFixBack.src.Data;
using TecnoFixBack.src.interfaces;
using TecnoFixBack.src.Repositories;
using TecnoFixBack.src.services;
=======
>>>>>>> d9c9274f928d258a431039b66e9e187b47d39a30

var builder = WebApplication.CreateBuilder(args);

// Soporte dinámico para el puerto asignado por Render (variable de entorno PORT)
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddControllers();
builder.Services.AddDbContext<TecnoFixContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("NeonDB")));

<<<<<<< HEAD
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmailService, SendGridEmailService>();

var jwtKey = builder.Configuration["Jwt:Key"]
=======
// Inyección de dependencias
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>(); 

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IEmailService, SendGridEmailService>();
builder.Services.AddScoped<IOrderService, OrderService>();

var jwtKey = builder.Configuration["Jwt:Key"] 
>>>>>>> d9c9274f928d258a431039b66e9e187b47d39a30
    ?? throw new InvalidOperationException("Falta configurar Jwt:Key en appsettings.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

<<<<<<< HEAD
var origenesPermitidos = builder.Configuration.GetSection("Cors:OrigenesPermitidos").Get<string[]>()
    ?? ["http://localhost:5173", "https://techno-fix-ochre.vercel.app"];

=======
>>>>>>> d9c9274f928d258a431039b66e9e187b47d39a30
builder.Services.AddCors(options =>
    options.AddPolicy("Frontend", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()));

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var contexto = scope.ServiceProvider.GetRequiredService<TecnoFixContext>();
        contexto.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
<<<<<<< HEAD
        logger.LogError(ex, "Ocurrió un error al aplicar migraciones automáticas a la base de datos.");
=======
        logger.LogError(ex, "Ocurrió un error al aplicar las migraciones automáticas a la base de datos.");
>>>>>>> d9c9274f928d258a431039b66e9e187b47d39a30
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("RENDER")))
{
    // Render maneja la terminación SSL a nivel de proxy inverso
    app.UseHttpsRedirection();
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
<<<<<<< HEAD

// Endpoints de salud y verificación para Render
app.MapGet("/", () => Results.Ok(new 
{ 
    status = "online", 
    service = "TecnoFix API", 
    environment = app.Environment.EnvironmentName,
    timestamp = DateTime.UtcNow 
}));

app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

=======
>>>>>>> d9c9274f928d258a431039b66e9e187b47d39a30
app.MapControllers();

app.Run();
