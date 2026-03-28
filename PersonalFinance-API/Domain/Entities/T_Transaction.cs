using PersonalFinance.Domain.Enumerations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalFinance.Domain.Entities
{
    /// <summary>
    /// Transactions a user made (incomes, spendings)
    /// </summary>
    [Table(nameof(T_Transaction))]
    public class T_Transaction
    {
        /// <summary>
        /// Transaction ID
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        /// <summary>
        /// Title of the Transaction
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// The partner that the user buys products/services from or pays user money
        /// </summary>
        public string? Merchant { get; set; }
        /// <summary>
        /// Transaction amount
        /// </summary>
        public double Amount { get; set; } = 0;
        /// <summary>
        /// Date and time the Transaction occurred
        /// </summary>
        public DateTime Date { get; set; } = DateTime.UtcNow;
        /// <summary>
        /// Transaction type
        /// </summary>
        public TransactionType Type { get; set; }
        /// <summary>
        /// Created at
        /// </summary>
        public DateTime CreatedAt { get; set; }
        /// <summary>
        /// Last updated at
        /// </summary>
        public DateTime LastUpdatedAt { get; set; }
        /// <summary>
        /// Row version, maps to implicit column "xmin" on Postgresql
        /// </summary>
        [Timestamp]
        public uint Version { get; }
        /// <summary>
        /// ID of the <see cref="M_AppUser"/> owning the Transaction
        /// </summary>
        public string? UserId { get; set; }
        /// <summary>
        /// The <see cref="M_AppUser"/> owning the Transaction
        /// </summary>
        public M_AppUser? _User { get; set; }
        /// <summary>
        /// ID of the <see cref="Category"/> that the Transaction belongs to
        /// </summary>
        public Guid? CategoryId { get; set; }
        /// <summary>
        /// The <see cref="Category"/> that the Transaction belongs to
        /// </summary>
        public M_Category? _Category { get; set; }
    }
}
