"use client";

import React, { useEffect } from "react";
import { Experience } from "@/data/experiences";
import { Button } from "@/components/common/Button";
import {
  X,
  Clock,
  Users,
  CheckCircle2,
  Utensils,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceModalProps {
  experience: Experience | null;
  onClose: () => void;
  onSelectExperience: (id: string) => void;
}

export function ExperienceModal({
  experience,
  onClose,
  onSelectExperience,
}: ExperienceModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (experience) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [experience, onClose]);

  if (!experience) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-cream-50 rounded-3xl shadow-2xl border border-cream-300 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cream-100 to-cream-200/70 border-b border-cream-300 relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-cream-50 border border-charcoal/15 flex items-center justify-center text-charcoal/70 hover:text-charcoal hover:bg-cream-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
              {experience.code}
            </span>
            {experience.badge && (
              <span className="px-2.5 py-0.5 rounded-full bg-burgundy text-white text-[10px] font-bold uppercase tracking-wider">
                {experience.badge}
              </span>
            )}
          </div>

          <h3 className="font-display font-black text-3xl sm:text-4xl text-charcoal mb-1">
            {experience.name}{" "}
            <span className="text-flame font-semibold text-2xl sm:text-3xl">
              · {experience.subtitle}
            </span>
          </h3>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-charcoal/80 mt-3">
            <div className="flex items-center gap-1.5 font-bold text-burgundy">
              <span>Introductory:</span>
              <span className="text-base font-extrabold text-charcoal">
                {experience.priceFormatted}
              </span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-flame" />
              <span>{experience.duration}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/50 mb-2">
              Overview
            </h4>
            <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed">
              {experience.description}
            </p>
          </div>

          {/* Sample Dishes / Concepts */}
          <div className="p-4 rounded-2xl bg-cream border border-cream-300">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4 text-flame" />
              <h4 className="font-display font-bold text-sm text-charcoal">
                Example Culinary Creations
              </h4>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-charcoal/80">
              {experience.sampleDishes.map((dish, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-flame shrink-0" />
                  <span>{dish}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Included Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/50 mb-3">
              Included in this experience
            </h4>
            <div className="space-y-2">
              {experience.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-charcoal/80">
                  <CheckCircle2 className="w-4 h-4 text-flame shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing transparency note */}
          <div className="p-3.5 rounded-xl bg-flame/10 border border-flame/20 flex items-start gap-2.5 text-xs text-charcoal/80">
            <Info className="w-4 h-4 text-flame shrink-0 mt-0.5" />
            <p>
              <strong>Introductory pricing note:</strong> All stated prices are pilot introductory rates and subject to final slot confirmation. Custom ingredients for UNLEASH require feasibility review.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-cream-100 border-t border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-charcoal/60 text-center sm:text-left">
            Ready to cook this? Join early access or plan your private session.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            {experience.id === "create" && (
              <Button
                href="/build-your-plate"
                variant="outline-burgundy"
                size="md"
                className="w-full sm:w-auto text-xs"
                rightIcon={<Sparkles className="w-3.5 h-3.5 text-flame" />}
              >
                Customize in Studio
              </Button>
            )}
            <Button
              variant="flame"
              size="md"
              className="w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                onSelectExperience(experience.id);
                onClose();
              }}
            >
              Waitlist for {experience.name}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

