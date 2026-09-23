using System.ComponentModel.DataAnnotations;

namespace TecnoFixBack.src.DTOs;

public class LoginDto
{
    private string _email = string.Empty;

    [Required(ErrorMessage = "Debe completar el campo Correo electrónico")]
    [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "El correo electrónico no tiene un formato válido")]
    public string Email
    {
        get => _email;
        set => _email = value?.Trim() ?? string.Empty;
    }

    [Required(ErrorMessage = "Debe completar el campo Contraseña")]
    public string Password { get; set; } = string.Empty;
}
