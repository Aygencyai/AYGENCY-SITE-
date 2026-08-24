interface EdenProgressProps {
  current: number;
  total: number;
}

export default function EdenProgress({ current, total }: EdenProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full" aria-live="polite">
      <div className="mb-3 flex items-end justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
          Question {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ghost-dim">
          {percentage}%
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Questionnaire progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        className="h-1 overflow-hidden rounded-full bg-surface-light"
      >
        <div
          className="h-full rounded-full bg-cyan transition-[width] duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
