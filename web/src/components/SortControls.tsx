type SortOption = {
  value: string;
  label: string;
};

type SortControlsProps = {
  options: readonly SortOption[];
  sortBy: string;
  onSortChange: (value: string) => void;
  ascending: boolean;
  onAscendingChange: (ascending: boolean) => void;
};

export default function SortControls({
  options,
  sortBy,
  onSortChange,
  ascending,
  onAscendingChange,
}: SortControlsProps) {
  return (
    <div>
      <h3 className="fred-bold text-[14px] text-[var(--primary)] mb-2">
        Sort by
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSortChange(option.value)}
            className={`px-3 py-1.5 rounded-full text-[13px] fred-med transition-colors ${
              sortBy === option.value
                ? "bg-[var(--secondary)] text-[var(--surface)]"
                : "bg-[var(--surface)] text-[var(--primary)] border border-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onAscendingChange(!ascending)}
          className="ml-2 px-3 py-1.5 rounded-full text-[13px] fred-med bg-[var(--surface)] text-[var(--primary)] border border-gray-200 hover:border-[var(--secondary)] transition-colors"
        >
          {ascending ? "Low to High" : "High to Low"}
        </button>
      </div>
    </div>
  );
}
