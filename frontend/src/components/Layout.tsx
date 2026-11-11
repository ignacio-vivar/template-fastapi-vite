import { Outlet } from "react-router";
import { useAuth } from "@/contexts/useAuth";
import { useEffect, useState } from "react";
import "./layouts.css";

function formatDate(date: Date) {
  return date
    .toLocaleDateString("es-AR", { day: "numeric", month: "short" })
    .replace(".", "");
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

export default function Layout() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const { logout } = useAuth();

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-logo">Logo</div>
          <div className="app-datetime">
            <span className="app-date">{formatDate(now)}</span>
            <span className="app-divider" />
            <span className="app-time">{formatTime(now)}</span>
          </div>
        </div>
        <div className="app-header-right">
          <button onClick={logout} className="logout-btn">
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
