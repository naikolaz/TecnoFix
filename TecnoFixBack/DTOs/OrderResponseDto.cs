namespace TecnoFixBack.DTOs;

public class OrderResponseDto
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string DeviceType { get; set; } = string.Empty;
    public string BrandAndModel { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public string IssueDescription { get; set; } = string.Empty;
    public string? Accessories { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}