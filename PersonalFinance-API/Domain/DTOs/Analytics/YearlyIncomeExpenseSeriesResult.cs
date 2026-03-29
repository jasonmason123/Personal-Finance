namespace PersonalFinance.Domain.DTOs.Analytics
{
    /// <summary>
    /// Represents a chronological trend of income and expenses grouped by month for a specific year.
    /// </summary>
    public class YearlyIncomeExpenseSeriesResult
    {
        /// <summary>
        /// The calendar year these series belong to.
        /// </summary>
        public int Year { get; set; }

        /// <summary>
        /// Monthly income totals. 
        /// Key: Month number (1-12), Value: Total income for that month.
        /// </summary>
        public Dictionary<int, decimal> IncomeSeries { get; set; } = new();

        /// <summary>
        /// Monthly expense totals. 
        /// Key: Month number (1-12), Value: Total expenses for that month.
        /// </summary>
        public Dictionary<int, decimal> ExpenseSeries { get; set; } = new();
    }
}
