namespace TecnoFixBack.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string recipient, string subject, string htmlMessage);
}
