import { PackageOpen } from "lucide-react";

export default function EmptyState({
  message = "No data to display",
  subtext,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "var(--color-surface-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-secondary)",
        }}
      >
        <PackageOpen size={22} />
      </div>
      <p
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--color-text-primary)",
        }}
      >
        {message}
      </p>
      {subtext && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            textAlign: "center",
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
