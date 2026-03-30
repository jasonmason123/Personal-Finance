import { YearlyTrendResult, DateFilterIso, IncomeExpenseResult, TransactionType } from "../types";

const GET_SUMMARY_URL = `/api/analytics/summary`;
const GET_CATEGORY_BREAKDOWN_URL = `/api/analytics/breakdown`;
const GET_YEARLY_TREND_URL = `/api/analytics/trend`;

/**
 * Gets a high-level summary of total income and expenses for a specific date range.
 * @param dateFilter - Object containing ExactDate or DateFrom/DateTo range.
 * @returns Total income and expense for the filtered period.
 */
export function getIncomeExpenseSummary(
  dateFilter: DateFilterIso
): Promise<IncomeExpenseResult> {
  
  const params = new URLSearchParams();
  
  if (dateFilter.exactDate) {
    params.append("exactDate", dateFilter.exactDate);
  } else if (dateFilter.dateFrom && dateFilter.dateTo) {
    params.append("dateFrom", dateFilter.dateFrom);
    params.append("dateTo", dateFilter.dateTo);
  }

  const url = `${GET_SUMMARY_URL}?${params.toString()}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      // If the backend 400s (e.g., range too large), this will catch it
      throw new Error(`Analytics API Error: ${response.statusText}`);
    }
    return response.json();
  });
}

/**
 * Gets the total expense by category in the selected date range
 * @param isoDateFrom - date from in ISO format
 * @param isoDateTo - date to in ISO format
 * @returns A Record containing the category name and it's corresponding total expense
 */
export function getCategoryBreakdown(dateFilter: DateFilterIso, type: TransactionType)
  : Promise<Record<string, number>>
{
  const params = new URLSearchParams();
  
  if (dateFilter.exactDate) {
    params.append("exactDate", dateFilter.exactDate);
  } else if (dateFilter.dateFrom && dateFilter.dateTo) {
    params.append("dateFrom", dateFilter.dateFrom);
    params.append("dateTo", dateFilter.dateTo);
  }

  params.append("type", type);

  let url = `${GET_CATEGORY_BREAKDOWN_URL}?${params.toString()}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
  .then((response) => {
    if(!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return response.json();
  });
}

/**
 * Gets the total income and expense of each month across the selected year
 * @param year - the selected year
 * @returns Monthly income and expense throughout the selected year
 */
export function getYearlyTrend(year: number)
  : Promise<YearlyTrendResult>
{
  let url = `${GET_YEARLY_TREND_URL}/${year}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
  .then((response) => {
    if(!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return response.json();
  });
}

export interface AnalyticsApiCaller {
  getIncomeExpenseSummary: (dateFilter: DateFilterIso) => Promise<IncomeExpenseResult>
  getCategoryBreakdown: (dateFilter: DateFilterIso, type: TransactionType) => Promise<Record<string, number>>
  getYearlyTrend: (year: number) => Promise<YearlyTrendResult>
};

export const analyticsApiCaller: AnalyticsApiCaller = {
  getIncomeExpenseSummary,
  getCategoryBreakdown,
  getYearlyTrend,
};