using PersonalFinance.Domain.Enumerations;

namespace PersonalFinance.Domain.DTOs.Transaction
{
    /// <summary>
    /// Wrap parameters to query transaction list
    /// </summary>
    public class TransactionQueryParams
    {
        /// <summary>
        /// Query by search string
        /// </summary>
        public string? Search {  get; set; }
        /// <summary>
        /// Query by Transaction type
        /// </summary>
        public TransactionType? TransactionType { get; set; }
        /// <summary>
        /// Query by Category
        /// </summary>
        public Guid? CategoryId { get; set; }
        /// <summary>
        /// Query by date, parameters are provided by the <see cref="DateFilterRecord"/>
        /// </summary>
        public DateFilterRecord? DateFilter { get; set; }
    }
}
