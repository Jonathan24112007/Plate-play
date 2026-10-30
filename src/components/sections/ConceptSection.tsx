"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Utensils, GraduationCap, Sparkles, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";

export function ConceptSection() {
  const [hoveredCard, setHoveredCard] = useState<string>("plateplay");

  const comparisonData = [
    {
      id: "restaurants",
      badge: "Traditional Dining",
      title: "Restaurants",
      action: "You eat.",
      icon: Utensils,
      summary: "Passive dining where someone else does everything while you check your phone.",
      points: [
        { text: "Wait in queue, order from a fixed menu", isNegative: true },
        { text: "Awkward table spacing & background noise", isNegative: true },
        { text: "Passive entertainment; you just consume", isNegative: true },
      ],
      border: "border-cream-300",
      bg: "bg-cream-50",
    },
    {
      id: "classes",
      badge: "Culinary School",
      title: "Cooking Classes",
      action: "You learn.",
      icon: GraduationCap,
      summary: "Rigid curriculum designed for technical training rather than social bonding.",
      points: [
        { text: "Strict schedules & academic syllabus", isNegative: true },
        { text: "Shared workspace with strangers", isNegative: true },
        { text: "Focus is on technique, not having fun with friends", isNegative: true },
      ],
      border: "border-cream-300",
      bg: "bg-cream-50",
    },
    {
      id: "plateplay",
      badge: "The New Category",
      title: "PlatePlay",
      action: "You create.",
      icon: Sparkles,
      isFeatured: true,
      summary: "An interactive culinary playground built for connection, creativity, and pure social energy.",
      points: [
        { text: "One booking = One 100% private kitchen for your crew", isNegative: false },
        { text: "Creative freedom with guidance & safety on standby", isNegative: false },
        { text: "Ingredients pre-prepped; zero kitchen cleanup for you", isNegative: false },
      ],
      border: "border-burgundy/40 shadow-burgundyGlow/20",
      bg: "bg-gradient-to-b from-burgundy-subtle to-cream-100",
    },
  ];

  return (
    <section id="concept" className="py-24 md:py-32 bg-cream-50 relative overflow-hidden border-t border-cream-200">
      {/* Background accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-bold tracking-widest uppercase mb-4">
            The Concept
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.1] mb-6">
            Going out just got a{" "}
            <span className="text-burgundy">new recipe.</span>
          </h2>
          <p className="text-lg sm:text-xl text-charcoal/80 leading-relaxed font-medium mb-4">
            Why settle for another ordinary outing when you can create something together?
          </p>
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-cream border border-cream-300/80 text-sm sm:text-base text-charcoal/75">
            &ldquo;At PlatePlay, the kitchen is yours, the creativity is yours, and the memories are made together.&rdquo;
          </div>
        </div>

        {/* Editorial 3-Tier Dynamic Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Restaurants & Classes (Compact stacked editorial cards) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {comparisonData
              .filter((c) => !c.isFeatured)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    className={cn(
                      "p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative",
                      item.bg,
                      item.border,
                      hoveredCard === item.id ? "shadow-md scale-[1.01]" : "opacity-90"
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase tracking-wider font-semibold text-charcoal/50">
                        {item.badge}
                      </span>
                      <Icon className="w-5 h-5 text-charcoal/40" />
                    </div>

                    <div className="mb-4">
                      <h3 className="font-display font-bold text-2xl text-charcoal">
                        {item.title}: <span className="text-charcoal/60 font-medium">{item.action}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                        {item.summary}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-cream-300/60">
                      {item.points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-charcoal/60">
                          <XCircle className="w-3.5 h-3.5 text-charcoal/40 shrink-0 mt-0.5" />
                          <span>{pt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Right Column: PlatePlay Signature Hero Card (Large & Prominent) */}
          {comparisonData
            .filter((c) => c.isFeatured)
            .map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-cream border-2 border-burgundy shadow-card relative flex flex-col justify-between overflow-hidden group"
                >
                  {/* Decorative glowing gradient inside card */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-flame/10 rounded-full blur-3xl pointer-events-none -z-0" />
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-burgundy/10 rounded-full blur-3xl pointer-events-none -z-0" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy text-white text-xs font-bold uppercase tracking-wider">
                        <Icon className="w-3.5 h-3.5 text-flame" />
                        <span>The PlatePlay Distinction</span>
                      </div>
                      <span className="text-xs font-bold text-flame uppercase tracking-wider">
                        Experiential Social Dining
                      </span>
                    </div>

                    <div className="mb-6">
                      <span className="text-sm font-semibold text-burgundy tracking-wider uppercase">
                        The Core Distinction
                      </span>
                      <h3 className="font-display font-black text-3xl sm:text-5xl text-charcoal mt-1 mb-3">
                        PlatePlay: <span className="text-flame">You create.</span>
                      </h3>
                      <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    {/* Highlighting PlatePlay perks */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                      <div className="p-4 rounded-2xl bg-white/70 border border-burgundy/15 backdrop-blur-sm">
                        <span className="font-display font-bold text-sm text-burgundy block mb-1">
                          100% Private
                        </span>
                        <p className="text-xs text-charcoal/70">
                          Your squad, your kitchen, your music. Zero strangers.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/70 border border-burgundy/15 backdrop-blur-sm">
                        <span className="font-display font-bold text-sm text-flame block mb-1">
                          Zero Friction
                        </span>
                        <p className="text-xs text-charcoal/70">
                          Pre-portioned artisan ingredients, guidance when needed.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/70 border border-burgundy/15 backdrop-blur-sm">
                        <span className="font-display font-bold text-sm text-burgundy block mb-1">
                          Zero Dishes
                        </span>
                        <p className="text-xs text-charcoal/70">
                          PlatePlay handles all ingredient prep and kitchen cleanup.
                        </p>
                      </div>
                    </div>

                    {/* Point checks */}
                    <div className="space-y-3 pt-2">
                      {item.points.map((pt, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-medium text-charcoal">
                          <CheckCircle2 className="w-5 h-5 text-flame shrink-0" />
                          <span>{pt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 pt-6 border-t border-burgundy/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-charcoal/60 text-center sm:text-left">
                      Pilot kitchens currently in production. Join early access for priority booking.
                    </p>
                    <Button
                      href="#waitlist"
                      variant="burgundy"
                      size="sm"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="shrink-0 w-full sm:w-auto"
                    >
                      Join Priority Waitlist
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

