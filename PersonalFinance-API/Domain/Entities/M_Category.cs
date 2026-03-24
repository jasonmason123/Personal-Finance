using Microsoft.EntityFrameworkCore;
using PersonalFinance.Domain.Enumerations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalFinance.Domain.Entities
{
    /// <summary>
    /// Transaction categories (e.g. Food, Groceries, etc.)
    /// </summary>
    [Table(nameof(M_Category))]
    [Index(nameof(Name), nameof(UserId), IsUnique = true)]
    public class M_Category
    {
        /// <summary>
        /// Category ID
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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
        /// <summary>
        /// Row version
        /// </summary>
        [Timestamp]
        public byte[] Version { get; set; }
        /// <summary>
        /// ID of the <see cref="M_AppUser"/> owning the Category
        /// </summary>
        public string? UserId { get; set; }
        /// <summary>
        /// The <see cref="M_AppUser"/> owning the Category
        /// </summary>
        public virtual M_AppUser? _User { get; set; }
        /// <summary>
        /// List of <see cref="T_Transaction"/> belongs to this Category
        /// </summary>
        public virtual List<T_Transaction>? _Transactions { get; set; }
    }
}
