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

    public async Task SendEmailAsync(string recipient, string subject, string htmlMessage)
    {
        var apiKey = _config["SendGrid:ApiKey"];
        var client = new SendGridClient(apiKey);
        
        var from = new EmailAddress(_config["SendGrid:FromEmail"], _config["SendGrid:FromName"]);
        var to = new EmailAddress(recipient);

        string plainTextContent = Regex.Replace(htmlMessage, "<.*?>", string.Empty);
        
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlMessage);
        
        var response = await client.SendEmailAsync(msg);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"SendGrid responded with HTTP status {(int)response.StatusCode}");
        }
    }
}
