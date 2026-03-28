using Microsoft.IdentityModel.Tokens;
using PersonalFinance.Domain.Constants;
using PersonalFinance.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PersonalFinance.Infrastructure.Tokens
{
    public class JwtProvider : IAuthTokenProvider
    {

        private readonly IConfiguration _configuration;

        private string JwtSecretKey => Environment.GetEnvironmentVariable(AuthenticationConstants.JwtSecretEnv) ?? "";
        private string JwtIssuer => _configuration["Technical:JwtSettings:Issuer"] ?? "";
        private string JwtAudience => _configuration["Technical:JwtSettings:Audience"] ?? "";
        private string JwtExpirationInMinutesString => _configuration["Technical:JwtSettings:ExpirationInMinutes"] ?? "";

        public JwtProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(M_AppUser user)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSecretKey));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var expirationInMinutes = int.Parse(JwtExpirationInMinutesString);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var tokenOptions = new JwtSecurityToken(
                issuer: JwtIssuer,
                audience: JwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(expirationInMinutes)),
                signingCredentials: signinCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return tokenString;
        }
    }
}
