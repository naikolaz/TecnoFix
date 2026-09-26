// 1. FALTABAN LAS IMPORTACIONES (using)
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TecnoFixBack.Services;
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


builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmailService, SendGridEmailService>(); // <- Mantén esta


var jwtKey = builder.Configuration["Jwt:Key"]
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

var origenesPermitidos = builder.Configuration.GetSection("Cors:OrigenesPermitidos").Get<string[]>()
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(origenesPermitidos)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
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