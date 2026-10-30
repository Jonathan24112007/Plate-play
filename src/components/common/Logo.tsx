import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  theme?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, theme = "light", size = "md" }: LogoProps) {
  const isDark = theme === "dark";

  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link
      href="/"
      aria-label="PlatePlay Homepage"
      className={cn(
        "inline-flex items-center gap-2 group transition-transform duration-200 active:scale-95 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame rounded-lg px-1",
        className
      )}
    >
      {/* Brand Icon: Minimal modern skillet / plate geometric motif */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-burgundy/10 text-burgundy group-hover:bg-burgundy group-hover:text-cream transition-all duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-flame group-hover:text-white transition-colors duration-300"
        >
          {/* Stylized cloche/plate rim + steam spark */}
          <path d="M12 4v2" />
          <path d="M4 18h16" />
          <path d="M5 18a7 7 0 0 1 14 0" />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" />
        </svg>
      </div>

      <span
        className={cn(
          "font-display font-extrabold tracking-tight transition-colors duration-200",
          sizeClasses[size]
        )}
      >
        <span className={isDark ? "text-cream" : "text-burgundy"}>Plate</span>
        <span className="text-flame">Play</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-flame ml-0.5 align-baseline animate-pulse" />
      </span>
    </Link>
  );
}

