using PersonalFinance.Domain.DTOs;
using PersonalFinance.Domain.DTOs.Analytics;
using PersonalFinance.Domain.Enumerations;

namespace PersonalFinance.Application.Analytics.Queries
{
    /// <summary>
    /// Queries for analytical feature
    /// </summary>
    public interface IAnalyticsQueries
    {
        /// <summary>
        /// Provides a high-level summary of total income and expenses for a specific date range.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="dateFilter">The date constraints (Exact, Range, or Open-ended) to apply.</param>
        /// <returns>An <see cref="IncomeExpenseResult"/> containing the aggregated totals.</returns>
        Task<IncomeExpenseResult> GetIncomeExpenseSummaryAsync(string userId, DateFilterRecord dateFilter);

        /// <summary>
        /// Breaks down total spending or income by category name for a specific date range.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="dateFilter">The date constraints to apply.</param>
        /// <param name="type">The type of transactions to include (Income or Expense).</param>
        /// <returns>A dictionary where the key is the Category Name and the value is the total amount.</returns>
        Task<Dictionary<string, decimal>> GetCategoryBreakdownAsync(string userId, DateFilterRecord dateFilter, TransactionType type);

        /// <summary>
        /// Retrieves a monthly chronological series of income and expense totals for a specific year.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="year">The calendar year to analyze.</param>
        /// <returns>A <see cref="YearlyIncomeExpenseSeriesResult"/> representing the month-over-month trend.</returns>
        Task<YearlyIncomeExpenseSeriesResult> GetAnnualTrendAsync(string userId, int year);
    }
}
