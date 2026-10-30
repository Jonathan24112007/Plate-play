"use client";

import React from "react";
import { Experience } from "@/data/experiences";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Check, Clock, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  experience: Experience;
  onExplore: (experience: Experience) => void;
  onSelectForWaitlist: (id: string) => void;
}

export function ExperienceCard({
  experience,
  onExplore,
  onSelectForWaitlist,
}: ExperienceCardProps) {
  const isSignature = experience.isSignature;

  return (
    <div
      className={cn(
        "rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between relative group",
        isSignature
          ? "bg-gradient-to-b from-burgundy-subtle via-cream-50 to-cream border-2 border-burgundy shadow-card lg:-translate-y-3"
          : "bg-cream-50 border border-cream-300/90 shadow-soft hover:shadow-card hover:border-flame/40"
      )}
    >
      {/* Signature Ribbon / Badge */}
      {isSignature && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full bg-burgundy text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-flame" />
            Signature Experience
          </span>
        </div>
      )}

      <div>
        {/* Code & Duration */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold tracking-wider text-charcoal/50">
            {experience.code}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-charcoal/70 bg-cream-200/80 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-flame" />
            <span>{experience.duration}</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-4">
          <h3 className="font-display font-black text-3xl sm:text-4xl text-charcoal tracking-tight">
            {experience.name}
          </h3>
          <p className="text-sm font-bold text-flame uppercase tracking-wider mt-0.5">
            {experience.subtitle}
          </p>
        </div>

        {/* Price block */}
        <div className="mb-6 pb-6 border-b border-cream-300/80">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-medium text-charcoal/60">Starting at</span>
            <span className="font-display font-black text-3xl sm:text-4xl text-burgundy">
              {experience.priceFormatted.split("/")[0]}
            </span>
            <span className="text-xs text-charcoal/60">/ person</span>
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1 italic">
            *Pilot introductory price
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-charcoal/80 leading-relaxed mb-6 font-medium">
          {experience.description}
        </p>

        {/* Feature list */}
        <div className="space-y-3 mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50">
            What&apos;s Included
          </p>
          {experience.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal/80">
              <span
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  isSignature ? "bg-burgundy text-white" : "bg-flame/15 text-flame"
                )}
              >
                <Check className="w-2.5 h-2.5" />
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2.5 pt-4 border-t border-cream-200">
        <Button
          variant={isSignature ? "burgundy" : "flame"}
          size="md"
          className="w-full justify-center group/btn"
          onClick={() => onExplore(experience)}
          rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
        >
          Explore {experience.name}
        </Button>

        {experience.id === "create" && (
          <Button
            href="/build-your-plate"
            variant="outline-burgundy"
            size="sm"
            className="w-full justify-center text-xs font-bold"
            rightIcon={<Sparkles className="w-3.5 h-3.5 text-flame" />}
          >
            Launch Build Your Plate Studio
          </Button>
        )}

        <button
          onClick={() => onSelectForWaitlist(experience.id)}
          className="w-full py-1 text-center text-xs text-charcoal/60 hover:text-burgundy transition-colors font-medium focus-visible:outline-none"
        >
          Reserve early access slot &rarr;
        </button>
      </div>
    </div>
  );
}

