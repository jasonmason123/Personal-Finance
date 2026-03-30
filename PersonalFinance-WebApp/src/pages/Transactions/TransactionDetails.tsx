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

export default function TransactionDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<Transaction>({});
  
  const { id: transactionId } = useParams<{ id: string }>();

  const toEditPage = () => {
    navigate(`/transactions/${transaction.id}/edit`, {
      state: { transaction },
    });
  }

  const localDeleteTransaction = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      await deleteTransaction(transaction.id! as UUID)
        .then(() => {
          alert("Giao dịch đã được xóa thành công.");
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
      <PageMeta title="Giao dịch" description="Giao dịch tài chính" />
      <PageBreadcrumb pageTitles={[
          { title: "Giao dịch", path: "/transactions" },
          { title: "Chi tiết giao dịch", path: `/transactions/${transactionId}` }
        ]} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-white/50">Đang tải...</p>
          ) : (
            <ComponentCard
              title="Chi tiết giao dịch"
              actions={[
                {
                  actionName: "Cập nhật",
                  action: toEditPage,
                  icon: <i className="fa-solid fa-pencil"></i>,
                },
                {
                  actionName: "Xóa",
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