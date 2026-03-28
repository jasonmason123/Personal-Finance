using PersonalFinance.Domain.DTOs.Authentication;

namespace PersonalFinance.Application.Authentication
{
    public interface IAuthenticationService
    {
        public Task<AuthenticationResult> AuthenticateByEmailAsync(string email, string password);
        public Task<AuthenticationResult> AuthenticateByUsernameAsync(string username, string password);
    }
}
