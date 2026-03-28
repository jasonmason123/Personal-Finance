using Microsoft.EntityFrameworkCore;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Infrastructure.DbContext;

namespace PersonalFinance.Application.Transaction.Validations
{
    public class TransactionValidations
    {
        private readonly AppDbContext appDbContext;

        public TransactionValidations(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        /// <summary>
        /// Check if the type of the selected Category matches the <paramref name="transaction"/> type
        /// </summary>
        /// <param name="transaction"></param>
        /// <returns></returns>
        public async Task<bool> CheckCategoryTypeMatchTransactionType(T_Transaction transaction)
        {
            if (transaction.CategoryId == null)
            {
                throw new ArgumentException($"{nameof(transaction.CategoryId)} is not provided");
            }

            return await appDbContext.M_Categories
                    .Where(x => x.Id == transaction.CategoryId && x.Type == transaction.Type).AnyAsync();
        }
    }
}
