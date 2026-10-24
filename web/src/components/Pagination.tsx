type PaginationProps = {
  page: number; // 0-based, like Spring's Page.number
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

// Which page numbers to show: always the first, last, and the ones around the
// current page, with "…" filling the gaps. e.g. on page 6 of 12: 1 … 5 6 7 … 12
function visiblePages(page: number, totalPages: number): (number | "gap")[] {
  const pages: (number | "gap")[] = [];
  for (let i = 0; i < totalPages; i++) {
    const nearCurrent = Math.abs(i - page) <= 1;
    if (i === 0 || i === totalPages - 1 || nearCurrent) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "gap") {
      pages.push("gap");
    }
  }
  return pages;
}

const buttonClass =
  "min-w-[36px] h-[36px] px-3 rounded-[8px] fred-med text-[13px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Search results pages"
      className="flex flex-col items-center gap-3 mt-8"
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page === 0}
          className={`${buttonClass} bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--secondary)]/10`}
        >
          &larr; Prev
        </button>

        {visiblePages(page, totalPages).map((p, idx) =>
          p === "gap" ? (
            <span
              key={`gap-${idx}`}
              className="px-1 fred-med text-[13px] text-[var(--muted)]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={disabled}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p + 1}`}
              className={`${buttonClass} ${
                p === page
                  ? "bg-[var(--secondary)] text-[var(--on-secondary)]"
                  : "bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--secondary)]/10"
              }`}
            >
              {p + 1}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page + 1 >= totalPages}
          className={`${buttonClass} bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--secondary)]/10`}
        >
          Next &rarr;
        </button>
      </div>

      <p className="fred-med text-[13px] text-[var(--muted)]">
        Page {page + 1} of {totalPages}
      </p>
    </nav>
  );
}
