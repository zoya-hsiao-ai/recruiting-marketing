"use client";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  planning: { bg: "#FFF3E0", color: "#E65100", label: "Planning" },
  active: { bg: "#E8F5E9", color: "#2E7D32", label: "Active" },
  completed: { bg: "#E3F2FD", color: "#1565C0", label: "Completed" },
  not_started: { bg: "#FFEBEE", color: "#C62828", label: "Not Started" },
  in_progress: { bg: "#FFF8E1", color: "#F57F17", label: "In Progress" },
  checking: { bg: "#FFF8E1", color: "#F57F17", label: "Checking" },
  confirmed: { bg: "#E8F5E9", color: "#2E7D32", label: "Confirmed" },
  yes: { bg: "#E8F5E9", color: "#2E7D32", label: "Yes" },
  no: { bg: "#FFEBEE", color: "#C62828", label: "No" },
  tbd: { bg: "#FFF8E1", color: "#F57F17", label: "TBD" },
  review: { bg: "#E3F2FD", color: "#1565C0", label: "In Review" },
  approved: { bg: "#E8F5E9", color: "#2E7D32", label: "Approved" },
  submitted: { bg: "#E8F5E9", color: "#1B5E20", label: "Submitted" },
  packed: { bg: "#FFF8E1", color: "#F57F17", label: "Packed" },
  shipped: { bg: "#E3F2FD", color: "#1565C0", label: "Shipped" },
  delivered: { bg: "#E8F5E9", color: "#2E7D32", label: "Delivered" },
};

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.not_started;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
      style={{ background: style.bg, color: style.color }}
    >
      {label || style.label}
    </span>
  );
}
