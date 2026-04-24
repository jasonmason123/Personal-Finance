import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Select from "../../components/form/Select";
import { Option, Transaction, TransactionType } from "../../types";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import DatePicker from "../../components/form/date-picker";
import flatpickr from "flatpickr";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { createTransaction, fetchTransaction, updateTransaction } from "../../api_caller/TransactionApiCaller";
import ModalSelect from "../../components/form/ModalSelect";
import { fetchCategoryOptions } from "../../api_caller/CategoryApiCaller";
import { UUID } from "crypto";
import { useI18n } from "../../context/I18nContext";
// import TextArea from "../../components/form/input/TextArea";
// import FileInput from "../../components/form/input/FileInput";

export default function TransactionAddEdit() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();

  const { id } = useParams();
  const location = useLocation();
  const transactionFromState: Transaction = location.state?.transaction;

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction | undefined>();
  const datePickerRef = React.useRef<flatpickr.Instance | null>(null);
  const transactionTypes = [
    { value: TransactionType.INCOME + "", label: t("transactions.incomeType", "Income") },
    { value: TransactionType.EXPENSE + "", label: t("transactions.expenseType", "Expense") },
  ];

  const handleError = (message:string, error: any) => {
    alert(t("transactions.addEdit.errorGeneric", "An error occurred. Please try again."));
    console.error(message, error);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!confirm(t("transactions.addEdit.confirmSave", "Are you sure you want to save?"))) {
      return;
    }

    if (newTransaction) {
      try {
        setLoading(true);
        let transactionResult: Transaction = {};
        if (id) {
          transactionResult = await updateTransaction(newTransaction);
        } else {
          transactionResult = await createTransaction(newTransaction);
        }
        
        alert(t("transactions.addEdit.successSaved", "Transaction saved successfully!"));
        
        const navigatePath =
          transactionResult.id ? `/transactions/${transactionResult.id}` :
          id ? `/transactions/${id}` :
          "/transactions";
        navigate(navigatePath);
      } catch (error) {
        handleError("Error saving transaction:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  // Set transaction from state or fetch from API if not available (in edit mode)
  useEffect(() => {
    if (transactionFromState && id) {
      setNewTransaction(transactionFromState);
    } else if(!transactionFromState && id) {
      setLoading(true);
      fetchTransaction(id as UUID)
        .then((transaction) => {
          setNewTransaction({
            ...transaction,
            date: transaction.date && new Date(transaction.date),
            createdAt: transaction.createdAt && new Date(transaction.createdAt),
            lastUpdatedAt: transaction.lastUpdatedAt && new Date(transaction.lastUpdatedAt),
          });
        })
        .catch((error) => {
          handleError("Error fetching transaction:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);
  
  useEffect(() => {
    if (newTransaction != undefined &&
      newTransaction?.type != undefined) {

      fetchCategoryOptions({ type: newTransaction.type })
      .then((options) => {
        setCategoryOptions(options);
        setLoadingOptions(false);
      })
      .catch((error) => {
        handleError("Error fetching category options:", error);
      })
    }
    
  }, [newTransaction?.type]);
    
  return (
    <>
      <PageMeta
        title={id ? t("transactions.addEdit.editTitle", "Edit transaction") : t("transactions.addEdit.createTitle", "Add transaction")}
        description={id ? t("transactions.addEdit.editTitle", "Edit transaction") : t("transactions.addEdit.createTitle", "Add transaction")}
      />
      <PageBreadcrumb
        pageTitles={[
          { title: t("transactions.title", "Transactions"), path: "/transactions" },
          { title: id ? t("transactions.addEdit.editTitle", "Edit transaction") : t("transactions.addEdit.createTitle", "Add transaction"),
            path: id ? `/transactions/${id}/edit` : "/transactions/create" },
        ]}
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {id ? t("transactions.addEdit.editTitle", "Edit transaction") : t("transactions.addEdit.createTitle", "Add transaction")}
        </h3>
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  {id ? `${t("transactions.addEdit.transactionCodeLabel", "Transaction code")}: ${id}` : t("transactions.addEdit.infoTitle", "Transaction information")}
                </h4>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      {t("transactions.addEdit.titleLabel", "Short description")}<span className="text-red-500">*</span>
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      <Input
                        required
                        disabled={loading}
                        placeholder={t("transactions.addEdit.titlePlaceholder", "Ex: Eating out")}
                        maxLength={40}
                        value={newTransaction?.title || ""}
                        onChange={(e) =>
                          setNewTransaction((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      {t("transactions.addEdit.merchantLabel", "Counterparty")}
                    </p>
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                      <Input
                        disabled={loading}
                        placeholder={t("transactions.addEdit.merchantPlaceholder", "Counterparty")}
                        value={newTransaction?.merchant || ""}
                        onChange={(e) =>
                          setNewTransaction((prev) => ({
                            ...prev,
                            merchant: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      {t("transactions.addEdit.dateLabel", "Date")}<span className="text-red-500">*</span>
                    </p>
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                      <DatePicker
                        id="date"
                        mode="single"
                        required
                        disabled={loading}
                        defaultDate={newTransaction?.date || undefined}
                        confirmOnly={false}
                        onChange={(date) => {
                          if (date && date[0]) {
                            setNewTransaction((prev) => ({
                              ...prev,
                              date: date[0],
                            }));
                          }
                        }}
                        placeholder={t("transactions.addEdit.datePlaceholder", "Transaction date")}
                        instanceRef={(fp) => (datePickerRef.current = fp)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      {t("transactions.addEdit.typeLabel", "Transaction type")}<span className="text-red-500">*</span>
                    </p>
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                      <Select
                        required
                        disabled={loading}
                        placeholder={t("transactions.addEdit.typePlaceholder", "Select transaction type")}
                        options={transactionTypes}
                        defaultValue={transactionFromState?.type?.toString()}
                        onChange={(selectedOption) => {
                          setNewTransaction((prev) => ({
                            ...prev,
                            type:
                              selectedOption as unknown as TransactionType,
                          }));
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      {newTransaction &&
                      newTransaction.type == TransactionType.INCOME
                        ? t("transactions.addEdit.incomeAmountLabel", "Amount received (VND)")
                        : t("transactions.addEdit.expenseAmountLabel", "Amount spent (VND)")}
                      <span className="text-red-500">*</span>
                    </p>
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                      <Input
                        required
                        disabled={loading}
                        placeholder={(10000).toLocaleString(locale, {
                          style: "currency",
                          currency: "VND"
                        })}
                        type="number"
                        value={newTransaction?.amount || ""}
                        onChange={(e) =>
                          setNewTransaction((prev) => ({
                            ...prev,
                            amount: parseFloat(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      {t("transactions.addEdit.categoryLabel", "Category")}
                    </p>
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                      <ModalSelect
                        defaultValue={newTransaction?.categoryId + ""}
                        disabled={loading || loadingOptions}
                        options={categoryOptions}
                        onChange={(value) => {
                          setNewTransaction((prev) => ({
                            ...prev,
                            categoryId: value as UUID,
                          }))
                        }}
                        placeholder={loading || loadingOptions
                          ? t("transactions.addEdit.loadingOptions", "Loading...")
                          : t("transactions.addEdit.categoryPlaceholder", "Select category")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
                  Tệp đính kèm
                </h4>
                <FileInput />
                <p className="text-gray-500 text-xs mt-2">
                  Kích cỡ file tối đa 10MB, chấp nhận các định dạng: .jpg, .png, .pdf
                </p>
              </div>
            </div>
          </div> */}

          {/* <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="gap-6 lg:flex-row lg:items-start lg:justify-between">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
                Ghi chú
              </h4>
              <TextArea placeholder="Ghi ghi chú của bạn tại đây..." />
            </div>
          </div> */}

          <div className="flex justify-end gap-4">
            <Button size="sm" type="submit" disabled={loading}>
              {t("transactions.addEdit.saveAction", "Save")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
