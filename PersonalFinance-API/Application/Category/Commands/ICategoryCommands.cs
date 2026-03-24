using PersonalFinance.Domain.Entities;
using PersonalFinance.Domain.Enumerations;

namespace PersonalFinance.Application.Category.Commands
{
    public interface ICategoryCommands
    {
        /// <summary>
        /// Create a new <see cref="M_Category"/> by user
        /// </summary>
        /// <param name="userId">The user who creates the Category</param>
        /// <param name="categoryName">The Category name</param>
        /// <param name="type">The <see cref="TransactionType"/> of the Category</param>
        /// <returns></returns>
        public Task<M_Category> CreateByUserAsync(string userId, string categoryName, TransactionType type);
        /// <summary>
        /// Update the name of an existing <see cref="M_Category"/> by user, must not be similar to any existing Category that the <paramref name="userId"/> owns
        /// </summary>
        /// <param name="categoryId">The category ID</param>
        /// <param name="userId">The user who owns and updates the Category</param>
        /// <param name="newName">The new name</param>
        /// <returns></returns>
        public Task<M_Category> UpdateByUserAsync(Guid categoryId, string userId, string newName);
        /// <summary>
        /// Delete a <see cref="M_Category"/> by user
        /// </summary>
        /// <param name="categoryId">Category ID</param>
        /// <param name="userId">The user who owns and deletes the Category</param>
        /// <returns></returns>
        public Task DeleteByUserAsync(Guid categoryId, string userId);
    }
}
