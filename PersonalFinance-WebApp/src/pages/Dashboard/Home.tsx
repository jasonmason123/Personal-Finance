import StatisticsChart from "../../components/dashboard/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import MonthlyOverall from "../../components/dashboard/MonthlyOverall";
import ExpenseBreakdownChart from "../../components/dashboard/ExpenseBreakdownChart";
import IncomeBreakdownChart from "../../components/dashboard/IncomeBreakdownChart";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Home"
        description="Home/Dashboard"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-12">
          <MonthlyOverall />
        </div>

        <div className="col-span-12 md:col-span-6">
          <ExpenseBreakdownChart />
        </div>

        <div className="col-span-12 md:col-span-6">
          <IncomeBreakdownChart />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </div>
    </>
  );
}
