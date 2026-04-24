import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { InfoIcon } from "../../icons";
import Tippy from "@tippyjs/react";
import { analyticsApiCaller } from "../../api_caller/AnalyticsApiCaller";
import { useI18n } from "../../context/I18nContext";

export default function MonthlyOverall() {
  const { t, locale } = useI18n();
  const today = new Date();
  const savingPercentage = 10;
  const oneHundredPercent = 100;
  
  // Calculate date boundaries for the current month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  const daysRemain = Math.ceil((endOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);

  const getSetData = async () => {
    setLoading(true);
    try {
      const response = await analyticsApiCaller.getIncomeExpenseSummary({
        dateFrom: startOfMonth.toISOString(),
        dateTo: endOfMonth.toISOString(),
      });

      setIncome(response.income);
      setExpense(response.expense);
    } catch (err) {
      console.error("Failed to fetch income/expense", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSetData();
  }, []);

  // Derived Values
  const incomeExpenseDiff = income - expense;
  const absoluteDiff = Math.abs(incomeExpenseDiff);
  const spentEarnedRatio = income > 0 ? (expense / income) * oneHundredPercent : (expense > 0 ? 110 : 0);
  
  // Logic: How much can I spend/must I save per day?
  const targetSaving = income * (savingPercentage / oneHundredPercent);
  const dailyAmount = (incomeExpenseDiff - targetSaving) / daysRemain;

  // Chart Configuration
  const colorSpending = "#F87171";
  const colorEarning = "#60A5FA";
  const options: ApexOptions = {
    colors: [colorSpending],
    chart: {
      fontFamily: "Nunito, sans-serif",
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "75%" },
        track: {
          background: colorEarning,
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "20px",
            fontWeight: "700",
            offsetY: -30,
            color: spentEarnedRatio > 100 ? colorSpending : "#374151",
            formatter: () => absoluteDiff.toLocaleString(locale, { style: "currency", currency: "VND" }),
          },
        },
      },
    },
    fill: { type: "solid" },
    stroke: { lineCap: "round" },
  };

  // Define the color logic
  const getRatioColorClass = () => {
    if (spentEarnedRatio <= 0) return "text-gray-500"; // No data
    if (spentEarnedRatio <= 70) return "text-green-600 dark:text-green-500"; // Safe (Green)
    if (spentEarnedRatio <= 100) return "text-yellow-600 dark:text-yellow-500"; // Warning (Yellow/Orange)
    return "text-red-600 dark:text-red-500 font-semibold"; // Danger (Red)
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
          {t("dashboard.monthlyOverallTitle", "Monthly overview")} {today.getMonth() + 1}/{today.getFullYear()}
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Side: Radial Chart */}
        <div className="flex flex-col items-center">
          {loading ? (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              {t("dashboard.calculating", "Calculating...")}
            </div>
          ) : (
            <>
              <div className="relative w-full">
                <Chart options={options} series={[Math.min(spentEarnedRatio, 100)]} type="radialBar" height={300} />
                <span className={`absolute left-1/2 top-[60%] -translate-x-1/2 text-xs font-medium 
                  ${incomeExpenseDiff >= 0 ? "text-blue-500" : "text-red-500"}`}
                >
                  {incomeExpenseDiff >= 0
                    ? t("dashboard.remaining", "Remaining")
                    : t("dashboard.overspent", "Over limit")}
                </span>
              </div>
              <p className={`text-center text-sm transition-colors duration-300 ${getRatioColorClass()}`}>
                {spentEarnedRatio <= 0 
                  ? t("dashboard.noData", "No transaction data yet.")
                  : spentEarnedRatio <= 70 
                    ? t("dashboard.safeSpending", "Spending is in a safe range.")
                    : spentEarnedRatio <= 100 
                      ? t("dashboard.nearLimit", "You are spending close to your income.")
                      : t("dashboard.overLimit", "Warning: Spending has exceeded income!")}
              </p>
            </>
          )}
        </div>

        {/* Right Side: Simple Metrics */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-gray-400">
              {t("dashboard.totalIncome", "Total income")}
            </span>
            <h3 className="text-2xl font-bold text-blue-600">
              {income.toLocaleString(locale, { style: "currency", currency: "VND" })}
            </h3>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-gray-400">
              {t("dashboard.totalExpense", "Total expense")}
            </span>
            <h3 className="text-2xl font-bold text-red-500">
              {expense.toLocaleString(locale, { style: "currency", currency: "VND" })}
            </h3>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {t("dashboard.remainingDaysInMonth", "Days left in month {month}:")
                    .replace("{month}", String(today.getMonth() + 1))}
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {daysRemain} {t("dashboard.days", "days")}
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Recommendations */}
      {!loading && (income > 0 || expense > 0) && (
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl flex justify-between items-center">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                {t("dashboard.dailyCanSpend", "Daily budget for remaining days")}
                <Tippy content={t("dashboard.dailyCanSpendHint", "Maximum daily spending to keep your saving target")}>
                   <div className="cursor-help"><InfoIcon className="w-3 h-3 text-gray-400" /></div>
                </Tippy>
              </span>
              <span className={`font-bold ${dailyAmount > 0 ? "text-gray-800 dark:text-white" : "text-red-500"}`}>
                {Math.abs(dailyAmount).toLocaleString(locale, { style: "currency", currency: "VND" })}
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {t("dashboard.savingTarget", "Saving target (at least {percentage}% of monthly income)")
                  .replace("{percentage}", String(savingPercentage))}
              </span>
              <span className="font-bold text-gray-800 dark:text-white">
                {targetSaving.toLocaleString(locale, { style: "currency", currency: "VND" })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}