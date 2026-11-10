import { useState, type ReactNode } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { Plus, Search } from "lucide-react";

export type ComboboxOption = { value: string; label: string };

const MAX_RESULTS = 5;

type Props = {
  options: ComboboxOption[];
  value: string; // "" = sin selección
  onChange: (value: string) => void;
  onCreate: (name: string) => void;
  createLabel: string;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  renderItem?: (option: ComboboxOption) => ReactNode;
  ariaLabel: string;
};

export function ComboboxCreateField({
  options,
  value,
  onChange,
  onCreate,
  createLabel,
  placeholder,
  emptyText = "No hay resultados",
  className,
  renderItem,
  ariaLabel,
}: Props) {
  const [query, setQuery] = useState("");
  const selected = options.find((o) => o.value === value) ?? null;
  const typed = query.trim();
  const showCreate = typed !== "" && typed !== selected?.label;
  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(option) => onChange(option?.value ?? "")}
      onInputValueChange={setQuery}
      isItemEqualToValue={(a, b) => a.value === b.value}
      limit={MAX_RESULTS}
      openOnInputClick
    >
      <ComboboxInput
        aria-label={ariaLabel}
        placeholder={placeholder}
        className={className}
        showTrigger={false}
      >
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(option: ComboboxOption) => (
            <ComboboxItem key={option.value} value={option}>
              {renderItem ? renderItem(option) : option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
        {showCreate && (
          <button
            type="button"
            aria-label={`create-${createLabel}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onCreate(typed)}
            className="flex w-full items-center gap-2 border-t px-3 py-2 text-left text-sm hover:bg-accent"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="truncate">
              Crear {createLabel} "{typed}"
            </span>
          </button>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
