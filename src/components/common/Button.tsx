"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "flame"
    | "burgundy"
    | "outline-burgundy"
    | "outline-charcoal"
    | "outline-cream"
    | "cream"
    | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "flame",
      size = "md",
      href,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2";

    const variantStyles = {
      flame:
        "bg-flame text-white hover:bg-flame-hover shadow-md hover:shadow-glow/40 border border-transparent",
      burgundy:
        "bg-burgundy text-white hover:bg-burgundy-hover shadow-md hover:shadow-burgundyGlow/30 border border-transparent",
      "outline-burgundy":
        "border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white bg-transparent",
      "outline-charcoal":
        "border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white bg-transparent",
      "outline-cream":
        "border-2 border-cream/80 text-cream hover:bg-cream hover:text-charcoal bg-transparent",
      cream:
        "bg-cream text-charcoal hover:bg-cream-200 shadow-md border border-transparent font-semibold",
      ghost:
        "text-charcoal hover:text-burgundy hover:bg-black/5 bg-transparent",
    };

    const sizeStyles = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-6 py-3 gap-2",
      lg: "text-base px-8 py-4 gap-2.5 font-semibold",
    };

    const content = (
      <>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

