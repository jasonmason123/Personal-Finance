namespace PersonalFinance.Domain.DTOs.Analytics
{
    /// <summary>
    /// Wraps total income and expense in a time period to return to client
    /// </summary>
    public class IncomeExpenseResult
    {
        /// <summary>
        /// Total income
        /// </summary>
        public decimal Income { get; set; }
        /// <summary>
        /// Total expense
        /// </summary>
        public decimal Expense { get; set; }
    }
}
