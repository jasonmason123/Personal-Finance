using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Category.Commands;
using PersonalFinance.Application.Category.Queries;
using PersonalFinance.Domain.Constants;
using PersonalFinance.Domain.DTOs.Category;
using PersonalFinance.Domain.Enumerations;
using System.Security.Claims;

namespace PersonalFinance.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route(ApiRoutes.Category.Base)]
    public class CategoryController : ControllerBase
    {
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        private readonly ICategoryQueries queries;
        private readonly ICategoryCommands commands;

        public CategoryController(ICategoryQueries queries, ICategoryCommands commands)
        {
            this.queries = queries;
            this.commands = commands;
        }

        [HttpGet(ApiRoutes.Category.GetList)]
        public async Task<IActionResult> GetList(
            [FromQuery] string? search,
            [FromQuery] TransactionType? type
        )
        {
            try
            {
                var query = queries
                    .GetListQueryByUser(UserId, search, type)
                    .Select(x => new CategoryResult
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Type = x.Type,
                    });
                // var result = await PaginationUtils.ToPagedListOffsetAsync(query, pageNumber, pageSize);
                var result = await query.ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }

        [HttpGet(ApiRoutes.Category.GetDetails)]
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
            [FromQuery] string categoryName,
            [FromQuery] TransactionType type
        )
        {
            try
            {
                var result = await commands.CreateByUserAsync(UserId, categoryName, type);
                return Ok(result.Id);
            }
            catch (InvalidOperationException ex)
            {
                Console.Write(ex);
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }

        [HttpPatch(ApiRoutes.Category.Update)]
        public async Task<IActionResult> Update(Guid id, [FromQuery] string newName)
        {
            try
            {
                var result = await commands.UpdateByUserAsync(id, UserId, newName);
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
