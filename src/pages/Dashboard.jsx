import { useMemo } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppSelector";
import { openModal } from "../store/uiSlice";
import { deleteTransaction } from "../store/transactionsSlice";
import { can } from "../utils/rbac";
import { formatCurrency } from "../utils/formatters";
import {
  selectNetBalance,
  selectTotalIncome,
  selectTotalExpenses,
  selectBalanceTrend,
  selectSpendingByCategory,
} from "../store/insightsSlice";
import SummaryCard from "../components/ui/SummaryCard";
import TransactionRow from "../components/ui/TransactionRow";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";
import SpendingChart from "../components/charts/SpendingChart";
import EmptyState from "../components/ui/EmptyState";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s) => s.transactions.list);
  const role = useAppSelector((s) => s.auth.role);
  const totalBalance = useAppSelector(selectNetBalance);
  const totalIncome = useAppSelector(selectTotalIncome);
  const totalExpenses = useAppSelector(selectTotalExpenses);
  const trendData = useAppSelector(selectBalanceTrend);
  const spendingData = useAppSelector(selectSpendingByCategory);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [transactions],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* Summary cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <SummaryCard
          index={0}
          label="Total Balance"
          icon={Wallet}
          value={formatCurrency(totalBalance)}
          accent="#f97316"
          trend={2.4}
          trendLabel="vs last month"
        />
        <SummaryCard
          index={1}
          label="Total Income"
          icon={TrendingUp}
          value={formatCurrency(totalIncome)}
          accent="var(--color-income)"
          trend={8}
          trendLabel="vs last month"
        />
        <SummaryCard
          index={2}
          label="Total Expenses"
          icon={TrendingDown}
          value={formatCurrency(totalExpenses)}
          accent="var(--color-expense)"
          trend={-5}
          trendLabel="vs last month"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div
          style={{
            flex: 2,
            minWidth: "280px",
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border)",
            borderRadius: "14px",
            padding: "20px 24px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              marginBottom: "4px",
            }}
          >
            Balance trend
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-text-secondary)",
              marginBottom: "20px",
            }}
          >
            Monthly net balance over time
          </p>
          <BalanceTrendChart data={trendData} />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "260px",
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border)",
            borderRadius: "14px",
            padding: "20px 24px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              marginBottom: "4px",
            }}
          >
            Spending breakdown
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-text-secondary)",
              marginBottom: "20px",
            }}
          >
            By category
          </p>
          <SpendingChart data={spendingData} />
        </div>
      </div>

      {/* Recent transactions */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "0.5px solid var(--color-border)",
          borderRadius: "14px",
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              Recent transactions
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--color-text-secondary)",
                marginTop: "2px",
              }}
            >
              Last 5 transactions
            </p>
          </div>
          {can(role, "canAddTransaction") && (
            <button
              onClick={() => dispatch(openModal(null))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#f97316",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <Plus size={14} /> Add transaction
            </button>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <EmptyState
            message="No transactions yet"
            subtext="Add your first transaction to get started"
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentTransactions.map((t, i) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                role={role}
                index={i}
                onEdit={(t) => dispatch(openModal(t))}
                onDelete={(id) => dispatch(deleteTransaction(id))}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
