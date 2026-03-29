using PersonalFinance.Domain.DTOs;

namespace PersonalFinance.Application.Analytics.Validations
{
    public class AnalyticsValidations
    {
        public const int MaxRangeDays = 366; // 1 year limit

        /// <summary>
        /// Validates that the requested date range is within performance safety limits.
        /// </summary>
        /// <param name="dateFilter">The filter containing ExactDate or From/To range.</param>
        /// <returns>True if the range is safe to query; otherwise, false.</returns>
        public bool CheckRangeSafe(DateFilterRecord dateFilter)
        {
            // 1. Point lookups (ExactDate) are always safe
            if (dateFilter.ExactDate.HasValue)
            {
                return true;
            }

            // 2. If both are null, it's an "All Time" query which we've decided is unsafe
            if (dateFilter.DateFrom == null || dateFilter.DateTo == null)
            {
                return false;
            }

            // 3. Check the span between dates
            var rangeSpan = dateFilter.DateTo.Value - dateFilter.DateFrom.Value;

            // Ensure the range is positive and doesn't exceed 1 year
            return rangeSpan.TotalDays >= 0 && rangeSpan.TotalDays <= MaxRangeDays;
        }
    }
}
