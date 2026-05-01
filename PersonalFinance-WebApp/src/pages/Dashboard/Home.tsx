import StatisticsChart from "../../components/dashboard/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import MonthlyOverall from "../../components/dashboard/MonthlyOverall";
import ExpenseBreakdownChart from "../../components/dashboard/ExpenseBreakdownChart";
import IncomeBreakdownChart from "../../components/dashboard/IncomeBreakdownChart";
import { useI18n } from "../../context/I18nContext";
import { useEffect, useMemo, useState } from "react";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import { Option } from "../../types";

type PeriodType = "week" | "month" | "quarter" | "custom";

type PeriodOption = {
  key: string;
  label: string;
  dateFrom: Date;
  dateTo: Date;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
const endOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const getWeekStart = (date: Date) => {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return startOfDay(d);
};

const getWeekEnd = (weekStart: Date) => {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6);
  return endOfDay(d);
};

const getMonthStart = (year: number, month: number) => new Date(year, month, 1);
const getMonthEnd = (year: number, month: number) =>
  new Date(year, month + 1, 0, 23, 59, 59, 999);

const getQuarterStart = (year: number, quarterIndex: number) =>
  new Date(year, quarterIndex * 3, 1);
const getQuarterEnd = (year: number, quarterIndex: number) =>
  new Date(year, quarterIndex * 3 + 3, 0, 23, 59, 59, 999);

export default function Home() {
  const { t, locale } = useI18n();
  const today = useMemo(() => new Date(), []);
  const currentMonthStart = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0),
    [today]
  );
  const currentMonthEnd = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999),
    [today]
  );
  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [customRange, setCustomRange] = useState<{ dateFrom: Date; dateTo: Date }>({
    dateFrom: currentMonthStart,
    dateTo: currentMonthEnd,
  });
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale]
  );
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }),
    [locale]
  );

  const periodOptions = useMemo<PeriodOption[]>(() => {
    if (periodType === "custom") {
      return [];
    }

    if (periodType === "week") {
      const currentWeekStart = getWeekStart(today);
      return Array.from({ length: 12 }, (_, index) => {
        const start = new Date(currentWeekStart);
        start.setDate(start.getDate() - index * 7);
        const end = getWeekEnd(start);
        return {
          key: `${start.getFullYear()}-W${start.toISOString()}`,
          label: `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`,
          dateFrom: start,
          dateTo: end,
        };
      });
    }

    if (periodType === "month") {
      return Array.from({ length: 12 }, (_, index) => {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - index, 1);
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        return {
          key: `${year}-${month + 1}`,
          label: monthFormatter.format(monthDate),
          dateFrom: getMonthStart(year, month),
          dateTo: getMonthEnd(year, month),
        };
      });
    }

    const currentQuarter = Math.floor(today.getMonth() / 3);
    return Array.from({ length: 8 }, (_, index) => {
      const quarterOffset = currentQuarter - index;
      const year = today.getFullYear() + Math.floor(quarterOffset / 4);
      const normalizedQuarter = ((quarterOffset % 4) + 4) % 4;
      return {
        key: `${year}-Q${normalizedQuarter + 1}`,
        label: t("dashboard.quarterYear", "Q{quarter}/{year}")
          .replace("{quarter}", String(normalizedQuarter + 1))
          .replace("{year}", String(year)),
        dateFrom: getQuarterStart(year, normalizedQuarter),
        dateTo: getQuarterEnd(year, normalizedQuarter),
      };
    });
  }, [dateFormatter, monthFormatter, periodType, t, today]);

  const [selectedPeriodKey, setSelectedPeriodKey] = useState(periodOptions[0]?.key ?? "");

  const activePeriod = useMemo(() => {
    if (periodType === "custom") {
      const from = customRange.dateFrom <= customRange.dateTo ? customRange.dateFrom : customRange.dateTo;
      const to = customRange.dateFrom <= customRange.dateTo ? customRange.dateTo : customRange.dateFrom;
      return {
        key: "custom",
        label: `${dateFormatter.format(from)} - ${dateFormatter.format(to)}`,
        dateFrom: from,
        dateTo: to,
      };
    }
    return periodOptions.find((option) => option.key === selectedPeriodKey) ?? periodOptions[0];
  }, [customRange.dateFrom, customRange.dateTo, dateFormatter, periodOptions, periodType, selectedPeriodKey]);

  const periodTypeOptions = useMemo<Option[]>(
    () => [
      { value: "week", label: t("dashboard.byWeek", "Week") },
      { value: "month", label: t("dashboard.byMonth", "Month") },
      { value: "quarter", label: t("dashboard.byQuarter", "Quarter") },
      { value: "custom", label: t("dashboard.byCustom", "Custom") },
    ],
    [t]
  );
  const periodSelectionOptions = useMemo<Option[]>(
    () => periodOptions.map((option) => ({ value: option.key, label: option.label })),
    [periodOptions]
  );

  useEffect(() => {
    if (periodType === "custom") {
      return;
    }
    setSelectedPeriodKey(periodOptions[0]?.key ?? "");
  }, [periodType, periodOptions]);

  return (
    <>
      <PageMeta
        title={t("dashboard.title", "Home")}
        description={t("dashboard.description", "Dashboard")}
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Select
                options={periodTypeOptions}
                defaultValue={periodType}
                onChange={(value) => setPeriodType(value as PeriodType)}
                placeholder={t("dashboard.selectPeriodType", "Select period type")}
              />

              {periodType === "custom" ? (
                <DatePicker
                  id="dashboard-custom-period"
                  mode="range"
                  dateFormat="Y-m-d"
                  defaultDate={[customRange.dateFrom, customRange.dateTo]}
                  placeholder={t("dashboard.selectDateRange", "Select date range")}
                  onChange={(selectedDates) => {
                    if (selectedDates.length === 2) {
                      const from = startOfDay(selectedDates[0]);
                      const to = endOfDay(selectedDates[1]);
                      setCustomRange({ dateFrom: from, dateTo: to });
                    }
                  }}
                />
              ) : (
                <Select
                  key={`${periodType}-${selectedPeriodKey}`}
                  options={periodSelectionOptions}
                  defaultValue={activePeriod?.key ?? ""}
                  onChange={(value) => setSelectedPeriodKey(value)}
                  placeholder={t("dashboard.selectPeriod", "Select period")}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-12">
          {activePeriod && (
            <MonthlyOverall
              dateFrom={activePeriod.dateFrom}
              dateTo={activePeriod.dateTo}
              periodLabel={activePeriod.label}
            />
          )}
        </div>

        <div className="col-span-12 md:col-span-6">
          {activePeriod && (
            <ExpenseBreakdownChart
              dateFrom={activePeriod.dateFrom}
              dateTo={activePeriod.dateTo}
              periodLabel={activePeriod.label}
            />
          )}
        </div>

        <div className="col-span-12 md:col-span-6">
          {activePeriod && (
            <IncomeBreakdownChart
              dateFrom={activePeriod.dateFrom}
              dateTo={activePeriod.dateTo}
              periodLabel={activePeriod.label}
            />
          )}
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </div>
    </>
  );
}
