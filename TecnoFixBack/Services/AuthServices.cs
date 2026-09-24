using TecnoFixBack.src.interfaces;
using TecnoFixBack.src.DTOs;
using TecnoFixBack.src.model;
using BCrypt.Net;

namespace TecnoFixBack.src.services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;

    // Inyectamos las dependencias
    public AuthService(IUserRepository userRepository, IEmailService emailService)
    {
        _userRepository = userRepository;
        _emailService = emailService;
    }

    public async Task<string> RegistrarClienteAsync(RegistroClienteDto dto)
    {
        // 1. Validar RUT (Algoritmo Módulo 11)
        if (!ValidarRut(dto.Rut))
            throw new Exception("El RUT ingresado no es válido según el algoritmo de Chile.");

        // 2. Validar que el correo sea único
        if (await _userRepository.ExisteEmailAsync(dto.Email)) 
            throw new Exception("El correo electrónico ingresado ya se encuentra registrado.");
        
        // 3. Validar que el RUT sea único
        if (await _userRepository.ExisteRutAsync(dto.Rut)) 
            throw new Exception("El RUT ingresado ya se encuentra registrado.");

        // 4. Generar contraseña aleatoria de 8 caracteres
        string passwordTemporal = GenerarPasswordAleatorio(8);

        // 5. Encriptar contraseña por seguridad
        string passwordHasheada = BCrypt.Net.BCrypt.HashPassword(passwordTemporal);

        // 6. Crear entidad User
        var nuevoCliente = new User
        {
            NombreCompleto = dto.NombreCompleto,
            Email = dto.Email,
            Rut = dto.Rut,
            Telefono = dto.Telefono,
            Password = passwordHasheada, 
            IdRol = 2 // Asumiendo que 2 es el ID del rol "Cliente" en tu tabla Roles
        };

        // 7. Guardar en base de datos
        await _userRepository.CrearUsuarioAsync(nuevoCliente);

        // 8. Enviar correo 
        await _emailService.EnviarPasswordAsync(nuevoCliente.Email, passwordTemporal);

        return "Cliente registrado exitosamente. Se ha enviado la contraseña al correo.";
    }

    public async Task<string> RegistrarTecnicoAsync(RegistroTecnicoDto dto)
    {
        if (await _userRepository.ExisteEmailAsync(dto.Email)) 
            throw new Exception("El correo electrónico ingresado ya se encuentra registrado.");

        string passwordTemporal = GenerarPasswordAleatorio(8);
        string passwordHasheada = BCrypt.Net.BCrypt.HashPassword(passwordTemporal);

        var nuevoTecnico = new User
        {
            NombreCompleto = dto.NombreCompleto,
            Email = dto.Email,
            Especialidad = dto.Especialidad,
            Password = passwordHasheada, 
            IdRol = 3,
            // ID autogenerado para evitar el choque con la validación UNIQUE del RUT en la base de datos
            Rut = $"TEC-{Guid.NewGuid().ToString()[..8]}", 
            Telefono = "Sin Registro"
        };

        await _userRepository.CrearUsuarioAsync(nuevoTecnico);
        await _emailService.EnviarPasswordAsync(nuevoTecnico.Email, passwordTemporal);

        return "Técnico registrado exitosamente. Se ha enviado la contraseña al correo.";
    }
    // (Aquí mantienes los métodos privados ValidarRut y GenerarPasswordAleatorio que te di en el mensaje anterior)
    private bool ValidarRut(string rut) { /* Código anterior... */ return true; }
    private string GenerarPasswordAleatorio(int longitud) { /* Código anterior... */ return "12345678"; }
}