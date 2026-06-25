"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Sparkles, Shield, Cloud, Globe, Mail, ArrowRight } from "lucide-react";
import { authService } from "@/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [message, setMessage]   = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setIsSuccess(true);
      setMessage("Password reset email sent. Please check your inbox.");
      setEmail("");
    } catch (error: any) {
      setIsSuccess(false);
      setMessage(error?.message || "Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035]">

      {/* ══════════════════════════════════════════
          LEFT PANEL — branding
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

        {/* Hero copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3.5 py-1 rounded-full text-[10px] font-bold text-yellow-400 mb-6 tracking-[0.15em] uppercase">
            <Sparkles size={10} /> Account Recovery
          </div>

          <h2 className="text-[2.8rem] font-extrabold leading-[1.08] tracking-tight">
            Recover Your<br />
            Account<br />
            <span className="text-yellow-400">Easily</span>
          </h2>

          <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-[360px]">
            Don't lose access to your graduation memories. We'll send a secure reset link straight to your inbox.
          </p>

          {/* Steps */}
          <div className="mt-8 space-y-3">
            {[
              { step: "01", text: "Enter your registered email" },
              { step: "02", text: "Check your inbox for the link" },
              { step: "03", text: "Click the link to reset your password" },
              { step: "04", text: "Log back in and access your legacy" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3.5 text-white/65 group">
                <div className="bg-white/8 border border-white/10 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/14 transition-all duration-200">
                  <span className="text-[10px] font-bold text-yellow-400">{step}</span>
                </div>
                <span className="text-sm font-medium">{text}</span>
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
          RIGHT PANEL — same dark bg, white card
      ══════════════════════════════════════════ */}
      <div className="flex-1 h-full flex items-center justify-center px-6 py-8 relative">

        <div className="absolute top-1/4 right-0 w-[20rem] h-[20rem] bg-blue-400/6 rounded-full blur-[90px] pointer-events-none" />

        {/* White card */}
        <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl shadow-2xl shadow-black/40">
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
                <Mail size={22} className="text-[#0f172a]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Forgot Password?</h2>
              <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                No worries. Enter your email and we'll send you a secure reset link.
              </p>
            </div>

            {/* Success state — replaces form */}
            {isSuccess ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-5 text-center">
                  <div className="text-3xl mb-2">📬</div>
                  <p className="text-sm font-semibold text-green-800">Check your inbox!</p>
                  <p className="mt-1 text-xs text-green-600 leading-relaxed">{message}</p>
                </div>
                <p className="text-center text-xs text-gray-400">
                  Didn't receive it?{" "}
                  <button
                    onClick={() => { setIsSuccess(false); setMessage(""); }}
                    className="font-semibold text-[#0f172a] hover:underline underline-offset-2"
                  >
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3.5">

                {/* Error banner */}
                {message && !isSuccess && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>{message}</span>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setMessage(""); }}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] py-3 font-semibold text-sm text-white transition-all hover:shadow-lg hover:from-[#1a2a4a] hover:to-[#0f172a] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending Reset Link…
                    </>
                  ) : (
                    <>Send Reset Link <ArrowRight size={14} /></>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}