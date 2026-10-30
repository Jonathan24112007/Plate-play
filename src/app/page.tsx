"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ConceptSection } from "@/components/sections/ConceptSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ExperiencesSection } from "@/components/sections/ExperiencesSection";
import { KitchenSection } from "@/components/sections/KitchenSection";
import { MomentSection } from "@/components/sections/MomentSection";
import { MysteryBoxSection } from "@/components/sections/MysteryBoxSection";
import { WaitlistSection } from "@/components/sections/WaitlistSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  const [selectedExperience, setSelectedExperience] = useState<string>("create");

  const handleSelectExperience = (id: string) => {
    setSelectedExperience(id);
    const waitlistEl = document.getElementById("waitlist");
    if (waitlistEl) {
      waitlistEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col">
      {/* SECTION 1: Sticky Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* SECTION 2: Cinematic Hero */}
        <HeroSection />

        {/* SECTION 3: The Concept */}
        <ConceptSection />

        {/* SECTION 4: How PlatePlay Works */}
        <HowItWorksSection />

        {/* SECTION 5: The Three Experiences */}
        <ExperiencesSection
          onSelectExperienceForWaitlist={handleSelectExperience}
        />

        {/* SECTION 6: Explore The Kitchens */}
        <KitchenSection />

        {/* SECTION 7: The PlatePlay Moment */}
        <MomentSection />

        {/* SECTION 8: Mystery Box Teaser */}
        <MysteryBoxSection />

        {/* SECTION 9: Early Access / Waitlist */}
        <WaitlistSection
          selectedExperience={selectedExperience}
          onExperienceChange={(id) => setSelectedExperience(id)}
        />

        {/* SECTION 10: About PlatePlay */}
        <AboutSection />

        {/* SECTION 11: FAQ */}
        <FAQSection />
      </main>

      {/* SECTION 12: Footer */}
      <Footer />
    </div>
  );
}

