using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace TecnoFixBack.Models;

public class Order
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int id { get; set; }

    [Required(ErrorMessage = "Debe completar el campo Cliente")]
    public int clientId { get; set; }

    [ForeignKey("clientId")]
    public User client { get; set; } = null!;

    [Required(ErrorMessage = "Debe completar el campo Tipo de equipo")]
    public string deviceType { get; set; } = string.Empty;

    [Required(ErrorMessage = "Debe completar el campo Marca y modelo")]
    public string brandAndModel { get; set; } = string.Empty;

    public string? serialNumber { get; set; }

    [Required(ErrorMessage = "Debe completar el campo Descripción de la falla")]
    public string issueDescription { get; set; } = string.Empty;

    public string? accessories { get; set; }

    [Required]
    public string status { get; set; } = "Recibida";

    [Required]
    public DateTime createdAt { get; set; } = DateTime.UtcNow;

    // Ahora usa OrderLog en lugar de Logger
    public List<OrderLog> history { get; set; } = new List<OrderLog>();
}
