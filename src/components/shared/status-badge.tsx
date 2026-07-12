import { cn } from "@/lib/utils";

type StatusType = 
  | "AVAILABLE" 
  | "ON_TRIP" 
  | "IN_SHOP" 
  | "RETIRED" 
  | "OFF_DUTY" 
  | "SUSPENDED"
  | "DRAFT"
  | "DISPATCHED"
  | "COMPLETED"
  | "CANCELLED"
  | "IN_PROGRESS"
  | "EXPIRED_LICENSE"
  | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) return null;
  const normalizedStatus = status.toUpperCase();

  let colorClass = "bg-gray-500/20 text-gray-400"; // Default gray (Retired, Draft, Off Duty)
  let dotClass = "bg-gray-400";

  if (["AVAILABLE", "COMPLETED"].includes(normalizedStatus)) {
    colorClass = "bg-emerald-500/20 text-emerald-400";
    dotClass = "bg-emerald-400";
  } else if (["ON_TRIP", "DISPATCHED", "IN_PROGRESS", "IN_USE"].includes(normalizedStatus)) {
    colorClass = "bg-blue-500/20 text-blue-400";
    dotClass = "bg-blue-400";
  } else if (["IN_SHOP"].includes(normalizedStatus)) {
    colorClass = "bg-amber-500/20 text-amber-400";
    dotClass = "bg-amber-400";
  } else if (["SUSPENDED", "CANCELLED", "EXPIRED_LICENSE"].includes(normalizedStatus)) {
    colorClass = "bg-red-500/20 text-red-400";
    dotClass = "bg-red-400";
  }

  // Format label: "IN_SHOP" -> "In Shop"
  const label = status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const isSpecial = (variant as string) === "success" || (variant as string) === "warning";
  const badgeVariant = (isSpecial ? "default" : variant) as "default" | "secondary" | "destructive" | "outline";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        colorClass,
        className
      )}
    >
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", dotClass)} aria-hidden="true" />
      {label}
    </span>
  );
}
