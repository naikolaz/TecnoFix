using System.ComponentModel.DataAnnotations;
namespace TecnoFixBack.DTOs;

public class CreateOrderDto
{
    [Required(ErrorMessage = "ClienteId es obligatorio.")]
    public int ClientId { get; set; }

    [Required(ErrorMessage = "DeviceType es obligatorio.")]
    public string DeviceType { get; set; } = string.Empty;


    [Required(ErrorMessage = "DeviceBrand es obligatorio.")]
    public string DeviceBrand { get; set; } = string.Empty;
    
    public string? serialNumber{ get; set; }



    [Required(ErrorMessage = "ProblemDescription es obligatorio.")] 
    public string ProblemDescription { get; set; } = string.Empty;
    public string? accessories { get; set; }
}
