"use client";

import React, { useState } from "react";
import { EXPERIENCES, Experience } from "@/data/experiences";
import { ExperienceCard } from "./ExperienceCard";
import { ExperienceModal } from "./ExperienceModal";
import { Info, Sparkles } from "lucide-react";

interface ExperiencesSectionProps {
  onSelectExperienceForWaitlist: (id: string) => void;
}

export function ExperiencesSection({
  onSelectExperienceForWaitlist,
}: ExperiencesSectionProps) {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(
    null
  );

  return (
    <section
      id="experiences"
      className="py-24 md:py-32 bg-cream-100/60 relative overflow-hidden border-t border-cream-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-bold tracking-widest uppercase mb-4">
            Curated Formats
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.1] mb-6">
            Three ways to <span className="text-burgundy">play with food.</span>
          </h2>
          <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed">
            Whether you want guided simplicity, open culinary experimentation, or a complete private test kitchen for your secret recipe—there&apos;s a format for your group.
          </p>
        </div>

        {/* 3 Experience Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {EXPERIENCES.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onExplore={(e) => setSelectedExperience(e)}
              onSelectForWaitlist={(id) => onSelectExperienceForWaitlist(id)}
            />
          ))}
        </div>

        {/* Transparent Pricing & Feasibility Notice */}
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-cream border border-cream-300 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-charcoal/70">
          <Info className="w-4 h-4 text-flame shrink-0" />
          <span>
            <strong>Introductory Pilot Notice:</strong> All stated prices are introductory pilot rates and subject to final slot confirmation. UNLEASH custom requests require feasibility review.
          </span>
        </div>
      </div>

      {/* Interactive Detail Modal */}
      <ExperienceModal
        experience={selectedExperience}
        onClose={() => setSelectedExperience(null)}
        onSelectExperience={(id) => onSelectExperienceForWaitlist(id)}
      />
    </section>
  );
}

