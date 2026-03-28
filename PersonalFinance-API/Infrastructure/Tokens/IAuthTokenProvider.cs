using PersonalFinance.Domain.Entities;

namespace PersonalFinance.Infrastructure.Tokens
{
    public interface IAuthTokenProvider
    {
        public string GenerateToken(M_AppUser user);
    }
}
