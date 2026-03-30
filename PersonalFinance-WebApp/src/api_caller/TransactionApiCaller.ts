import { UUID } from "crypto";
import { PagedListResult, Transaction, TransactionFilterParams } from "../types";
import { buildQueryString } from "../utils";

/**
 * Fetches a transaction by its ID from the API.
 * @param transactionId - The ID of the transaction to fetch.
 * @returns A promise that resolves to the fetched transaction.
 */
export async function fetchTransaction(transactionId: UUID): Promise<Transaction> {
  return fetch(`/api/transactions/${transactionId}`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data: Transaction) => ({
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.lastUpdatedAt ? new Date(data.lastUpdatedAt) : undefined,
    }));
}

/**
 * Fetches a paginated list of transactions based on the provided filter parameters.
 * @param filterParam - The parameters to filter the transactions.
 * @returns A promise that resolves to a paginated list of transactions.
 */
export async function fetchTransactionPagedList(filterParam: TransactionFilterParams): Promise<PagedListResult<Transaction>> {
  const queryString = buildQueryString(filterParam);
  return fetch(`/api/transactions/get-paged-list?${queryString}`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      var res = response.json();
      return res;
    })
    .then((data: PagedListResult<Transaction>) => ({
      ...data,
      items: data.items.map((transaction) => ({
        ...transaction,
        date: transaction.date ? new Date(transaction.date) : undefined,
        createdAt: transaction.createdAt ? new Date(transaction.createdAt) : undefined,
        updatedAt: transaction.lastUpdatedAt ? new Date(transaction.lastUpdatedAt) : undefined,
      })),
    }));
}

/**
 * Creates a new transaction by sending it to the API.
 * @param transaction - The transaction object to create.
 * @returns A promise that resolves to the created transaction.
 */
export async function createTransaction(transaction: Transaction): Promise<Transaction> {
  return fetch(`/api/transactions/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

/**
 * Updates an existing transaction by sending the updated data to the API.
 * @param transaction - The transaction object with updated data.
 * @returns A promise that resolves to the updated transaction.
 */
export async function updateTransaction(transaction: Transaction): Promise<Transaction> {
  return fetch(`/api/transactions/update/${transaction.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

/**
 * Deletes a transaction by its ID.
 * @param transactionId - The ID of the transaction to delete.
 * @returns A promise that resolves when the transaction is deleted.
 */
export async function deleteTransaction(transactionId: UUID): Promise<void> {
  return fetch(`/api/transactions/delete/${transactionId}`, {
    method: "DELETE",
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  });
}