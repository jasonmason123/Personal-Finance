using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Category.Validations;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Domain.Enumerations;
using PersonalFinance.Infrastructure.DbContext;

namespace PersonalFinance.Application.Category.Commands
{
    public class CategoryCommands : ICategoryCommands
    {
        private readonly IConfiguration configuration;
        private readonly AppDbContext appDbContext;
        private readonly CategoryValidations validations;

        public CategoryCommands(AppDbContext appDbContext, CategoryValidations validations, IConfiguration configuration)
        {
            this.appDbContext = appDbContext;
            this.validations = validations;
            this.configuration = configuration;
        }

        public async Task<M_Category> CreateByUserAsync(string userId, string categoryName, TransactionType type)
        {
            if (!await validations.CheckMaximumCategoriesOwnedByUserAsync(userId))
            {
                var max = configuration.GetValue<int>("BusinessRules:MaxCategoriesPerUser");
                throw new InvalidOperationException($"User cannot create any more Categories, max: {max}");
            }

            var newCategory = new M_Category
            {
                Name = categoryName.ToUpper(),
                Type = type,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                LastUpdatedAt = DateTime.UtcNow,
            };

            appDbContext.M_Categories.Add(newCategory);
            await appDbContext.SaveChangesAsync();

            return newCategory;
        }

        public async Task<M_Category> UpdateByUserAsync(Guid categoryId, string userId, string newName)
        {
            var category = await appDbContext.M_Categories.Where(x => x.Id == categoryId && x.UserId == userId).FirstOrDefaultAsync();

            if(category == null)
            {
                throw new ArgumentException("Category not found or unauthorized user");
            }

            category.Name = newName.ToUpper();
            category.LastUpdatedAt = DateTime.UtcNow;

            await appDbContext.SaveChangesAsync();

            return category;
        }

        public async Task DeleteByUserAsync(Guid categoryId, string userId)
        {
            var category = await appDbContext.M_Categories.Where(x => x.Id == categoryId && x.UserId == userId).FirstOrDefaultAsync();

            if (category == null)
            {
                throw new ArgumentException("Category not found or unauthorized user");
            }

            appDbContext.M_Categories.Remove(category);
            await appDbContext.SaveChangesAsync();
        }
    }
}
