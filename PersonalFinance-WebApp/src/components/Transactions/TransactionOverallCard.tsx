import { Transaction, TransactionType } from "../../types";
import { useI18n } from "../../context/I18nContext";

interface TransactionOverallCardProps {
    transaction: Transaction;
}

export default function TransactionOverallCard({ transaction }: TransactionOverallCardProps) {
  const { locale } = useI18n();
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border
              ${transaction.type === TransactionType.INCOME ? "border-green-500"
              : transaction.type === TransactionType.EXPENSE ? "border-red-500" : ""}`}
          >
            {transaction.type === TransactionType.INCOME ? (
              <i className="fa-solid fa-circle-dollar-to-slot text-green-500"></i>
            ) : transaction.type === TransactionType.EXPENSE ? (
              <i className="fa-solid fa-wallet text-red-500"></i>
            ) : null}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            <div className="text-lg font-bold">
                {transaction.title}
            </div>
            <div className="text-sm text-gray-400">
              <b>{(transaction.date && transaction.date.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
              }))}</b>
            </div>
          </span>
        </div>
        <div>
          <span className={`text-lg font-bold
              ${transaction.type == TransactionType.EXPENSE ? "text-red-500" :
                transaction.type == TransactionType.INCOME ? "text-green-500" :
                "text-gray-500"}`}
          >
            {transaction.type == TransactionType.INCOME ? '+' : '-'}
            {transaction.amount && transaction.amount.toLocaleString(locale, {
              style: "currency",
              currency: "VND"
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
