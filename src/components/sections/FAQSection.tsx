"use client";

import React, { useState } from "react";
import { FAQ_ITEMS } from "@/data/faq";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("is-restaurant");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-cream-50 relative overflow-hidden border-t border-cream-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-bold tracking-widest uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight leading-[1.1] mb-6">
            Frequently Asked <span className="text-burgundy">Questions.</span>
          </h2>

          <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed max-w-xl mx-auto">
            Everything you need to know about the PlatePlay concept, safety, private studios, and upcoming pilot availability.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "bg-cream border-burgundy/40 shadow-soft"
                    : "bg-cream-100/60 border-cream-300 hover:border-flame/30 hover:bg-cream"
                )}
              >
                <button
                  type="button"
                  id={`faq-trigger-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame"
                >
                  <span className="font-display font-bold text-base sm:text-lg text-charcoal">
                    {item.question}
                  </span>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300",
                      isOpen
                        ? "bg-burgundy text-white rotate-180"
                        : "bg-cream-200 text-charcoal/70"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    className="px-6 pb-6 pt-1 text-sm sm:text-base text-charcoal/80 leading-relaxed border-t border-cream-200 animate-in fade-in duration-200"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

