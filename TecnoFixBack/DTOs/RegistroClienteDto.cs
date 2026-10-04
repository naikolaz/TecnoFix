using System.ComponentModel.DataAnnotations;

namespace TecnoFixBack.src.DTOs;

public class RegistroClienteDto
{
    [Required(ErrorMessage = "Debe completar el campo Nombre y apellidos")]
    public string NombreCompleto { get; set; } = string.Empty;

    [Required(ErrorMessage = "Debe completar el campo Correo electrónico")]
    [EmailAddress(ErrorMessage = "El correo electrónico no tiene un formato válido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Debe completar el campo RUT")]
    [RegularExpression(@"^[0-9]+[0-9Kk]$", ErrorMessage = "El RUT debe ingresarse sin puntos ni guion (ej.: 12345670K)")]
    public string Rut { get; set; } = string.Empty;

   [Required(ErrorMessage = "Debe completar el campo Teléfono de contacto")]
    [RegularExpression(@"^\+569\d{8}$", ErrorMessage = "El teléfono debe tener el formato chileno correcto (+569 seguido de 8 dígitos, total 11 dígitos).")]
    public string Telefono { get; set; } = string.Empty;
}