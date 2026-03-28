namespace PersonalFinance.Domain.Constants
{
    public static class ApiRoutes
    {
        public const string Base = "api";

        public static class Authentication
        {
            public const string Base = $"{ApiRoutes.Base}/authentication";
            public const string LoginWithUsername = "login-username";
            public const string LoginWithEmail = "login-email";
        }

        public static class Transaction
        {
            public const string Base = $"{ApiRoutes.Base}/transactions";
            public const string GetPagedList = "get-paged-list";
            public const string GetDetails = $"{{id}}";
            public const string Create = "create";
            public const string Update = $"update/{{id}}";
            public const string Delete = $"delete/{{id}}";
        }

        public static class Category
        {
            public const string Base = $"{ApiRoutes.Base}/categories";
            public const string GetList = "get-list";
            public const string GetDetails = $"{{id}}";
            public const string Create = "create";
            public const string Update = $"update/{{id}}";
            public const string Delete = $"delete/{{id}}";
        }
    }
}
