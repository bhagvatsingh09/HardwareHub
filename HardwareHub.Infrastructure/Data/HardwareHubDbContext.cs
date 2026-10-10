using HardwareHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HardwareHub.Infrastructure.Data;

public class HardwareHubDbContext : DbContext
{
    public HardwareHubDbContext(
        DbContextOptions<HardwareHubDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Product> Products => Set<Product>();

    public DbSet<Enquiry> Enquiries => Set<Enquiry>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Enquiry>()
            .HasOne(e => e.Product)
            .WithMany()
            .HasForeignKey(e => e.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Enquiry>()
            .Property(e => e.Status)
            .HasConversion<string>();

        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.HasKey(a => a.Id);

            entity.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(a => a.Email)
                .IsRequired()
                .HasMaxLength(256);

            entity.HasIndex(a => a.Email)
                .IsUnique();

            entity.Property(a => a.PasswordHash)
                .IsRequired();

            entity.Property(a => a.Role)
                .IsRequired()
                .HasMaxLength(50);
        });
    }
}