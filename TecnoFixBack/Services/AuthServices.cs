using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using BCrypt.Net;
using TecnoFixBack.Services;
using TecnoFixBack.src.DTOs;
using TecnoFixBack.src.interfaces;
using TecnoFixBack.src.model;

namespace TecnoFixBack.src.services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;

    // Dependency injection
    public AuthService(IUserRepository userRepository, IEmailService emailService)
    {
        _userRepository = userRepository;
        _emailService = emailService;
    }

    public async Task<string> RegisterClientAsync(RegistroClienteDto dto)
    {
        // 1. Validate required fields
        if (string.IsNullOrWhiteSpace(dto.NombreCompleto) || 
            string.IsNullOrWhiteSpace(dto.Email) || 
            string.IsNullOrWhiteSpace(dto.Rut) || 
            string.IsNullOrWhiteSpace(dto.Telefono))
        {
            throw new Exception("All fields are required.");
        }

        // 2. Validate email format
        if (!ValidateEmailFormat(dto.Email))
        {
            throw new Exception("The email format is invalid.");
        }

        // 3. Validate Chilean RUT (Module 11 algorithm)
        if (!ValidateRut(dto.Rut))
        {
            throw new Exception("The entered RUT is invalid according to the Chilean algorithm.");
        }

        // 4. Check email uniqueness
        if (await _userRepository.ExisteEmailAsync(dto.Email)) 
        {
            throw new Exception("The entered email is already registered.");
        }
        
        // 5. Check RUT uniqueness
        if (await _userRepository.ExisteRutAsync(dto.Rut)) 
        {
            throw new Exception("The entered RUT is already registered.");
        }

        // 6. Generate and hash temporary password
        string tempPassword = GenerateRandomPassword(8);
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(tempPassword);

        // 7. Instantiate User entity with exact property names
        var newClient = new User
        {
            name = dto.NombreCompleto,
            email = dto.Email,
            RUT = dto.Rut,
            telephoneNumber = dto.Telefono,
            password = hashedPassword, 
            idRole = 2 // Client Role
        };

        // 8. Save user to database
        await _userRepository.CrearUsuarioAsync(newClient);

        // 9. Send welcome email via SendGrid
        try
        {
            string subject = "Welcome to TecnoFix - Your Credentials";
            string htmlMessage = $"<h1>Welcome to TecnoFix</h1><p>Hello {newClient.name}, your account has been created. Your temporary password is: <strong>{tempPassword}</strong></p>";

            await _emailService.EnviarCorreoAsync(newClient.email, subject, htmlMessage);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[WARNING] SendGrid Email Error: {ex.Message}");
            return "Client registered in database, but there was an issue sending the email.";
        }

        return "Client registered successfully. Temporary password sent to email.";
    }

    public async Task<string> RegisterTechnicianAsync(RegistroTecnicoDto dto)
    {
        // 1. Validate required fields
        if (string.IsNullOrWhiteSpace(dto.NombreCompleto) || 
            string.IsNullOrWhiteSpace(dto.Email))
        {
            throw new Exception("Name and email are required.");
        }

        // 2. Validate email format
        if (!ValidateEmailFormat(dto.Email))
        {
            throw new Exception("The email format is invalid.");
        }

        // 3. Check email uniqueness
        if (await _userRepository.ExisteEmailAsync(dto.Email)) 
        {
            throw new Exception("The entered email is already registered.");
        }

        // 4. Generate and hash temporary password
        string tempPassword = GenerateRandomPassword(8);
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(tempPassword);

        // 5. Instantiate Technician entity
        var newTechnician = new User
        {
            name = dto.NombreCompleto,
            email = dto.Email,
            specialization = dto.Especialidad,
            password = hashedPassword, 
            idRole = 3 // Technician Role
        };

        // 6. Save technician to database
        await _userRepository.CrearUsuarioAsync(newTechnician);

        // 7. Send notification email
        try
        {
            string subject = "Welcome to TecnoFix - Technician Credentials";
            string htmlMessage = $"<h1>TecnoFix Technician Panel</h1><p>Hello {newTechnician.name}, your technician account has been created. Your temporary password is: <strong>{tempPassword}</strong></p>";

            await _emailService.EnviarCorreoAsync(newTechnician.email, subject, htmlMessage);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[WARNING] SendGrid Email Error: {ex.Message}");
        }

        return "Technician registered successfully. Temporary password sent to email.";
    }

    // --- PRIVATE HELPER METHODS ---

    private bool ValidateEmailFormat(string email)
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

    private bool ValidateRut(string rut)
    {
        if (string.IsNullOrWhiteSpace(rut))
            return false;

        try
        {
            // Clean dots and hyphens, convert to uppercase
            string cleanRut = rut.Replace(".", "").Replace("-", "").Trim().ToUpper();

            if (cleanRut.Length < 2) 
                return false;

            string body = cleanRut[..^1];
            string inputDv = cleanRut[^1..];

            if (!int.TryParse(body, out int bodyNum))
                return false;

            int sum = 0;
            int multiplier = 2;

            while (bodyNum > 0)
            {
                int remainder = bodyNum % 10;
                sum += remainder * multiplier;
                bodyNum /= 10;
                multiplier = (multiplier == 7) ? 2 : multiplier + 1;
            }

            int dvRemainder = 11 - (sum % 11);
            string calculatedDv = dvRemainder switch
            {
                11 => "0",
                10 => "K",
                _ => dvRemainder.ToString()
            };

            return calculatedDv == inputDv;
        }
        catch
        {
            return false;
        }
    }

    private string GenerateRandomPassword(int length)
    {
        const string characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var random = new Random();
        char[] password = new char[length];

        for (int i = 0; i < length; i++)
        {
            password[i] = characters[random.Next(characters.Length)];
        }

        return new string(password);
    }
}
