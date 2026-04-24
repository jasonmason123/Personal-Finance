import { Transaction, TransactionType } from "../../types";
import Badge from "../ui/badge/Badge";
import { useI18n } from "../../context/I18nContext";

interface TransactionInfoCardProps {
    transaction: Transaction;
}

export default function TransactionInfoCard({ transaction }: TransactionInfoCardProps) {  
  const { t, locale } = useI18n();
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            {t("transactions.details.generalInfoTitle", "General information")}
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {transaction.type === TransactionType.INCOME
                    && (transaction.amount && transaction.amount > 0)
                    ? t("transactions.details.incomeAmountLabel", "Amount received")
                    : t("transactions.details.expenseAmountLabel", "Amount spent")}
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-white/90 text-bold">
                {transaction.type == TransactionType.INCOME ? (
                  <span className="text-green-500">
                    +{transaction.amount && transaction.amount.toLocaleString(locale, {
                      style: "currency",
                      currency: "VND"
                    })}
                  </span>
                ) : transaction.type == TransactionType.EXPENSE ? (
                  <span className="text-red-500">
                    -{transaction.amount && transaction.amount.toLocaleString(locale, {
                      style: "currency",
                      currency: "VND"
                    })}
                  </span>
                ) : (
                  <span className="text-gray-500">
                    {transaction.amount && transaction.amount.toLocaleString(locale, {
                      style: "currency",
                      currency: "VND"
                    })}
                  </span>
                )}
              </p>
            </div>
            
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("transactions.details.typeLabel", "Transaction type")}
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-white/90">
                <Badge
                  size="sm"
                  className={
                    transaction.type === TransactionType.INCOME ? "border-green-500"
                    : transaction.type === TransactionType.EXPENSE ? "border-red-500"
                    : ""
                  }
                >
                  {transaction.type === TransactionType.INCOME ? t("transactions.incomeType", "Income") :
                   transaction.type === TransactionType.EXPENSE ? t("transactions.expenseType", "Expense") : null
                  }
                </Badge>
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("transactions.details.merchantLabel", "Counterparty")}
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-white/90">
                {transaction?.merchant}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("transactions.details.categoryLabel", "Category")}
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-white/90">
                {transaction?.categoryName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
