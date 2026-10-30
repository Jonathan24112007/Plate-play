"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Utensils } from "lucide-react";

interface DishVisualizerProps {
  kitchenId: "pizzeria" | "masala-kitchen";
  dishId: string;
  base: string;
  sauce: string;
  cheeseOrMain: string;
  toppings: string[];
  dishName: string;
}

export function DishVisualizer({
  kitchenId,
  dishId,
  base,
  sauce,
  cheeseOrMain,
  toppings,
  dishName,
}: DishVisualizerProps) {
  const isPizzaKitchen = kitchenId === "pizzeria";
  const isGarlicBread = dishId === "cheesy-garlic-bread";
  const isWrap = dishId === "masala-wrap";

  // Color mappings for base crust
  const baseColors: Record<string, { fill: string; stroke: string; texture: string }> = {
    classic: { fill: "#E8C28A", stroke: "#C99B61", texture: "#D9A86E" },
    "thin-crust": { fill: "#D9A86E", stroke: "#B37E46", texture: "#C59357" },
    "whole-wheat": { fill: "#A87A4F", stroke: "#7D5531", texture: "#8F643B" },
    rice: { fill: "#F7F3E8", stroke: "#E2DAC4", texture: "#EEE5CE" },
    "roti-wrap": { fill: "#DAB57E", stroke: "#BD9357", texture: "#C89F64" },
    "millet-bowl": { fill: "#CBB38B", stroke: "#AA8E61", texture: "#BA9F73" },
  };

  // Color mappings for sauces
  const sauceColors: Record<string, string> = {
    tomato: "#D43827",
    "spicy-tomato": "#B82216",
    "creamy-herb": "#8FA361",
    "mild-masala": "#D66324",
    "tangy-tomato": "#C03A2B",
    "creamy-spiced": "#D48C46",
  };

  // Color mappings for cheese / mains
  const cheeseColors: Record<string, string> = {
    mozzarella: "#F7F5EB",
    "cheddar-blend": "#F5A623",
    none: "transparent",
    paneer: "#FFF8EA",
    chickpeas: "#D4A359",
    "mixed-vegetables": "#788E44",
  };

  const currentBase = baseColors[base] || baseColors.classic;
  const currentSauce = sauceColors[sauce] || "#D43827";
  const currentCheese = cheeseColors[cheeseOrMain] || "#F7F5EB";

  // Pre-calculated organic positions for toppings on circular pizza
  const toppingCoordinates = [
    { x: 190, y: 150, rot: 15 },
    { x: 260, y: 165, rot: 45 },
    { x: 310, y: 220, rot: -30 },
    { x: 290, y: 290, rot: 60 },
    { x: 240, y: 340, rot: 10 },
    { x: 170, y: 320, rot: -45 },
    { x: 140, y: 240, rot: 80 },
    { x: 220, y: 230, rot: -15 },
    { x: 175, y: 195, rot: 35 },
    { x: 255, y: 275, rot: -60 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[480px] mx-auto flex items-center justify-center p-4">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-4 rounded-full bg-radial-flame blur-2xl opacity-60 pointer-events-none" />

      {/* SVG Canvas Stage */}
      <svg
        viewBox="0 0 450 450"
        className="w-full h-full drop-shadow-2xl select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wood Board Texture */}
          <radialGradient id="boardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#2A2220" />
            <stop offset="100%" stopColor="#1A1413" />
          </radialGradient>

          {/* Crust 3D bevel */}
          <radialGradient id="crustBevel" cx="45%" cy="40%" r="55%">
            <stop offset="75%" stopColor={currentBase.fill} />
            <stop offset="95%" stopColor={currentBase.texture} />
            <stop offset="100%" stopColor={currentBase.stroke} />
          </radialGradient>

          {/* Cheese melt sheen */}
          <radialGradient id="cheeseMelt" cx="48%" cy="45%" r="50%">
            <stop offset="0%" stopColor={currentCheese} stopOpacity="0.95" />
            <stop offset="85%" stopColor={currentCheese} stopOpacity="0.9" />
            <stop offset="100%" stopColor={currentCheese} stopOpacity="0.8" />
          </radialGradient>

          {/* Sauce rich gradient */}
          <radialGradient id="sauceSpread" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={currentSauce} />
            <stop offset="90%" stopColor={currentSauce} />
            <stop offset="100%" stopColor="#8A1B10" stopOpacity="0.8" />
          </radialGradient>

          {/* Bowl inner gradient */}
          <radialGradient id="bowlInner" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#3A302E" />
            <stop offset="85%" stopColor="#261F1E" />
            <stop offset="100%" stopColor="#181312" />
          </radialGradient>
        </defs>

        {/* 1. Underlying Prep Board / Plate */}
        <circle cx="225" cy="225" r="215" fill="url(#boardGlow)" stroke="#3D3231" strokeWidth="6" />
        <circle cx="225" cy="225" r="200" fill="none" stroke="#FFFFFF" strokeOpacity="0.04" strokeWidth="2" strokeDasharray="6,6" />

        {/* 2. PIZZERIA MODE */}
        {isPizzaKitchen && !isGarlicBread && (
          <g id="pizza-group">
            {/* Pizza Crust Base */}
            <circle
              cx="225"
              cy="225"
              r="175"
              fill="url(#crustBevel)"
              stroke={currentBase.stroke}
              strokeWidth="5"
            />

            {/* Blistered crust charred air bubbles */}
            <g opacity="0.45">
              <ellipse cx="140" cy="110" rx="14" ry="7" fill="#5E381C" transform="rotate(-30 140 110)" />
              <ellipse cx="320" cy="140" rx="12" ry="6" fill="#5E381C" transform="rotate(25 320 140)" />
              <ellipse cx="350" cy="270" rx="15" ry="8" fill="#5E381C" transform="rotate(70 350 270)" />
              <ellipse cx="180" cy="360" rx="13" ry="6" fill="#5E381C" transform="rotate(-15 180 360)" />
              <ellipse cx="90" cy="250" rx="11" ry="5" fill="#5E381C" transform="rotate(85 90 250)" />
            </g>

            {/* Sauce Layer */}
            <circle
              cx="225"
              cy="225"
              r="150"
              fill="url(#sauceSpread)"
              stroke="#68150D"
              strokeWidth="2"
            />

            {/* Sauce Swirl Organic Details */}
            <path
              d="M 160 210 Q 225 150 280 200 T 250 280 T 170 250"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.15"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Cheese Layer (if not 'none') */}
            {cheeseOrMain !== "none" && (
              <g id="cheese-layer">
                <circle
                  cx="225"
                  cy="225"
                  r="140"
                  fill="url(#cheeseMelt)"
                />
                {/* Toasted golden blistering spots on cheese */}
                <g fill="#D87820" opacity="0.6">
                  <circle cx="180" cy="170" r="7" />
                  <circle cx="280" cy="190" r="9" />
                  <circle cx="240" cy="280" r="8" />
                  <circle cx="160" cy="260" r="6" />
                  <circle cx="270" cy="250" r="7" />
                </g>
              </g>
            )}

            {/* Render Toppings */}
            <g id="toppings-layer">
              {toppings.map((toppingId) => (
                <React.Fragment key={toppingId}>
                  {toppingCoordinates.map((coord, idx) => (
                    <g
                      key={`${toppingId}-${idx}`}
                      transform={`translate(${coord.x}, ${coord.y}) rotate(${coord.rot + idx * 25})`}
                    >
                      {toppingId === "onion" && (
                        <path
                          d="M -16 0 A 16 16 0 0 1 16 0"
                          fill="none"
                          stroke="#B33973"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      )}
                      {toppingId === "capsicum" && (
                        <rect
                          x="-8"
                          y="-8"
                          width="16"
                          height="16"
                          rx="3"
                          fill="#489849"
                          stroke="#2B6B2C"
                          strokeWidth="2"
                        />
                      )}
                      {toppingId === "mushroom" && (
                        <g>
                          <path d="M -10 2 Q 0 -12 10 2 Z" fill="#8D7768" stroke="#5E4E44" strokeWidth="1.5" />
                          <rect x="-3" y="2" width="6" height="7" rx="1.5" fill="#C5B5A8" />
                        </g>
                      )}
                      {toppingId === "sweet-corn" && (
                        <g fill="#F8CD46" stroke="#D19E16" strokeWidth="1">
                          <circle cx="-4" cy="-3" r="3.5" />
                          <circle cx="4" cy="-2" r="3" />
                          <circle cx="0" cy="3" r="3.2" />
                        </g>
                      )}
                      {toppingId === "olives" && (
                        <g>
                          <circle cx="0" cy="0" r="7" fill="#322E2F" />
                          <circle cx="0" cy="0" r="3" fill={currentCheese !== "transparent" ? currentCheese : currentSauce} />
                        </g>
                      )}
                      {toppingId === "paneer" && (
                        <rect
                          x="-9"
                          y="-9"
                          width="18"
                          height="18"
                          rx="2"
                          fill="#FAF6EB"
                          stroke="#D8BA84"
                          strokeWidth="1.5"
                        />
                      )}
                      {toppingId === "jalapenos" && (
                        <g>
                          <circle cx="0" cy="0" r="8" fill="#547834" stroke="#334E1D" strokeWidth="2" />
                          <circle cx="0" cy="0" r="3.5" fill="#759E4C" />
                        </g>
                      )}
                      {toppingId === "basil" && (
                        <path
                          d="M -14 0 C -12 -12 12 -12 14 0 C 12 12 -12 12 -14 0 Z"
                          fill="#2E7D32"
                          stroke="#1B5E20"
                          strokeWidth="1.5"
                        />
                      )}
                    </g>
                  ))}
                </React.Fragment>
              ))}
            </g>
          </g>
        )}

        {/* 2B. CHEESY GARLIC BREAD MODE */}
        {isPizzaKitchen && isGarlicBread && (
          <g id="garlic-bread-group">
            {/* Baguette Slices */}
            {[-70, 0, 70].map((offset, i) => (
              <g key={i} transform={`translate(225, ${225 + offset}) rotate(-12)`}>
                {/* Golden Toast Slice */}
                <ellipse cx="0" cy="0" rx="140" ry="26" fill={currentBase.fill} stroke={currentBase.stroke} strokeWidth="5" />
                {/* Herb butter spread */}
                <ellipse cx="0" cy="0" rx="125" ry="20" fill={currentSauce} opacity="0.85" />
                {/* Melted Cheese */}
                <ellipse cx="0" cy="0" rx="115" ry="16" fill={currentCheese} opacity="0.9" />
                {/* Herb sprinkles */}
                <g fill="#2E7D32" opacity="0.8">
                  <circle cx="-60" cy="-3" r="2.5" />
                  <circle cx="-20" cy="4" r="2" />
                  <circle cx="30" cy="-4" r="2.5" />
                  <circle cx="70" cy="2" r="2" />
                </g>
              </g>
            ))}
          </g>
        )}

        {/* 3. MASALA KITCHEN MODE (BOWL OR WRAP) */}
        {!isPizzaKitchen && !isWrap && (
          <g id="masala-bowl-group">
            {/* Terracotta / Ceramic Bowl Rim */}
            <circle cx="225" cy="225" r="170" fill="url(#bowlInner)" stroke="#594643" strokeWidth="12" />

            {/* Grain Base (Rice or Millet) */}
            <circle cx="225" cy="225" r="145" fill={currentBase.fill} />
            {/* Grain texture specks */}
            <g fill={currentBase.stroke} opacity="0.4">
              <ellipse cx="180" cy="180" rx="5" ry="2" transform="rotate(20 180 180)" />
              <ellipse cx="250" cy="170" rx="5" ry="2" transform="rotate(-30 250 170)" />
              <ellipse cx="220" cy="260" rx="5" ry="2" transform="rotate(45 220 260)" />
              <ellipse cx="160" cy="240" rx="5" ry="2" transform="rotate(-15 160 240)" />
              <ellipse cx="270" cy="230" rx="5" ry="2" transform="rotate(60 270 230)" />
            </g>

            {/* Simmered Gravy Swirl */}
            <path
              d="M 150 200 C 190 140 280 150 300 210 C 310 270 220 310 160 260 Z"
              fill={currentSauce}
              opacity="0.9"
            />

            {/* Main Protein / Vegetable Pieces */}
            <g id="masala-mains">
              {cheeseOrMain === "paneer" && (
                <g fill="#FFF8EA" stroke="#D8BA84" strokeWidth="2">
                  <rect x="180" y="190" width="30" height="30" rx="4" transform="rotate(15 195 205)" />
                  <rect x="235" y="180" width="32" height="32" rx="4" transform="rotate(-20 251 196)" />
                  <rect x="200" y="240" width="30" height="30" rx="4" transform="rotate(35 215 255)" />
                </g>
              )}
              {cheeseOrMain === "chickpeas" && (
                <g fill="#D4A359" stroke="#9E6E27" strokeWidth="1.5">
                  {[
                    { cx: 190, cy: 190 }, { cx: 220, cy: 180 }, { cx: 250, cy: 195 },
                    { cx: 200, cy: 230 }, { cx: 235, cy: 235 }, { cx: 215, cy: 260 },
                  ].map((p, i) => (
                    <circle key={i} cx={p.cx} cy={p.cy} r="10" />
                  ))}
                </g>
              )}
              {cheeseOrMain === "mixed-vegetables" && (
                <g>
                  <circle cx="190" cy="190" r="14" fill="#388E3C" />
                  <rect x="230" y="185" width="22" height="18" rx="4" fill="#E65100" />
                  <circle cx="215" cy="245" r="12" fill="#7CB342" />
                </g>
              )}
            </g>

            {/* Masala Extras */}
            <g id="masala-extras">
              {toppings.includes("onion") && (
                <path d="M 160 200 Q 180 170 210 185" fill="none" stroke="#C4417C" strokeWidth="4" strokeLinecap="round" />
              )}
              {toppings.includes("capsicum") && (
                <rect x="240" y="225" width="20" height="7" rx="3" fill="#489849" transform="rotate(25 250 228)" />
              )}
              {toppings.includes("corn") && (
                <g fill="#F8CD46">
                  <circle cx="170" cy="240" r="4" />
                  <circle cx="180" cy="246" r="3.5" />
                  <circle cx="260" cy="210" r="4" />
                </g>
              )}
              {toppings.includes("herbs") && (
                <g fill="#2E7D32">
                  <path d="M 215 210 Q 225 200 230 210 Q 220 220 215 210 Z" />
                  <path d="M 200 215 Q 195 205 205 205 Q 210 215 200 215 Z" />
                </g>
              )}
              {toppings.includes("yogurt-drizzle") && (
                <path
                  d="M 165 240 Q 210 210 230 250 T 285 220"
                  fill="none"
                  stroke="#F7FAF5"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              )}
            </g>
          </g>
        )}

        {/* 3B. MASALA WRAP MODE */}
        {!isPizzaKitchen && isWrap && (
          <g id="masala-wrap-group">
            {/* Wooden Platter */}
            <ellipse cx="225" cy="225" rx="170" ry="140" fill={currentBase.fill} stroke={currentBase.stroke} strokeWidth="6" transform="rotate(-8 225 225)" />
            {/* Wrap Fold lines */}
            <path d="M 120 180 Q 225 240 330 180" fill="none" stroke="#C59357" strokeWidth="4" />
            {/* Filling Peek */}
            <ellipse cx="225" cy="205" rx="95" ry="35" fill={currentSauce} opacity="0.9" />
            <g fill="#FFF8EA" stroke="#D8BA84" strokeWidth="2">
              <rect x="180" y="190" width="24" height="22" rx="3" transform="rotate(10 192 201)" />
              <rect x="230" y="188" width="26" height="24" rx="3" transform="rotate(-15 243 200)" />
            </g>
            {/* Drizzle & Herbs */}
            <path d="M 160 200 Q 225 215 290 195" fill="none" stroke="#F7FAF5" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
      </svg>

      {/* Floating Tag with Dynamic Dish Name */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-charcoal/90 text-cream px-4 py-2 rounded-2xl shadow-xl border border-cream/15 backdrop-blur-md flex items-center gap-2 max-w-[90%] truncate">
        <Sparkles className="w-4 h-4 text-flame shrink-0 animate-pulse" />
        <span className="font-display font-bold text-xs sm:text-sm truncate">
          {dishName || "Custom Creation"}
        </span>
      </div>
    </div>
  );
}

