import { motion } from "framer-motion";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppSelector";
import { toggleTheme } from "../store/uiSlice";
import { setRole } from "../store/authSlice";
import { deleteTransaction } from "../store/transactionsSlice";
import { ROLES } from "../utils/rbac";
import { exportToCSV, exportToJSON } from "../utils/exportUtils";
import { Sun, Moon, Shield, Eye, Trash2, Download, Info } from "lucide-react";

const Section = ({ title, sub, children, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.08 }}
    style={{
      background: "var(--color-surface)",
      border: "0.5px solid var(--color-border)",
      borderRadius: "14px",
      padding: "20px 24px",
    }}
  >
    <div style={{ marginBottom: "16px" }}>
      <p
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </p>
      {sub && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            marginTop: "2px",
          }}
        >
          {sub}
        </p>
      )}
    </div>
    <div
      style={{
        height: "0.5px",
        background: "var(--color-border)",
        marginBottom: "16px",
      }}
    />
    {children}
  </motion.div>
);

const Row = ({ label, sub, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      padding: "10px 0",
    }}
  >
    <div>
      <p
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--color-text-primary)",
        }}
      >
        {label}
      </p>
      {sub && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            marginTop: "2px",
          }}
        >
          {sub}
        </p>
      )}
    </div>
    {children}
  </div>
);

const Divider = () => (
  <div style={{ height: "0.5px", background: "var(--color-border)" }} />
);

export default function Settings() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const role = useAppSelector((s) => s.auth.role);
  const transactions = useAppSelector((s) => s.transactions.list);
  const isDark = theme === "dark";

  const btnBase = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    border: "none",
  };

  const clearAll = () => {
    if (window.confirm("Clear all transactions? This cannot be undone.")) {
      transactions.forEach((t) => dispatch(deleteTransaction(t.id)));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "680px",
      }}
    >
      {/* Appearance */}
      <Section index={0} title="Appearance" sub="Customize how Zorvyn looks">
        <Row
          label="Theme"
          sub={
            isDark ? "Currently using dark mode" : "Currently using light mode"
          }
        >
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { value: "light", icon: Sun, label: "Light" },
              { value: "dark", icon: Moon, label: "Dark" },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => theme !== value && dispatch(toggleTheme())}
                style={{
                  ...btnBase,
                  background:
                    theme === value ? "#f97316" : "var(--color-surface-2)",
                  color:
                    theme === value ? "#fff" : "var(--color-text-secondary)",
                  border:
                    theme === value
                      ? "none"
                      : "0.5px solid var(--color-border)",
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* Role */}
      <Section
        index={1}
        title="Role & access"
        sub="Switch between Admin and Viewer mode"
      >
        <Row
          label="Current role"
          sub={
            role === ROLES.ADMIN
              ? "Can add, edit, and delete transactions"
              : "Read-only access — cannot modify data"
          }
        >
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { value: ROLES.ADMIN, icon: Shield, label: "Admin" },
              { value: ROLES.VIEWER, icon: Eye, label: "Viewer" },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => dispatch(setRole(value))}
                style={{
                  ...btnBase,
                  background:
                    role === value ? "#f97316" : "var(--color-surface-2)",
                  color:
                    role === value ? "#fff" : "var(--color-text-secondary)",
                  border:
                    role === value ? "none" : "0.5px solid var(--color-border)",
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </Row>

        <Divider />

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "14px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "var(--color-surface-2)",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <Info
            size={14}
            style={{ color: "#f97316", marginTop: "1px", flexShrink: 0 }}
          />
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            Role switching is for demo purposes. In a real application, roles
            would be assigned by a backend authentication system and could not
            be changed by the user.
          </p>
        </div>
      </Section>

      {/* Data */}
      <Section
        index={2}
        title="Data management"
        sub="Export or clear your transaction data"
      >
        <Row
          label="Export transactions"
          sub={`${transactions.length} transactions available`}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            {["CSV", "JSON"].map((fmt) => (
              <button
                key={fmt}
                onClick={() =>
                  fmt === "CSV"
                    ? exportToCSV(transactions)
                    : exportToJSON(transactions)
                }
                style={{
                  ...btnBase,
                  background: "var(--color-surface-2)",
                  color: "var(--color-text-primary)",
                  border: "0.5px solid var(--color-border)",
                }}
              >
                <Download size={13} /> {fmt}
              </button>
            ))}
          </div>
        </Row>

        <Divider />

        <Row
          label="Clear all data"
          sub="Permanently delete all transactions from local storage"
        >
          <button
            onClick={clearAll}
            style={{
              ...btnBase,
              background: "rgba(248,113,113,0.1)",
              color: "var(--color-expense)",
              border: "0.5px solid rgba(248,113,113,0.25)",
            }}
          >
            <Trash2 size={13} /> Clear all
          </button>
        </Row>
      </Section>

      {/* About */}
      <Section index={3} title="About" sub="Project information">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { label: "Project", value: "Zorvyn Finance Dashboard" },
            {
              label: "Stack",
              value:
                "React 18 · Redux Toolkit · Framer Motion · Recharts · Tailwind CSS",
            },
            { label: "Version", value: "1.0.0" },
            { label: "Data", value: "Mock data · localStorage persistence" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: "16px" }}>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                  minWidth: "80px",
                  paddingTop: "1px",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.5,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "16px",
            padding: "14px 16px",
            borderRadius: "10px",
            background: "var(--color-accent-muted)",
            border: "0.5px solid rgba(124,111,247,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 26 26"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <polygon points="13,2 25,23 1,23" fill="#f97316" />
          </svg>
          <p style={{ fontSize: "12px", color: "#f97316", lineHeight: 1.6 }}>
            Built as a frontend internship assignment — demonstrating component
            architecture, state management, RBAC, data visualisation, and
            responsive design.
          </p>
        </div>
      </Section>
    </motion.div>
  );
}
