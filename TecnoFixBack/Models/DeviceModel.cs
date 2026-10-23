namespace TecnoFixBack.Models;

public class DeviceModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public int BrandId { get; set; }
    public Brand Brand { get; set; } = null!;
}