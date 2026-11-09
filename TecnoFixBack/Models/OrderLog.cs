using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TecnoFixBack.Models;

public class OrderLog
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int id { get; set; }

    [Required]
    public int orderId { get; set; }

    [ForeignKey("orderId")]
    public Order order { get; set; } = null!;

    [Required]
    public string action { get; set; } = string.Empty;

    [Required]
    public DateTime date { get; set; } = DateTime.UtcNow;
}