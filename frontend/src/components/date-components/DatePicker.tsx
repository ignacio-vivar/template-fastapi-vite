import { useState } from "react";
import { es } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const toDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toStr = (d: Date) => d.toLocaleDateString("sv-SE"); // YYYY-MM-DD
const show = (s: string) => s.split("-").reverse().join("/"); // dd/mm/yyyy

type Props = {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  ariaLabel: string;
  className?: string;
};

export function DatePicker({ value, onChange, min, ariaLabel, className }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={ariaLabel}
        className={className ?? "h-8 w-full rounded-md border border-input px-2 text-xs"}
      >
        {value ? show(value) : "dd/mm/aaaa"}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          locale={es}
          selected={value ? toDate(value) : undefined}
          disabled={min ? { before: toDate(min) } : undefined}
          onSelect={(d) => {
            if (d) {
              onChange(toStr(d));
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
