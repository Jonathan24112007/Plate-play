"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Sliders,
  ChevronDown,
  Compass,
  Lightbulb,
  FileQuestion,
  CalendarDays,
  Search,
  ChefHat,
  Box,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinkItem {
  label: string;
  href: string;
  isExternalPage?: boolean;
  isPill?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

const MAIN_NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/#hero" },
  { label: "Experiences", href: "/#experiences" },
  { label: "Kitchens", href: "/kitchens", isExternalPage: true },
  { label: "Build Your Plate", href: "/build-your-plate", isExternalPage: true },
  { label: "Mystery Box", href: "/mystery-box", isExternalPage: true },
];

const MORE_NAV_LINKS: NavLinkItem[] = [
  { label: "The Concept", href: "/#concept", icon: Lightbulb },
  { label: "How It Works", href: "/#how-it-works", icon: Compass },
  { label: "Plan Experience", href: "/plan-experience", isExternalPage: true, icon: Sliders },
  { label: "Book a Session", href: "/book", isExternalPage: true, icon: CalendarDays },
  { label: "Check Status", href: "/booking-status", isExternalPage: true, icon: Search },
];

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const pathname = usePathname();
  const moreRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isDarkBackground = !isScrolled && pathname.startsWith("/mystery-box");

  // Check if any link in the "More" dropdown is currently active
  const isMoreActive = MORE_NAV_LINKS.some((link) => {
    if (link.isExternalPage) return pathname.startsWith(link.href);
    if (isHome) return activeSection === link.href.replace("/#", "");
    return false;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (isHome) {
        const sections = [
          "hero",
          "concept",
          "how-it-works",
          "experiences",
          "kitchens",
          "about",
          "waitlist",
        ];
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom >= 120) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Click outside listener for "More" dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMoreDropdownOpen(false);
      }
    };

    if (moreDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [moreDropdownOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  const handleAnchorClick = (href: string) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    if (href.startsWith("/#") && isHome) {
      const id = href.replace("/#", "");
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-cream/92 backdrop-blur-md py-2.5 sm:py-3 shadow-soft border-b border-cream-300/70"
          : "bg-transparent py-3.5 sm:py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Three-Zone Layout: Left Logo | Center Nav | Right CTA */}
        <div className="flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="shrink-0 flex items-center">
            <Logo size="md" theme={isDarkBackground ? "dark" : "light"} />
          </div>

          {/* Zone 2: Desktop Navigation Pill Container */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 bg-cream-50/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-cream-300 shadow-sm"
          >
            {MAIN_NAV_LINKS.map((link) => {
              const isRouteActive =
                link.isExternalPage && pathname.startsWith(link.href);
              const isAnchorActive =
                isHome &&
                !link.isExternalPage &&
                activeSection === link.href.replace("/#", "");
              const isActive = isRouteActive || isAnchorActive;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => handleAnchorClick(link.href)}
                  className={cn(
                    "relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame flex items-center gap-1.5 whitespace-nowrap shrink-0",
                    isActive
                      ? "text-burgundy font-bold bg-burgundy/10 shadow-sm"
                      : "text-charcoal/80 hover:text-burgundy hover:bg-black/5"
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* "More" Dropdown Trigger & Popover */}
            <div className="relative shrink-0" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen((prev) => !prev)}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
                aria-label="More navigation links"
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame flex items-center gap-1 whitespace-nowrap",
                  isMoreActive
                    ? "text-burgundy font-bold bg-burgundy/10 shadow-sm"
                    : "text-charcoal/80 hover:text-burgundy hover:bg-black/5"
                )}
              >
                <span>More</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200 text-charcoal/60",
                    moreDropdownOpen && "rotate-180 text-burgundy"
                  )}
                />
              </button>

              {/* Popover Menu */}
              {moreDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-cream-300 shadow-xl p-2 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal/45 px-3 py-1.5">
                    Explore & Operations
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {MORE_NAV_LINKS.map((item) => {
                      const Icon = item.icon || Sparkles;
                      const isItemActive = item.isExternalPage
                        ? pathname.startsWith(item.href)
                        : isHome && activeSection === item.href.replace("/#", "");

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => handleAnchorClick(item.href)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                            isItemActive
                              ? "bg-burgundy text-white font-bold"
                              : "text-charcoal/80 hover:text-burgundy hover:bg-cream-100"
                          )}
                        >
                          <Icon className={cn("w-3.5 h-3.5 shrink-0", isItemActive ? "text-white" : "text-flame")} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Primary CTA Button (Right) & Session Status */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {session ? (
              <Link
                href={(session.user as any)?.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 border border-cream-300 text-xs font-bold text-burgundy transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{(session.user as any)?.role === "ADMIN" ? "Admin" : "Dashboard"}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold text-charcoal/80 hover:text-burgundy px-2.5 py-1.5 rounded-full hover:bg-black/5 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Button
              href="/book"
              variant="flame"
              size="sm"
              className="h-9 px-4 text-xs font-bold shadow-sm whitespace-nowrap"
              rightIcon={
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              }
            >
              Request a Session
            </Button>
          </div>

          {/* Mobile Right Controls: Quick Build Pill & Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/build-your-plate"
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap transition-colors",
                isDarkBackground
                  ? "bg-flame/20 text-flame border border-flame/40"
                  : "bg-flame/10 text-flame border border-flame/20"
              )}
            >
              <Sliders className="w-3 h-3" />
              <span>Build</span>
            </Link>

            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 rounded-xl active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame",
                isDarkBackground
                  ? "text-cream hover:bg-white/10"
                  : "text-charcoal hover:bg-cream-200"
              )}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "fixed inset-0 top-[60px] bg-cream/98 backdrop-blur-xl z-40 lg:hidden transition-all duration-300 flex flex-col justify-between p-6 overflow-y-auto",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        )}
      >
        <div className="flex flex-col gap-5 pt-2">
          {/* Main Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-charcoal/50 px-3 pb-1">
              Main Experiences
            </div>
            {MAIN_NAV_LINKS.map((link) => {
              const isRouteActive =
                link.isExternalPage && pathname.startsWith(link.href);
              const isAnchorActive =
                isHome &&
                !link.isExternalPage &&
                activeSection === link.href.replace("/#", "");
              const isActive = isRouteActive || isAnchorActive;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => handleAnchorClick(link.href)}
                  className={cn(
                    "px-4 py-3 rounded-2xl text-base font-display font-semibold transition-all flex items-center justify-between",
                    isActive
                      ? "bg-burgundy text-white font-bold"
                      : link.isPill
                      ? "bg-flame/10 text-flame border border-flame/20 font-bold"
                      : "text-charcoal hover:bg-cream-200 active:bg-cream-300"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {link.isPill && <Sliders className="w-4 h-4 text-flame" />}
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </Link>
              );
            })}
          </div>

          {/* More Links in Mobile */}
          <div className="space-y-1 pt-2 border-t border-cream-200">
            <div className="text-[11px] font-mono uppercase tracking-wider text-charcoal/50 px-3 pb-1">
              Explore & Operations
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {MORE_NAV_LINKS.map((item) => {
                const Icon = item.icon || Sparkles;
                const isItemActive = item.isExternalPage
                  ? pathname.startsWith(item.href)
                  : isHome && activeSection === item.href.replace("/#", "");

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => handleAnchorClick(item.href)}
                    className={cn(
                      "px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5",
                      isItemActive
                        ? "bg-burgundy text-white font-bold"
                        : "bg-cream-100 text-charcoal hover:bg-cream-200"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isItemActive ? "text-white" : "text-flame")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA & Account Block */}
        <div className="pt-6 mt-6 border-t border-cream-300/70 flex flex-col gap-3">
          {session ? (
            <div className="p-3 rounded-2xl bg-cream-100/80 border border-cream-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-burgundy/10 text-burgundy font-bold text-xs flex items-center justify-center">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-charcoal block leading-tight">
                    {session.user?.name || "Account"}
                  </span>
                  <Link
                    href={(session.user as any)?.role === "ADMIN" ? "/admin" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] text-flame font-semibold hover:underline"
                  >
                    {(session.user as any)?.role === "ADMIN" ? "Admin Portal →" : "View Dashboard →"}
                  </Link>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="p-1.5 rounded-lg text-charcoal/50 hover:text-burgundy"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-white border border-cream-300 text-charcoal text-xs font-bold text-center hover:bg-cream-100"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-burgundy text-white text-xs font-bold text-center hover:bg-burgundy/90 shadow-sm"
              >
                Register
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-charcoal/70 px-1">
            <Sparkles className="w-3.5 h-3.5 text-flame" />
            <span>Pilot kitchens open for beta booking requests</span>
          </div>
          <Button
            href="/book"
            variant="flame"
            size="lg"
            className="w-full justify-center shadow-lg h-12 text-sm font-bold"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => setMobileMenuOpen(false)}
          >
            Request a Session
          </Button>
          <Link
            href="/booking-status"
            onClick={() => setMobileMenuOpen(false)}
            className="text-center text-xs font-semibold text-burgundy hover:underline py-1"
          >
            Check Existing Booking Status &rarr;
          </Link>
        </div>
      </div>
    </header>
  );
}
