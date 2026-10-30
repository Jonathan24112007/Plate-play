"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { KITCHENS, Kitchen } from "@/data/kitchens";
import {
  Flame,
  ChefHat,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  UtensilsCrossed,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function KitchensPage() {
  const [filter, setFilter] = useState<"all" | "pilot" | "future">("all");
  const [expandedKitchenId, setExpandedKitchenId] = useState<string | null>(null);

  const filteredKitchens = KITCHENS.filter((k) => {
    if (filter === "pilot") return k.isPilot;
    if (filter === "future") return !k.isPilot;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-flame/10 text-flame text-xs font-bold tracking-widest uppercase mb-3">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Studio Exploration</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.08] mb-4">
              Explore Our <span className="text-burgundy">Kitchens.</span>
            </h1>
            <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed font-medium max-w-2xl mx-auto mb-4">
              Step inside our purpose-built private culinary spaces. Every studio is engineered for group laughter, collaborative cooking, and effortless memory making.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 bg-cream-100 px-3 py-1 rounded-full border border-cream-300">
              <Info className="w-3.5 h-3.5 text-burgundy" />
              <span>Pilot studios in development · Digital customization demos available</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[
              { id: "all", label: "All Kitchen Studios" },
              { id: "pilot", label: "Inaugural Pilots (Live Demos)" },
              { id: "future", label: "Future Concepts" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  filter === tab.id
                    ? "bg-burgundy text-white shadow-sm"
                    : "bg-cream-100 text-charcoal/70 border border-cream-300 hover:border-burgundy/30"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 4 Premium Kitchen Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-16">
            {filteredKitchens.map((kitchen) => {
              const isExpanded = expandedKitchenId === kitchen.id;
              return (
                <div
                  key={kitchen.id}
                  className={cn(
                    "rounded-3xl overflow-hidden border-2 transition-all duration-300 flex flex-col justify-between group",
                    kitchen.isPilot
                      ? "bg-cream-50 border-burgundy/20 shadow-card hover:border-flame/50 hover:shadow-glow/20"
                      : "bg-cream-100/70 border-cream-300 shadow-soft opacity-95"
                  )}
                >
                  {/* Photo with Overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
                    <Image
                      src={kitchen.image}
                      alt={kitchen.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-106"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />

                    {/* Top Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm inline-flex items-center gap-1.5",
                          kitchen.isPilot
                            ? "bg-flame text-white border border-white/20"
                            : "bg-charcoal/80 text-cream border border-white/10"
                        )}
                      >
                        {kitchen.isPilot ? (
                          <Flame className="w-3 h-3 text-white animate-pulse" />
                        ) : (
                          <Lock className="w-3 h-3 text-cream/70" />
                        )}
                        <span>{kitchen.status}</span>
                      </span>
                    </div>

                    {/* Marketing Catchphrase */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs font-mono font-bold tracking-wider text-flame uppercase mb-0.5">
                        {kitchen.heroTagline}
                      </p>
                      <h2 className="font-display font-black text-2xl sm:text-3xl text-cream tracking-tight">
                        {kitchen.name}
                      </h2>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Theme pill */}
                      <div className="inline-block px-3 py-1 rounded-full bg-cream-200 text-charcoal/80 text-xs font-semibold mb-3 border border-cream-300">
                        {kitchen.theme}
                      </div>

                      <p className="text-sm text-charcoal/80 leading-relaxed mb-6 font-medium">
                        {kitchen.description}
                      </p>

                      {/* Example Dishes List */}
                      <div className="mb-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-charcoal/50 block mb-2">
                          Signature Concepts
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/80">
                          {kitchen.exampleDishes.map((dish, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-flame shrink-0" />
                              <span>{dish}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expandable Studio Equipment Details */}
                      {isExpanded && (
                        <div className="p-4 rounded-2xl bg-cream border border-cream-300 mb-6 space-y-2 animate-in fade-in duration-200">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60 block">
                            Key Equipment Setup:
                          </span>
                          <div className="flex flex-wrap gap-1.5 text-xs text-charcoal/70">
                            {kitchen.equipment.map((eq, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-full bg-cream-200 border border-cream-300"
                              >
                                {eq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedKitchenId(isExpanded ? null : kitchen.id)
                        }
                        className="text-xs text-charcoal/60 hover:text-burgundy font-semibold underline-offset-4 hover:underline"
                      >
                        {isExpanded ? "Less Details &uarr;" : "View Studio Gear &darr;"}
                      </button>

                      {kitchen.isPilot ? (
                        <Button
                          href={`/build-your-plate?kitchen=${kitchen.slug}`}
                          variant="flame"
                          size="sm"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Customize in Studio
                        </Button>
                      ) : (
                        <Button
                          href="#waitlist"
                          variant="outline-charcoal"
                          size="sm"
                          rightIcon={<Sparkles className="w-3.5 h-3.5 text-flame" />}
                        >
                          Notify Me at Launch
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Jump Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-charcoal text-cream text-center flex flex-col sm:flex-row items-center justify-between gap-6 border border-charcoal-border">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono font-bold text-flame uppercase tracking-wider">
                Ready to Create?
              </span>
              <h3 className="font-display font-bold text-xl text-cream">
                Try our live interactive customization studio.
              </h3>
              <p className="text-xs text-cream/70">
                Pick your dough, simmered sauces, and fresh toppings in real-time.
              </p>
            </div>
            <Button
              href="/build-your-plate"
              variant="cream"
              size="md"
              rightIcon={<Sliders className="w-4 h-4 text-flame" />}
            >
              Launch Build Your Plate
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

