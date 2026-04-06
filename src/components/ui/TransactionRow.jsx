import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { CATEGORY_COLORS } from "../../utils/mockData";
import { formatCurrency, formatShortDate } from "../../utils/formatters";
import { can } from "../../utils/rbac";

export default function TransactionRow({
  transaction,
  role,
  onEdit,
  onDelete,
  index,
}) {
  const { date, description, category, amount, type } = transaction;
  const isIncome = type === "income";
  const color = CATEGORY_COLORS[category] ?? "#f97316";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderRadius: "10px",
        border: "0.5px solid var(--color-border)",
        background: "var(--color-surface)",
        gap: "12px",
      }}
    >
      {/* Category dot + info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "9px",
            flexShrink: 0,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        </div>

        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-text-secondary)",
              marginTop: "2px",
            }}
          >
            {formatShortDate(date)} · {category}
          </p>
        </div>
      </div>

      {/* Amount + actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: isIncome ? "var(--color-income)" : "var(--color-expense)",
          }}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(amount)}
        </span>

        {can(role, "canEditTransaction") && (
          <button
            onClick={() => onEdit(transaction)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f97316")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-secondary)")
            }
          >
            <Pencil size={13} />
          </button>
        )}

        {can(role, "canDeleteTransaction") && (
          <button
            onClick={() => onDelete(transaction.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-expense)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-secondary)")
            }
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
