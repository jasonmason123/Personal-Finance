using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.Domain.DTOs;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Infrastructure.DbContext;

namespace PersonalFinance.Application.AppUser
{
    public class ProfileManager : IProfileManager
    {
        private readonly UserManager<M_AppUser> userManager;
        private readonly AppDbContext appDbContext;

        public ProfileManager(UserManager<M_AppUser> userManager, AppDbContext appDbContext)
        {
            this.userManager = userManager;
            this.appDbContext = appDbContext;
        }

        public async Task<UserProfileData> GetUserProfileDataAsync(string userId)
        {
            return await appDbContext.M_AppUsers
                .Where(x => x.Id == userId)
                .Select(x => new UserProfileData
                {
                    Username = x.UserName,
                    Email = x.Email,
                    DateJoined = x.CreatedAt,
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await userManager.FindByIdAsync(userId);
            var result = await userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return result.Succeeded;
        }
    }
}
