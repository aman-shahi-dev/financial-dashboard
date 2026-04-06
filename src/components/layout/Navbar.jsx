import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppSelector";
import { toggleTheme } from "../../store/uiSlice";
import { setRole } from "../../store/authSlice";
import { ROLES } from "../../utils/rbac";
import ThemeToggle from "../ui/ThemeToggle";
import RoleBadge from "../ui/RoleBadge";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/insights": "Insights",
  "/settings": "Settings",
};

export default function Navbar() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const theme = useAppSelector((state) => state.ui.theme);
  const role = useAppSelector((state) => state.auth.role);

  const title = PAGE_TITLES[location.pathname] ?? "Zorvyn";

  return (
    <header
      style={{
        height: "64px",
        borderBottom: "0.5px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "var(--color-bg)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Role switcher */}
        <select
          value={role}
          onChange={(e) => dispatch(setRole(e.target.value))}
          style={{
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border)",
            borderRadius: "8px",
            padding: "6px 10px",
            fontSize: "13px",
            color: "var(--color-text-primary)",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value={ROLES.ADMIN}>Admin</option>
          <option value={ROLES.VIEWER}>Viewer</option>
        </select>

        <RoleBadge role={role} />
        <ThemeToggle theme={theme} onToggle={() => dispatch(toggleTheme())} />
      </div>
    </header>
  );
}
