import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks/useAppSelector";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import Modal from "./components/ui/Modal";

export default function App() {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Modal />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
