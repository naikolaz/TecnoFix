namespace TecnoFixBack.Models;

/// <summary>
/// Order states defined in the ERS. The value is the text stored in Order.status.
/// </summary>
public static class OrderStatus
{
    public const string Received = "Recibida";
    public const string InDiagnosis = "En diagnóstico";
    public const string Budgeted = "Presupuestada";
    public const string InRepair = "En reparación";
    public const string ReadyForPickup = "Lista para retiro";
    public const string Delivered = "Entregada";
    public const string Rejected = "Rechazada";
}
