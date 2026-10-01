using TecnoFixBack.src.interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;
namespace TecnoFixBack.Services
{
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
            
            // SendGrid permite enviar texto plano y HTML. Aquí enviamos el mismo contenido para ambos.
            var msg = MailHelper.CreateSingleEmail(from, to, asunto, mensaje, mensaje);
            
            await client.SendEmailAsync(msg);

            var respuesta = await client.SendEmailAsync(msg);
            if (!respuesta.IsSuccessStatusCode)
        {
            throw new Exception($"SendGrid respondió {(int)respuesta.StatusCode}");
            }

        
        }
    }
}