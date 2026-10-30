"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(
    !token ? "Missing password reset token. Please request a new link." : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-cream-300 shadow-xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size="md" />
        </div>
        <h1 className="font-display font-black text-2xl text-charcoal tracking-tight">
          Create New Password
        </h1>
        <p className="text-xs text-charcoal/60 mt-1.5">
          Enter and confirm your new secure account password.
        </p>
      </div>

      {success ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="font-bold text-sm">Password Updated!</p>
          <p className="text-emerald-700">
            Your password has been reset successfully. Redirecting you to sign in...
          </p>
          <Link
            href="/login"
            className="inline-block font-bold text-burgundy hover:underline pt-2"
          >
            Click here if not redirected
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
              New Password (Min 8 Characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy bg-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !token}
            variant="flame"
            size="lg"
            className="w-full justify-center mt-3 shadow-md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4 selection:bg-burgundy selection:text-white">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-3xl p-8 text-center text-sm text-charcoal/60">
            Loading...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

