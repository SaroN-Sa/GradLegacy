"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  Shield,
  Cloud,
  Globe,
  Loader2,
  Home,
} from "lucide-react";

import { toast } from "sonner";
import { authService } from "@/services/auth";

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Signing you in...");

    try {
      await authService.login(email, password);

      toast.dismiss(loadingToast);

      toast.success("Welcome back to GradLegacy!");

      router.push("/dashboard");
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(
        error instanceof Error ? error.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
      {/* LEFT PANEL */}
      <div
        className="
          hidden lg:flex flex-col justify-between
          w-[58%] min-h-screen
          bg-gradient-to-br
          from-[#0b1120]
          via-[#0f172a]
          to-[#162035]
          px-16 py-14
          text-white
          relative
          overflow-hidden
          flex-shrink-0
        "
      >
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[36rem] h-[36rem] bg-purple-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <GraduationCap size={32} className="text-yellow-400" />
            </div>

            <span className="text-[1.6rem] font-bold">
              Grad
              <span className="text-yellow-400">Legacy</span>
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <Home size={15} />
            Back to Home
          </Link>
        </div>

        <div className="relative z-10">
          <div
            className="
              inline-flex items-center gap-2
              bg-yellow-400/10
              border border-yellow-400/20
              px-4 py-1.5
              rounded-full
              text-[11px]
              font-bold
              text-yellow-400
              mb-8
              uppercase
            "
          >
            <Sparkles size={11} />
            Welcome Back
          </div>

          <h2
            className="
              text-[3.5rem]
              font-extrabold
              leading-[1.05]
            "
          >
            Continue
            <br />
            Your
            <br />
            <span className="text-yellow-400">Legacy</span>
          </h2>

          <p
            className="
              mt-6
              text-white/60
              text-[1rem]
              leading-relaxed
              max-w-[400px]
            "
          >
            Sign in to view wishes, memories, photos, videos, and your graduation journey.
          </p>
        </div>

        <div
          className="
            relative z-10
            flex gap-6
            text-xs
            text-white/35
            border-t border-white/10
            pt-6
          "
        >
          <span className="flex items-center gap-1.5">
            <Shield size={12} />
            Secure
          </span>

          <span className="flex items-center gap-1.5">
            <Cloud size={12} />
            Cloud Backup
          </span>

          <span className="flex items-center gap-1.5">
            <Globe size={12} />
            Multi-language
          </span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          min-h-screen
          bg-white
          px-8
          py-12
        "
      >
        <div className="w-full max-w-[440px]">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <GraduationCap size={26} className="text-[#0f172a]" />

              <span className="text-xl font-bold text-[#0f172a]">
                Grad
                <span className="text-yellow-500">Legacy</span>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#0f172a]">Welcome Back</h2>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-[2rem] font-extrabold text-[#0f172a]">Welcome Back</h2>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue your graduation journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  px-4
                  py-3.5
                  text-gray-900
                  placeholder-gray-400
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="
                    text-sm
                    text-blue-600
                    hover:text-blue-700
                    font-medium
                  "
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    px-4
                    py-3.5
                    pr-12
                    text-gray-900
                    placeholder-gray-400
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="
                    h-4
                    w-4
                    rounded
                    border-gray-300
                  "
                />

                <span className="text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-2xl
                bg-[#0f172a]
                text-white
                py-3.5
                font-semibold
                transition
                hover:opacity-95
                disabled:opacity-60
                disabled:cursor-not-allowed
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* REGISTER LINK */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}