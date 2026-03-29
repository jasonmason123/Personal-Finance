using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinance.Application.Analytics.Queries;
using PersonalFinance.Domain.Constants;
using PersonalFinance.Domain.DTOs;
using PersonalFinance.Domain.Enumerations;
using System.Security.Claims;

namespace PersonalFinance.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route(ApiRoutes.Analytics.Base)]
    public class AnalyticsController : ControllerBase
    {
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User not authenticated");

        private readonly IAnalyticsQueries queries;

        public AnalyticsController(IAnalyticsQueries queries)
        {
            this.queries = queries;
        }

        [HttpGet(ApiRoutes.Analytics.GetSummary)]
        public async Task<IActionResult> GetSummary([FromQuery] DateFilterRecord dateFilter)
        {
            try
            {
                var result = await queries.GetIncomeExpenseSummaryAsync(UserId, dateFilter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }

        [HttpGet(ApiRoutes.Analytics.GetBreakdown)]
        public async Task<IActionResult> GetBreakdown(
            [FromQuery] DateFilterRecord dateFilter,
            [FromQuery] TransactionType type)
        {
            try
            {
                var result = await queries.GetCategoryBreakdownAsync(UserId, dateFilter, type);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }

        [HttpGet(ApiRoutes.Analytics.GetTrend)]
        public async Task<IActionResult> GetTrend(int year)
        {
            try
            {
                var result = await queries.GetAnnualTrendAsync(UserId, year);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }
    }
}