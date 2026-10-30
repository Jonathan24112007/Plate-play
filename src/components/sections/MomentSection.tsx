"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Music, HeartHandshake, Smile, Flame } from "lucide-react";
import { Button } from "@/components/common/Button";

export function MomentSection() {
  const moments = [
    {
      icon: Smile,
      title: "The Blooper Reel",
      desc: "When the dough gets tossed too high or someone adds double the garlic—and everyone breaks into laughter.",
    },
    {
      icon: Music,
      title: "Your Kitchen, Your Aux",
      desc: "Connect to the studio speakers. Play your road trip playlist or disco hits while sizzling your signature plate.",
    },
    {
      icon: HeartHandshake,
      title: "Shared Triumph",
      desc: "Lifting the cloche, plating the dish, taking that first steaming bite, and realizing: you actually made this.",
    },
  ];

  return (
    <section className="py-24 md:py-36 bg-charcoal text-cream relative overflow-hidden">
      {/* Cinematic ambient glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-burgundy/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-flame/20 blur-[140px] rounded-full pointer-events-none" />

      {/* Subtle organic noise or grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#FFF7F0 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Storyteller Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream/10 border border-cream/15 backdrop-blur-md text-xs font-semibold text-flame uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-flame" />
            <span>The PlatePlay Philosophy</span>
          </div>
        </div>

        {/* Hero Narrative Headline */}
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-cream tracking-tight leading-[1.08] mb-6">
            The best memories aren&apos;t ordered. <br />
            <span className="text-flame">They&apos;re made.</span>
          </h2>
          <p className="font-display text-xl sm:text-2xl text-cream/90 font-medium max-w-2xl mx-auto leading-relaxed">
            &ldquo;Flour on your hands. Your favourite people beside you. A recipe that might turn out perfectly, or become the funniest story of the night.&rdquo;
          </p>
        </div>

        {/* Editorial Cinematic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Visual: Intimate group cooking photo */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/11] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-2 border-cream/15 group">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85"
                alt="Friends gathered around a warm culinary table sharing fresh food"
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

              {/* In-image caption tag */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-mono font-bold text-flame tracking-wider uppercase block mb-1">
                  Unscripted Connection
                </span>
                <p className="font-display font-bold text-lg sm:text-xl text-cream">
                  No awkward silences. Cooking turns everyone into collaborators.
                </p>
              </div>
            </div>

            {/* Overlapping Floating Quote Badge */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 max-w-xs bg-cream-50 text-charcoal p-5 rounded-2xl shadow-2xl border-2 border-flame/30">
              <p className="text-xs font-display font-bold text-burgundy italic">
                &ldquo;You don&apos;t remember what you had for dinner 3 months ago. You always remember the night you made pizza together.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Narrative Breakdown */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {moments.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-cream-50/5 border border-cream/10 backdrop-blur-sm hover:border-flame/40 hover:bg-cream-50/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-xl bg-flame/20 flex items-center justify-center text-flame">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-display font-bold text-lg text-cream">
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-cream/70 leading-relaxed pl-13">
                    {m.desc}
                  </p>
                </div>
              );
            })}

            <div className="pt-4">
              <Button
                href="#waitlist"
                variant="cream"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<Flame className="w-4 h-4 text-flame" />}
              >
                Experience It First
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

