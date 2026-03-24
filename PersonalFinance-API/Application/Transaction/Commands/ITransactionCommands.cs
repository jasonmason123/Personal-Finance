using PersonalFinance.Domain.DTOs.Transaction;
using PersonalFinance.Domain.Entities;

namespace PersonalFinance.Application.Transaction.Commands
{
    public interface ITransactionCommands
    {
        /// <summary>
        /// Create a new Transaction
        /// </summary>
        /// <param name="userId">ID of user owning the Transaction</param>
        /// <param name="transactionInfo">Information to create the Transaction</param>
        /// <returns></returns>
        public Task<T_Transaction> CreateByUserAsync(string userId, CreateUpdateTransactionInfo transactionInfo);
        /// <summary>
        /// Update a Transaction
        /// </summary>
        /// <param name="id">Transaction ID</param>
        /// <param name="userId">ID of user owning the Transaction</param>
        /// <param name="transactionInfo">Information to update the Transaction</param>
        /// <returns></returns>
        public Task<T_Transaction> UpdateByUserAsync(Guid id, string userId, CreateUpdateTransactionInfo transactionInfo);
        /// <summary>
        /// Delete a Transaction
        /// </summary>
        /// <param name="id">Transaction ID</param>
        /// <param name="userId">ID of user owning the Transaction</param>
        /// <returns></returns>
        public Task DeleteByUserAsync(Guid id, string userId);
    }
}
