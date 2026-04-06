import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg)",
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: isSidebarOpen ? "240px" : "72px",
          transition: "margin-left 0.3s ease",
          minWidth: 0,
        }}
      >
        <Navbar />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
