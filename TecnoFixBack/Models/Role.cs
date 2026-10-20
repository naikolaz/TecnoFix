namespace TecnoFixBack.Models;

public class Role 
{
    public int ID { get; set; }
    public string name { get; set; } = string.Empty;
    
  
    public ICollection<User> Users { get; set; } = new List<User>();
}