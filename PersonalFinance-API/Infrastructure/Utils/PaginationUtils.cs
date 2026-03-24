using Microsoft.EntityFrameworkCore;
using PersonalFinance.Domain.DTOs;

namespace PersonalFinance.Infrastructure.Utils
{
    public static class PaginationUtils
    {
        public static int DefaultPageNumber = 1;
        public static int DefaultPageSize = 10;

        /// <summary>
        /// Turn a query <see cref="IQueryable"/> into a paged list <see cref="PagedListResult{TItem}"/> using the offset method
        /// </summary>
        /// <typeparam name="TItem"></typeparam>
        /// <param name="query"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public static async Task<PagedListResult<TItem>> ToPagedListOffsetAsync<TItem>(
            IQueryable<TItem> query,
            int pageNumber,
            int pageSize
        )
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var itemCount = await query.CountAsync();
            var pageCount = (int)Math.Ceiling((double)itemCount / pageSize);
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedListResult<TItem>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                ItemCount = itemCount,
                PageCount = pageCount,
                Items = items
            };
        }
    }
}
