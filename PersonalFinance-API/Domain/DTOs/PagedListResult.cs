namespace PersonalFinance.Domain.DTOs
{
    public class PagedListResult<TItem>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int PageCount { get; set; }
        public int ItemCount { get; set; }
        public List<TItem> Items { get; set; }
    }
}
