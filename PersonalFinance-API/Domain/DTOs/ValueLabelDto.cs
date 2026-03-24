namespace PersonalFinance.Domain.DTOs
{
    /// <summary>
    /// Value-label wrapper for dropdown lists
    /// </summary>
    /// <typeparam name="TValue">Datatype of <see cref="ValueLabelDto{TValue}.Value"/></typeparam>
    public class ValueLabelDto<TValue>
    {
        /// <summary>
        /// Value
        /// </summary>
        public TValue Value { get; }
        /// <summary>
        /// Label
        /// </summary>
        public string Label { get; }

        public ValueLabelDto(TValue value, string label)
        {
            Value = value;
            Label = label;
        }
    }
}
