"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit request.");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4 selection:bg-burgundy selection:text-white">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-cream-300 shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="font-display font-black text-2xl text-charcoal tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-charcoal/60 mt-1.5">
            Enter your email to receive a secure password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <p className="font-semibold">Reset instructions dispatched!</p>
              <p className="text-emerald-700">
                If an account exists with <strong>{email}</strong>, you will receive an email shortly with next steps.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block text-xs font-bold text-burgundy hover:underline"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-burgundy/10 border border-burgundy/20 text-burgundy text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="burgundy"
              size="lg"
              className="w-full justify-center mt-3"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </Button>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-xs text-charcoal/60 hover:text-burgundy font-semibold"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

