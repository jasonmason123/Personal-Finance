using PersonalFinance.Domain.DTOs.Transaction;
using PersonalFinance.Domain.Entities;

namespace PersonalFinance.Application.Transaction.Queries
{
    public interface ITransactionQueries
    {
        /// <summary>
        /// Get the list <see cref="IQueryable"/> of <see cref="T_Transaction"/>, pagination should be applied on the caller side
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public IQueryable<TransactionResult> GetListQueryByUser(string userId, TransactionQueryParams queryParams);
        /// <summary>
        /// Get the details <see cref="IQueryable"/> of a <see cref="T_Transaction"/>
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IQueryable<TransactionResult> GetDetailsQueryByUser(Guid id, string userId);
        /// <summary>
        /// Calculate the total amount of all <see cref="T_Transaction"/> within the search range
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public Task<double> CalculateTotalAmountByUserAsync(string userId, TransactionQueryParams queryParams);
        /// <summary>
        /// Count the number of <see cref="T_Transaction"/> items within the query range
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public Task<int> CountItemsByUser(string userId, TransactionQueryParams queryParams);
    }
}
