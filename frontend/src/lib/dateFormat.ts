const TZ = "America/Argentina/Buenos_Aires";

// "2026-10-27T01:30:00Z" → "26/10, 22:30"
export const fmt = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23", // sin esto puede salir "10:30 p. m."
  });

// instante → día argentino "2026-10-26" (para DateCell y filtros)
export const day = (iso: string) =>
  new Date(iso).toLocaleDateString("sv-SE", { timeZone: TZ });

// "2026-10-26" (elegido en el DateCell) → instante en UTC
export const dayToIso = (d: string) =>
  new Date(`${d}T00:00:00-03:00`).toISOString();

// "2026-10-27T01:30:00Z" → "26/10/2026"
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// "2026-10-27T01:30:00Z" → "22:30"
export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-AR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

// "2026-10-27" → último instante de ese día argentino, en UTC
export const endOfDayIso = (d: string) =>
  new Date(`${d}T23:59:59.999-03:00`).toISOString();

// día argentino de mañana, "YYYY-MM-DD"
export const tomorrow = () =>
  day(new Date(Date.now() + 86400000).toISOString());
