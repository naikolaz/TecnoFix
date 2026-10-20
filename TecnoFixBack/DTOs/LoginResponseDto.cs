namespace TecnoFixBack.DTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expiracion { get; set; }
    public int ID { get; set; }
    public string name { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string role { get; set; } = string.Empty;
}
