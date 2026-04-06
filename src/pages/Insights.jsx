import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAppSelector } from "../hooks/useAppSelector";
import { formatCurrency, getMonthKey } from "../utils/formatters";
import { CATEGORY_COLORS, MONTHS } from "../utils/mockData";
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  Zap,
} from "lucide-react";
import EmptyState from "../components/ui/EmptyState";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "13px",
      }}
    >
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "6px" }}>
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

const InsightCard = ({ icon: Icon, title, value, sub, accent, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.08 }}
    style={{
      background: "var(--color-surface)",
      border: "0.5px solid var(--color-border)",
      borderRadius: "14px",
      padding: "20px 24px",
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
      flex: 1,
      minWidth: "200px",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        flexShrink: 0,
        background: `${accent}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: accent,
      }}
    >
      <Icon size={18} />
    </div>
    <div>
      <p
        style={{
          fontSize: "12px",
          color: "var(--color-text-secondary)",
          marginBottom: "4px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          letterSpacing: "-0.3px",
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            marginTop: "4px",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  </motion.div>
);

export default function Insights() {
  const transactions = useAppSelector((s) => s.transactions.list);

  // Per-month income vs expenses
  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      if (!map[key]) map[key] = { income: 0, expenses: 0 };
      if (t.type === "income") map[key].income += t.amount;
      if (t.type === "expense") map[key].expenses += t.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        month: MONTHS[parseInt(key.split("-")[1]) - 1],
        income: val.income,
        expenses: val.expenses,
        savings: val.income - val.expenses,
      }));
  }, [transactions]);

  // Spending by category
  const categoryData = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] ?? 0) + t.amount;
      });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Key insights
  const insights = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const savingsRate =
      totalIncome > 0
        ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
        : 0;
    const topCategory = categoryData[0];

    // Month-over-month expense comparison
    const months = [...monthlyData];
    const current = months[months.length - 1];
    const prev = months[months.length - 2];
    const momDiff =
      current && prev
        ? (((current.expenses - prev.expenses) / prev.expenses) * 100).toFixed(
            1,
          )
        : null;

    // Avg monthly spend
    const avgMonthlyExpense = monthlyData.length
      ? (totalExpenses / monthlyData.length).toFixed(0)
      : 0;

    return {
      savingsRate,
      topCategory,
      momDiff,
      avgMonthlyExpense,
      totalIncome,
      totalExpenses,
    };
  }, [transactions, categoryData, monthlyData]);

  if (!transactions.length) {
    return (
      <EmptyState
        message="No data yet"
        subtext="Add transactions to see insights"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* Insight cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <InsightCard
          index={0}
          icon={Award}
          title="Savings rate"
          value={`${insights.savingsRate}%`}
          sub="of total income saved"
          accent="#f97316"
        />
        <InsightCard
          index={1}
          icon={AlertCircle}
          title="Top spending category"
          value={insights.topCategory?.name ?? "—"}
          sub={
            insights.topCategory
              ? formatCurrency(insights.topCategory.value) + " total"
              : ""
          }
          accent="#f87171"
        />
        <InsightCard
          index={2}
          icon={Zap}
          title="Avg monthly spend"
          value={formatCurrency(insights.avgMonthlyExpense)}
          sub="across all months"
          accent="#fbbf24"
        />
        <InsightCard
          index={3}
          icon={insights.momDiff >= 0 ? TrendingUp : TrendingDown}
          title="Month-over-month"
          value={
            insights.momDiff !== null
              ? `${insights.momDiff > 0 ? "+" : ""}${insights.momDiff}%`
              : "—"
          }
          sub="change in expenses"
          accent={insights.momDiff >= 0 ? "#f87171" : "#34d399"}
        />
      </div>

      {/* Monthly income vs expenses bar chart */}
      <div
        style={{
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
          Monthly comparison
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            marginBottom: "20px",
          }}
        >
          Income vs expenses by month
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={monthlyData}
            barGap={4}
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{
                fontSize: 12,
                fill: "var(--color-text-secondary)",
                fontFamily: "Inter",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: "var(--color-text-secondary)",
                fontFamily: "Inter",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="income"
              name="Income"
              fill="#34d399"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#f87171"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown bars */}
      <div
        style={{
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
          Spending by category
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            marginBottom: "20px",
          }}
        >
          All-time breakdown
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {categoryData.map((cat, i) => {
            const max = categoryData[0].value;
            const pct = ((cat.value / max) * 100).toFixed(1);
            const color = CATEGORY_COLORS[cat.name] ?? "#f97316";
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {formatCurrency(cat.value)}
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    borderRadius: "3px",
                    background: "var(--color-surface-2)",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                    style={{
                      height: "100%",
                      borderRadius: "3px",
                      background: color,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Observations */}
      <div
        style={{
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
            marginBottom: "16px",
          }}
        >
          Observations
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              text: `Your savings rate is ${insights.savingsRate}% — ${insights.savingsRate >= 20 ? "great job, you're above the recommended 20%" : "try to aim for at least 20% of your income"}.`,
              color:
                insights.savingsRate >= 20 ? "var(--color-income)" : "#fbbf24",
            },
            {
              text: `${insights.topCategory?.name} is your biggest expense category at ${formatCurrency(insights.topCategory?.value ?? 0)}.`,
              color: "#f87171",
            },
            {
              text:
                insights.momDiff !== null
                  ? `Your expenses ${insights.momDiff >= 0 ? "increased" : "decreased"} by ${Math.abs(insights.momDiff)}% compared to last month.`
                  : "Not enough months of data for a comparison yet.",
              color: insights.momDiff >= 0 ? "#f87171" : "var(--color-income)",
            },
            {
              text: `You spend an average of ${formatCurrency(insights.avgMonthlyExpense)} per month across all categories.`,
              color: "#f97316",
            },
          ].map((obs, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "var(--color-surface-2)",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: obs.color,
                  flexShrink: 0,
                  marginTop: "6px",
                }}
              />
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.6,
                }}
              >
                {obs.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
