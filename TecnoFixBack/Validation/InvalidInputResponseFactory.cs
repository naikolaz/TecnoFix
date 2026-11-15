using Microsoft.AspNetCore.Mvc;

namespace TecnoFixBack.Validation;

public static class InvalidInputResponseFactory
{
    private const string InvalidCostMessage = "El costo ingresado no es válido";
    private const string InvalidValueMessage = "El valor ingresado no es válido";
    private const string EmptyRequestMessage = "La solicitud no contiene datos válidos";
    private const string ValidationTitle = "Uno o más datos ingresados no son válidos";

    private static readonly HashSet<string> CostFields = new(StringComparer.OrdinalIgnoreCase)
    {
        "laborCost",
        "partsCost"
    };

    public static IActionResult Create(ActionContext context)
    {
        var parameterNames = context.ActionDescriptor.Parameters.Select(p => p.Name).ToHashSet();
        var errors = new Dictionary<string, string[]>();

        foreach (var (key, entry) in context.ModelState)
        {
            if (entry.Errors.Count == 0 || parameterNames.Contains(key))
                continue;

            if (string.IsNullOrEmpty(key))
            {
                errors[string.Empty] = [EmptyRequestMessage];
                continue;
            }

            // Las claves que empiezan con "$" vienen del lector JSON: el valor no se pudo convertir al tipo del campo
            if (key.StartsWith('$'))
            {
                var field = key.TrimStart('$', '.');
                errors[field] = [CostFields.Contains(field) ? InvalidCostMessage : InvalidValueMessage];
                continue;
            }

            errors[key] = entry.Errors
                .Select(e => string.IsNullOrWhiteSpace(e.ErrorMessage) ? InvalidValueMessage : e.ErrorMessage)
                .ToArray();
        }

        if (errors.Count == 0)
            errors[string.Empty] = [EmptyRequestMessage];

        var problem = new ValidationProblemDetails(errors)
        {
            Title = ValidationTitle,
            Status = StatusCodes.Status400BadRequest
        };

        return new BadRequestObjectResult(problem);
    }
}
