"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 24,
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2
        className={cn("animate-spin text-primary", className)}
        size={size}
      />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}
