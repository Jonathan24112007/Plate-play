"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Kitchen } from "@/data/kitchens";
import { Flame, Sparkles, ChefHat, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KitchenCardProps {
  kitchen: Kitchen;
  isLarge?: boolean;
}

export function KitchenCard({ kitchen, isLarge = false }: KitchenCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col justify-between group relative",
        kitchen.isPilot
          ? "bg-cream-50 border-cream-300 shadow-soft hover:shadow-card hover:border-flame/40"
          : "bg-cream-100/60 border-cream-300/80 opacity-95 hover:opacity-100"
      )}
    >
      {/* Image Area with Zoom effect */}
      <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
        <Image
          src={kitchen.image}
          alt={kitchen.imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

        {/* Status Pill Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm inline-flex items-center gap-1.5",
              kitchen.isPilot
                ? "bg-flame text-white border border-white/20"
                : "bg-charcoal/80 text-cream/90 border border-white/10"
            )}
          >
            {kitchen.isPilot ? (
              <Flame className="w-3 h-3 text-white animate-pulse" />
            ) : (
              <Sparkles className="w-3 h-3 text-flame" />
            )}
            <span>{kitchen.status}</span>
          </span>
        </div>

        {/* Floating equipment peek on hover */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-[11px] font-mono tracking-wider text-flame uppercase">
            {kitchen.subtitle}
          </p>
          <h3 className="font-display font-black text-2xl text-cream tracking-tight">
            {kitchen.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* One line summary */}
          <p className="font-display font-semibold text-sm text-burgundy mb-2">
            {kitchen.tagline}
          </p>
          <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed mb-5">
            {kitchen.description}
          </p>

          {/* Highlights tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {kitchen.highlights.map((h, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-cream-200 text-charcoal/80 border border-cream-300"
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Action & Planned equipment line */}
        <div className="pt-4 border-t border-cream-200/80 flex items-center justify-between text-xs text-charcoal/60 gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <ChefHat className="w-3.5 h-3.5 text-flame shrink-0" />
            <span className="truncate">
              Key Gear: {kitchen.equipment.slice(0, 2).join(", ")}
            </span>
          </div>
          {kitchen.isPilot ? (
            <a
              href={`/build-your-plate?kitchen=${kitchen.slug}`}
              className="text-xs font-bold text-flame hover:underline shrink-0 flex items-center gap-1"
            >
              <span>Try in Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <a
              href="/kitchens"
              className="text-[11px] font-semibold text-burgundy hover:underline shrink-0"
            >
              View Roadmap &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

