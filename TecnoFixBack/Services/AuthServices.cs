using System.Text.RegularExpressions;
using TecnoFixBack.DTOs;
using TecnoFixBack.Interfaces;
using TecnoFixBack.Models;

namespace TecnoFixBack.Services;

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
    string subject = "Bienvenido a TecnoFix - Tus credenciales de acceso";
    string htmlMessage = $@"
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <style>
            body {{ font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }}
            .card {{ max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }}
            .header {{ background-color: #0056b3; color: #ffffff; padding: 24px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 22px; font-weight: 700; }}
            .body {{ padding: 32px; color: #2d3748; line-height: 1.6; }}
            .password-box {{ background-color: #f0f7ff; border: 1px dashed #0056b3; border-left: 4px solid #0056b3; padding: 16px; margin: 20px 0; border-radius: 6px; text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #0056b3; }}
            .footer {{ background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; }}
        </style>
    </head>
    <body>
        <div class='card'>
            <div class='header'>
                <h1>Sistema TecnoFix</h1>
            </div>
            <div class='body'>
                <p>Hola <strong>{newClient.name}</strong>,</p>
                <p>Tu cuenta de cliente ha sido registrada exitosamente en nuestra plataforma de soporte técnico.</p>
                <p>A continuación se detalla tu contraseña temporal de acceso:</p>
                <div class='password-box'>
                    {tempPassword}
                </div>
                <p style='font-size: 13px; color: #718096;'>Te recomendamos iniciar sesión y cambiar esta contraseña en tu primer ingreso por seguridad.</p>
            </div>
            <div class='footer'>
                <p>© TecnoFix - Gestión de Servicio Técnico</p>
            </div>
        </div>
    </body>
    </html>";

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
       // 7. Send notification email
try
{
    string subject = "Bienvenido al Panel Técnico de TecnoFix";
    string htmlMessage = $@"
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <style>
            body {{ font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }}
            .card {{ max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }}
            .header {{ background-color: #0056b3; color: #ffffff; padding: 24px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 22px; font-weight: 700; }}
            .body {{ padding: 32px; color: #2d3748; line-height: 1.6; }}
            .badge {{ display: inline-block; background-color: #e2e8f0; color: #4a5568; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }}
            .password-box {{ background-color: #f0f7ff; border: 1px dashed #0056b3; border-left: 4px solid #0056b3; padding: 16px; margin: 20px 0; border-radius: 6px; text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #0056b3; }}
            .footer {{ background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; }}
        </style>
    </head>
    <body>
        <div class='card'>
            <div class='header'>
                <h1>Panel Técnico - TecnoFix</h1>
            </div>
            <div class='body'>
                <p>Hola <strong>{newTechnician.name}</strong>,</p>
                <p>Se ha creado tu perfil de técnico especializado <span class='badge'>{newTechnician.specialization ?? "General"}</span> en el sistema.</p>
                <p>Tus credenciales para ingresar al panel son las siguientes:</p>
                <div class='password-box'>
                    {tempPassword}
                </div>
                <p style='font-size: 13px; color: #718096;'>Por favor, ingresa al sistema y actualiza tu clave personal.</p>
            </div>
            <div class='footer'>
                <p>© TecnoFix - Área Técnica</p>
            </div>
        </div>
    </body>
    </html>";

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
