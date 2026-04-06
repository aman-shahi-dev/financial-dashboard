import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppSelector";
import { toggleSidebar, setSidebar } from "../../store/uiSlice";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/insights", icon: Lightbulb, label: "Insights" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ isMobile }) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  const location = useLocation();

  const handleNavClick = () => {
    if (isMobile) dispatch(setSidebar(false));
  };

  return (
    <motion.aside
      animate={{
        x: isMobile ? (isOpen ? 0 : -240) : 0,
        width: isMobile ? 240 : isOpen ? 240 : 72,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        background: "var(--color-surface)",
        borderRight: "0.5px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 100,
      }}
    >
      {/* Logo row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          padding: isOpen ? "20px 16px 20px 20px" : "20px 0",
          borderBottom: "0.5px solid var(--color-border)",
          minHeight: "64px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 26 26"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <polygon points="13,2 25,23 1,23" fill="#f97316" />
          </svg>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                Zorvyn
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {isOpen && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            style={{
              background: "none",
              border: "0.5px solid var(--color-border)",
              borderRadius: "6px",
              padding: "4px",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav
        style={{
          flex: 1,
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: isOpen ? "10px 12px" : "10px 0",
                justifyContent: isOpen ? "flex-start" : "center",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "#f97316" : "var(--color-text-secondary)",
                background: isActive
                  ? "var(--color-accent-muted)"
                  : "transparent",
                fontWeight: isActive ? 500 : 400,
                fontSize: "14px",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ overflow: "hidden" }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button — desktop only when closed */}
      {!isOpen && !isMobile && (
        <div
          style={{
            padding: "16px 0",
            display: "flex",
            justifyContent: "center",
            borderTop: "0.5px solid var(--color-border)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => dispatch(toggleSidebar())}
            style={{
              background: "none",
              border: "0.5px solid var(--color-border)",
              borderRadius: "6px",
              padding: "6px",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </motion.aside>
  );
}
