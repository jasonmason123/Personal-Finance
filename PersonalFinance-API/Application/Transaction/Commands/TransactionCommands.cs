using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Transaction.Validations;
using PersonalFinance.Domain.DTOs.Transaction;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Infrastructure.DbContext;

namespace PersonalFinance.Application.Transaction.Commands
{
    public class TransactionCommands : ITransactionCommands
    {
        private readonly AppDbContext appDbContext;
        private readonly TransactionValidations validations;

        public TransactionCommands(AppDbContext appDbContext, TransactionValidations validations)
        {
            this.appDbContext = appDbContext;
            this.validations = validations;
        }

        public async Task<T_Transaction> CreateByUserAsync(string userId, CreateUpdateTransactionInfo transactionInfo)
        {
            if (transactionInfo.Date == null)
            {
                throw new ArgumentNullException("Date is not provided");
            }

            var newTransaction = new T_Transaction
            {
                UserId = userId,
                Type = transactionInfo.Type,
                Amount = transactionInfo.Amount,
                Title = transactionInfo.Title.ToUpper(),
                Merchant = transactionInfo.Merchant?.ToUpper(),
                Date = (DateTime) transactionInfo.Date,
                CategoryId = transactionInfo.CategoryId,
                CreatedAt = DateTime.UtcNow,
                LastUpdatedAt = DateTime.UtcNow,
            };

            if(! await validations.CheckCategoryTypeMatchTransactionType(newTransaction))
            {
                throw new InvalidOperationException("Category type does not match Transaction type");
            }

            appDbContext.T_Transactions.Add(newTransaction);
            await appDbContext.SaveChangesAsync();

            return newTransaction;
        }

        public async Task<T_Transaction> UpdateByUserAsync(Guid id, string userId, CreateUpdateTransactionInfo transactionInfo)
        {
            var transaction = await appDbContext.T_Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
            {
                throw new ArgumentException("Transaction not found or unauthorized user");
            }

            if (!string.IsNullOrEmpty(transactionInfo.Title))
            {
                transaction.Title = transactionInfo.Title.ToUpper();
            }

            if (!string.IsNullOrEmpty(transactionInfo.Merchant))
            {
                transaction.Merchant = transactionInfo.Merchant.ToUpper();
            }

            if (transactionInfo.Amount  != 0)
            {
                transaction.Amount = transactionInfo.Amount;
            }

            if (transactionInfo.Date != null)
            {
                transaction.Date = (DateTime) transactionInfo.Date;
            }

            if (transactionInfo.CategoryId != null)
            {
                // Ensure the category with correct type is chosen
                var categoryTypeMatched = await appDbContext.M_Categories
                    .Where(x => x.Id == transactionInfo.CategoryId && x.Type == transaction.Type).AnyAsync();

                if (categoryTypeMatched)
                {
                    transaction.CategoryId = transactionInfo.CategoryId;
                }
            }

            transaction.LastUpdatedAt = DateTime.UtcNow;
            await appDbContext.SaveChangesAsync();
            return transaction;
        }

        public async Task DeleteByUserAsync(Guid id, string userId)
        {
            var transaction = await appDbContext.T_Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
            {
                throw new ArgumentException("Transaction not found or unauthorized user");
            }

            appDbContext.T_Transactions.Remove(transaction);
            await appDbContext.SaveChangesAsync();
        }
    }
}
