"use client";

export default function ProgressBar({
  completed,
  total,
  showLabel = true,
}: {
  completed: number;
  total: number;
  showLabel?: boolean;
}) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-off-white)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: pct === 100 ? "#4CAF50" : pct > 0 ? "#FFC107" : "var(--color-light-gray)",
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs tabular-nums whitespace-nowrap" style={{ color: "var(--color-gray)" }}>
          {completed}/{total}
        </span>
      )}
    </div>
  );
}
