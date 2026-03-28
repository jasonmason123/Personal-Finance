namespace PersonalFinance.Domain.Constants
{
    public class AuthenticationConstants
    {
        public const string MobileAuthScheme = "Mobile";
        public const string WebAuthScheme = "Web";

        public const string JwtSecretEnv = "JWT_SECRET";
        public const string JwtCookieKey = "user_session";

        public const string UserInfoCookieKey = "user_info";
        public const string IsLoggedInCookieKey = "is_logged_in";

        public const string GoogleClientId = "GOOGLE_CLIENT_ID";
        public const string GoogleClientSecret = "GOOGLE_CLIENT_SECRET";

        public const string CommonCorsPolicy = "CommonPolicy";
    }
}
