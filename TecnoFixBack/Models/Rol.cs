namespace TecnoFixBack.src.model;

public class Rol 
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
  
    public ICollection<User> Usuarios { get; set; } = new List<User>();
}