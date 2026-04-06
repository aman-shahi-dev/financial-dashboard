import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Plus, Download, X } from "lucide-react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppSelector";
import {
  setSearchQuery,
  setFilterCategory,
  setFilterType,
  setSortBy,
  resetFilters,
  deleteTransaction,
} from "../store/transactionsSlice";
import { openModal } from "../store/uiSlice";
import { can } from "../utils/rbac";
import { CATEGORIES } from "../utils/mockData";
import { formatCurrency } from "../utils/formatters";
import { exportToCSV, exportToJSON } from "../utils/exportUtils";
import TransactionRow from "../components/ui/TransactionRow";
import EmptyState from "../components/ui/EmptyState";

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "amount-desc", label: "Highest amount" },
  { value: "amount-asc", label: "Lowest amount" },
];

const sel = {
  background: "var(--color-surface)",
  border: "0.5px solid var(--color-border)",
  borderRadius: "8px",
  padding: "8px 10px",
  fontSize: "13px",
  color: "var(--color-text-primary)",
  cursor: "pointer",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  flex: "1 1 120px",
};

export default function Transactions() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s) => s.transactions.list);
  const searchQuery = useAppSelector((s) => s.transactions.searchQuery);
  const filterCat = useAppSelector((s) => s.transactions.filterCategory);
  const filterType = useAppSelector((s) => s.transactions.filterType);
  const sortBy = useAppSelector((s) => s.transactions.sortBy);
  const role = useAppSelector((s) => s.auth.role);
  const [showExport, setShowExport] = useState(false);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    if (filterCat !== "All")
      list = list.filter((t) => t.category === filterCat);
    if (filterType !== "All") list = list.filter((t) => t.type === filterType);
    list.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });
    return list;
  }, [transactions, searchQuery, filterCat, filterType, sortBy]);

  const filteredIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const filteredExpenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const hasActiveFilters =
    searchQuery || filterCat !== "All" || filterType !== "All";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {/* Toolbar */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "0.5px solid var(--color-border)",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Row 1: search + actions */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{ position: "relative", flex: "1 1 180px", minWidth: "0" }}
          >
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-secondary)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              style={{
                width: "100%",
                padding: "9px 10px 9px 30px",
                borderRadius: "8px",
                border: "0.5px solid var(--color-border)",
                background: "var(--color-surface-2)",
                color: "var(--color-text-primary)",
                fontSize: "13px",
                outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            {can(role, "canExportData") && (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowExport(!showExport)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "var(--color-surface-2)",
                    border: "0.5px solid var(--color-border)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "var(--color-text-primary)",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Download size={13} /> Export
                </button>
                {showExport && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      background: "var(--color-surface)",
                      border: "0.5px solid var(--color-border)",
                      borderRadius: "10px",
                      padding: "6px",
                      zIndex: 50,
                      minWidth: "130px",
                    }}
                  >
                    {["CSV", "JSON"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => {
                          fmt === "CSV"
                            ? exportToCSV(filtered)
                            : exportToJSON(filtered);
                          setShowExport(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 12px",
                          background: "none",
                          border: "none",
                          borderRadius: "7px",
                          fontSize: "13px",
                          color: "var(--color-text-primary)",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--color-surface-2)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        Download {fmt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {can(role, "canAddTransaction") && (
              <button
                onClick={() => dispatch(openModal(null))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "#f97316",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                <Plus size={13} /> Add
              </button>
            )}
          </div>
        </div>

        {/* Row 2: filters */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <SlidersHorizontal
            size={13}
            style={{ color: "var(--color-text-secondary)", flexShrink: 0 }}
          />
          <select
            value={filterType}
            onChange={(e) => dispatch(setFilterType(e.target.value))}
            style={sel}
          >
            <option value="All">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filterCat}
            onChange={(e) => dispatch(setFilterCategory(e.target.value))}
            style={sel}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            style={sel}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              onClick={() => dispatch(resetFilters())}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "0.5px solid var(--color-border)",
                borderRadius: "8px",
                padding: "8px 10px",
                fontSize: "12px",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {[
          {
            label: "Showing",
            value: `${filtered.length} transactions`,
            color: "var(--color-text-primary)",
          },
          {
            label: "Income",
            value: formatCurrency(filteredIncome),
            color: "var(--color-income)",
          },
          {
            label: "Expenses",
            value: formatCurrency(filteredExpenses),
            color: "var(--color-expense)",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: "var(--color-surface)",
              border: "0.5px solid var(--color-border)",
              borderRadius: "10px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: "1 1 100px",
            }}
          >
            <span
              style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}
            >
              {label}
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* List */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "0.5px solid var(--color-border)",
          borderRadius: "14px",
          padding: "16px",
        }}
      >
        {filtered.length === 0 ? (
          <EmptyState
            message="No transactions found"
            subtext="Try adjusting your search or filters"
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.map((t, i) => (
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
