using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.Domain.Entities;

namespace PersonalFinance.Infrastructure.DbContext
{
    /// <summary>
    /// Db context
    /// </summary>
    public class AppDbContext : IdentityDbContext<M_AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        /// <summary>
        /// <see cref="DbSet{TEntity}"/> of <see cref="M_AppUser"/>
        /// </summary>
        public DbSet<M_AppUser> M_AppUsers { get; set; }
        /// <summary>
        /// <see cref="DbSet{TEntity}"/> of <see cref="M_Category"/>
        /// </summary>
        public DbSet<M_Category> M_Categories { get; set; }
        /// <summary>
        /// <see cref="DbSet{TEntity}"/> of <see cref="T_Transaction"/>
        /// </summary>
        public DbSet<T_Transaction> T_Transactions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Still needed for enum → string conversion
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
                foreach (var property in entityType.GetProperties())
                    if (property.ClrType.IsEnum)
                        property.SetProviderClrType(typeof(string));

            // Set null to CategoryId of the Transaction if the Category is deleted
            modelBuilder.Entity<T_Transaction>()
            .HasOne(t => t._Category)
            .WithMany(c => c._Transactions)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
