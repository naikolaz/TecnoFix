using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TecnoFixBack.DTOs;

public class UpdateDiagnosisDto
{
    [Required(ErrorMessage = "Debe completar el campo Diagnóstico técnico")]
    [JsonPropertyName("technicalDiagnosis")]
    public string TechnicalDiagnosis { get; set; } = string.Empty;

    [Required(ErrorMessage = "Debe completar el campo Costo de mano de obra")]
    [Range(0, double.MaxValue, ErrorMessage = "El costo ingresado no es válido")]
    [JsonPropertyName("laborCost")]
    public decimal LaborCost { get; set; }

    [Required(ErrorMessage = "Debe completar el campo Costo de repuestos")]
    [Range(0, double.MaxValue, ErrorMessage = "El costo ingresado no es válido")]
    [JsonPropertyName("partsCost")]
    public decimal PartsCost { get; set; }
}