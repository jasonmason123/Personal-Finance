import { UUID } from "crypto";

//Constants
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;

//Utils
export interface PageTitle {
  title: string;
  path: string;
  state?: any;
}

export interface Option {
  value: string;
  label: string;
}

//Enums
export enum TransactionType {
    INCOME = "Income",
    EXPENSE = "Expense",
}

export enum FlagBoolean {
    TRUE = "TRUE",
    FALSE = "FALSE"
}

//Entities
export interface Transaction {
  id?: UUID;
  title?: string;
  merchant?: string;
  amount?: number;
  date?: Date;
  type?: TransactionType;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  categoryId?: UUID; // Added to link to category
  categoryName?: string;
}

export interface Category {
  id?: UUID;
  name: string;
  type?: TransactionType;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}

/** Date filter parameters */
export class DateFilterIso {
  /** Filter for a specific single day */
  public exactDate?: string;
  /** Filter starting from a specific date (inclusive) */
  public dateFrom?: string;
  /** Filter up to a specific date (inclusive) */
  public dateTo?: string;

  // Private constructor prevents "new DateFilter()" 
  // and forces use of the static factory methods below.
  private constructor() {}

  /**
   * Filter for a specific single day.
   */
  public static exact(date: Date): DateFilterIso {
    const filter = new DateFilterIso();
    filter.exactDate = date.toISOString();
    return filter;
  }

  /**
   * Filter starting from a specific date (inclusive).
   */
  public static from(dateFrom: Date): DateFilterIso {
    const filter = new DateFilterIso();
    filter.dateFrom = dateFrom.toISOString();
    return filter;
  }

  /**
   * Filter up to a specific date (inclusive).
   */
  public static to(dateTo: Date): DateFilterIso {
    const filter = new DateFilterIso();
    filter.dateTo = dateTo.toISOString();
    return filter;
  }

  /**
   * Filter between two specific dates (range).
   */
  public static between(from: Date, to: Date): DateFilterIso {
    const filter = new DateFilterIso();
    filter.dateFrom = from.toISOString();
    filter.dateTo = to.toISOString();
    return filter;
  }
}

//Filter params
export interface BaseFilterParams {
  search?: string;
  pageNumber: number;
  pageSize: number;
}

// Use ISO8601 format for date strings
export interface TransactionFilterParams extends BaseFilterParams {
  transactionType?: TransactionType;
  categoryId?: UUID;
  dateFilter?: DateFilterIso;
}

//DTO
export interface PagedListResult<T extends any> {
  totalBudget?: number;
  itemCount: number;
  pageCount: number;
  pageSize: number;
  pageNumber: number;
  items: T[];
}

export interface AuthenticationResult {
  succeeded: boolean;
  isLockedOut: boolean;
  isEmailConfirmed: boolean;
  confirmationToken?: string;
}

export interface IncomeExpenseResult {
  income: number;
  expense: number;
}

export interface YearlyTrendResult {
  year: number;
  incomeSeries: Record<number, number>;
  expenseSeries: Record<number, number>;
}

export interface UserInfo {
  username: string;
  email?: string;
  dateJoined: string;
}