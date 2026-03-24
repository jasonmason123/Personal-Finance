using Microsoft.EntityFrameworkCore;
using PersonalFinance.Domain.DTOs.Transaction;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Infrastructure.DbContext;

namespace PersonalFinance.Application.Transaction.Queries
{
    public class TransactionQueries : ITransactionQueries
    {
        private readonly AppDbContext appDbContext;

        public TransactionQueries(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IQueryable<TransactionResult> GetListQueryByUser(string userId, TransactionQueryParams queryParams)
        {
            var query = appDbContext.T_Transactions.Where(x => x.UserId == userId);

            query = BuildConditionsFromQueryParams(query, queryParams);

            return query
                .Include(x => x._Category)
                .Select(x => new TransactionResult
                {
                    Id = x.Id,
                    Title = x.Title,
                    Merchant = x.Merchant,
                    Date = x.Date,
                    Type = x.Type,
                    Amount = x.Amount,
                    CategoryId = x.CategoryId,
                    CategoryName = x._Category.Name,
                    CreatedAt = x.CreatedAt,
                    LastUpdatedAt = x.LastUpdatedAt,
                });
        }

        public IQueryable<TransactionResult> GetDetailsQueryByUser(Guid id, string userId)
        {
            return appDbContext.T_Transactions
                .Where(x => x.Id == id && x.UserId == userId)
                .Include(x => x._Category)
                .Select(x => new TransactionResult
                {
                    Id = x.Id,
                    Title = x.Title,
                    Merchant = x.Merchant,
                    Date = x.Date,
                    Type = x.Type,
                    Amount = x.Amount,
                    CategoryId = x.CategoryId,
                    CategoryName = x._Category.Name,
                    CreatedAt = x.CreatedAt,
                    LastUpdatedAt = x.LastUpdatedAt,
                });
        }

        public async Task<double> CalculateTotalAmountByUserAsync(string userId, TransactionQueryParams queryParams)
        {
            var query = appDbContext.T_Transactions.Where(x => x.UserId == userId);

            if (queryParams.DateFilter == null)
            {
                throw new ArgumentException("Must specify date range");
            }

            query = BuildConditionsFromQueryParams(query, queryParams);

            return await query.SumAsync(x => x.Amount);
        }

        public async Task<int> CountItemsByUser(string userId, TransactionQueryParams queryParams)
        {
            var query = appDbContext.T_Transactions.Where(x => x.UserId == userId);

            query = BuildConditionsFromQueryParams(query, queryParams);

            return await query.Select(x => x.Id).CountAsync();
        }

        private IQueryable<T_Transaction> BuildConditionsFromQueryParams(IQueryable<T_Transaction> query, TransactionQueryParams queryParams)
        {
            if (!string.IsNullOrEmpty(queryParams.Search))
            {
                // Use .StartsWith() to preserve indexes -> faster query, for .Contains(), consider using GIN index of Postgresql
                query = query.Where(x => x.Title.StartsWith(queryParams.Search));
            }

            if (queryParams.TransactionType != null)
            {
                query = query.Where(x => x.Type == queryParams.TransactionType);
            }

            if (queryParams.CategoryId != null)
            {
                query = query.Where(x => x.CategoryId == queryParams.CategoryId);
            }

            if (queryParams.DateFilter != null)
            {
                var dateFilter = queryParams.DateFilter;

                if (dateFilter.ExactDate != null)
                {
                    query = query.Where(x => x.Date == dateFilter.ExactDate);
                }
                else if (dateFilter.DateFrom != null && dateFilter.DateTo != null)
                {
                    query = query.Where(x => x.Date >= dateFilter.DateFrom && x.Date <= dateFilter.DateTo);
                }
                else if (dateFilter.DateFrom != null)
                {
                    query = query.Where(x => x.Date >= dateFilter.DateFrom);
                }
                else if (dateFilter.DateTo != null)
                {
                    query = query.Where(x => x.Date <= dateFilter.DateTo);
                }
            }

            return query;
        }
    }
}
