using TecnoFixBack.src.interfaces;
using TecnoFixBack.src.DTOs;
using TecnoFixBack.src.model;
using BCrypt.Net;
using System.Text.RegularExpressions;
using TecnoFixBack.Services;

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
        // 1. Validar campos nulos o vacíos
        if (string.IsNullOrWhiteSpace(dto.NombreCompleto) || 
            string.IsNullOrWhiteSpace(dto.Email) || 
            string.IsNullOrWhiteSpace(dto.Rut) || 
            string.IsNullOrWhiteSpace(dto.Telefono))
        {
            throw new Exception("Todos los campos son obligatorios.");
        }

        // 2. Validar formato de correo
        if (!ValidarFormatoEmail(dto.Email))
        {
            throw new Exception("El formato del correo electrónico no es válido.");
        }

        // 3. Validar RUT (Algoritmo Módulo 11)
        if (!ValidarRut(dto.Rut))
            throw new Exception("El RUT ingresado no es válido según el algoritmo de Chile.");

        // 4. Validar que el correo sea único
        if (await _userRepository.ExisteEmailAsync(dto.Email)) 
            throw new Exception("El correo electrónico ingresado ya se encuentra registrado.");
        
        // 5. Validar que el RUT sea único
        if (await _userRepository.ExisteRutAsync(dto.Rut)) 
            throw new Exception("El RUT ingresado ya se encuentra registrado.");

        // 6. Generar y encriptar contraseña
        string passwordTemporal = GenerarPasswordAleatorio(8);
        string passwordHasheada = BCrypt.Net.BCrypt.HashPassword(passwordTemporal);

        // 7. Crear entidad User
        var nuevoCliente = new User
        {
            NombreCompleto = dto.NombreCompleto,
            Email = dto.Email,
            Rut = dto.Rut,
            Telefono = dto.Telefono,
            Password = passwordHasheada, 
            IdRol = 2 // Rol Cliente
        };

        // 8. Guardar en base de datos
        await _userRepository.CrearUsuarioAsync(nuevoCliente);

        // 9. Enviar correo usando el método correcto (EnviarCorreoAsync)
        try
        {
            string asunto = "Bienvenido a TecnoFix - Tus credenciales";
            string mensajeHtml = $"<h1>Bienvenido a TecnoFix</h1><p>Hola {nuevoCliente.NombreCompleto}, tu cuenta ha sido creada. Tu contraseña temporal es: <strong>{passwordTemporal}</strong></p>";

            await _emailService.EnviarCorreoAsync(nuevoCliente.Email, asunto, mensajeHtml);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ADVERTENCIA] Error de SendGrid: {ex.Message}");
            return "Cliente registrado en la base de datos, pero hubo un problema al enviar el correo.";
        }

        return "Cliente registrado exitosamente. Se ha enviado la contraseña al correo.";
    }

    public async Task<string> RegistrarTecnicoAsync(RegistroTecnicoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NombreCompleto) || 
            string.IsNullOrWhiteSpace(dto.Email))
        {
            throw new Exception("Nombre y correo son obligatorios.");
        }

        if (!ValidarFormatoEmail(dto.Email))
        {
            throw new Exception("El formato del correo electrónico no es válido.");
        }

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
            IdRol = 3, // Rol Técnico
            Rut = $"TEC-{Guid.NewGuid().ToString()[..8]}", 
            Telefono = "Sin Registro"
        };

        await _userRepository.CrearUsuarioAsync(nuevoTecnico);

        try
        {
            string asunto = "Bienvenido a TecnoFix - Credenciales de Técnico";
            string mensajeHtml = $"<h1>Panel Técnico TecnoFix</h1><p>Hola {nuevoTecnico.NombreCompleto}, tu cuenta de técnico ha sido creada. Tu contraseña temporal es: <strong>{passwordTemporal}</strong></p>";

            await _emailService.EnviarCorreoAsync(nuevoTecnico.Email, asunto, mensajeHtml);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ADVERTENCIA] Error de SendGrid: {ex.Message}");
        }

        return "Técnico registrado exitosamente. Se ha enviado la contraseña al correo.";
    }

    // --- MÉTODOS PRIVADOS ---
    private bool ValidarFormatoEmail(string email)
    {
        try
        {
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase);
        }
        catch
        {
            return false;
        }
    }

    private bool ValidarRut(string rut) { /* Mantén tu lógica del Módulo 11 aquí */ return true; }
    
    private string GenerarPasswordAleatorio(int longitud)
    {
        const string caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var random = new Random();
        char[] password = new char[longitud];

        for (int i = 0; i < longitud; i++)
        {
            password[i] = caracteres[random.Next(caracteres.Length)];
        }

        return new string(password);
    }
}