using PersonalFinance.Domain.DTOs;

namespace PersonalFinance.Application.AppUser
{
    public interface IProfileManager
    {
        /// <summary>
        /// Get data for user profile
        /// </summary>
        /// <param name="userId"></param>
        /// <returns><see cref="UserProfileData"/> contains username, email and date joined</returns>
        public Task<UserProfileData> GetUserProfileDataAsync(string userId);
        /// <summary>
        /// Change password after logged-in
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="currentPassword"></param>
        /// <param name="newPasswords"></param>
        /// <returns></returns>
        public Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPasswords);
    }
}
