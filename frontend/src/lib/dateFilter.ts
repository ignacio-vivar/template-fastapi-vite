export type DateOp = "eq" | "lt" | "gt";

export const DATE_OPS: { value: DateOp; label: string }[] = [
  { value: "eq", label: "Igual" },
  { value: "lt", label: "Antes" },
  { value: "gt", label: "Después" },
];

export const matchDate = (date: string | null, op: DateOp, value: string) => {
  if (!value) return true;
  if (!date) return false;
  if (op === "eq") return date === value;
  if (op === "lt") return date < value;
  return date > value;
};
