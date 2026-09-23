using Microsoft.EntityFrameworkCore;
using TecnoFixBack.src.model;

namespace TecnoFixBack.src.Data;

public class TecnoFixContext : DbContext
{
    public TecnoFixContext(DbContextOptions<TecnoFixContext> options) : base(options) { }

    public DbSet<User> Usuarios { get; set; }
    public DbSet<Rol> Roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuramos las tablas y relaciones
        modelBuilder.Entity<User>()
            .HasOne(u => u.Rol)
            .WithMany(r => r.Usuarios)
            .HasForeignKey(u => u.IdRol);

        // Aseguramos que Email y RUT sean únicos en la base de datos
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Rut).IsUnique();

        // Los IDs autoincrementales parten después de los registros iniciales para no chocar con ellos
        modelBuilder.Entity<Rol>().Property(r => r.Id).HasIdentityOptions(startValue: 4);
        modelBuilder.Entity<User>().Property(u => u.Id).HasIdentityOptions(startValue: 2);

        // Datos iniciales: roles del sistema y el administrador (requerido para iniciar sesión y registrar técnicos)
        modelBuilder.Entity<Rol>().HasData(
            new Rol { Id = 1, Name = "Administrador" },
            new Rol { Id = 2, Name = "Cliente" },
            new Rol { Id = 3, Name = "Técnico" }
        );

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                NombreCompleto = "Administrador TecnoFix",
                Email = "admin@tecnofix.cl",
                Password = "$2a$11$p1aaLoFneaW8kzCJCPJDJe5qJlJm19DomNZtN4U7J2jm8YvlMW3p.",
                CreateOnly = new DateTime(2026, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                IdRol = 1
            }
        );
    }
}
