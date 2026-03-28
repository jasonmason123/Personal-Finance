using Microsoft.AspNetCore.Identity;
using PersonalFinance.Domain.DTOs.Authentication;
using PersonalFinance.Domain.Entities;

namespace PersonalFinance.Application.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<M_AppUser> userManager;

        public AuthenticationService(UserManager<M_AppUser> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<AuthenticationResult> AuthenticateByEmailAsync(string email, string password)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return new AuthenticationResult
                {
                    AppUser = null,
                    IsLockedOut = false,
                    Succeeded = false,
                    IsEmailConfirmed = false,
                };
            }

            var result = new AuthenticationResult
            {
                AppUser = user,
                IsEmailConfirmed = await userManager.IsEmailConfirmedAsync(user),
                IsLockedOut = await userManager.IsLockedOutAsync(user),
                Succeeded = await userManager.CheckPasswordAsync(user, password),
            };

            //Check lockout and email confirmation status
            if (!result.IsEmailConfirmed || result.IsLockedOut)
            {
                return result;
            }

            if (result.Succeeded)
            {
                // ✅ Reset failed count on success
                await userManager.ResetAccessFailedCountAsync(user);
            }
            else
            {
                // ❌ Increment failed count
                await userManager.AccessFailedAsync(user);

                if (await userManager.IsLockedOutAsync(user))
                {
                    result.IsLockedOut = true;
                }
            }

            return result;
        }

        public async Task<AuthenticationResult> AuthenticateByUsernameAsync(string username, string password)
        {
            var user = await userManager.FindByNameAsync(username);

            if (user == null)
            {
                return new AuthenticationResult
                {
                    AppUser = null,
                    IsLockedOut = false,
                    Succeeded = false,
                    IsEmailConfirmed = false,
                };
            }

            var result = new AuthenticationResult
            {
                AppUser = user,
                IsEmailConfirmed = await userManager.IsEmailConfirmedAsync(user),
                IsLockedOut = await userManager.IsLockedOutAsync(user),
                Succeeded = await userManager.CheckPasswordAsync(user, password),
            };

            //Check lockout and email confirmation status
            if (!result.IsEmailConfirmed || result.IsLockedOut)
            {
                return result;
            }

            if (result.Succeeded)
            {
                // ✅ Reset failed count on success
                await userManager.ResetAccessFailedCountAsync(user);
            }
            else
            {
                // ❌ Increment failed count
                await userManager.AccessFailedAsync(user);

                if (await userManager.IsLockedOutAsync(user))
                {
                    result.IsLockedOut = true;
                }
            }

            return result;
        }
    }
}
