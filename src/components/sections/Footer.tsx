"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { ArrowUp, Instagram, Mail, Shield, FileText, X } from "lucide-react";
import { NAV_ITEMS } from "@/data/siteContent";

export function Footer() {
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-charcoal text-cream pt-20 pb-12 border-t border-charcoal-border relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-flame/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Tasteful Final Brand Statement */}
        <div className="pb-16 border-b border-charcoal-border/70 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-flame block mb-2">
              The PlatePlay Ethos
            </span>
            <p className="font-display font-black text-3xl sm:text-5xl text-cream tracking-tight">
              Life&apos;s too short for boring plans.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:text-white hover:bg-cream/10 hover:border-flame transition-all"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Main Footer Grid */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo theme="dark" size="lg" />
            <p className="text-flame font-display font-bold text-base tracking-wide">
              Cook · Create · Connect
            </p>
            <p className="text-xs sm:text-sm text-cream/60 max-w-sm leading-relaxed">
              An upcoming experiential cooking and social entertainment studio where groups reserve a private kitchen, create incredible food together, and make unforgettable memories.
            </p>
            <div className="pt-2 text-xs text-cream/40">
              One booking = One private kitchen = One group.
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-sm text-cream uppercase tracking-wider">
              Interactive Studios
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-cream/70">
              <li>
                <Link
                  href="/book"
                  className="hover:text-flame transition-colors inline-block font-bold text-flame"
                >
                  Request a Session (Beta) &rarr;
                </Link>
              </li>
              <li>
                <Link
                  href="/booking-status"
                  className="hover:text-flame transition-colors inline-block text-cream/90"
                >
                  Check Booking Status
                </Link>
              </li>
              <li>
                <Link
                  href="/build-your-plate"
                  className="hover:text-flame transition-colors inline-block"
                >
                  Build Your Plate Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/kitchens"
                  className="hover:text-flame transition-colors inline-block"
                >
                  Kitchen Explorer
                </Link>
              </li>
              <li>
                <Link
                  href="/mystery-box"
                  className="hover:text-flame transition-colors inline-block"
                >
                  Mystery Box Mini-Game
                </Link>
              </li>
              <li>
                <Link
                  href="/plan-experience"
                  className="hover:text-flame transition-colors inline-block"
                >
                  Experience Planner
                </Link>
              </li>
              <li>
                <a
                  href="/#waitlist"
                  className="text-cream/50 hover:text-flame transition-colors inline-block pt-1"
                >
                  Join Waitlist
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Official Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-sm text-cream uppercase tracking-wider">
              Connect & Updates
            </h4>
            <p className="text-xs text-cream/70 leading-relaxed">
              Follow our journey as we prepare to launch our inaugural pilot kitchen studio.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-xs text-cream/80 bg-charcoal-400 p-2.5 rounded-xl border border-charcoal-border">
                <Instagram className="w-4 h-4 text-flame shrink-0" />
                <span className="font-mono text-cream/70">@plateplay.official</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream/10 text-cream/60 ml-auto">
                  Launch Placeholder
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-cream/80 bg-charcoal-400 p-2.5 rounded-xl border border-charcoal-border">
                <Mail className="w-4 h-4 text-flame shrink-0" />
                <span className="font-mono text-cream/70">hello@plateplay.com</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream/10 text-cream/60 ml-auto">
                  Inquiries
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 border-t border-charcoal-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>© 2026 PlatePlay. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModal("privacy")}
              className="hover:text-cream transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setLegalModal("terms")}
              className="hover:text-cream transition-colors underline-offset-4 hover:underline"
            >
              Terms of Experience
            </button>
            <span>·</span>
            <Link
              href="/admin"
              className="hover:text-cream transition-colors text-cream/40 hover:underline"
            >
              Admin Portal
            </Link>
            <span>·</span>
            <span className="text-cream/40">v0.3 Booking Beta</span>
          </div>
        </div>
      </div>

      {/* Legal Information Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="w-full max-w-lg bg-cream text-charcoal rounded-3xl p-6 sm:p-8 shadow-2xl border border-cream-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLegalModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-cream-200 text-charcoal/70 hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-2xl mb-4 text-charcoal">
              {legalModal === "privacy" ? "Privacy Policy" : "Terms of Experience"}
            </h3>

            <div className="text-xs sm:text-sm text-charcoal/80 space-y-3 leading-relaxed max-h-80 overflow-y-auto pr-2">
              {legalModal === "privacy" ? (
                <>
                  <p>
                    <strong>Data Protection:</strong> PlatePlay respects your privacy. Information submitted on our waitlist (such as your name, email, and preferences) is stored securely and solely used for pilot communications, studio previews, and booking announcements.
                  </p>
                  <p>
                    <strong>No Third-Party Sharing:</strong> We do not sell, rent, or lease your personal contact details to any third-party advertisers or data brokers.
                  </p>
                  <p>
                    <strong>Unsubscribe Anytime:</strong> Every pilot announcement email includes a 1-click unsubscribe option.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Experiential Concept:</strong> PlatePlay is an interactive social entertainment concept in active preparation. v0.1 website content represents planned pilot offerings and does not constitute a binding immediate restaurant reservation.
                  </p>
                  <p>
                    <strong>Kitchen Safety:</strong> Group bookings will require adherence to basic studio safety protocols, allergen notifications, and respectful equipment usage.
                  </p>
                  <p>
                    <strong>Pricing Confirmation:</strong> Stated prices for PLAY (₹599), CREATE (₹799), and UNLEASH (₹1,099) are introductory pilot estimates and subject to final slot confirmation.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-cream-300 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-5 py-2 rounded-full bg-burgundy text-white text-xs font-bold hover:bg-burgundy-hover"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

