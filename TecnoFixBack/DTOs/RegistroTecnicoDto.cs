using System.ComponentModel.DataAnnotations;

namespace TecnoFixBack.src.DTOs;

public class RegistroTecnicoDto
{
    [Required(ErrorMessage = "Debe completar el campo Nombre y apellidos")]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "El nombre solo puede contener letras y espacios")]
    public string NombreCompleto { get; set; } = string.Empty;

    [Required(ErrorMessage = "Debe completar el campo Correo electrónico")]
    [EmailAddress(ErrorMessage = "El correo electrónico no tiene un formato válido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Debe completar el campo Especialidad")]
    public string Especialidad { get; set; } = string.Empty;
}