import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useCallback, useEffect, useState } from "react";
import { analyticsApiCaller } from "../../api_caller/AnalyticsApiCaller";
import { DateFilterIso, TransactionType } from "../../types";
import { useI18n } from "../../context/I18nContext";

type ExpenseBreakdownChartProps = {
  dateFrom: Date;
  dateTo: Date;
  periodLabel: string;
};

export default function ExpenseBreakdownChart({
  dateFrom,
  dateTo,
  periodLabel,
}: ExpenseBreakdownChartProps) {
  const { t, locale } = useI18n();
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    await analyticsApiCaller.getCategoryBreakdown(
      DateFilterIso.between(dateFrom, dateTo),
      TransactionType.EXPENSE
    )
      .then((result) => {
        const labels = Object.keys(result).map(key => 
          key === "Other" ? t("dashboard.otherCategory", "Other") : key
        );
        const series = Object.values(result);

        setLabels(labels);
        setSeries(series);
      })
      .catch((err) => {
        console.error("Failed to fetch expense by category", err);
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dateFrom, dateTo, t]);

  useEffect(() => {
    getData();
  }, [getData]);

  const formatterVND = (value: number) =>
    value.toLocaleString(locale, { style: "currency", currency: "VND" });

  const options: ApexOptions = {
    chart: {
      type: "pie",
      toolbar: {
        show: true
      }
    },
    series: series,
    labels: labels,
    legend: {
      position: "right",
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: formatterVND,
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("dashboard.expenseBreakdownTitle", "Expense breakdown by category")}
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          {periodLabel}
        </p>
      </div>

      {loading ? (
        <div className="h-[330px] flex items-center justify-center">
          {t("common.loading", "Loading...")}
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            <Chart options={options} series={series} type="pie" height={310} />
          </div>
        </div>
      )}
    </div>
  );
}