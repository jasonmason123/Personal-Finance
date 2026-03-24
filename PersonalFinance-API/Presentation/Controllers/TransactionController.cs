using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Transaction.Commands;
using PersonalFinance.Application.Transaction.Queries;
using PersonalFinance.Domain.Constants;
using PersonalFinance.Domain.DTOs.Transaction;
using PersonalFinance.Infrastructure.Utils;
using System.Security.Claims;

namespace PersonalFinance.Presentation.Controllers
{
    [ApiController]
    [Route(ApiRoutes.Transaction.Base)]
    public class TransactionController : ControllerBase
    {
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User not authenticated");

        private readonly ITransactionQueries queries;
        private readonly ITransactionCommands commands;

        public TransactionController(ITransactionQueries queries, ITransactionCommands commands)
        {
            this.queries = queries;
            this.commands = commands;
        }

        [HttpGet(ApiRoutes.Transaction.GetPagedList)]
        public async Task<IActionResult> GetPagedList(
            [FromQuery] TransactionQueryParams queryParams,
            [FromQuery] int? pageNumber,
            [FromQuery] int? pageSize
        )
        {
            try
            {
                var query = queries
                    .GetListQueryByUser(UserId, queryParams)
                    .Select(x => new TransactionResult
                    {
                        Id = x.Id,
                        Title = x.Title,
                        Amount = x.Amount,
                        Type = x.Type,
                        CategoryId = x.CategoryId,
                        CategoryName = x.CategoryName,
                    });

                var result = await PaginationUtils.ToPagedListOffsetAsync(
                    query,
                    pageNumber ?? PaginationUtils.DefaultPageNumber,
                    pageSize ?? PaginationUtils.DefaultPageSize);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }

        [HttpGet(ApiRoutes.Transaction.GetDetails)]
        public async Task<IActionResult> GetDetails(Guid id)
        {
            try
            {
                var result = await queries.GetDetailsQueryByUser(id, UserId).FirstOrDefaultAsync();

                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }

        [HttpPost(ApiRoutes.Category.Create)]
        public async Task<IActionResult> Create(
            [FromBody] CreateUpdateTransactionInfo transactionInfo
        )
        {
            try
            {
                var result = await commands.CreateByUserAsync(UserId, transactionInfo);
                return Ok(result.Id);
            }
            catch (ArgumentNullException ex)
            {
                Console.Write(ex);
                return StatusCode(400, ex.Message);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }

        [HttpPatch(ApiRoutes.Category.Update)]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateUpdateTransactionInfo newInfo)
        {
            try
            {
                var result = await commands.UpdateByUserAsync(id, UserId, newInfo);
                return Ok(result.Id);
            }
            catch (ArgumentException ex)
            {
                Console.Write(ex);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }

        [HttpDelete(ApiRoutes.Category.Delete)]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await commands.DeleteByUserAsync(id, UserId);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                Console.Write(ex);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }
    }
}
