"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid admin email or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-cream flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-charcoal-400 p-8 sm:p-10 rounded-3xl border border-charcoal-border shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo theme="dark" size="md" />
          </div>
          <h1 className="font-display font-black text-2xl text-cream tracking-tight">
            Pilot Portal Access
          </h1>
          <p className="text-xs text-cream/60">
            Sign in to manage kitchen slots, review requests, and pilot operations.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-flame/10 border border-flame/30 text-flame text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cream/70 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@plateplay.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal border border-charcoal-border text-cream text-sm focus:outline-none focus:ring-2 focus:ring-flame"
              />
              <Mail className="w-4 h-4 text-cream/40 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cream/70 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal border border-charcoal-border text-cream text-sm focus:outline-none focus:ring-2 focus:ring-flame"
              />
              <Lock className="w-4 h-4 text-cream/40 absolute left-3.5 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="flame"
            size="lg"
            className="w-full justify-center mt-2 shadow-lg"
            rightIcon={
              loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )
            }
          >
            {loading ? "Authenticating..." : "Sign In to Admin"}
          </Button>
        </form>

        <div className="pt-4 border-t border-charcoal-border/60 text-center">
          <p className="text-[11px] text-cream/40">
            Authorized studio operations personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-charcoal flex items-center justify-center text-cream">Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}

