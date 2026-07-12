import { Badge } from "@/components/ui/badge";

export type StatusVariant = 
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let variant: StatusVariant = "default";
  
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "AVAILABLE":
    case "COMPLETED":
      variant = "success"; // Assuming you extend shadcn badge with these or handle via classes
      break;
    case "IN_USE":
    case "IN_PROGRESS":
    case "ON_TRIP":
    case "DISPATCHED":
      variant = "default";
      break;
    case "IN_SHOP":
    case "SUSPENDED":
    case "EXPIRED_LICENSE":
    case "RETIRED":
    case "CANCELLED":
      variant = "destructive";
      break;
    case "DRAFT":
      variant = "secondary";
      break;
    default:
      variant = "outline";
  }

  // Fallback map since shadcn default doesn't have success/warning
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "text-foreground",
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
  };

  return (
    <Badge variant={variant === "success" || variant === "warning" ? "default" : variant} className={variantStyles[variant as keyof typeof variantStyles]}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
