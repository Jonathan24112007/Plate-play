"use client";

import React from "react";
import { Sparkles, Heart, Lightbulb, Users2, Compass } from "lucide-react";

export function AboutSection() {
  const pillars = [
    {
      icon: Users2,
      title: "Creating Together",
      desc: "Cooking isn't just about nutrition—it's one of the oldest social rituals on earth. We design spaces that bring people out of their screens and into collaborative joy.",
    },
    {
      icon: Lightbulb,
      title: "Freedom to Experiment",
      desc: "No rigid etiquette or culinary pretension. Whether you follow a guided classic or invent a bold new sauce combination, the kitchen is your creative sandbox.",
    },
    {
      icon: Heart,
      title: "Connecting Through Food",
      desc: "Shared hands-on activities build deeper bonds than sitting across a quiet restaurant table. You share the heat, the laughter, and the pride of creation.",
    },
    {
      icon: Compass,
      title: "Memories Made, Not Ordered",
      desc: "Life's best stories rarely happen when a waiter brings a pre-made plate. They happen when someone accidentally adds too much spice and everyone laughs together.",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-bold tracking-widest uppercase mb-4">
            Our Purpose
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.1] mb-6">
            We believe food should be{" "}
            <span className="text-burgundy">an experience.</span>
          </h2>

          {/* Tagline Showcase */}
          <div className="inline-block py-2 px-6 rounded-full bg-flame/10 border border-flame/20 mb-6">
            <span className="font-display font-extrabold text-base sm:text-lg text-flame tracking-wider uppercase">
              Cook · Create · Connect
            </span>
          </div>

          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed max-w-2xl mx-auto">
            PlatePlay is being developed as an experiential cooking and social entertainment studio. We believe modern gatherings deserve more than passive dining or generic hangouts.
          </p>
        </div>

        {/* 4 Brand Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-cream-50 border border-cream-300 shadow-soft hover:shadow-card hover:border-burgundy/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-burgundy/10 text-burgundy flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-charcoal mb-3">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-cream-200">
                  <span className="text-[11px] font-mono font-bold text-burgundy uppercase tracking-wider">
                    Pillar 0{idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Brand Manifesto Quote Block */}
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cream-100 via-cream-50 to-cream-200 border border-cream-300 text-center">
          <p className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-charcoal leading-snug">
            &ldquo;One booking. One private kitchen. Your group. <br className="hidden sm:inline" />
            No culinary degree required—just an appetite for fun.&rdquo;
          </p>
          <span className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-flame">
            The PlatePlay Promise
          </span>
        </div>
      </div>
    </section>
  );
}

