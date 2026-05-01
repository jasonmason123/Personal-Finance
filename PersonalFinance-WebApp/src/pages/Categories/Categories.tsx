import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import { Table, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { Category, TransactionType } from "../../types";
import { useEffect, useState } from "react";
import Switch from "../../components/form/switch/Switch";
import { fetchCategoryList } from "../../api_caller/CategoryApiCaller";
import { useI18n } from "../../context/I18nContext";
import Input from "../../components/form/input/InputField";

// NOTE: All Categories are fetched, searching and filtering are done on the frontend, since there aren't too many Categories for each user (max 50)
export default function Categories() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [searchStr, setSearchStr] = useState<string>("");
  // const [pageNumber, setPageNumber] = useState<number>(DEFAULT_PAGE_NUMBER);
  // const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  // const [pageCount, setPageCount] = useState<number>(0);
  // const [itemCount, setItemCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all Categories then filter, since there aren't too many Categories for each user (max 50)
  useEffect(() => {
    setLoading(true);
    fetchCategoryList({})
      .then((data) => {
        setCategories(data);
        // setCategories(data.items);
        // setPageCount(data.pageCount);
        // setItemCount(data.itemCount);
      })
      .catch((error) => {
        console.error("Error categories transaction:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageMeta
        title={t("categories.title", "Categories")}
        description={t("categories.description", "Category management")}
      />
      <PageBreadcrumb pageTitles={[{ title: t("categories.title", "Categories"), path: "/categories" }]} />
      <div className="space-y-6">
        <ComponentCard
          title={t("categories.listTitle", "Category list")}
          actions={
            [
              {
                actionName: t("categories.addAction", "Add category"),
                action: () => navigate("/categories/add"),
                icon: <i className="fa-solid fa-plus"></i>,
              },
            ]
          }
        >
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-white/[0.05] flex-col sm:flex-row gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <Switch
                    label={`${t("categories.typeLabel", "Category type")}: ${
                      selectedType == TransactionType.INCOME
                        ? t("categories.incomeType", "Income")
                        : t("categories.expenseType", "Expense")
                    }`}
                    onChange={(e) => setSelectedType(e ? TransactionType.INCOME : TransactionType.EXPENSE)}
                  />
                </div>
                <form className="h-11 w-full sm:w-1/4">
                  <div className="w-full max-w-sm">
                    <Input
                      type="text"
                      value={searchStr}
                      onChange={(e) => setSearchStr(e.target.value.toUpperCase())}
                      placeholder={t("categories.searchPlaceholder", "Search...")}
                      className=""
                    />
                  </div>
                </form>
              </div>

              <Table>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={100} className="text-center py-6 text-gray-500 dark:text-gray-400">
                        {t("categories.loading", "Loading...")}
                      </TableCell>
                    </TableRow>
                  ) : categories.filter(c => c.type == selectedType)
                                .filter(c => searchStr == "" || c.name.toUpperCase().startsWith(searchStr.toUpperCase()))
                                .length === 0 ?
                  (
                    <TableRow>
                      <TableCell colSpan={100} className="text-center py-6 text-gray-500 dark:text-gray-400">
                        {t("categories.empty", "No categories found.")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories
                      .filter(c => c.type == selectedType)
                      .filter(c => searchStr == "" || c.name.toUpperCase().startsWith(searchStr.toUpperCase()))
                  .map((c) => (
                      <TableRow
                        key={c.id}
                        className="hover:bg-gray-50 group dark:hover:bg-white/[0.05] cursor-pointer"
                        onClick={() => navigate(`/categories/${c.id}`)}
                      >
                        <TableCell className="px-4 py-3 sm:px-6 text-start">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="text-lg font-semibold dark:text-white">
                                {c.name}
                              </div>
                              {/* <div className="text-xs text-gray-400">
                                {c.createdAt && new Date(c.createdAt).toLocaleDateString("vi-VN")} · {c.flagDel === FlagBoolean.TRUE ? "Đã xóa" : "Đang dùng"}
                              </div> */}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>

                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={100} className="!p-0">
                      <div className="w-full flex justify-between items-center flex-col sm:flex-row px-4 py-3 gap-2">
                        <div>
                          <span className="text-sm text-gray-400">Số dòng đếm được: </span>
                          <span className="text-sm dark:text-white">
                            {itemCount}
                          </span>
                        </div>

                        <Pagination
                          className="flex justify-end items-center gap-2 px-4 py-3 flex-col sm:flex-row"
                          pageNumber={pageNumber}
                          pageCount={pageCount}
                          onPageChange={(p) => setPageNumber(p)}
                          onPageSizeChange={(ps) => {
                            setPageSize(ps);
                            setPageNumber(DEFAULT_PAGE_NUMBER);
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
