using System.Text.Json.Serialization;

namespace PersonalFinance.Domain.Enumerations
{
    /// <summary>
    /// Transaction types, with 2 types: <see cref="TransactionType.Income"/> and <see cref="TransactionType.Expense"/>
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter<TransactionType>))]
    public enum TransactionType
    {
        /// <summary>
        /// Income Transaction, adding amount to user account
        /// </summary>
        Income,
        /// <summary>
        /// Expense Transaction, subtracting amount from user account
        /// </summary>
        Expense
    }
}
