using Microsoft.EntityFrameworkCore;
using TecnoFixBack.src.model; 
using TecnoFixBack.Models;    

namespace TecnoFixBack.src.Data;

public class TecnoFixContext : DbContext
{
    public TecnoFixContext(DbContextOptions<TecnoFixContext> options) : base(options) { }

    // Tablas del sistema
    public DbSet<User> Usuarios { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderLog> Loggers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // === CONFIGURACIÓN USER Y ROLE ===
        modelBuilder.Entity<User>()
            .HasOne(u => u.role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.idRole); // Usamos idRole

        // Índices únicos con las propiedades actualizadas (Email y RUT)
        modelBuilder.Entity<User>().HasIndex(u => u.email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.RUT).IsUnique();

        // Autoincrementales usando ID (en mayúsculas)
        modelBuilder.Entity<Role>().Property(r => r.ID).HasIdentityOptions(startValue: 4);
        modelBuilder.Entity<User>().Property(u => u.ID).HasIdentityOptions(startValue: 2);

        // Datos iniciales de roles
        modelBuilder.Entity<Role>().HasData(
            new Role { ID = 1, name = "Administrador" },
            new Role { ID = 2, name = "Cliente" },
            new Role { ID = 3, name = "Técnico" }
        );

        // Usuario administrador inicial
        modelBuilder.Entity<User>().HasData(
            new User
            {
                ID = 1,
                name = "Administrador TecnoFix", // Usamos name
                email = "admin@tecnofix.cl",
                password = "$2a$11$p1aaLoFneaW8kzCJCPJDJe5qJlJm19DomNZtN4U7J2jm8YvlMW3p.",
                CreateOnly = new DateTime(2026, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                idRole = 1
            }
        );

        // === CONFIGURACIÓN ORD-001 (Órdenes y Bitácora) ===
        modelBuilder.Entity<Order>()
            .HasOne(o => o.client)
            .WithMany() 
            .HasForeignKey(o => o.clientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderLog>()
            .HasOne(l => l.order)
            .WithMany(o => o.history)
            .HasForeignKey(l => l.orderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
