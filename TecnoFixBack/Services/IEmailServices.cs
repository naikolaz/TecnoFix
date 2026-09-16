namespace TecnoFixBack.src.interfaces;

public interface IEmailService
{
    Task EnviarPasswordAsync(string email, string passwordTemporal);
}