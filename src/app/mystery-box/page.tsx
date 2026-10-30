"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import {
  getRandomMysterySet,
  MysteryIngredient,
  MysteryChallenge,
} from "@/data/mysteryBox";
import {
  Package,
  Sparkles,
  Lock,
  Unlock,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Flame,
  HelpCircle,
  Shuffle,
  Lightbulb,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export default function MysteryBoxPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [mysteryData, setMysteryData] = useState<{
    ingredients: MysteryIngredient[];
    challenge: MysteryChallenge;
  }>({
    ingredients: [],
    challenge: { id: "", title: "", prompt: "", focus: "" },
  });

  // Brainstorming Timer (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // User input
  const [imaginaryDishName, setImaginaryDishName] = useState("");
  const [copied, setCopied] = useState(false);

  // Initialize random set on client mount
  useEffect(() => {
    setMysteryData(getRandomMysterySet());
  }, []);

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  // Open Mystery Box
  const handleOpenBox = () => {
    setIsOpen(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#FF6B3D", "#8C1538", "#FFB8C8", "#FFF7F0"],
      });
    } catch (e) {}
  };

  // Reveal Another Box
  const handleRevealAnother = () => {
    setMysteryData(getRandomMysterySet());
    setImaginaryDishName("");
    setTimeLeft(300);
    setIsTimerRunning(false);
    setCopied(false);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#FF6B3D", "#8C1538", "#FFB8C8"],
      });
    } catch (e) {}
  };

  // Timer controls
  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(300);
  };

  // Format timer MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Copy shareable summary
  const handleCopySummary = () => {
    const ingNames = mysteryData.ingredients.map((i) => i.name).join(", ");
    const text = `📦 PlatePlay Mystery Challenge Unlocked!
Challenge: ${mysteryData.challenge.title}
Prompt: "${mysteryData.challenge.prompt}"
Secret Wildcards: ${ingNames}
My Imaginary Dish: "${imaginaryDishName || "Untitled Culinary Experiment"}"

Play the Mystery Box Mini-Game at PlatePlay!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-charcoal-400 text-cream flex flex-col selection:bg-flame selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-flame/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-burgundy/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-flame/20 text-flame border border-flame/30 text-xs font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Brainstorming Mini-Game</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-cream tracking-tight leading-[1.08] mb-4">
              READY FOR <br />
              <span className="text-flame">THE UNKNOWN?</span>
            </h1>

            <p className="font-display text-lg sm:text-xl text-cream/90 font-medium max-w-xl mx-auto mb-3">
              Three mystery ingredients. One creative challenge. What will you make?
            </p>

            <p className="text-xs sm:text-sm text-cream/60 max-w-lg mx-auto">
              A playful culinary imagination game designed for group brainstorming. Crack open the box, unlock wildcards, and sketch out your group&apos;s wildest culinary concept.
            </p>
          </div>

          {/* Interactive Mystery Stage */}
          <div className="bg-charcoal-200 rounded-3xl border-2 border-charcoal-border p-6 sm:p-10 shadow-2xl relative mb-12">
            {!isOpen ? (
              /* Sealed Box State */
              <div
                onClick={handleOpenBox}
                className="py-16 px-4 flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-charcoal-light to-charcoal border-2 border-flame/40 group-hover:border-flame shadow-glow/30 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                    <Package className="w-16 h-16 text-flame transition-transform group-hover:rotate-6" />
                  </div>
                  <span className="absolute -top-3 -right-3 p-2.5 rounded-full bg-flame text-white shadow-md">
                    <Lock className="w-4 h-4" />
                  </span>
                </div>

                <h2 className="font-display font-bold text-2xl sm:text-3xl text-cream mb-2 group-hover:text-flame transition-colors">
                  Tap to Crack Open the Mystery Box
                </h2>
                <p className="text-xs sm:text-sm text-cream/70 max-w-md mb-8">
                  Will you get high-end truffle butter, spicy ghost honey, or tart yuzu coulis? Click to unveil your three random culinary wildcards.
                </p>

                <Button
                  variant="flame"
                  size="lg"
                  rightIcon={<Unlock className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenBox();
                  }}
                >
                  Reveal 3 Wildcard Ingredients
                </Button>
              </div>
            ) : (
              /* Unveiled Challenge Stage */
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Challenge Header & Reshuffle Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-charcoal-border gap-4">
                  <div className="flex items-center gap-2.5 text-center sm:text-left">
                    <span className="p-2 rounded-xl bg-flame/20 text-flame">
                      <Unlock className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-flame block">
                        Challenge Objective
                      </span>
                      <h2 className="font-display font-bold text-xl text-cream">
                        {mysteryData.challenge.title}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={handleRevealAnother}
                    className="flex items-center gap-1.5 text-xs text-cream/70 hover:text-flame transition-colors py-2 px-4 rounded-full border border-charcoal-border hover:border-flame/40 bg-charcoal-400"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Reveal Another Box</span>
                  </button>
                </div>

                {/* Challenge Prompt Box */}
                <div className="p-5 rounded-2xl bg-charcoal-400 border border-charcoal-border flex items-start gap-3.5">
                  <Lightbulb className="w-5 h-5 text-flame shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cream/50 block mb-1">
                      Creative Brief (Focus: {mysteryData.challenge.focus})
                    </span>
                    <p className="font-display text-sm sm:text-base font-semibold text-cream leading-relaxed">
                      &ldquo;{mysteryData.challenge.prompt}&rdquo;
                    </p>
                  </div>
                </div>

                {/* 3 Mystery Ingredients Cards */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cream/50 block mb-3">
                    Your 3 Secret Wildcards:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mysteryData.ingredients.map((ing, idx) => (
                      <div
                        key={ing.id || idx}
                        className="p-5 rounded-2xl bg-charcoal-400 border border-charcoal-border flex flex-col justify-between hover:border-flame/40 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream/10 text-flame font-bold">
                              Wildcard 0{idx + 1}
                            </span>
                            <span className="text-[10px] text-cream/50">
                              {ing.category}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-lg text-cream mb-1">
                            {ing.name}
                          </h3>
                          <p className="text-xs text-cream/60 leading-relaxed mb-3">
                            {ing.flavorProfile}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-charcoal-border/70 text-[11px] text-cream/80 italic">
                          <span className="text-flame font-semibold not-italic">
                            Chef Tip:{" "}
                          </span>
                          {ing.chefHint}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brainstorming Timer & Dish Namer */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-charcoal-border">
                  {/* Timer (5 Mins) */}
                  <div className="lg:col-span-5 p-5 rounded-2xl bg-charcoal-400 border border-charcoal-border flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-flame" />
                        <span className="text-xs font-bold uppercase tracking-wider text-cream">
                          Brainstorming Timer
                        </span>
                      </div>
                      <span className="text-[10px] text-cream/50">Optional</span>
                    </div>

                    <div className="text-center py-2">
                      <span className="font-mono font-black text-4xl sm:text-5xl text-flame tracking-tight">
                        {formatTime(timeLeft)}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        onClick={handleToggleTimer}
                        className="px-4 py-1.5 rounded-full bg-flame text-white text-xs font-bold flex items-center gap-1.5 hover:bg-flame-hover transition-colors"
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>{timeLeft < 300 ? "Resume" : "Start 5 Min"}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleResetTimer}
                        className="p-1.5 rounded-full border border-cream/20 text-cream/70 hover:text-white transition-colors"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Name Your Dish & Share */}
                  <div className="lg:col-span-7 p-5 rounded-2xl bg-charcoal-400 border border-charcoal-border flex flex-col justify-between space-y-4">
                    <div>
                      <label
                        htmlFor="imaginaryDish"
                        className="block text-xs font-bold uppercase tracking-wider text-cream mb-1.5"
                      >
                        Name Your Imaginary Dish:
                      </label>
                      <input
                        id="imaginaryDish"
                        type="text"
                        placeholder="e.g. Saffron Truffle Flatbread Surprise"
                        value={imaginaryDishName}
                        onChange={(e) => setImaginaryDishName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-charcoal-200 border border-cream/20 text-cream font-display font-bold text-sm focus:outline-none focus:border-flame"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-cream/30 text-cream text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-cream/10 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copied ? "Copied!" : "Copy Challenge Summary"}</span>
                      </button>

                      <Button
                        href="/plan-experience?package=create"
                        variant="flame"
                        size="sm"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="w-full sm:w-auto"
                      >
                        Plan an Experience
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legal / Conceptual Disclaimer */}
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-charcoal-200 border border-charcoal-border text-center text-xs text-cream/60">
            <p>
              <strong>Creative Notice:</strong> This is a digital brainstorming mini-game designed for creative inspiration. It does not constitute a real competition, live judging, prizes, or an instruction to cook under time pressure.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

