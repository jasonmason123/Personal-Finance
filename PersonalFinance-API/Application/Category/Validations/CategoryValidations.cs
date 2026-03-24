using Microsoft.EntityFrameworkCore;
using PersonalFinance.Infrastructure.DbContext;

namespace PersonalFinance.Application.Category.Validations
{
    public class CategoryValidations
    {
        private readonly IConfiguration configuration;
        private readonly AppDbContext appDbContext;

        public CategoryValidations(AppDbContext appDbContext, IConfiguration configuration)
        {
            this.appDbContext = appDbContext;
            this.configuration = configuration;
        }

        /// <summary>
        /// Ensure that the number of categories created do not exceed the limit
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<bool> CheckMaximumCategoriesOwnedByUserAsync(string userId)
        {
            var max = configuration.GetValue<int>("BusinessRules:MaxCategoriesPerUser");
            return await appDbContext.M_Categories.Where(x => x.UserId == userId).Select(x => x.Id).CountAsync() <= max;
        }
    }
}
