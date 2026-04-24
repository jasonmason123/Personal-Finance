import { useNavigate } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TransactionsTable from "../../components/Transactions/TransactionsTable";
import { useI18n } from "../../context/I18nContext";

export default function Transactions() {
  const navigate = useNavigate();
  const { t } = useI18n();
  return (
    <>
      <PageMeta
        title={t("transactions.title", "Transactions")}
        description={t("transactions.description", "Financial transactions")}
      />
      <PageBreadcrumb
        pageTitles={[{ title: t("transactions.title", "Transactions"), path: "/transactions" }]}
      />
      <div className="space-y-6">
        <ComponentCard
          title={t("transactions.listTitle", "Transaction list")}
          actions={
            [
              {
                actionName: t("transactions.addAction", "Add transaction"),
                action: () => navigate("/transactions/add"),
                icon: <i className="fa-solid fa-plus"></i>,
              },
            ]
          }
        >
          <TransactionsTable
            isSearchAndFilterIncluded
            isPaginationIncluded
            isLineCountDisplayed
          />
        </ComponentCard>
      </div>
    </>
  );
}
