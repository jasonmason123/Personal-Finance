using PersonalFinance.Domain.DTOs;
using PersonalFinance.Domain.DTOs.Category;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Domain.Enumerations;

namespace PersonalFinance.Application.Category.Queries
{
    public interface ICategoryQueries
    {
        /// <summary>
        /// Get the <see cref="IQueryable"/> of the list of <see cref="M_Category"/>
        /// </summary>
        /// <param name="userId">ID of the <see cref="M_AppUser"/> owning the <see cref="M_Category"/></param>
        /// <param name="search">Search string, search by <see cref="M_Category.Name"/></param>
        /// <param name="type">Search paramenter for <see cref="M_Category.Type"/></param>
        /// <returns></returns>
        public IQueryable<CategoryResult> GetListQueryByUser(string userId, string? search, TransactionType? type);
        /// <summary>
        /// Get the <see cref="IQueryable"/> of the details of a <see cref="M_Category"/> record
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IQueryable<CategoryResult> GetDetailsQueryByUser(Guid id, string userId);
        /// <summary>
        /// Get the <see cref="IQueryable"/> of the list of <see cref="M_Category"/>, in the form of <see cref="ValueLabelDto{TValue}"/>
        /// </summary>
        /// <param name="userId">ID of the <see cref="M_AppUser"/> owning the <see cref="M_Category"/></param>
        /// <param name="search">Search string, search by <see cref="M_Category.Name"/></param>
        /// <param name="type">Search paramenter for <see cref="M_Category.Type"/></param>
        /// <returns></returns>
        public IQueryable<ValueLabelDto<Guid>> GetValueLabelListQuery(string userId, string search, TransactionType type);
    }
}
