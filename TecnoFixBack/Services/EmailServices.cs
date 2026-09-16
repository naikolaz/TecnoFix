using TecnoFixBack.src.interfaces;

namespace TecnoFixBack.src.services;

public class EmailService : IEmailService
{
    public Task EnviarPasswordAsync(string email, string passwordTemporal)
    {
        // NOTA: Aquí posteriormente integrarás SmtpClient o SendGrid
        Console.WriteLine($"[EMAIL SIMULADO] Para: {email} | Mensaje: Tu contraseña temporal es {passwordTemporal}");
        return Task.CompletedTask;
    }
}