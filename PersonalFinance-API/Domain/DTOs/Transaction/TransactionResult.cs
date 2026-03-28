using PersonalFinance.Domain.Enumerations;
using PersonalFinance.Domain.Entities;

namespace PersonalFinance.Domain.DTOs.Transaction
{
    /// <summary>
    /// Fields of <see cref="T_Transaction"/> that can be exposed to the user app
    /// </summary>
    public class TransactionResult
    {
        /// <summary>
        /// Transaction ID
        /// </summary>
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
        public TransactionType? Type { get; set; }
        /// <summary>
        /// Created at
        /// </summary>
        public DateTime CreatedAt { get; set; }
        /// <summary>
        /// Last updated at
        /// </summary>
        public DateTime LastUpdatedAt { get; set; }
        /// <summary>
        /// ID of the <see cref="Category"/> that the Transaction belongs to
        /// </summary>
        public Guid? CategoryId { get; set; }
        /// <summary>
        /// Name of the <see cref="Category"/> that the Transaction belongs to
        /// </summary>
        public string? CategoryName { get; set; }
    }
}
