using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinance.Application.Authentication;
using PersonalFinance.Domain.Constants;
using PersonalFinance.Domain.DTOs.Authentication;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Infrastructure.Tokens;
using System.Text;
using System.Text.Json;

namespace PersonalFinance.Presentation.Controllers
{
    [ApiController]
    [Route(ApiRoutes.Authentication.Base)]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService authenticationService;
        private readonly IAuthTokenProvider authTokenProvider;
        private readonly IConfiguration configuration;

        public AuthenticationController(IAuthenticationService authenticationService, IConfiguration configuration, IAuthTokenProvider authTokenProvider)
        {
            this.authenticationService = authenticationService;
            this.authTokenProvider = authTokenProvider;
            this.configuration = configuration;
        }

        [HttpPost(ApiRoutes.Authentication.Web.LoginWithUsername)]
        public async Task<IActionResult> LoginWithUsername([FromBody] LoginCredentials loginCredentials, bool? remember)
        {
            try
            {
                var authResult = await authenticationService.AuthenticateByUsernameAsync(loginCredentials.Identifier, loginCredentials.Password);

                if (authResult.Succeeded && authResult.AppUser != null)
                {
                    Console.WriteLine($"Login success: {loginCredentials.Identifier}");
                    var jwtToken = authTokenProvider.GenerateToken(authResult.AppUser);
                    SetAuthCookies(authResult.AppUser, jwtToken, remember ?? false);
                    return Ok();
                }

                if (authResult.Succeeded)
                    return Ok(); // will return JWT token here later

                if (authResult.IsLockedOut)
                {
                    Console.WriteLine($"Succeeded: {authResult.Succeeded}");
                    Console.WriteLine($"IsLockedOut: {authResult.IsLockedOut}");
                    Console.WriteLine($"IsEmailConfirmed: {authResult.IsEmailConfirmed}");
                    return StatusCode(423, "Account is locked out, try again later"); // 423 Locked
                }
                    

                if (!authResult.IsEmailConfirmed)
                {
                    Console.WriteLine($"Succeeded: {authResult.Succeeded}");
                    Console.WriteLine($"IsLockedOut: {authResult.IsLockedOut}");
                    Console.WriteLine($"IsEmailConfirmed: {authResult.IsEmailConfirmed}");
                    return StatusCode(403, "Email is not confirmed");
                }
                
                if (authResult.AppUser == null)
                {
                    Console.WriteLine($"Succeeded: {authResult.Succeeded}");
                    Console.WriteLine($"IsLockedOut: {authResult.IsLockedOut}");
                    Console.WriteLine($"IsEmailConfirmed: {authResult.IsEmailConfirmed}");
                    return Unauthorized("Invalid credentials");
                }
                
                Console.WriteLine($"Succeeded: {authResult.Succeeded}");
                Console.WriteLine($"IsLockedOut: {authResult.IsLockedOut}");
                Console.WriteLine($"IsEmailConfirmed: {authResult.IsEmailConfirmed}");
                return Unauthorized("Invalid credentials"); // wrong password
            }
            catch (Exception ex)
            {
                Console.Write($"Error during login for user {loginCredentials.Identifier}: {ex}");
                return StatusCode(500);
            }
        }

        [HttpPost(ApiRoutes.Authentication.Web.LoginWithEmail)]
        public async Task<IActionResult> LoginWithEmail([FromBody] LoginCredentials loginCredentials, bool? remember)
        {
            try
            {
                var authResult = await authenticationService.AuthenticateByEmailAsync(loginCredentials.Identifier, loginCredentials.Password);

                if (authResult.Succeeded && authResult.AppUser != null)
                {
                    Console.WriteLine($"Login success: {loginCredentials.Identifier}");
                    var jwtToken = authTokenProvider.GenerateToken(authResult.AppUser);
                    SetAuthCookies(authResult.AppUser, jwtToken, remember ?? false);
                    return Ok();
                }

                if (authResult.IsLockedOut)
                {
                    Console.WriteLine($"Succeeded: {authResult.Succeeded}");
                    Console.WriteLine($"IsLockedOut: {authResult.IsLockedOut}");
                    Console.WriteLine($"IsEmailConfirmed: {authResult.IsEmailConfirmed}");
                    return StatusCode(423, "Account is locked out, try again later"); // 423 Locked
                }


                if (!authResult.IsEmailConfirmed)
                {
                    Console.WriteLine($"Succeeded: {authResult.Succeeded}");
                    Console.WriteLine($"IsLockedOut: {authResult.IsLockedOut}");
                    Console.WriteLine($"IsEmailConfirmed: {authResult.IsEmailConfirmed}");
                    return StatusCode(403, "Email is not confirmed");
                }

                if (authResult.AppUser == null)
                {
                    Console.WriteLine($"Succeeded: {authResult.Succeeded}");
                    Console.WriteLine($"IsLockedOut: {authResult.IsLockedOut}");
                    Console.WriteLine($"IsEmailConfirmed: {authResult.IsEmailConfirmed}");
                    return Unauthorized("Invalid credentials");
                }

                Console.WriteLine($"Succeeded: {authResult.Succeeded}");
                Console.WriteLine($"IsLockedOut: {authResult.IsLockedOut}");
                Console.WriteLine($"IsEmailConfirmed: {authResult.IsEmailConfirmed}");
                return Unauthorized("Invalid credentials"); // wrong password
            }
            catch (Exception ex)
            {
                Console.Write($"Error during login for user email {loginCredentials.Identifier}: {ex}");
                return StatusCode(500);
            }
        }

        // Only web app can sign out with this endpoint
        [Authorize(AuthenticationSchemes = AuthenticationConstants.WebAuthScheme)]
        [HttpPost(ApiRoutes.Authentication.Web.Logout)]
        public IActionResult SignOutFromWeb()
        {
            try
            {
                RemoveAuthCookies();
                Console.WriteLine("Signed out successfully");
                return Ok(new { message = "Signed out successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Sign-out error: {ex}");
                return StatusCode(500);
            }
        }

        // Helper methods to set auth cookies
        private void SetAuthCookies(M_AppUser user, string jwtToken, bool remember = false)
        {
            var expirationInMinutesString = configuration["Technical:JwtSettings:ExpirationInMinutes"] ?? "";
            var expirationInMinutes = int.Parse(expirationInMinutesString);
            var expirationDateUtc = DateTimeOffset.UtcNow.AddMinutes(expirationInMinutes);

            Response.Cookies.Append(AuthenticationConstants.JwtCookieKey, jwtToken, new CookieOptions
            {
                Secure = true,
                SameSite = SameSiteMode.Strict,
                HttpOnly = true,
                Expires = remember ? expirationDateUtc : null
            });

            // Add base64 userInfo cookie
            var userObj = new
            {
                username = user.UserName,
                email = user.Email,
                dateJoined = user.CreatedAt,
            };
            var json = JsonSerializer.Serialize(userObj);
            var base64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
            Response.Cookies.Append(AuthenticationConstants.UserInfoCookieKey, base64, new CookieOptions
            {
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = remember ? expirationDateUtc : null
            });

            // Add IsLoggedIn cookie
            Response.Cookies.Append(AuthenticationConstants.IsLoggedInCookieKey, "true", new CookieOptions
            {
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = remember ? expirationDateUtc : null
            });
        }

        private void RemoveAuthCookies()
        {
            Response.Cookies.Delete(AuthenticationConstants.JwtCookieKey);
            Response.Cookies.Delete(AuthenticationConstants.IsLoggedInCookieKey);
            Response.Cookies.Delete(AuthenticationConstants.UserInfoCookieKey);
        }
    }
}
