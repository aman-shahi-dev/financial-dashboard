import { createSlice, createSelector } from "@reduxjs/toolkit";
import { getMonthKey } from "../utils/formatters";
import { CATEGORY_COLORS } from "../utils/mockData";

const insightsSlice = createSlice({
  name: "insights",
  initialState: {},
  reducers: {},
});

const selectTransactions = (state) => state.transactions.list;

export const selectTotalIncome = createSelector(selectTransactions, (list) =>
  list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
);

export const selectTotalExpenses = createSelector(selectTransactions, (list) =>
  list.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
);

export const selectNetBalance = createSelector(
  selectTotalIncome,
  selectTotalExpenses,
  (income, expenses) => income - expenses,
);

export const selectSavingsRate = createSelector(
  selectTotalIncome,
  selectTotalExpenses,
  (income, expenses) =>
    income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : "0.0",
);

export const selectSpendingByCategory = createSelector(
  selectTransactions,
  (list) => {
    const map = {};
    list
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] ?? 0) + t.amount;
      });
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] ?? "#f97316",
      }))
      .sort((a, b) => b.value - a.value);
  },
);

export const selectTopCategory = createSelector(
  selectSpendingByCategory,
  (categories) => categories[0] ?? null,
);

export const selectMonthlyData = createSelector(selectTransactions, (list) => {
  const map = {};
  list.forEach((t) => {
    const key = getMonthKey(t.date);
    if (!map[key]) map[key] = { income: 0, expenses: 0 };
    if (t.type === "income") map[key].income += t.amount;
    if (t.type === "expense") map[key].expenses += t.amount;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      month: new Date(key + "-01").toLocaleString("en-IN", { month: "short" }),
      income: val.income,
      expenses: val.expenses,
      savings: val.income - val.expenses,
    }));
});

export const selectBalanceTrend = createSelector(selectMonthlyData, (months) =>
  months.map((m) => ({ month: m.month, balance: m.savings })),
);

export const selectMoMChange = createSelector(selectMonthlyData, (months) => {
  if (months.length < 2) return null;
  const current = months[months.length - 1];
  const prev = months[months.length - 2];
  if (prev.expenses === 0) return null;
  return (((current.expenses - prev.expenses) / prev.expenses) * 100).toFixed(
    1,
  );
});

export const selectAvgMonthlyExpense = createSelector(
  selectTotalExpenses,
  selectMonthlyData,
  (total, months) => (months.length ? Math.round(total / months.length) : 0),
);

export default insightsSlice.reducer;
