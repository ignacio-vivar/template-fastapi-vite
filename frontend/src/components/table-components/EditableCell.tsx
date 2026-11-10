import { useState } from "react";

type Props = {
  value: string;
  onSave: (value: string) => void;
  inputMode?: "text" | "numeric";
  ariaLabel: string;
};

export function EditableCell({ value, onSave, inputMode = "text", ariaLabel }: Props) {
  const [draft, setDraft] = useState<string | null>(null); // null = sin editar

  const commit = () => {
    const next = draft?.trim();
    setDraft(null);
    if (!next || next === value) return; // sin cambios o vacío: no se envía
    onSave(next);
  };

  return (
    <input
      value={draft ?? value}
      inputMode={inputMode}
      aria-label={ariaLabel}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur(); // Enter guarda
        if (e.key === "Escape") setDraft(null); // Escape cancela
      }}
      className="w-full rounded-md border border-input bg-muted/40 px-2 h-8 text-center transition-colors hover:border-ring hover:bg-muted focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/50"
    />
  );
}
