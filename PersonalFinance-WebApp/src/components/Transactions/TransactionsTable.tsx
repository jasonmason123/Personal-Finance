import {
Table,
TableBody,
TableCell,
TableFooter,
TableRow,
} from "../ui/table";
  
import {  DateFilterIso, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, Transaction, TransactionFilterParams, TransactionType } from "../../types";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router";
import Pagination from "../tables/Pagination";
import DatePicker from "../form/date-picker"; // Add this import if not present
import flatpickr from "flatpickr"; // Add this import if not present
import { fetchTransactionPagedList } from "../../api_caller/TransactionApiCaller";
import { UUID } from "crypto";
import { useI18n } from "../../context/I18nContext";

function parseLocalDateKeyForDisplay(key: string, locale: string): string {
  const [y, m, day] = key.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return d.toLocaleDateString(locale);
}

interface TransactionTableProps {
  isSearchAndFilterIncluded?: boolean;
  isPaginationIncluded?: boolean;
  isLineCountDisplayed?: boolean;
  defaultTransactions?: Transaction[];
  fetchTransactions?: boolean;
}

export default function TransactionsTable({
  isSearchAndFilterIncluded = false,
  isPaginationIncluded = false,
  isLineCountDisplayed = false,
  defaultTransactions,
  fetchTransactions = true,
} : TransactionTableProps) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [searchStr, setSearchStr] = useState<string>("");
  const [itemCount, setItemCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions ?? []);
  const [groupedTransactions, setGroupedTransactions] = useState<Record<string, Transaction[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [filterParam, setFilterParam] = useState<TransactionFilterParams>({
    pageNumber: 1,
    pageSize: 10,
  });
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const datePickerRef = React.useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if(fetchTransactions) {
      setLoading(true);
      fetchTransactionPagedList(filterParam)
        .then((data) => {
          setTransactions(data.items ?? []);
          setItemCount(data.itemCount);
          setPageCount(data.pageCount);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [filterParam]);

  // Group transactions by date whenever transactions change
  useEffect(() => {
    const grpTrns = transactions?.reduce((acc, transaction) => {
      if (!transaction.date) return acc;

      const d = new Date(transaction.date);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      const dateKey = `${year}-${month}-${day}`;

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    setGroupedTransactions(grpTrns);
  }, [transactions]);

  // Set transactions to default transactions on reloads
  useEffect(() => {
    if (!fetchTransactions && defaultTransactions) {
      setTransactions(defaultTransactions);
    }
  }, [defaultTransactions, fetchTransactions]);

  //If search, other filter params will not be applied
  const onSearch = (searchStr: string) => {
    handleClearFilters();
    setFilterParam({
      pageNumber: DEFAULT_PAGE_NUMBER,
      pageSize: DEFAULT_PAGE_SIZE,
      search: searchStr,
    });
  }

  const onPageChange = (page: number) => {
    setFilterParam({
      ...filterParam,
      pageNumber: page,
    });
  }

  const onPageSizeChange = (pageSize: number) => {
    setFilterParam({
      ...filterParam,
      pageSize: pageSize,
      pageNumber: DEFAULT_PAGE_NUMBER, // Reset to first page when page size changes
    });
  }

  const onSelect = (transactionId: UUID) => {
    navigate(`/transactions/${transactionId}`);
  }

  const handleClearFilters = () => {
    handleClearDateRange();
    setFilterParam({
      pageNumber: 1,
      pageSize: 10,
    });
  }

  // Handler for date range change
  const handleDateRangeChange = (selectedDates: Date[]) => {
    console.log("Selected Dates:", selectedDates);
    if (selectedDates.length === 2) {
      setDateRange([selectedDates[0], selectedDates[1]]);
      setFilterParam({
        ...filterParam,
        dateFilter: DateFilterIso.between(selectedDates[0], selectedDates[1]),
        pageNumber: DEFAULT_PAGE_NUMBER,
      });
    } else {
      setDateRange([undefined, undefined]);
      setFilterParam({
        ...filterParam,
        dateFilter: undefined,
        pageNumber: DEFAULT_PAGE_NUMBER,
      });
    }
  };

  // Handler to clear the date range
  const handleClearDateRange = () => {
    datePickerRef.current?.clear();
    setDateRange([undefined, undefined]);
    setFilterParam({
      ...filterParam,
      dateFilter: undefined,
      pageNumber: DEFAULT_PAGE_NUMBER,
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        {isSearchAndFilterIncluded && (
          <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-white/[0.05] flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-auto flex items-center gap-4 justify-center sm:justify-end">
              <div className="relative flex items-center gap-2">
                {/* Date Range Picker */}
                <DatePicker
                  id="dateRange"
                  mode="range"
                  className="w-64"
                  confirmOnly={true}
                  onChange={handleDateRangeChange}
                  placeholder={t("transactions.searchDateRange", "Search within date range")}
                  instanceRef={(fp) => (datePickerRef.current = fp)}
                />
                {(dateRange[0] || dateRange[1]) && (
                  <span
                    className="text-xs text-blue-500 underline cursor-pointer"
                    onClick={handleClearDateRange}
                  >
                    {t("transactions.clear", "Clear")}
                  </span>
                )}
              </div>
            </div>

            <form className="h-11 w-full sm:w-1/4"
              onSubmit={(e) => {
                e.preventDefault();
                onSearch!== undefined && onSearch(searchStr);
              }}
            >
              <div className="relative w-full max-w-sm flex items-center">
                <button
                  type="submit"
                  className="absolute left-2 text-gray-500 dark:text-gray-400 p-1"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
  
                <input
                  value={searchStr}
                  onChange={(e) => setSearchStr(e.target.value)}
                  type="text"
                  placeholder={t("transactions.searchPlaceholder", "Search...")}
                  className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm shadow-theme-xs focus:border-brand-500 focus:ring-1 focus:outline-hidden focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/40 dark:focus:border-brand-400 dark:focus:ring-brand-800"
                />
              </div>
            </form>
          </div>
        )}
        <Table>
          {loading ? (
            <TableRow>
              <TableCell colSpan={100} className="text-center py-6 text-gray-500 dark:text-gray-400">
                {t("transactions.loading", "Loading...")}
              </TableCell>
            </TableRow>
          ) : (
            <>
              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {(!transactions || transactions.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={100} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    {t("transactions.empty", "No transactions found.")}
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(groupedTransactions)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([dateKey, group]) => {
                  const dayTotal = group.reduce((sum, t) => {
                    const amount = t.amount ?? 0;
                    return t.type === TransactionType.EXPENSE ? sum - amount : sum + amount;
                  }, 0);
                  return (
                    <React.Fragment key={dateKey}>
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="bg-gray-100 dark:bg-gray-900 text-xs font-semibold text-gray-600 dark:text-gray-300 py-2 px-5"
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>{parseLocalDateKeyForDisplay(dateKey, locale)}</span>
                            <span className={dayTotal >= 0 ?
                              "text-green-500" :
                              "text-gray-600 dark:text-gray-300"}
                            >
                              {dayTotal >= 0 && '+'}
                              {dayTotal.toLocaleString(locale, {
                                style: "currency",
                                currency: "VND"
                              })}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {group
                        .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
                        .map((transaction) => (
                          <TableRow
                            key={transaction.id}
                            className="hover:bg-gray-50 dark:hover:bg-white/[0.03] cursor-pointer"
                            onClick={() => transaction.id !== undefined
                              && onSelect
                              && onSelect(transaction.id)}
                          >
                            <TableCell className="px-4 py-3 sm:px-6 text-start">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border
                                      ${transaction.type === TransactionType.INCOME ? "border-green-500"
                                      : transaction.type === TransactionType.EXPENSE ? "border-red-500" : ""}`}
                                  >
                                    {transaction.type === TransactionType.INCOME ? (
                                      <i className="fa-solid fa-circle-dollar-to-slot text-green-500"></i>
                                    ) : transaction.type === TransactionType.EXPENSE ? (
                                      <i className="fa-solid fa-wallet text-red-500"></i>
                                    ) : null}
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {/* Category name here (income, bill, budget, etc.) */}
                                    <div className="text-sm font-semibold">
                                      {transaction.title}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {transaction.categoryName}
                                    </div>
                                  </span>
                                </div>
                                <div>
                                  <span className={`text-sm font-bold ${
                                    transaction.type === TransactionType.EXPENSE ?
                                      "text-red-500" :
                                      "text-green-500"}`}
                                  >
                                    {transaction.amount !== undefined &&
                                      transaction.type === TransactionType.INCOME ? '+' : '-'}
                                    {transaction?.amount?.toLocaleString(locale, {
                                      style: "currency",
                                      currency: "VND",
                                    })}
                                  </span>
                                  <i className="text-sm fa-solid fa-ellipsis-vertical ml-6 text-gray-600 dark:text-gray-400"></i>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  )
                })
              )}
              </TableBody>
            </>
          )}
          
          <TableFooter>
            <TableRow>
              <TableCell colSpan={100} className="!p-0">
                <div className="w-full flex justify-between items-center flex-col sm:flex-row px-4 py-3 gap-2">
                  {isLineCountDisplayed && transactions && (
                    <div>
                      <span className="text-sm text-gray-400">{t("transactions.lineCount", "Rows counted")}: </span>
                      <span className="text-sm dark:text-white">
                        {itemCount}
                      </span>
                    </div>
                  )}
                  
                  {isPaginationIncluded && (
                    <Pagination
                      className="flex justify-end items-center gap-2 px-4 py-3 flex-col sm:flex-row"
                      pageNumber={filterParam.pageNumber}
                      pageCount={pageCount}
                      onPageChange={onPageChange}
                      onPageSizeChange={onPageSizeChange}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}