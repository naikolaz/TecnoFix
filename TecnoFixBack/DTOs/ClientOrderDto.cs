namespace TecnoFixBack.DTOs;

public class ClientOrderDto
{
    public int Id { get; set; }
    public string DeviceType { get; set; } = string.Empty;
    public string BrandAndModel { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public string IssueDescription { get; set; } = string.Empty;
    public string? Accessories { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool CanDecideBudget { get; set; }
    public BudgetDto? Budget { get; set; }
}
