namespace TecnoFixBack.src.model;

public class User 
{
    public int Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty; // Para Nombre y apellidos
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Rut { get; set; } // Solo clientes; null para administrador y técnicos
    public string? Telefono { get; set; } // Solo clientes
    public string? Especialidad { get; set; } // Solo técnicos
    
    public DateTime CreateOnly { get; set; } = DateTime.UtcNow;

    // Relaciones de clases
    public int IdRol { get; set; }
    public Rol Rol { get; set; } = null!;
}
