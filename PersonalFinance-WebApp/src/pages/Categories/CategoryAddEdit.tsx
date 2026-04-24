import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Category, TransactionType } from "../../types";
import { createCategory, fetchCategory, updateCategory } from "../../api_caller/CategoryApiCaller";
import { UUID } from "crypto";
import Select from "../../components/form/Select";
import { useI18n } from "../../context/I18nContext";

export default function CategoryAddEdit() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { id } = useParams();
  const location = useLocation();
  const categoryFromState: Category | undefined = location.state?.category;

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | undefined>();

  const types = [
    { value: TransactionType.EXPENSE + "", label: t("categories.expenseType", "Expense") },
    { value: TransactionType.INCOME + "", label: t("categories.incomeType", "Income") },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!category?.name?.trim()) return;

    if(!confirm(t("categories.addEdit.confirmSave", "Are you sure you want to save?"))) {
      return;
    }

    try {
      setLoading(true);
      let result: Category;
      if (id) {
        result = await updateCategory({ ...category, id: id as UUID });
      } else {
        result = await createCategory({ name: category.name.trim(), type: category.type! });
      }
      alert(t("categories.addEdit.successSaved", "Category saved successfully!"));
      const navigatePath = result.id ? `/categories/${result.id}` : id ? `/categories/${id}` : "/categories";
      navigate(navigatePath);
    } catch (err) {
      alert(t("categories.addEdit.errorSave", "An error occurred while saving the category. Please try again."));
      console.error("Error saving category:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (categoryFromState && id) {
      setCategory(categoryFromState);
    } else if (!categoryFromState && id) {
      setLoading(true);
      fetchCategory(id as UUID)
        .then((data) => setCategory(data))
        .catch((err) => console.error("Error fetching category:", err))
        .finally(() => setLoading(false));
    } else {
      setCategory({ name: "" });
    }
  }, [id]);

  return (
    <>
      <PageMeta
        title={id ? t("categories.addEdit.editTitle", "Edit category") : t("categories.addEdit.createTitle", "Create category")}
        description={id ? t("categories.addEdit.editTitle", "Edit category") : t("categories.addEdit.createTitle", "Create category")}
      />
      <PageBreadcrumb
        pageTitles={[
          { title: t("categories.title", "Categories"), path: "/categories" },
          { title: id ? t("categories.addEdit.breadcrumbEdit", "Edit") : t("categories.addEdit.breadcrumbCreate", "Create"),
            path: id ? `/categories/${id}/edit` : "/categories/add" },
        ]}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {id ? t("categories.addEdit.editTitle", "Edit category") : t("categories.addEdit.createTitle", "Create category")}
        </h3>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("categories.addEdit.nameLabel", "Category name")} <span className="text-red-500">*</span>
              </p>
              <Input
                required
                disabled={loading}
                placeholder={t("categories.addEdit.namePlaceholder", "Ex: Food")}
                maxLength={100}
                value={category?.name || ""}
                onChange={(e) => setCategory((prev) => ({ ...(prev || {}), name: e.target.value }))}
              />
            </div>

            {!id ? (
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  {t("categories.addEdit.typeLabel", "Category type")} <span className="text-red-500">*</span>
                </p>
                <Select
                  required
                  disabled={loading}
                  placeholder={t("categories.addEdit.typePlaceholder", "Select category type")}
                  options={types}
                  onChange={(selectedOption) => {
                    setCategory((prev) => ({
                      ...prev,
                      type: selectedOption as unknown as TransactionType,
                    }));
                  }}
                />
              </div>
            ) : (<></>)}
          </div>

          <div className="flex justify-end gap-4">
            <Button size="sm" type="submit" disabled={loading}>
              {t("categories.addEdit.saveAction", "Save")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}


