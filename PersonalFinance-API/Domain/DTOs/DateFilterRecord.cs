namespace PersonalFinance.Domain.DTOs
{
    public record DateFilterRecord
    {
        public DateTime? ExactDate { get; init; }
        public DateTime? DateFrom { get; init; }
        public DateTime? DateTo { get; init; }

        private DateFilterRecord() { }

        public static DateFilterRecord Exact(DateTime date) =>
            new() { ExactDate = date };

        public static DateFilterRecord From(DateTime dateFrom) =>
            new() { DateFrom = dateFrom };

        public static DateFilterRecord To(DateTime dateTo) =>
            new() { DateTo = dateTo };

        public static DateFilterRecord Between(DateTime from, DateTime to) =>
            new() { DateFrom = from, DateTo = to };
    }
}
