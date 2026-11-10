import type { ReactNode } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import { Search } from "lucide-react";
import { InputGroupAddon } from "@/components/ui/input-group";
export type ComboboxOption = { value: string; label: string };

const MAX_RESULTS = 5;

type Props = {
  options: ComboboxOption[];
  value: string; // "" = sin selección
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  renderItem?: (option: ComboboxOption) => ReactNode;
  ariaLabel: string;
};

export function ComboboxField({
  options,
  value,
  onChange,
  placeholder,
  emptyText = "Sin resultados",
  className,
  renderItem,
  ariaLabel,
}: Props) {
  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(option) => onChange(option?.value ?? "")}
      isItemEqualToValue={(a, b) => a.value === b.value}
      limit={MAX_RESULTS}
      openOnInputClick
    >
      <ComboboxInput aria-label={ariaLabel} placeholder={placeholder} className={className} showTrigger={false}>
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
      </ComboboxContent>
    </Combobox>
  );
}
