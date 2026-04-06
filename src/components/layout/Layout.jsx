import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppSelector";
import { setSidebar } from "../../store/uiSlice";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  const dispatch = useAppDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        dispatch(setSidebar(false));
      } else {
        dispatch(setSidebar(true));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg)",
        position: "relative",
      }}
    >
      <Sidebar isMobile={isMobile} />

      {/* Mobile backdrop */}
      {isSidebarOpen && isMobile && (
        <div
          onClick={() => dispatch(setSidebar(false))}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 99,
          }}
        />
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: isMobile ? 0 : isSidebarOpen ? "240px" : "72px",
          transition: "margin-left 0.3s ease",
          minWidth: 0,
        }}
      >
        <Navbar isMobile={isMobile} />
        <main
          style={{
            flex: 1,
            padding: "20px 16px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
