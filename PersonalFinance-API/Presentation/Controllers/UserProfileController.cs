using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinance.Application.AppUser;
using PersonalFinance.Domain.Constants;
using PersonalFinance.Domain.DTOs.Authentication;
using System.Security.Claims;

namespace PersonalFinance.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route(ApiRoutes.Profile.Base)]
    public class UserProfileController : ControllerBase
    {
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User not authenticated");

        private readonly IProfileManager profileManager;

        public UserProfileController(IProfileManager profileManager)
        {
            this.profileManager = profileManager;
        }

        [HttpGet(ApiRoutes.Profile.GetProfile)]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                return Ok(await profileManager.GetUserProfileDataAsync(UserId));
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }

        [HttpPost(ApiRoutes.Profile.ChangePassword)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCredentials changePasswordCredentials)
        {
            try
            {
                var result = await profileManager.ChangePasswordAsync(
                    UserId,
                    changePasswordCredentials.CurrentPassword,
                    changePasswordCredentials.NewPassword
                );
                return result ? Ok() : BadRequest();
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return StatusCode(500);
            }
        }
    }
}
