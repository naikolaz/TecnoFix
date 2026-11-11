namespace TecnoFixBack.DTOs;

public class BudgetDto
{
    public string Diagnosis { get; set; } = string.Empty;
    public decimal LaborCost { get; set; }
    public decimal PartsCost { get; set; }
    public decimal TotalCost { get; set; }
}
