namespace TecnoFixBack.src.model;

public class User{
    public int ID { get; set; }
    public string name { get; set; } = string.Empty; // Para Nombre y apellidos
    public string email { get; set; } = string.Empty;
    public string password { get; set; } = string.Empty;
    public string? RUT { get; set; } // Solo clientes; null para administrador y técnicos
    public string? telephoneNumber { get; set; } // Solo clientes
    public string? specialization { get; set; } // Solo técnicos
    
    public DateTime CreateOnly { get; set; } = DateTime.UtcNow;

    // Relaciones de clases
    public int idRole { get; set; }
    public Role role { get; set; } = null!;
}
