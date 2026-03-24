using PersonalFinance.Domain.DTOs;
using PersonalFinance.Domain.DTOs.Category;
using PersonalFinance.Domain.Enumerations;
using PersonalFinance.Infrastructure.DbContext;

namespace PersonalFinance.Application.Category.Queries
{
    public class CategoryQueries : ICategoryQueries
    {
        private readonly AppDbContext appDbContext;

        public CategoryQueries(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IQueryable<CategoryResult> GetListQueryByUser(string userId, string? search, TransactionType? type)
        {
            var query = appDbContext.M_Categories.Where(x => x.UserId == userId);
                
            if (type != null)
            {
                query = query.Where(x => x.Type == type);
            }

            if (!string.IsNullOrEmpty(search))
            {
                // Use .StartsWith() to preserve indexes -> faster query, for .Contains(), consider using GIN index of Postgresql
                query = query.Where(x => x.Name.StartsWith(search));
            }

            return query
                .Select(x => new CategoryResult
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    CreatedAt = x.CreatedAt,
                    LastUpdatedAt = x.LastUpdatedAt
                });
        }

        public IQueryable<CategoryResult> GetDetailsQueryByUser(Guid id, string userId)
        {
            return appDbContext.M_Categories
                .Where(x => x.Id == id && x.UserId == userId)
                .Select(x => new CategoryResult
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    CreatedAt = x.CreatedAt,
                    LastUpdatedAt = x.LastUpdatedAt
                });
        }

        public IQueryable<ValueLabelDto<Guid>> GetValueLabelListQuery(string userId, string search, TransactionType type)
        {
            var query = appDbContext.M_Categories
                .Where(x => x.UserId == userId && x.Type == type);

            if (!string.IsNullOrEmpty(search))
            {
                // Use .StartsWith() to preserve indexes -> faster query, for .Contains(), consider using GIN index of Postgresql
                query = query.Where(x => x.Name.StartsWith(search));
            }

            return query.Select(x => new ValueLabelDto<Guid>(x.Id, x.Name));
        }
    }
}
