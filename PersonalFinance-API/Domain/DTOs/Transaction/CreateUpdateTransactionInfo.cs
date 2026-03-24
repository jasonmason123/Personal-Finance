using PersonalFinance.Domain.Enumerations;

namespace PersonalFinance.Domain.DTOs.Transaction
{
    public class CreateUpdateTransactionInfo
    {
        /// <summary>
        /// Title of the Transaction
        /// </summary>
        public string Title { get; set; } = "";
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
        public DateTime? Date { get; set; }
        /// <summary>
        /// Transaction type
        /// </summary>
        public TransactionType Type { get; set; }
        /// <summary>
        /// ID of the <see cref="Category"/> that the Transaction belongs to
        /// </summary>
        public Guid? CategoryId { get; set; }
    }
}
