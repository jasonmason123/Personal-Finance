import { UUID } from "crypto";
import { Category, Option, TransactionType } from "../types";
import { buildQueryString } from "../utils";

export async function fetchCategory(categoryId: UUID): Promise<Category> {
  return fetch(`/api/categories/${categoryId}`, {
    method: "GET",
    credentials: "include",
  }).then(async (response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    const data = (await response.json()) as Category;
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.lastUpdatedAt ? new Date(data.lastUpdatedAt) : undefined,
    };
  });
}

export async function fetchCategoryList(params: { searchString?: string; type?: TransactionType; }): Promise<Category[]> {
  const queryString = buildQueryString(params);
  return fetch(`/api/categories/get-list?${queryString}`, {
    method: "GET",
    credentials: "include",
  }).then(async (response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    const data = (await response.json()) as Category[];
    return data.map((c) => ({
      ...c,
      createdAt: c.createdAt ? new Date(c.createdAt) : undefined,
      updatedAt: c.lastUpdatedAt ? new Date(c.lastUpdatedAt) : undefined,
    }));
  });
}

export async function createCategory(category: Category): Promise<Category> {
  return fetch(`/api/categories/create?categoryName=${encodeURIComponent(category.name)}&type=${category.type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).then(async (response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    const data = (await response.json()) as Category;
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.lastUpdatedAt ? new Date(data.lastUpdatedAt) : undefined,
    };
  });
}

export async function updateCategory(category: Category): Promise<Category> {
  return fetch(`/api/categories/update/${category.id}?newName=${encodeURIComponent(category.name)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).then(async (response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    const data = (await response.json()) as Category;
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.lastUpdatedAt ? new Date(data.lastUpdatedAt) : undefined,
    };
  });
}

export async function deleteCategory(categoryId: UUID): Promise<void> {
  return fetch(`/api/categories/delete/${categoryId}`, {
    method: "DELETE",
    credentials: "include",
  }).then((response) => {
    if (!response.ok) throw new Error("Network response was not ok");
  });
}

export async function fetchCategoryOptions(params: { type: TransactionType }): Promise<Option[]> {
  const queryString = buildQueryString(params);
  return fetch(`/api/categories/get-options?${queryString}`, {
    method: "GET",
    credentials: "include",
  }).then(async (response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    const data = (await response.json()) as Option[];
    return data;
  });
}