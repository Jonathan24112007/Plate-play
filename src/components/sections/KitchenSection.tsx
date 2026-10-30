"use client";

import React from "react";
import { KITCHENS } from "@/data/kitchens";
import { KitchenCard } from "./KitchenCard";
import { Sparkles, Compass, AlertCircle } from "lucide-react";

export function KitchenSection() {
  const pilotKitchens = KITCHENS.filter((k) => k.isPilot);
  const futureKitchens = KITCHENS.filter((k) => !k.isPilot);

  return (
    <section
      id="kitchens"
      className="py-24 md:py-32 bg-cream relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-flame/10 text-flame text-xs font-bold tracking-widest uppercase mb-4">
            Themed Cooking Studios
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.1] mb-6">
            Different kitchens. <br className="hidden sm:inline" />
            <span className="text-flame">Endless possibilities.</span>
          </h2>
          <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed">
            Every PlatePlay kitchen is custom-engineered with commercial-grade equipment, premium ventilation, and aesthetic prep stations calibrated for group collaboration.
          </p>
        </div>

        {/* Priority 1: Planned Pilot Kitchens (More Prominent) */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-flame animate-pulse" />
            <h3 className="font-display font-bold text-xl text-charcoal tracking-tight">
              Inaugural Pilot Kitchens
            </h3>
            <span className="text-xs text-charcoal/50 font-medium">
              — Planned for first launch
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pilotKitchens.map((kitchen) => (
              <KitchenCard key={kitchen.id} kitchen={kitchen} isLarge={true} />
            ))}
          </div>
        </div>

        {/* Priority 2: Future Kitchen Concepts */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-burgundy" />
            <h3 className="font-display font-bold text-xl text-charcoal tracking-tight">
              Future Studio Roadmap
            </h3>
            <span className="text-xs text-charcoal/50 font-medium">
              — Expanding post-pilot
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {futureKitchens.map((kitchen) => (
              <KitchenCard key={kitchen.id} kitchen={kitchen} />
            ))}
          </div>
        </div>

        {/* Explore All Kitchens CTA */}
        <div className="flex justify-center mb-14">
          <a
            href="/kitchens"
            className="px-6 py-3 rounded-full bg-cream-50 border-2 border-burgundy/20 text-burgundy hover:bg-burgundy hover:text-white font-display font-bold text-sm transition-all shadow-sm flex items-center gap-2 group"
          >
            <span>Explore All 4 Kitchen Concepts</span>
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>

        {/* Notice of concept & location */}
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-cream-100 border border-cream-300 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-charcoal/70">
          <AlertCircle className="w-4 h-4 text-burgundy shrink-0" />
          <span>
            Kitchen studios are currently in pilot design and site development. Not currently open for walk-ins or immediate reservations.
          </span>
        </div>
      </div>
    </section>
  );
}

