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

export default function CategoryDetails() {
  const navigate = useNavigate();
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
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      await deleteCategory(category?.id! as UUID)
        .then(() => {
          alert("Danh mục đã được xóa thành công.");
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
      <PageMeta title={`Danh mục #${id}`} description={`Thông tin danh mục ${category?.name}`} />
      <PageBreadcrumb
        pageTitles={[
          { title: "Danh mục", path: "/categories" },
          { title: category?.name || "", path: `/categories/${id}` },
        ]}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          {loading ? (
            <div className="dark:text-white">
              Đang tải...
            </div>
          ) : (
            <>
              <ComponentCard
                title="Chi tiết danh mục"
                actions={[
                  {
                    actionName: "Cập nhật",
                    action: toEditPage,
                    icon: <i className="fa-solid fa-pencil"></i>,
                  },
                  {
                    actionName: "Xóa",
                    action: localDeleteCategory,
                    icon: <i className="fa-solid fa-trash"></i>,
                  },
                ]}
              >
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Tên:</span> <span className="dark:text-white">{category?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Loại:</span> <span className="dark:text-white">{category?.type == TransactionType.INCOME ? "Thu nhập" : "Chi tiêu"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tạo lúc:</span> <span className="dark:text-white">{category?.createdAt && new Date(category.createdAt).toLocaleString("vi-VN")}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cập nhật lúc:</span> <span className="dark:text-white">{category?.lastUpdatedAt && new Date(category.lastUpdatedAt).toLocaleString("vi-VN")}</span>
                  </div>
                </div>
              </ComponentCard>
              <ComponentCard
                title="Giao dịch liên quan"
              >
                {loadingTransactions ? (
                  <div className="dark:text-white">
                    Đang tải giao dịch...
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
