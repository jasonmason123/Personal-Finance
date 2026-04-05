namespace PersonalFinance.Domain.DTOs.Authentication
{
    public class ChangePasswordCredentials
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
