import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppSelector";
import { toggleTheme, toggleSidebar } from "../../store/uiSlice";
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
    <>
      <header
        style={{
          height: "64.5px",
          borderBottom: "0.5px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: "var(--color-bg)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          gap: "12px",
        }}
      >
        {/* Left */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: 0,
            flex: 1,
          }}
        >
          {/* Hamburger — mobile only */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hamburger-btn"
            style={{
              background: "none",
              border: "0.5px solid var(--color-border)",
              borderRadius: "8px",
              padding: "7px",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Menu size={16} />
          </button>

          <h1
            style={{
              fontSize: "17px",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
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
              fontFamily: "Inter, sans-serif",
            }}
          >
            <option value={ROLES.ADMIN}>Admin</option>
            <option value={ROLES.VIEWER}>Viewer</option>
          </select>

          <span className="role-badge-wrap">
            <RoleBadge role={role} />
          </span>

          <ThemeToggle theme={theme} onToggle={() => dispatch(toggleTheme())} />
        </div>
      </header>

      <style>{`
        .hamburger-btn { display: none !important; }
        .role-badge-wrap { display: inline-flex; }

        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .role-badge-wrap { display: none !important; }
        }
      `}</style>
    </>
  );
}
