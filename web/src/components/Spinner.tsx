type SpinnerProps = {
  label?: string;
};

// Centered loading spinner with an optional caption underneath
export default function Spinner({ label }: SpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      role="status"
    >
      <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--secondary)] rounded-full animate-spin" />
      {label && (
        <p className="fred-med text-[14px] text-[var(--muted)] mt-4">{label}</p>
      )}
    </div>
  );
}
