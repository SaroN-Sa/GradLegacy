"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap, Sparkles, Shield, Cloud, Globe, KeyRound } from "lucide-react";
import { authService } from "@/services/auth";

export default function ResetPasswordPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const userId       = searchParams.get("userId");
  const secret       = searchParams.get("secret");

  const [password, setPassword]                       = useState("");
  const [confirmPassword, setConfirmPassword]         = useState("");
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage]                         = useState("");
  const [isSuccess, setIsSuccess]                     = useState(false);
  const [loading, setLoading]                         = useState(false);

  const passwordsMatch    = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) { setMessage("Passwords do not match."); return; }
    if (!userId || !secret)           { setMessage("Invalid recovery link. Please request a new one."); return; }

    try {
      setLoading(true);
      await authService.resetPassword(userId, secret, password, confirmPassword);
      setIsSuccess(true);
      setMessage("Password reset successfully. Redirecting to login…");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      setIsSuccess(false);
      setMessage(error?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Same root as RegisterForm — full viewport, no scroll, dark bg everywhere */
    <div className="w-screen h-screen overflow-hidden flex bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035]">

      {/* ══════════════════════════════════════════
          LEFT PANEL — branding (identical to Register)
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[56%] h-full px-14 py-12 text-white relative overflow-hidden flex-shrink-0">

        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[26rem] h-[26rem] bg-blue-500/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-purple-500/8 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/4 rounded-full blur-[70px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm border border-white/10">
            <GraduationCap size={28} className="text-yellow-400" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Grad<span className="text-yellow-400">Legacy</span>
          </span>
        </div>

        {/* Hero copy — page-specific messaging */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3.5 py-1 rounded-full text-[10px] font-bold text-yellow-400 mb-6 tracking-[0.15em] uppercase">
            <Sparkles size={10} /> Account Recovery
          </div>

          <h2 className="text-[2.8rem] font-extrabold leading-[1.08] tracking-tight">
            Secure Your<br />
            Account<br />
            <span className="text-yellow-400">Again</span>
          </h2>

          <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-[360px]">
            Choose a strong new password to protect your graduation memories and keep your legacy safe.
          </p>

          {/* Tips */}
          <div className="mt-8 space-y-3">
            {[
              "Use at least 8 characters",
              "Mix uppercase & lowercase letters",
              "Add numbers and special characters",
              "Never reuse old passwords",
            ].map((tip) => (
              <div key={tip} className="flex items-center gap-3.5 text-white/65">
                <div className="bg-white/8 border border-white/10 p-2 rounded-xl">
                  <Shield size={14} className="text-yellow-400" />
                </div>
                <span className="text-sm font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative z-10 flex gap-5 text-xs text-white/30 border-t border-white/10 pt-5">
          <span className="flex items-center gap-1.5"><Shield size={11} /> Secure</span>
          <span className="flex items-center gap-1.5"><Cloud  size={11} /> Cloud Backup</span>
          <span className="flex items-center gap-1.5"><Globe  size={11} /> Multi-language</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — same dark bg, white card inside
      ══════════════════════════════════════════ */}
      <div className="flex-1 h-full flex items-center justify-center px-6 py-8 relative">

        <div className="absolute top-1/4 right-0 w-[20rem] h-[20rem] bg-blue-400/6 rounded-full blur-[90px] pointer-events-none" />

        {/* White card */}
        <div className="relative z-10 w-full max-w-[420px] max-h-[calc(100vh-4rem)] bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-y-auto">
          <div className="px-8 py-8">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <GraduationCap size={22} className="text-[#0f172a]" />
              <span className="text-lg font-bold text-[#0f172a]">
                Grad<span className="text-yellow-500">Legacy</span>
              </span>
            </div>

            {/* Icon + Heading */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#0f172a]/8 flex items-center justify-center mb-4">
                <KeyRound size={22} className="text-[#0f172a]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Reset Password</h2>
              <p className="mt-1 text-xs text-gray-400">Enter and confirm your new password below.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">

              {/* Message banner */}
              {message && (
                <div
                  role="alert"
                  className={`rounded-xl border px-4 py-3 text-xs flex items-start gap-2 ${
                    isSuccess
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <span className="shrink-0 mt-0.5">{isSuccess ? "✅" : "⚠️"}</span>
                  <span>{message}</span>
                </div>
              )}

              {/* New Password */}
              <div>
                <label htmlFor="password" className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    autoComplete="new-password"
                    required
                    onChange={(e) => { setPassword(e.target.value); setMessage(""); }}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 pr-10 text-sm text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    autoComplete="new-password"
                    required
                    onChange={(e) => { setConfirmPassword(e.target.value); setMessage(""); }}
                    className={`w-full rounded-xl border bg-gray-50 px-3.5 py-2.5 pr-10 text-sm text-[#0f172a] placeholder:text-gray-400 outline-none transition-all hover:border-gray-300 focus:bg-white ${
                      passwordsMismatch ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
                      : passwordsMatch  ? "border-green-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/10"
                      : "border-gray-200 focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8"
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordsMatch    && <p className="mt-1 text-[11px] text-green-600 font-medium">✓ Passwords match</p>}
                {passwordsMismatch && <p className="mt-1 text-[11px] text-red-500 font-medium">✗ Passwords do not match</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || isSuccess}
                className="w-full rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] py-3 font-semibold text-sm text-white transition-all hover:shadow-lg hover:from-[#1a2a4a] hover:to-[#0f172a] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Resetting Password…
                  </>
                ) : (
                  <>Reset Password <Sparkles size={14} /></>
                )}
              </button>

              {/* Back to login */}
              <p className="text-center text-xs text-gray-500 pt-1">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold text-[#0f172a] hover:underline underline-offset-2">
                  Log In
                </Link>
              </p>

              {/* Footer */}
              <div className="flex flex-wrap justify-center gap-3 text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                <span>🔒 Secure Auth</span>
                <span>☁️ Cloud Backup</span>
                <span>🌍 Multi-language</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}