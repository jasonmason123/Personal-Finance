using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Analytics.Validations;
using PersonalFinance.Domain.DTOs;
using PersonalFinance.Domain.DTOs.Analytics;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Domain.Enumerations;
using PersonalFinance.Infrastructure.DbContext;

namespace PersonalFinance.Application.Analytics.Queries
{
    public class AnalyticsQueries : IAnalyticsQueries
    {
        private readonly AppDbContext appDbContext;
        private readonly AnalyticsValidations validations;

        public AnalyticsQueries(AppDbContext appDbContext, AnalyticsValidations validations)
        {
            this.appDbContext = appDbContext;
            this.validations = validations;
        }

        public async Task<IncomeExpenseResult> GetIncomeExpenseSummaryAsync(string userId, DateFilterRecord dateFilter)
        {
            var query = appDbContext.T_Transactions
                .Where(x => x.UserId == userId);

            query = BuildConditionsFromDateFilter(query, dateFilter);

            var totals = await query
                .GroupBy(x => 1) // Group everything into a single bucket
                .Select(g => new IncomeExpenseResult
                {
                    Income = g.Where(x => x.Type == TransactionType.Income).Sum(x => (decimal?)x.Amount) ?? 0,
                    Expense = g.Where(x => x.Type == TransactionType.Expense).Sum(x => (decimal?)x.Amount) ?? 0
                })
                .FirstOrDefaultAsync() ?? new IncomeExpenseResult();

            return totals;
        }

        public async Task<Dictionary<string, decimal>> GetCategoryBreakdownAsync(string userId, DateFilterRecord dateFilter, TransactionType type)
        {
            var query = appDbContext.T_Transactions
                .Where(x => x.UserId == userId && x.Type == type);

            query = BuildConditionsFromDateFilter(query, dateFilter);

            // Execute Grouping and Summation
            return await query
                .GroupBy(x => x._Category.Name ?? "Other")
                .Select(g => new
                {
                    Name = g.Key,
                    // (decimal?) handles empty categories safely within the sum
                    Total = g.Sum(x => (decimal?)x.Amount) ?? 0
                })
                .ToDictionaryAsync(
                    x => x.Name,
                    x => x.Total
                );
        }

        public async Task<YearlyIncomeExpenseSeriesResult> GetAnnualTrendAsync(string userId, int year)
        {
            // PostgreSQL requires to set DateTimeKind
            var startOfYear = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var endOfYear = new DateTime(year, 12, 31, 23, 59, 59, DateTimeKind.Utc);

            // 1. Fetch grouped data from DB (Single Query)
            var monthlyData = await appDbContext.T_Transactions
                .Where(x => x.UserId == userId
                        && x.Date >= startOfYear
                        && x.Date <= endOfYear)
                .GroupBy(x => new { x.Date.Month, x.Type })
                .Select(g => new
                {
                    Month = g.Key.Month,
                    Type = g.Key.Type,
                    Total = g.Sum(x => (decimal?)x.Amount) ?? 0
                })
                .ToListAsync();

            // 2. Initialize Result
            var result = new YearlyIncomeExpenseSeriesResult
            {
                Year = year,
                IncomeSeries = new Dictionary<int, decimal>(),
                ExpenseSeries = new Dictionary<int, decimal>()
            };

            // 3. Populate 1-12 (Ensures no "gaps" in your chart data)
            for (int m = 1; m <= 12; m++)
            {
                result.IncomeSeries[m] = monthlyData
                    .FirstOrDefault(d => d.Month == m && d.Type == TransactionType.Income)?.Total ?? 0;

                result.ExpenseSeries[m] = monthlyData
                    .FirstOrDefault(d => d.Month == m && d.Type == TransactionType.Expense)?.Total ?? 0;
            }

            return result;
        }

        private IQueryable<T_Transaction> BuildConditionsFromDateFilter(IQueryable<T_Transaction> query, DateFilterRecord dateFilter)
        {
            if (dateFilter.ExactDate != null)
            {
                query = query.Where(x => x.Date == dateFilter.ExactDate);
            }
            else if (dateFilter.DateFrom != null && dateFilter.DateTo != null)
            {
                if (!validations.CheckRangeSafe(dateFilter))
                {
                    throw new ArgumentException($"Range span is too large, maximum: {AnalyticsValidations.MaxRangeDays}");
                }

                query = query.Where(x => x.Date >= dateFilter.DateFrom && x.Date <= dateFilter.DateTo);
            }
            else
            {
                // Default is current month
                var now = DateTime.UtcNow;
                var startOfMonth = new DateTime(now.Year, now.Month, 1);
                var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

                return query.Where(x => x.Date >= startOfMonth && x.Date <= endOfMonth);
            }

            return query;
        }
    }
}
