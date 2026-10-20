
namespace TecnoFixBack.Interfaces;

public interface IEmailService
{
    Task EnviarCorreoAsync(string destino, string asunto, string mensajeHtml);
}