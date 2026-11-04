using Microsoft.EntityFrameworkCore;
using TecnoFixBack.Models;

namespace TecnoFixBack.Data;

public class TecnoFixContext : DbContext
{
    public TecnoFixContext(DbContextOptions<TecnoFixContext> options) : base(options) { }

    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderLog> Loggers { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Brand> Brands { get; set; } = null!;
    public DbSet<DeviceModel> Models { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasOne(u => u.role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.idRole);

        modelBuilder.Entity<User>().HasIndex(u => u.email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.RUT).IsUnique();

        modelBuilder.Entity<Role>().Property(r => r.ID).HasIdentityOptions(startValue: 4);
        modelBuilder.Entity<User>().Property(u => u.ID).HasIdentityOptions(startValue: 2);

        modelBuilder.Entity<Role>().HasData(
            new Role { ID = 1, name = "Administrador" },
            new Role { ID = 2, name = "Cliente" },
            new Role { ID = 3, name = "Técnico" }
        );

        modelBuilder.Entity<User>().HasData(
            new User
            {
                ID = 1,
                name = "Administrador TecnoFix",
                email = "admin@tecnofix.cl",
                password = "$2a$11$p1aaLoFneaW8kzCJCPJDJe5qJlJm19DomNZtN4U7J2jm8YvlMW3p.",
                CreateOnly = new DateTime(2026, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                idRole = 1
            }
        );

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

            modelBuilder.Entity<Brand>().HasData(
            new Brand { Id = 1, Name = "Asus" },
            new Brand { Id = 2, Name = "HP" },
            new Brand { Id = 3, Name = "Lenovo" },
            new Brand { Id = 4, Name = "Dell" },
            new Brand { Id = 5, Name = "Apple" },
            new Brand { Id = 6, Name = "Samsung" },
            new Brand { Id = 7, Name = "Acer" },
            new Brand { Id = 8, Name = "MSI" }
        );
    }
}