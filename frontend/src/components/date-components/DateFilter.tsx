import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATE_OPS, type DateOp } from "@/lib/dateFilter";
import { DatePicker } from "./DatePicker";

export function DateFilter({
  label,
  op,
  onOp,
  value,
  onValue,
  ariaLabel
}: {
  label: string;
  op: DateOp;
  onOp: (op: DateOp) => void;
  value: string;
  onValue: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="flex gap-2">
        <Select value={op} onValueChange={(v) => v && onOp(v as DateOp)}>
          <SelectTrigger aria-label={`${ariaLabel}-op`} className="w-28 shrink-0">
            <SelectValue>{DATE_OPS.find((o) => o.value === op)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {DATE_OPS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker
          ariaLabel={ariaLabel ?? "date"}
          value={value}
          onChange={onValue}
          className="h-9 w-full rounded-md border border-input px-2 text-sm"
        />
      </div>
    </div>
  );
}
