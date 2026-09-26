using TecnoFixBack.src.interfaces;
using TecnoFixBack.src.DTOs;
using TecnoFixBack.src.model;
using BCrypt.Net;
using System.Text.RegularExpressions;
using TecnoFixBack.Services; // Necesario para validar el formato del correo

namespace TecnoFixBack.src.services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;

    public AuthService(IUserRepository userRepository, IEmailService emailService)
    {
        _userRepository = userRepository;
        _emailService = emailService;
    }

    public async Task<string> RegistrarClienteAsync(RegistroClienteDto dto)
    {
        // 1. Validar campos nulos o vacíos (Seguridad básica)
        if (string.IsNullOrWhiteSpace(dto.NombreCompleto) || 
            string.IsNullOrWhiteSpace(dto.Email) || 
            string.IsNullOrWhiteSpace(dto.Rut) || 
            string.IsNullOrWhiteSpace(dto.Telefono))
        {
            throw new Exception("Todos los campos son obligatorios.");
        }

        // 2. Validar el formato exacto del correo ("que el correo exista" estructuralmente)
        if (!ValidarFormatoEmail(dto.Email))
        {
            throw new Exception("El formato del correo electrónico no es válido (ej: usuario@dominio.com).");
        }

        // 3. Validar RUT (Algoritmo Módulo 11)
        if (!ValidarRut(dto.Rut))
            throw new Exception("El RUT ingresado no es válido según el algoritmo de Chile.");

        // 4. Validar que el correo sea único en la BD
        if (await _userRepository.ExisteEmailAsync(dto.Email)) 
            throw new Exception("El correo electrónico ingresado ya se encuentra registrado.");
        
        // 5. Validar que el RUT sea único en la BD
        if (await _userRepository.ExisteRutAsync(dto.Rut)) 
            throw new Exception("El RUT ingresado ya se encuentra registrado.");

        // 6. Lógica de negocio: Generar y encriptar
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
            IdRol = 2 // Rol "Cliente"
        };

        // 8. Guardar en base de datos
        await _userRepository.CrearUsuarioAsync(nuevoCliente);

       // 9. Intentar enviar el correo
        try
        {
            string asunto = "Bienvenido a TecnoFix - Tus credenciales";
            string mensajeHtml = $"<h1>Bienvenido a TecnoFix</h1><p>Hola {nuevoCliente.NombreCompleto}, tu cuenta ha sido creada. Tu contraseña temporal es: <strong>{passwordTemporal}</strong></p>";

            // Usamos el método correcto: EnviarCorreoAsync
            await _emailService.EnviarCorreoAsync(nuevoCliente.Email, asunto, mensajeHtml);
        }
   catch (Exception ex)
        {
            // Solo avisamos en consola, pero NO lo borramos.
            Console.WriteLine($"Error de SendGrid: {ex.Message}");
            throw new Exception("Cliente registrado en la base de datos, pero hubo un problema al enviar el correo. Intente solicitar una nueva contraseña.");
        }

        // AGREGA ESTA LÍNEA PARA QUE EL CÓDIGO COMPILE CORRECTAMENTE
        return "Cliente registrado exitosamente. Se ha enviado la contraseña al correo.";
    }
    // --- MÉTODOS PRIVADOS DE VALIDACIÓN ---

    // Nuevo método: Verifica que tenga el formato texto@texto.texto
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

    // (Aquí mantienes tus métodos privados originales)
    private bool ValidarRut(string rut) { /* Tu código real... */ return true; }
    private string GenerarPasswordAleatorio(int longitud) { /* Tu código real... */ return "12345678"; }
}