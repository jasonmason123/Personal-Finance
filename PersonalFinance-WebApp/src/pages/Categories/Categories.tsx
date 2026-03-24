import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import Pagination from "../../components/tables/Pagination";
import { Table, TableBody, TableRow, TableCell, TableFooter } from "../../components/ui/table";
import { Category, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, TransactionType } from "../../types";
import { useEffect, useState } from "react";
import Switch from "../../components/form/switch/Switch";
// import { fetchCategoryPagedList } from "../../api_caller/CategoryApiCaller";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [searchStr, setSearchStr] = useState<string>("");
  const [searchSwitch, setSearchSwitch] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // setLoading(true);
    // fetchCategoryPagedList({ searchString: searchStr || undefined, type: selectedType, pageNumber, pageSize })
    //   .then((data) => {
    //     setCategories(data.items);
    //     setPageCount(data.pageCount);
    //     setItemCount(data.itemCount);
    //   })
    //   .catch((error) => {
    //     console.error("Error categories transaction:", error);
    //   })
    //   .finally(() => setLoading(false));
    const categories: Category[] = [
        {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Food & Drinks",
            type: TransactionType.EXPENSE,
            createdAt: new Date("2024-01-01"),
            lastUpdatedAt: new Date("2024-01-01")
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "Income",
            type: TransactionType.INCOME,
            createdAt: new Date("2024-01-01"),
            lastUpdatedAt: new Date("2024-01-01")
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440005",
            name: "Entertainment",
            type: TransactionType.EXPENSE,
            createdAt: new Date("2024-01-01"),
            lastUpdatedAt: new Date("2024-01-01")
        }
    ];

    setCategories(categories);
    setItemCount(categories.length);
    setPageNumber(DEFAULT_PAGE_NUMBER);
    setPageCount(1);
    setLoading(false);
  }, [searchSwitch, selectedType, pageNumber, pageSize]);

  const onSearch = () => {
    setSearchSwitch(!searchSwitch);
  };

  return (
    <>
      <PageMeta title="Danh mục" description="Quản lý danh mục" />
      <PageBreadcrumb pageTitles={[{ title: "Danh mục", path: "/categories" }]} />
      <div className="space-y-6">
        <ComponentCard
          title="Danh sách danh mục"
          actions={
            [
              {
                actionName: "Thêm danh mục",
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
                    label={`Type: ${selectedType == TransactionType.INCOME ? "Income" : "Expense"}`}
                    onChange={(e) => setSelectedType(e ? TransactionType.INCOME : TransactionType.EXPENSE)}
                  />
                </div>
                <form className="h-11 w-full sm:w-1/4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSearch!== undefined && onSearch();
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
                      placeholder="Tìm kiếm..."
                      className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm shadow-theme-xs focus:border-brand-500 focus:ring-1 focus:outline-hidden focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/40 dark:focus:border-brand-400 dark:focus:ring-brand-800"
                    />
                  </div>
                </form>
              </div>

              <Table>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={100} className="text-center py-6 text-gray-500 dark:text-gray-400">
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : categories.filter(c => c.type == selectedType).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={100} className="text-center py-6 text-gray-500 dark:text-gray-400">
                        Không có danh mục nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.filter(c => c.type == selectedType).map((c) => (
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

                <TableFooter>
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
                </TableFooter>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
