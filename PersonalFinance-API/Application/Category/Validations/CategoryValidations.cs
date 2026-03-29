using Microsoft.EntityFrameworkCore;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Infrastructure.DbContext;

namespace PersonalFinance.Application.Category.Validations
{
    public class CategoryValidations
    {
        private readonly AppDbContext appDbContext;

        public int MaxCategoriesAllowed { get; }

        public CategoryValidations(AppDbContext appDbContext, IConfiguration configuration)
        {
            this.appDbContext = appDbContext;
            this.MaxCategoriesAllowed = configuration.GetValue<int>("BusinessRules:MaxCategoriesPerUser");
        }

        /// <summary>
        /// Ensure that the number of categories created do not exceed the limit
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<bool> CheckMaximumCategoriesOwnedByUserAsync(string userId)
        {
            return await appDbContext.M_Categories.Where(x => x.UserId == userId).Select(x => x.Id).CountAsync() <= MaxCategoriesAllowed;
        }

        /// <summary>
        /// Ensure that for each <paramref name="userId"/>, no <see cref="M_Category.Name"/> is duplicated
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<bool> CheckNameExisted(string userId, string name)
        {
            return await appDbContext.M_Categories.Where(x => x.Name == name && x.UserId == userId).AnyAsync();
        }
    }
}
