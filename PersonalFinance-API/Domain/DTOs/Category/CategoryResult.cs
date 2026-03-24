using PersonalFinance.Domain.Entities;
using PersonalFinance.Domain.Enumerations;

namespace PersonalFinance.Domain.DTOs.Category
{
    /// <summary>
    /// Fields of <see cref="M_Category"/> that can be exposed to the user app
    /// </summary>
    public class CategoryResult
    {
        /// <summary>
        /// Category ID
        /// </summary>
        public Guid Id { get; set; }
        /// <summary>
        /// Category name, unique by each user
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Specify which type of Transaction fits the Category
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
    }
}
