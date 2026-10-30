"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/common/Button";
import {
  ChefHat,
  Users,
  Flame,
  ArrowDown,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

export function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col justify-between overflow-hidden bg-cream"
    >
      {/* Subtle organic background gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-flame/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-burgundy/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-softpink/20 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Decorative dotted pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(#211A19 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Concept Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center lg:justify-start mb-6"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cream-50 border border-burgundy/15 shadow-sm text-xs font-semibold text-burgundy">
            <span className="flex h-2 w-2 rounded-full bg-flame animate-ping shrink-0" />
            <span className="font-display tracking-wide uppercase text-[11px] whitespace-nowrap">
              Coming Soon · Experiential Cooking Studios
            </span>
            <span className="text-charcoal/30">|</span>
            <span className="text-charcoal/70 hidden sm:inline whitespace-nowrap">
              Private Kitchens for Groups
            </span>
          </div>
        </motion.div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* Left Column: Expressive Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-charcoal leading-[1.06] text-balance mb-6"
            >
              DON&apos;T JUST EAT IT.{" "}
              <br className="hidden sm:inline" />
              <span className="relative inline-block text-flame">
                MAKE IT.
                {/* Handcrafted underline brush accent */}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-burgundy/20"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C50 3 150 2 197 8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-3 max-w-xl mb-8"
            >
              <p className="font-display text-lg sm:text-xl font-semibold text-burgundy">
                Your people. Your kitchen. Your creation.
              </p>
              <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed">
                Book a private kitchen, cook something amazing, and turn an
                ordinary outing into a story worth sharing.
              </p>
            </motion.div>

            {/* CTAs with Consistent Heights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              <Button
                variant="flame"
                size="lg"
                className="w-full sm:w-auto group shadow-lg h-12 px-7 text-sm font-bold whitespace-nowrap"
                onClick={() => scrollTo("experiences")}
                rightIcon={
                  <UtensilsCrossed className="w-4 h-4 transition-transform group-hover:rotate-45" />
                }
              >
                Explore Experiences
              </Button>
              <Button
                href="/build-your-plate"
                variant="outline-burgundy"
                size="lg"
                className="w-full sm:w-auto group h-12 px-7 text-sm font-bold whitespace-nowrap"
                rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
              >
                Try Build Your Plate
              </Button>
            </motion.div>

            {/* Key Value Proposition Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 pt-7 border-t border-cream-300/80 grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg"
            >
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1.5 text-burgundy font-bold text-xs sm:text-sm">
                  <Users className="w-4 h-4 text-flame shrink-0" />
                  <span className="whitespace-nowrap">Private Room</span>
                </div>
                <span className="text-[11px] sm:text-xs text-charcoal/60 mt-0.5">
                  Only your group
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1.5 text-burgundy font-bold text-xs sm:text-sm">
                  <ChefHat className="w-4 h-4 text-flame shrink-0" />
                  <span className="whitespace-nowrap">Zero Stress</span>
                </div>
                <span className="text-[11px] sm:text-xs text-charcoal/60 mt-0.5">
                  Prep & clean included
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1.5 text-burgundy font-bold text-xs sm:text-sm">
                  <Flame className="w-4 h-4 text-flame shrink-0" />
                  <span className="whitespace-nowrap">From ₹599</span>
                </div>
                <span className="text-[11px] sm:text-xs text-charcoal/60 mt-0.5">
                  Introductory rates
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Photo Composition with Predictable Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-5 relative w-full flex justify-center lg:justify-end"
          >
            {/* Visual Container with Controlled Maximum Width */}
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-[430px] xl:max-w-[460px]">
              {/* Primary Main Visual Card */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-cream-50 bg-cream-200">
                <Image
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85"
                  alt="Friends laughing and cooking together in an experiential kitchen"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
                {/* Subtle protective gradient for caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent pointer-events-none" />

                {/* Bottom Photo Caption Tag (Clear of any overlapping card) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white z-10 pointer-events-none">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-flame text-[10px] font-bold tracking-wide uppercase">
                      Experience Preview
                    </span>
                    <span className="text-xs text-cream/90 font-medium">One Private Kitchen</span>
                  </div>
                  <p className="font-display text-sm sm:text-base font-semibold text-cream leading-snug">
                    Laugh, roll the dough, and plate like pros.
                  </p>
                </div>
              </div>

              {/* Floating Card 1: Artisanal Pizzeria Detail
                  - Desktop/Tablet (sm+): Absolute positioning on left, strictly ABOVE caption zone (bottom-24).
                  - Mobile (<sm): Neatly placed beneath the photo without negative margins.
              */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-4 sm:mt-0 sm:absolute sm:bottom-24 md:bottom-26 lg:bottom-24 sm:-left-4 md:-left-6 lg:-left-7 xl:-left-8 w-full max-w-[240px] sm:w-48 lg:w-50 rounded-2xl overflow-hidden shadow-xl border-4 border-cream-50 bg-cream-100 z-20 mx-auto sm:mx-0"
              >
                <div className="relative aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
                    alt="Handcrafted pizza fresh from the oven"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="p-2.5 bg-cream-50">
                  <p className="text-[11px] font-bold text-burgundy truncate">
                    Pizzeria Studio Concept
                  </p>
                  <p className="text-[10px] text-charcoal/60">
                    Hand-stretch & flame bake
                  </p>
                </div>
              </motion.div>

              {/* Floating Pill 2: Brand Tagline
                  - Mobile (<sm): Inset top-right inside the visual to avoid screen clipping.
                  - Desktop/Tablet (sm+): Floats cleanly on top-right edge with balanced offset.
              */}
              <motion.div
                initial={{ opacity: 0, x: 15, y: -15 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute top-3 right-3 sm:-top-4 sm:-right-4 lg:-right-4 xl:-right-6 bg-charcoal/95 backdrop-blur-md text-cream px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl border border-cream/15 flex items-center gap-2 z-20"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-flame animate-spin shrink-0" style={{ animationDuration: "6s" }} />
                <div>
                  <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-flame uppercase whitespace-nowrap">
                    Cook · Create · Connect
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-cream/70 whitespace-nowrap">
                    Zero mundane dinners
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="mt-10 md:mt-12 flex justify-center">
        <button
          onClick={() => scrollTo("concept")}
          aria-label="Scroll to concept section"
          className="group flex flex-col items-center gap-1.5 text-xs text-charcoal/50 hover:text-burgundy transition-colors focus-visible:outline-none"
        >
          <span className="font-medium tracking-wider uppercase text-[10px]">
            Discover The Concept
          </span>
          <div className="w-8 h-8 rounded-full border border-charcoal/20 flex items-center justify-center group-hover:border-flame group-hover:bg-flame/10 transition-all">
            <ArrowDown className="w-3.5 h-3.5 text-charcoal/60 group-hover:text-flame animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
}
