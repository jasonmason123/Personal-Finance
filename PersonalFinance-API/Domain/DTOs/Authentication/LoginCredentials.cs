namespace PersonalFinance.Domain.DTOs.Authentication
{
    /// <summary>
    /// Wraps login credentials
    /// </summary>
    public class LoginCredentials
    {
        /// <summary>
        /// Identifier can be username or email
        /// </summary>
        public string Identifier { get; protected set; }
        /// <summary>
        /// Password
        /// </summary>
        public string Password { get; protected set; }

        public LoginCredentials(string identifier, string password)
        {
            Identifier = identifier;
            Password = password;
        }
    }
}
