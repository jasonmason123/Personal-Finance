import { UUID } from "crypto";

//Constants
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;
export const APP_BASE_URL = "/app";

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

export enum PeriodUnit {
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR"
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
  transactionType?: TransactionType;
  createdAt?: Date;
  updatedAt?: Date;
  categoryId?: UUID; // Added to link to category
  categoryName?: string;
}

export interface Category {
  id?: UUID;
  name: string;
  type?: TransactionType;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  flagDel?: FlagBoolean;
}

//Filter params
export interface BaseFilterParams {
  search?: string;
  pageNumber: number;
  pageSize: number;
}

// Use ISO8601 format for date strings
export interface TransactionFilterParams extends BaseFilterParams {
  dateFrom?: string;
  dateTo?: string;
  transactionType?: TransactionType;
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
  from: string;
  to: string;
  income: number;
  expense: number;
}

export interface IncomeExpenseSummaryResult extends IncomeExpenseResult {
  incomeChange: number;
  expenseChange: number;
  rollover: number;
}

export interface AmountsByYearResult {
  year: number;
  monthlyIncomes: Record<number, number>;
  monthlyExpenses: Record<number, number>;
}

export interface UserInfo {
  username: string;
  email: string;
  dateJoined: string;
}