"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { DishVisualizer } from "@/components/studio/DishVisualizer";
import {
  PIZZERIA_CONFIG,
  MASALA_KITCHEN_CONFIG,
  DishType,
} from "@/data/dishes";
import {
  Sparkles,
  Flame,
  ChefHat,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Info,
  Sliders,
  Utensils,
  Lock,
  Bookmark,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

function BuildYourPlateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State: Kitchen
  const [kitchenId, setKitchenId] = useState<"pizzeria" | "masala-kitchen">(
    (searchParams.get("kitchen") as any) === "masala-kitchen"
      ? "masala-kitchen"
      : "pizzeria"
  );

  const activeConfig =
    kitchenId === "pizzeria" ? PIZZERIA_CONFIG : MASALA_KITCHEN_CONFIG;

  // State: Dish
  const [selectedDish, setSelectedDish] = useState<DishType>(
    activeConfig.dishes[0]
  );

  // State: Customization
  const [base, setBase] = useState<string>(activeConfig.dishes[0].defaultBase);
  const [sauce, setSauce] = useState<string>(activeConfig.dishes[0].defaultSauce);
  const [cheeseOrMain, setCheeseOrMain] = useState<string>(
    activeConfig.dishes[0].defaultCheeseOrMain
  );
  const [toppings, setToppings] = useState<string[]>(
    activeConfig.dishes[0].defaultToppings
  );
  const [dishName, setDishName] = useState<string>("My Fire Creation");

  // Feedback states
  const [copied, setCopied] = useState(false);

  // Sync when kitchen changes
  useEffect(() => {
    const config =
      kitchenId === "pizzeria" ? PIZZERIA_CONFIG : MASALA_KITCHEN_CONFIG;
    setSelectedDish(config.dishes[0]);
    setBase(config.dishes[0].defaultBase);
    setSauce(config.dishes[0].defaultSauce);
    setCheeseOrMain(config.dishes[0].defaultCheeseOrMain);
    setToppings(config.dishes[0].defaultToppings);
    setDishName(
      kitchenId === "pizzeria" ? "My Fire Artisan Pizza" : "My Spiced Signature Bowl"
    );
  }, [kitchenId]);

  // Handle dish switch within kitchen
  const handleSelectDish = (dish: DishType) => {
    setSelectedDish(dish);
    setBase(dish.defaultBase);
    setSauce(dish.defaultSauce);
    setCheeseOrMain(dish.defaultCheeseOrMain);
    setToppings(dish.defaultToppings);
    setDishName(`My Custom ${dish.name}`);
  };

  // Toggle toppings
  const handleToggleTopping = (toppingId: string) => {
    setToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  // Reset to default
  const handleReset = () => {
    setBase(selectedDish.defaultBase);
    setSauce(selectedDish.defaultSauce);
    setCheeseOrMain(selectedDish.defaultCheeseOrMain);
    setToppings(selectedDish.defaultToppings);
    setDishName(`My Custom ${selectedDish.name}`);
  };

  // Copy creation summary
  const handleCopy = () => {
    const baseObj = activeConfig.bases.find((b) => b.id === base)?.name;
    const sauceObj = activeConfig.saucesOrFlavours.find((s) => s.id === sauce)?.name;
    const mainObj = activeConfig.cheeseOrMains.find((c) => c.id === cheeseOrMain)?.name;
    const toppingNames = toppings
      .map((t) => activeConfig.toppingsOrExtras.find((opt) => opt.id === t)?.name)
      .filter(Boolean)
      .join(", ");

    const text = `🍳 PlatePlay Custom Creation: "${dishName}"
Studio: ${activeConfig.name}
Dish Concept: ${selectedDish.name}
Base: ${baseObj}
Sauce / Flavour: ${sauceObj}
Cheese / Main: ${mainObj}
Toppings / Extras: ${toppingNames || "None"}
Created in PlatePlay Interactive Studio (v0.2)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#FF6B3D", "#8C1538", "#FFB8C8"],
      });
    } catch (e) {}
  };

  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Save creation to customer profile
  const handleSaveCreation = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/build-your-plate");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/creations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName,
          kitchenId,
          dishId: selectedDish.id,
          base,
          sauce,
          cheeseOrMain,
          toppings,
          dietaryTags: activeDietary,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#8C1538", "#FF6B3D"],
        });
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Plan this experience -> Transfer to /plan-experience
  const handlePlanExperience = () => {
    const params = new URLSearchParams({
      package: "create",
      kitchen: kitchenId,
      dishId: selectedDish.id,
      dishName: dishName,
      base: base,
      sauce: sauce,
      cheeseOrMain: cheeseOrMain,
      toppings: toppings.join(","),
    });

    router.push(`/plan-experience?${params.toString()}`);
  };

  // Gather active dietary tags
  const activeDietary = Array.from(
    new Set([
      ...(activeConfig.bases.find((b) => b.id === base)?.dietary || []),
      ...(activeConfig.saucesOrFlavours.find((s) => s.id === sauce)?.dietary || []),
      ...(activeConfig.cheeseOrMains.find((c) => c.id === cheeseOrMain)?.dietary || []),
    ])
  );

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-flame/10 text-flame text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Studio · CREATE Demo</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.08] mb-4">
              Build Your <span className="text-flame">Plate.</span>
            </h1>
            <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed font-medium max-w-2xl mx-auto">
              Experiment with artisan crusts, simmered sauces, and fresh toppings. Design your group&apos;s custom dish and transfer it directly into your session plan.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-charcoal/60 bg-cream-100 px-3 py-1 rounded-full border border-cream-300">
              <Info className="w-3.5 h-3.5 text-burgundy" />
              <span>Illustrative digital concept engine · Not a static venue menu</span>
            </div>
          </div>

          {/* STEP A: Choose Kitchen Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setKitchenId("pizzeria")}
              className={cn(
                "px-5 py-2.5 rounded-full font-display font-bold text-sm transition-all flex items-center gap-2 border shadow-sm",
                kitchenId === "pizzeria"
                  ? "bg-flame text-white border-flame shadow-glow/30"
                  : "bg-cream-100 text-charcoal/80 border-cream-300 hover:border-flame/40"
              )}
            >
              <Flame className="w-4 h-4" />
              <span>Pizzeria Studio</span>
              <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Pilot
              </span>
            </button>

            <button
              onClick={() => setKitchenId("masala-kitchen")}
              className={cn(
                "px-5 py-2.5 rounded-full font-display font-bold text-sm transition-all flex items-center gap-2 border shadow-sm",
                kitchenId === "masala-kitchen"
                  ? "bg-burgundy text-white border-burgundy shadow-burgundyGlow/30"
                  : "bg-cream-100 text-charcoal/80 border-cream-300 hover:border-burgundy/40"
              )}
            >
              <ChefHat className="w-4 h-4" />
              <span>Masala Kitchen</span>
              <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Pilot
              </span>
            </button>

            {/* Coming Later Roadmaps */}
            <div className="flex items-center gap-2 opacity-60 cursor-not-allowed">
              <span className="px-4 py-2 rounded-full bg-cream-200 text-charcoal/50 text-xs font-semibold border border-cream-300 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>The Wok (Post-Pilot)</span>
              </span>
              <span className="px-4 py-2 rounded-full bg-cream-200 text-charcoal/50 text-xs font-semibold border border-cream-300 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Bakehouse (Post-Pilot)</span>
              </span>
            </div>
          </div>

          {/* STEP B: Choose Dish within Kitchen */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50 text-center mb-3">
              Step 1: Choose Your Canvas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeConfig.dishes.map((dish) => {
                const isSelected = selectedDish.id === dish.id;
                return (
                  <button
                    key={dish.id}
                    onClick={() => handleSelectDish(dish)}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all duration-200",
                      isSelected
                        ? "bg-cream-50 border-flame shadow-md ring-2 ring-flame/30"
                        : "bg-cream-100/70 border-cream-300 hover:border-charcoal/30 hover:bg-cream-50"
                    )}
                  >
                    <span className="font-display font-bold text-base text-charcoal block">
                      {dish.name}
                    </span>
                    <span className="text-xs text-charcoal/60 block mt-1 line-clamp-2">
                      {dish.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN STUDIO STAGE: Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
            {/* Left Column (Desktop) / Top Column (Mobile): Live Dish Visualizer */}
            <div className="lg:col-span-6 sticky lg:top-28">
              <div className="rounded-3xl bg-charcoal p-6 sm:p-8 shadow-2xl border border-charcoal-border flex flex-col items-center justify-between text-cream relative overflow-hidden">
                <div className="w-full flex items-center justify-between pb-4 border-b border-cream/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-flame animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-flame">
                      Live Studio Canvas
                    </span>
                  </div>
                  <span className="text-xs text-cream/60 font-mono">
                    SVG Layered Engine
                  </span>
                </div>

                {/* SVG Visualizer */}
                <DishVisualizer
                  kitchenId={kitchenId}
                  dishId={selectedDish.id}
                  base={base}
                  sauce={sauce}
                  cheeseOrMain={cheeseOrMain}
                  toppings={toppings}
                  dishName={dishName}
                />

                {/* Dish Name Input Field */}
                <div className="w-full mt-6 pt-4 border-t border-cream/10">
                  <label
                    htmlFor="dishNameInput"
                    className="block text-[11px] font-mono uppercase tracking-wider text-cream/70 mb-1.5"
                  >
                    Name Your Masterpiece:
                  </label>
                  <input
                    id="dishNameInput"
                    type="text"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="e.g. Midnight Fire Pizza"
                    maxLength={32}
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-400 border border-cream/20 text-cream font-display font-bold text-sm focus:outline-none focus:border-flame focus:ring-1 focus:ring-flame"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Customization Controls */}
            <div className="lg:col-span-6 space-y-8">
              {/* Control Group 1: Base */}
              <div className="p-6 rounded-3xl bg-cream-50 border border-cream-300 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-charcoal">
                      1. Select Base
                    </h3>
                    <p className="text-xs text-charcoal/60">
                      The foundation of your creation
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-burgundy">
                    1 Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeConfig.bases.map((opt) => {
                    const isSelected = base === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setBase(opt.id)}
                        className={cn(
                          "p-3 rounded-2xl border text-left transition-all",
                          isSelected
                            ? "bg-burgundy text-white border-burgundy shadow-sm"
                            : "bg-cream text-charcoal border-cream-300 hover:border-burgundy/30"
                        )}
                      >
                        <span className="font-display font-bold text-xs block">
                          {opt.name}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] block mt-1 line-clamp-2",
                            isSelected ? "text-cream/80" : "text-charcoal/60"
                          )}
                        >
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Control Group 2: Sauce / Flavour */}
              <div className="p-6 rounded-3xl bg-cream-50 border border-cream-300 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-charcoal">
                      2. Choose Sauce & Gravy
                    </h3>
                    <p className="text-xs text-charcoal/60">
                      House simmered aromatics
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-flame">
                    1 Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeConfig.saucesOrFlavours.map((opt) => {
                    const isSelected = sauce === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSauce(opt.id)}
                        className={cn(
                          "p-3 rounded-2xl border text-left transition-all",
                          isSelected
                            ? "bg-flame text-white border-flame shadow-sm"
                            : "bg-cream text-charcoal border-cream-300 hover:border-flame/30"
                        )}
                      >
                        <span className="font-display font-bold text-xs block">
                          {opt.name}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] block mt-1 line-clamp-2",
                            isSelected ? "text-cream/80" : "text-charcoal/60"
                          )}
                        >
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Control Group 3: Cheese / Mains */}
              <div className="p-6 rounded-3xl bg-cream-50 border border-cream-300 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-charcoal">
                      {kitchenId === "pizzeria"
                        ? "3. Choose Cheese Blend"
                        : "3. Choose Main Filling"}
                    </h3>
                    <p className="text-xs text-charcoal/60">
                      Primary melt & protein layer
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-charcoal/70">
                    1 Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeConfig.cheeseOrMains.map((opt) => {
                    const isSelected = cheeseOrMain === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCheeseOrMain(opt.id)}
                        className={cn(
                          "p-3 rounded-2xl border text-left transition-all",
                          isSelected
                            ? "bg-charcoal text-cream border-charcoal shadow-sm"
                            : "bg-cream text-charcoal border-cream-300 hover:border-charcoal/30"
                        )}
                      >
                        <span className="font-display font-bold text-xs block">
                          {opt.name}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] block mt-1 line-clamp-2",
                            isSelected ? "text-cream/80" : "text-charcoal/60"
                          )}
                        >
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Control Group 4: Toppings & Extras (Multi-select) */}
              <div className="p-6 rounded-3xl bg-cream-50 border border-cream-300 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-charcoal">
                      4. Add Fresh Toppings & Extras
                    </h3>
                    <p className="text-xs text-charcoal/60">
                      Mix and match as many as you like
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-burgundy">
                    {toppings.length} Active
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeConfig.toppingsOrExtras.map((opt) => {
                    const isSelected = toppings.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleTopping(opt.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border",
                          isSelected
                            ? "bg-burgundy text-white border-burgundy shadow-sm"
                            : "bg-cream text-charcoal/80 border-cream-300 hover:border-flame/40"
                        )}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: opt.color || "#FF6B3D" }}
                        />
                        <span>{opt.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* STEP F: Creation Summary & Action Footer Bar */}
          <div className="rounded-3xl bg-gradient-to-r from-cream-100 via-cream-50 to-cream-200 border-2 border-burgundy/20 p-6 sm:p-8 shadow-card">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left flex-1">
                <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-burgundy text-white text-xs font-bold uppercase tracking-wider">
                    {activeConfig.name}
                  </span>
                  <span className="text-xs font-bold text-flame">
                    {selectedDish.name}
                  </span>
                  <span className="text-charcoal/30">|</span>
                  <span className="font-display font-black text-lg text-charcoal">
                    &ldquo;{dishName}&rdquo;
                  </span>
                </div>

                <p className="text-xs text-charcoal/70 leading-relaxed">
                  <strong>Selected:</strong> Base:{" "}
                  {activeConfig.bases.find((b) => b.id === base)?.name} · Sauce:{" "}
                  {activeConfig.saucesOrFlavours.find((s) => s.id === sauce)?.name} · Main:{" "}
                  {activeConfig.cheeseOrMains.find((c) => c.id === cheeseOrMain)?.name} · Toppings:{" "}
                  {toppings.length > 0
                    ? toppings
                        .map(
                          (t) =>
                            activeConfig.toppingsOrExtras.find((opt) => opt.id === t)?.name
                        )
                        .join(", ")
                    : "None"}
                </p>

                {/* Dietary Tags */}
                {activeDietary.length > 0 && (
                  <div className="flex items-center justify-center lg:justify-start gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-bold text-charcoal/50 uppercase">
                      Profile:
                    </span>
                    {activeDietary.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cream-200 text-charcoal/80 border border-cream-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Working Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-3 rounded-full border border-charcoal/20 text-charcoal hover:bg-cream-200 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-burgundy/30 bg-cream text-burgundy hover:bg-burgundy/10 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied!" : "Copy My Creation"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveCreation}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-burgundy/30 bg-white text-burgundy hover:bg-burgundy/5 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {savedSuccess ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5 text-burgundy" />
                  )}
                  <span>{savedSuccess ? "Saved to Profile!" : "Save Dish"}</span>
                </button>

                <Button
                  variant="flame"
                  size="md"
                  onClick={handlePlanExperience}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-md"
                >
                  Plan This Experience
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BuildYourPlatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center font-display font-bold text-burgundy text-lg">
            Loading Studio...
          </div>
        </div>
      }
    >
      <BuildYourPlateContent />
    </Suspense>
  );
}

