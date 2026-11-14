using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TecnoFixBack.DTOs;

public class CreateOrderDto
{
    [Required(ErrorMessage = "Debe completar el campo Cliente")]
    [JsonPropertyName("clientId")]
    public int ClientId { get; set; }

    [Required(ErrorMessage = "Debe completar el campo Tipo de equipo")]
    [RegularExpression(
        @"^(Notebook|PC de Escritorio|Celular|Tablet|Consola|Impresora|Otro)$",
        ErrorMessage = "El tipo de equipo debe ser uno de los valores permitidos: Notebook, PC de Escritorio, Celular, Tablet, Consola, Impresora u Otro.")]
    [JsonPropertyName("deviceType")]
    public string DeviceType { get; set; } = string.Empty;

    [Required(ErrorMessage = "Debe completar el campo Marca")]
    [MaxLength(100, ErrorMessage = "El campo Marca no puede superar los 100 caracteres")]
    [JsonPropertyName("brand")]
    public string Brand { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "El campo Modelo no puede superar los 100 caracteres")]
    [JsonPropertyName("model")]
    public string? Model { get; set; }

    [MaxLength(100, ErrorMessage = "El campo Número de serie no puede superar los 100 caracteres")]
    [JsonPropertyName("serialNumber")]
    public string? SerialNumber { get; set; }

    [Required(ErrorMessage = "Debe completar el campo Descripción de la falla")]
    [MaxLength(2000, ErrorMessage = "El campo Descripción de la falla no puede superar los 2000 caracteres")]
    [JsonPropertyName("issueDescription")]
    public string IssueDescription { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "El campo Accesorios no puede superar los 500 caracteres")]
    [JsonPropertyName("accessories")]
    public string? Accessories { get; set; }
}
