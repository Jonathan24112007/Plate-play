"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Sparkles,
  Timer,
  Lock,
  Unlock,
  RotateCcw,
  Flame,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import confetti from "canvas-confetti";

interface MysteryItem {
  name: string;
  category: string;
  hint: string;
  iconBg: string;
}

const MYSTERY_PRESETS: MysteryItem[][] = [
  [
    { name: "Smoked Truffle Butter", category: "Fat & Richness", hint: "Melt over handmade pasta or charred crust", iconBg: "bg-flame" },
    { name: "Dragonfruit & Yuzu Coulis", category: "Acid & Brightness", hint: "Bright drizzle for savoury or sweet contrast", iconBg: "bg-softpink text-charcoal" },
    { name: "Artisanal Burrata", category: "Cream & Texture", hint: "Tear open fresh at the very last second", iconBg: "bg-cream-100 text-charcoal" },
    { name: "Wildcard: Hot Honey Drizzle", category: "The Twist", hint: "Adds sweet heat to elevate everything", iconBg: "bg-burgundy text-white" },
  ],
  [
    { name: "Black Garlic Paste", category: "Deep Umami", hint: "Incorporate into glaze or pizza sauce", iconBg: "bg-charcoal text-white" },
    { name: "Candied Ginger Crisps", category: "Crunch & Zing", hint: "Texture topper for flatbreads or desserts", iconBg: "bg-flame" },
    { name: "Salted Pistachio Crumble", category: "Nutty Depth", hint: "Crush and sprinkle over warm creations", iconBg: "bg-softpink text-charcoal" },
    { name: "Wildcard: Saffron threads", category: "The Twist", hint: "Bloom in warm milk or stock for gold color", iconBg: "bg-burgundy text-white" },
  ],
];

export function MysteryBoxSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);

  const handleOpenBox = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Trigger festive confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FF6B3D", "#8C1538", "#FFB8C8", "#FFF7F0"],
        });
      } catch (e) {
        // Fallback gracefully if confetti fails
      }
    }
  };

  const handleReset = () => {
    setIsOpen(false);
    setPresetIndex((prev) => (prev + 1) % MYSTERY_PRESETS.length);
  };

  const currentItems = MYSTERY_PRESETS[presetIndex];

  return (
    <section className="py-24 md:py-32 bg-charcoal-400 text-cream relative overflow-hidden border-t border-charcoal-border">
      {/* Background lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-flame/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-flame/20 text-flame border border-flame/30 text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Future Experience Preview</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.1] mb-6">
            Think you can handle <br />
            <span className="text-flame">the mystery?</span>
          </h2>

          <p className="font-display text-lg sm:text-xl text-cream/90 font-medium max-w-xl mx-auto mb-2">
            Surprise ingredients. A ticking clock. Your group&apos;s creativity.
          </p>

          <p className="text-xs sm:text-sm text-cream/60 max-w-lg mx-auto">
            A future adrenaline-pumping experience where your crew unboxes secret culinary wildcards and crafts a showstopping dish against the timer.
          </p>
        </div>

        {/* Interactive Mystery Box Interactive Stage */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-charcoal-200 border-2 border-charcoal-border p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Top Bar with Ticking Clock Concept */}
            <div className="flex items-center justify-between pb-6 border-b border-charcoal-border/70 mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-flame animate-ping" />
                <span className="font-mono text-xs uppercase tracking-wider text-flame font-bold">
                  Challenge Timer Preview
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-base sm:text-lg font-bold text-cream bg-charcoal-400 px-3.5 py-1.5 rounded-xl border border-charcoal-border">
                <Timer className="w-4 h-4 text-flame animate-pulse" />
                <span>45:00</span>
              </div>
            </div>

            {/* Box Interactive Card */}
            {!isOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-4 flex flex-col items-center text-center cursor-pointer group"
                onClick={handleOpenBox}
              >
                <div className="relative mb-6">
                  {/* Glowing Box Icon Container */}
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-charcoal-light to-charcoal border-2 border-flame/40 group-hover:border-flame shadow-glow/30 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                    <Package className="w-14 h-14 text-flame transition-transform group-hover:rotate-6" />
                  </div>
                  <span className="absolute -top-2 -right-2 p-2 rounded-full bg-flame text-white shadow-md">
                    <Lock className="w-4 h-4" />
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl text-cream mb-2 group-hover:text-flame transition-colors">
                  Tap to Unlock the Mystery Box
                </h3>
                <p className="text-xs sm:text-sm text-cream/70 max-w-sm mb-6">
                  See what a sample secret ingredient basket looks like. Are you brave enough to take the culinary gamble?
                </p>

                <Button
                  variant="flame"
                  size="md"
                  rightIcon={<Unlock className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenBox();
                  }}
                >
                  Reveal Mystery Ingredients
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-flame" />
                    <h3 className="font-display font-bold text-xl text-cream">
                      Box Unlocked! Your Secret Basket:
                    </h3>
                  </div>

                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-cream/60 hover:text-flame transition-colors py-1 px-2.5 rounded-lg border border-charcoal-border hover:border-flame/40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Shuffle basket</span>
                  </button>
                </div>

                {/* Unveiled Ingredients Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-2xl bg-charcoal-400 border border-charcoal-border flex items-start gap-3.5 hover:border-flame/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-flame/20 flex items-center justify-center shrink-0 text-flame font-bold font-mono text-sm">
                        0{idx + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-flame block mb-0.5">
                          {item.category}
                        </span>
                        <h4 className="font-display font-bold text-sm text-cream">
                          {item.name}
                        </h4>
                        <p className="text-xs text-cream/60 mt-1">
                          {item.hint}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-charcoal-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-cream/60 text-center sm:text-left">
                    Mystery Box will launch as an exclusive tier during our post-pilot rollout.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                    <Button
                      href="/mystery-box"
                      variant="outline-cream"
                      size="md"
                      className="w-full sm:w-auto text-xs"
                      rightIcon={<Sparkles className="w-3.5 h-3.5 text-flame" />}
                    >
                      Play Mini-Game Studio
                    </Button>
                    <Button
                      href="#waitlist"
                      variant="flame"
                      size="md"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="w-full sm:w-auto"
                    >
                      Get Notified
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

