using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TecnoFixBack.DTOs;

public class CreateOrderDto
{
    [Required]
    [JsonPropertyName("clientId")]
    public int ClientId { get; set; }

    [Required]
    [JsonPropertyName("deviceType")]
    public string DeviceType { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("brand")]
    public string Brand { get; set; } = string.Empty;

    [JsonPropertyName("model")]
    public string? Model { get; set; }

    [JsonPropertyName("serialNumber")]
    public string? SerialNumber { get; set; }

    [Required]
    [JsonPropertyName("issueDescription")]
    public string IssueDescription { get; set; } = string.Empty;

    [JsonPropertyName("accessories")]
    public string? Accessories { get; set; }
}