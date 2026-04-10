import { Search } from "lucide-react";

/**
 * Search input with icon — used on the Transactions page.
 *
 * @param {{ value: string, onChange: (v: string) => void, placeholder?: string }} props
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg"
      />
    </div>
  );
}
