namespace PersonalFinance.Domain.Constants
{
    public static class ApiRoutes
    {
        public const string Base = "api";

        public static class Transaction
        {
            public const string Base = $"{ApiRoutes.Base}/transactions";
            public const string GetPagedList = "paged";
            public const string GetDetails = $"{{id}}";
            public const string Create = "create";
            public const string Update = $"update/{{id}}";
            public const string Delete = $"delete/{{id}}";
        }

        public static class Category
        {
            public const string Base = $"{ApiRoutes.Base}/categories";
            public const string GetList = "";
            public const string GetDetails = $"{{id}}";
            public const string Create = "create";
            public const string Update = $"update/{{id}}";
            public const string Delete = $"delete/{{id}}";
        }
    }
}
