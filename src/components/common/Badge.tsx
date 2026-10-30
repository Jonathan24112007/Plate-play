import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "flame" | "burgundy" | "softpink" | "charcoal" | "cream" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "flame",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    flame: "bg-flame/10 text-flame border border-flame/20",
    burgundy: "bg-burgundy/10 text-burgundy border border-burgundy/20",
    softpink: "bg-softpink/30 text-burgundy border border-softpink",
    charcoal: "bg-charcoal text-cream border border-charcoal/20",
    cream: "bg-cream-200 text-charcoal border border-cream-300",
    outline: "border border-charcoal/20 text-charcoal/80",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 font-medium rounded-full",
    md: "text-xs px-3 py-1 font-semibold rounded-full",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 uppercase tracking-wider",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

