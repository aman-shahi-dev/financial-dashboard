import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function SummaryCard({
  label,
  value,
  trend,
  trendLabel,
  icon: Icon,
  accent,
  index,
}) {
  const isPositive = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border)",
        borderRadius: "14px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        flex: "1 1 140px",
        minWidth: "140px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "var(--color-text-secondary)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        {Icon && (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: accent ? `${accent}18` : "var(--color-surface-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accent ?? "var(--color-text-secondary)",
              flexShrink: 0,
            }}
          >
            <Icon size={15} />
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: accent ?? "var(--color-text-primary)",
          letterSpacing: "-0.5px",
          lineHeight: 1,
          wordBreak: "break-all",
        }}
      >
        {value}
      </div>

      {trend !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              padding: "3px 7px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 500,
              background: isPositive
                ? "rgba(52,211,153,0.12)"
                : "rgba(248,113,113,0.12)",
              color: isPositive
                ? "var(--color-income)"
                : "var(--color-expense)",
            }}
          >
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
          <span
            style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}
          >
            {trendLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}
