"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  Heart,
  Share2,
  Calendar,
  Users,
  Shield,
  Cloud,
  Globe,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { authService } from "@/services/auth";
import { registerSchema } from "@/lib/auth-schema";
import PasswordRequirements from "./password-requirements";

export default function RegisterForm() {
 const router = useRouter();

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);

const [acceptedTerms, setAcceptedTerms] =
  useState(false);

const [language, setLanguage] =
  useState("en");

const passwordsMatch =
  confirmPassword.length > 0 &&
  password === confirmPassword;

const passwordsMismatch =
  confirmPassword.length > 0 &&
  password !== confirmPassword;

const clearError = () => {
  if (error) setError("");
};

 const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  const loadingToast = toast.loading(
    "Creating your GradLegacy account..."
  );

  const formData = new FormData(e.currentTarget);

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const confirmPwd =
    formData.get("confirmPassword") as string;

  const validation = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword: confirmPwd,
  });

  if (!validation.success) {
    toast.dismiss(loadingToast);

    const message =
      validation.error.issues[0]?.message ||
      "Please check your information.";

    setError(message);

    toast.error(message);

    setLoading(false);
    return;
  }

  if (!acceptedTerms) {
    toast.dismiss(loadingToast);

    const message =
      "Please accept the Terms of Service and Privacy Policy.";

    setError(message);

    toast.error(message);

    setLoading(false);
    return;
  }

  try {
    await authService.register(
      name,
      email,
      password,
      language
    );

    toast.dismiss(loadingToast);

    toast.success(
      "🎓 Welcome to GradLegacy! Your account has been created successfully."
    );

    router.push("/register/success");
  } catch (err) {
    toast.dismiss(loadingToast);

    const message =
      err instanceof Error
        ? err.message
        : "Registration failed. Please try again.";

    setError(message);

    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  /* ─────────────────────────────────────────────────────────────────────────
     ROOT: w-screen h-screen, no padding, no max-width — fills the viewport.
     Two columns: left 58 % dark branding | right 42 % white form.
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <div className="w-screen min-h-screen flex flex-col lg:flex-row overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          LEFT PANEL — full-height dark branding column
      ══════════════════════════════════════════════ */}
      <div
        className="
          hidden lg:flex flex-col justify-between
          w-[58%] min-h-screen
          bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035]
          px-16 py-14 text-white relative overflow-hidden
          flex-shrink-0
        "
      >
        {/* Ambient glow blobs */}
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-blue-500/10   rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0  w-[36rem] h-[36rem] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/4 rounded-full blur-[80px] pointer-events-none" />

        {/* ── TOP: Logo ── */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <GraduationCap size={32} className="text-yellow-400" />
            </div>
            <span className="text-[1.6rem] font-bold tracking-tight">
              Grad<span className="text-yellow-400">Legacy</span>
            </span>
          </div>
        </div>

        {/* ── MIDDLE: Hero copy ── */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 rounded-full text-[11px] font-bold text-yellow-400 mb-8 tracking-[0.15em] uppercase">
            <Sparkles size={11} />
            Class of 2026
          </div>

          <h2 className="text-[3.5rem] font-extrabold leading-[1.05] tracking-tight">
            Preserve Your
            <br />
            Graduation
            <br />
            <span className="text-yellow-400">Legacy</span>
          </h2>

          <p className="mt-6 text-white/55 text-[1rem] leading-relaxed max-w-[400px]">
            Collect wishes, memories, and messages from the people who matter most — all in one place, forever.
          </p>

          {/* Feature list */}
          <div className="mt-12 space-y-4">
            {[
              { icon: Heart,    text: "Receive Graduation Wishes" },
              { icon: Calendar, text: "Preserve Memories Forever" },
              { icon: Share2,   text: "Share Your Achievement"   },
              { icon: Users,    text: "Build Your Digital Legacy" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4 text-white/70 group">
                <div className="bg-white/8 border border-white/10 p-2.5 rounded-xl group-hover:bg-white/14 transition-all duration-200">
                  <Icon size={16} className="text-yellow-400" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM: Trust badges ── */}
        <div className="relative z-10 flex gap-6 text-xs text-white/35 border-t border-white/10 pt-6">
          <span className="flex items-center gap-1.5"><Shield size={12} /> Secure</span>
          <span className="flex items-center gap-1.5"><Cloud  size={12} /> Cloud Backup</span>
          <span className="flex items-center gap-1.5"><Globe  size={12} /> Multi-language</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT PANEL — full-height white form column
      ══════════════════════════════════════════════ */}
      <div
        className="
          flex-1 flex items-center justify-center
          min-h-screen bg-white
          px-8 py-12
        "
      >
        <div className="w-full max-w-[440px]">

          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <GraduationCap size={26} className="text-[#0f172a]" />
              <span className="text-xl font-bold text-[#0f172a]">
                Grad<span className="text-yellow-500">Legacy</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a]">Create My Legacy</h2>
            <p className="mt-1 text-sm text-gray-500">Start your graduation journey today</p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-[2rem] font-extrabold text-[#0f172a] tracking-tight">Create My Legacy</h2>
            <p className="mt-2 text-sm text-gray-500">Start your graduation journey today</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Error banner */}
            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="John Doe"
                onChange={clearError}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="john@example.com"
                onChange={clearError}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <PasswordRequirements password={password} />

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-[#0f172a] placeholder:text-gray-400 outline-none transition-all hover:border-gray-300 ${
                    passwordsMismatch
                      ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
                      : passwordsMatch
                      ? "border-green-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/10"
                      : "border-gray-200 focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8"
                  }`}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordsMatch    && <p className="mt-1.5 text-xs text-green-600 font-medium">✓ Passwords match</p>}
              {passwordsMismatch && <p className="mt-1.5 text-xs text-red-500 font-medium">✗ Passwords do not match</p>}
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Preferred Language
              </label>
              <select
                id="language"
                name="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#0f172a] outline-none transition-all focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300 cursor-pointer"
              >
                <option value="en">🇺🇸 English</option>
                <option value="am">🇪🇹 አማርኛ</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => { setAcceptedTerms(e.target.checked); clearError(); }}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#0f172a] cursor-pointer shrink-0"
              />
              <span className="group-hover:text-gray-800 transition-colors leading-snug">
                I agree to the{" "}
                <Link href="/terms" className="text-[#0f172a] font-semibold hover:underline underline-offset-2">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[#0f172a] font-semibold hover:underline underline-offset-2">Privacy Policy</Link>.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] py-3.5 font-semibold text-white transition-all hover:shadow-xl hover:from-[#1a2a4a] hover:to-[#0f172a] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[15px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path  className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account…
                </>
              ) : (
                <>Create My Legacy <Sparkles size={16} /></>
              )}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#0f172a] hover:underline underline-offset-2">Log In</Link>
            </p>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <span>🔒 Secure Auth</span>
              <span>☁️ Cloud Backup</span>
              <span>🌍 Multi-language</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}