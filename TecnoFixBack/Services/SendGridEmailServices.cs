using System.Text.RegularExpressions;
using TecnoFixBack.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace TecnoFixBack.Services;

public class SendGridEmailService : IEmailService
{
    private readonly IConfiguration _config;

    public SendGridEmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task EnviarCorreoAsync(string destinatario, string asunto, string mensaje)
    {
        var apiKey = _config["SendGrid:ApiKey"];
        var client = new SendGridClient(apiKey);
        
        var from = new EmailAddress(_config["SendGrid:FromEmail"], _config["SendGrid:FromName"]);
        var to = new EmailAddress(destinatario);

        // Versión plana simplificada como respaldo (fallback)
        string plainTextContent = Regex.Replace(mensaje, "<.*?>", string.Empty);
        
        // Creamos el correo pasando tanto texto plano como HTML
        var msg = MailHelper.CreateSingleEmail(from, to, asunto, plainTextContent, mensaje);
        
        // ⚠️ UNA SOLA LLAMADA a SendEmailAsync
        var respuesta = await client.SendEmailAsync(msg);

        if (!respuesta.IsSuccessStatusCode)
        {
            throw new Exception($"SendGrid respondió con estado HTTP {(int)respuesta.StatusCode}");
        }
    }
}