using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalFinance.Domain.Entities
{
    /// <summary>
    /// Stores app users information
    /// </summary>
    [Table(nameof(M_AppUser))]
    public class M_AppUser : IdentityUser
    {
        /// <summary>
        /// Active flag
        /// </summary>
        public bool FlagActive { get; set; }
        /// <summary>
        /// Created at
        /// </summary>
        public DateTime CreatedAt { get; set; }
        /// <summary>
        /// Last updated at
        /// </summary>
        public DateTime LastUpdatedAt { get; set; }
        /// <summary>
        /// List of <see cref="M_Category"/> owned by the user
        /// </summary>
        public virtual List<M_Category>? _Categories { get; set; }
        /// <summary>
        /// List of <see cref="T_Transaction"/> owned by the user
        /// </summary>
        public virtual List<T_Transaction>? _Transactions { get; set; }
    }
}
