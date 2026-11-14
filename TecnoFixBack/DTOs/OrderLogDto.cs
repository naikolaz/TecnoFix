namespace TecnoFixBack.DTOs;

public class OrderLogDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string? NewStatus { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserRole { get; set; }
}
