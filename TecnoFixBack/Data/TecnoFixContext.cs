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
    }
}