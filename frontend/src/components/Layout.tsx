import { Outlet } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/useAuth";
import { useTheme } from "@/contexts/useTheme";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, LogOut, Moon, Sun } from "lucide-react";

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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-col gap-2 border-b px-6 py-3 md:flex-row md:items-center md:justify-between">
        {/* Izquierda: Logo y fecha/hora apilados */}
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="text-lg font-bold">Logo</div>
          <div className="flex items-center gap-3 w-fit rounded-full bg-muted px-3 py-1 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays size={14} />
              {formatDate(now)}
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5 font-medium tabular-nums">
              <Clock size={14} />
              {formatTime(now)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut size={16} />
            Cerrar sesión
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
