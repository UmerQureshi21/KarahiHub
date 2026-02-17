import { useEffect, useRef, useState } from "react";

const UNITS = [
  { label: "Volume", items: ["tsp", "tbsp", "cup", "ml", "l"] },
  { label: "Weight", items: ["g", "kg", "oz", "lb"] },
  { label: "Other", items: ["pinch", "piece", "slice", "clove"] },
];

type UnitPickerProps = {
  value: string | null;
  onChange: (unit: string) => void;
  className?: string;
};

// Shared list content used by both the desktop dropdown and mobile modal
function UnitList({ value, onSelect }: { value: string | null; onSelect: (unit: string) => void }) {
  return (
    <>
      <button
        type="button"
        onClick={() => onSelect("")}
        className={`w-full text-left px-4 py-2.5 fred-med text-[14px] transition-colors hover:bg-gray-50 ${
          !value ? "text-[var(--secondary)]" : "text-gray-400"
        }`}
      >
        No unit
      </button>
      {UNITS.map((group) => (
        <div key={group.label}>
          <p className="px-4 pt-3 pb-1 fred-bold text-[11px] text-gray-300 uppercase tracking-wide">
            {group.label}
          </p>
          {group.items.map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => onSelect(unit)}
              className={`w-full text-left px-4 py-2.5 fred-med text-[14px] transition-colors hover:bg-[var(--accent)] ${
                value === unit
                  ? "text-[var(--secondary)] bg-[var(--accent)]"
                  : "text-[var(--primary)]"
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      ))}
    </>
  );
}

export default function UnitPicker({ value, onChange, className }: UnitPickerProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Prevent body scroll when mobile modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const select = (unit: string) => {
    onChange(unit);
    setOpen(false);
  };

  return (
    <div ref={pickerRef} className={`relative ${className ?? ""}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-[10px] border border-gray-200 md:border-[var(--accent)] fred-med text-[14px] text-left outline-none focus:border-[var(--secondary)] transition-colors bg-[var(--surface)] flex items-center justify-between"
      >
        <span className={value ? "text-[var(--primary)]" : "text-gray-400"}>
          {value || "Unit"}
        </span>
        <svg
          className={`w-[14px] h-[14px] text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          {/* Desktop: floating dropdown (hidden on mobile) */}
          <div className="hidden md:block absolute z-30 top-[calc(100%+6px)] left-0 w-[200px] bg-[var(--surface)] rounded-[12px] shadow-lg border border-gray-100 py-2 max-h-[280px] overflow-y-auto">
            <UnitList value={value} onSelect={select} />
          </div>

          {/* Mobile: full-screen bottom sheet (hidden on desktop) */}
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            {/* Sheet */}
            <div className="relative bg-[var(--surface)] rounded-t-[20px] max-h-[70vh] flex flex-col">
              {/* Handle + header */}
              <div className="flex flex-col items-center pt-3 pb-2 border-b border-gray-100">
                <div className="w-[36px] h-[4px] bg-gray-300 rounded-full mb-3" />
                <span className="fred-bold text-[16px] text-[var(--primary)]">
                  Select Unit
                </span>
              </div>
              {/* Scrollable list */}
              <div className="overflow-y-auto py-2 pb-8">
                <UnitList value={value} onSelect={select} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
