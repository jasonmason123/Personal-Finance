import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate, useParams } from "react-router";
import { Transaction } from "../../types";
import { useEffect, useState } from "react";
import TransactionOverallCard from "../../components/Transactions/TransactionOverallCard";
import TransactionInfoCard from "../../components/Transactions/TransactionInfoCard";
// import MetaDataCard from "../../components/MetaDataCard";
// import TransactionNoteCard from "../../components/Transactions/TransactionNoteCard";
// import TransactionAttachmentCard from "../../components/Transactions/TransactionAttachmentCard";
import ComponentCard from "../../components/common/ComponentCard";
import { deleteTransaction, fetchTransaction } from "../../api_caller/TransactionApiCaller";
import { UUID } from "crypto";
import { useI18n } from "../../context/I18nContext";

export default function TransactionDetails() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<Transaction>({});
  
  const { id: transactionId } = useParams<{ id: string }>();

  const toEditPage = () => {
    navigate(`/transactions/${transaction.id}/edit`, {
      state: { transaction },
    });
  }

  const localDeleteTransaction = async () => {
    if (window.confirm(t("transactions.details.confirmDelete", "Are you sure you want to delete this transaction?"))) {
      await deleteTransaction(transaction.id! as UUID)
        .then(() => {
          alert(t("transactions.details.successDeleted", "Transaction deleted successfully."));
          navigate("/transactions");
        });
    }
  }

  useEffect(() => {
      if (!transactionId) return;
      setLoading(true);
      fetchTransaction(transactionId as UUID)
        .then((data) => setTransaction(data))
        .catch((err) => console.error("Error fetching transaction:", err));
  
      setLoading(false);
  }, []);

  return (
    <>
      <PageMeta
        title={t("transactions.title", "Transactions")}
        description={t("transactions.description", "Financial transactions")}
      />
      <PageBreadcrumb pageTitles={[
          { title: t("transactions.title", "Transactions"), path: "/transactions" },
          { title: t("transactions.details.title", "Transaction details"), path: `/transactions/${transactionId}` }
        ]} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-white/50">{t("transactions.loading", "Loading...")}</p>
          ) : (
            <ComponentCard
              title={t("transactions.details.title", "Transaction details")}
              actions={[
                {
                  actionName: t("transactions.details.editAction", "Edit"),
                  action: toEditPage,
                  icon: <i className="fa-solid fa-pencil"></i>,
                },
                {
                  actionName: t("transactions.details.deleteAction", "Delete"),
                  action: localDeleteTransaction,
                  icon: <i className="fa-solid fa-trash"></i>,
                },
              ]}
            >
              <TransactionOverallCard transaction={transaction} />
              <TransactionInfoCard transaction={transaction} />
              {/* <TransactionAttachmentCard transaction={transaction} />
              <TransactionNoteCard transaction={transaction} />
              <MetaDataCard entity={transaction} /> */}
            </ComponentCard>
          )}
        </div>
      </div>
    </>
  );
}