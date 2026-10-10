using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace HardwareHub.Infrastructure.Data;

public class HardwareHubDbContextFactory
    : IDesignTimeDbContextFactory<HardwareHubDbContext>
{
    public HardwareHubDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<HardwareHubDbContext>();

        optionsBuilder.UseSqlServer(
            "Server=(localdb)\\MSSQLLocalDB;Database=HardwareHubDb;Trusted_Connection=True;TrustServerCertificate=True;");

        return new HardwareHubDbContext(optionsBuilder.Options);
    }
}