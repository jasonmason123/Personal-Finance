import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Category, Transaction, TransactionFilterParams, TransactionType } from "../../types";
import ComponentCard from "../../components/common/ComponentCard";
import { deleteCategory, fetchCategory } from "../../api_caller/CategoryApiCaller";
import { UUID } from "crypto";
import TransactionsTable from "../../components/Transactions/TransactionsTable";
import { fetchTransactionPagedList } from "../../api_caller/TransactionApiCaller";
import { useI18n } from "../../context/I18nContext";

export default function CategoryDetails() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [category, setCategory] = useState<Category | undefined>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const toEditPage = () => {
    navigate(`/categories/${category?.id}/edit`, {
      state: { category },
    });
  }
  
  const localDeleteCategory = async () => {
    if (window.confirm(t("categories.details.confirmDelete", "Are you sure you want to delete this category?"))) {
      await deleteCategory(category?.id! as UUID)
        .then(() => {
          alert(t("categories.details.successDeleted", "Category deleted successfully."));
          navigate("/categories");
        });
    }
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCategory(id as UUID)
      .then((data) => setCategory(data))
      .catch((err) => console.error("Error fetching category:", err));

    setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoadingTransactions(true);

    var filterParam: TransactionFilterParams = {
      pageNumber: 1,
      pageSize: 10,
      categoryId: id as UUID,
    };

    fetchTransactionPagedList(filterParam)
      .then((data) => {
        setTransactions(data.items ?? []);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      })
      .finally(() => {
        setLoadingTransactions(false);
      });
  }, []);

  return (
    <>
      <PageMeta
        title={`${t("categories.title", "Categories")} #${id}`}
        description={`${t("categories.details.title", "Category details")} ${category?.name ?? ""}`}
      />
      <PageBreadcrumb
        pageTitles={[
          { title: t("categories.title", "Categories"), path: "/categories" },
          { title: category?.name || "", path: `/categories/${id}` },
        ]}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          {loading ? (
            <div className="dark:text-white">
              {t("categories.loading", "Loading...")}
            </div>
          ) : (
            <>
              <ComponentCard
                title={t("categories.details.title", "Category details")}
                actions={[
                  {
                    actionName: t("categories.details.editAction", "Edit"),
                    action: toEditPage,
                    icon: <i className="fa-solid fa-pencil"></i>,
                  },
                  {
                    actionName: t("categories.details.deleteAction", "Delete"),
                    action: localDeleteCategory,
                    icon: <i className="fa-solid fa-trash"></i>,
                  },
                ]}
              >
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">{t("categories.details.nameLabel", "Name")}:</span> <span className="dark:text-white">{category?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("categories.details.typeLabel", "Type")}:</span> <span className="dark:text-white">{category?.type == TransactionType.INCOME ? t("categories.incomeType", "Income") : t("categories.expenseType", "Expense")}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("categories.details.createdAtLabel", "Created at")}:</span> <span className="dark:text-white">{category?.createdAt && new Date(category.createdAt).toLocaleString(locale)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("categories.details.updatedAtLabel", "Updated at")}:</span> <span className="dark:text-white">{category?.lastUpdatedAt && new Date(category.lastUpdatedAt).toLocaleString(locale)}</span>
                  </div>
                </div>
              </ComponentCard>
              <ComponentCard
                title={t("categories.details.recentTransactionsTitle", "Related transactions")}
              >
                {loadingTransactions ? (
                  <div className="dark:text-white">
                    {t("categories.details.loadingTransactions", "Loading transactions...")}
                  </div>
                ) : (
                  <TransactionsTable
                    fetchTransactions={false}
                    defaultTransactions={transactions}
                  />
                )}
                
              </ComponentCard>
            </>
          )}
        </div>
      </div>
    </>
  );
}
