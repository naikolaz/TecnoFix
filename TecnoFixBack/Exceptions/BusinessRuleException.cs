namespace TecnoFixBack.Exceptions;

/// <summary>
/// Thrown when a request breaks a validation rule of a requirement.
/// Its message is the text shown to the user.
/// </summary>
public class BusinessRuleException : Exception
{
    public BusinessRuleException(string message) : base(message)
    {
    }
}
