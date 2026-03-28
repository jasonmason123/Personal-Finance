using PersonalFinance.Domain.Entities;

namespace PersonalFinance.Domain.DTOs.Authentication
{
    /// <summary>
    /// Wraps authentication result
    /// </summary>
    public class AuthenticationResult
    {
        /// <summary>
        /// The authenticating user
        /// </summary>
        public M_AppUser? AppUser { get; set; }
        /// <summary>
        /// Successful status
        /// </summary>
        public bool Succeeded { get; set; }
        /// <summary>
        /// Indicates whether the <see cref="AuthenticationResult.AppUser"/> is locked out
        /// </summary>
        public bool IsLockedOut { get; set; }
        /// <summary>
        /// Indicates whether the <see cref="AuthenticationResult.AppUser"/> email is confirmed 
        /// </summary>
        public bool IsEmailConfirmed { get; set; }
    }
}
