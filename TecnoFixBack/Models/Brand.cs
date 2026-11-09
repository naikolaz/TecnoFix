namespace TecnoFixBack.Models;

public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;


    public ICollection<DeviceModel> Models { get; set; } = new List<DeviceModel>();
}