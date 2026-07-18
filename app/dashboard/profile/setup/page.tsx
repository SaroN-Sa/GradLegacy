"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  User,
  AtSign,
  Building2,
  BookOpen,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Home,
} from "lucide-react";

import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";
import ImageUpload from "@/components/ImageUpload";

export default function ProfileSetupPage() {
  const router = useRouter();

  const [loading, setLoading]         = useState(false);
  const [existingId, setExistingId]   = useState<string | null>(null);
  const [message, setMessage]         = useState("");
  const [isSuccess, setIsSuccess]     = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    bio: "",
    university: "",
    department: "",
    graduationYear: "",
    profileImage: "",
    coverImage: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = await authService.getCurrentUser();
    if (!user) return;

    const profile = await profileService.getProfileByUserId(user.$id);
    if (profile) {
      setExistingId(profile.$id);
      setForm({
        fullName: profile.fullName || "",
        username: profile.username || "",
        bio: profile.bio || "",
        university: profile.university || "",
        department: profile.department || "",
        graduationYear: profile.graduationYear?.toString() || "",
        profileImage: profile.profileImage || "",
        coverImage: profile.coverImage || "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) return;

      if (existingId) {
        await profileService.updateProfile(existingId, {
          ...form,
          graduationYear: Number(form.graduationYear),
          status: "draft",
        });
      } else {
        await profileService.createProfile({
          userId: user.$id,
          ...form,
          graduationYear: Number(form.graduationYear),
          status: "draft",
        });
      }

      setIsSuccess(true);
      setMessage("Profile saved successfully! Redirecting to dashboard…");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setIsSuccess(false);
      setMessage(err?.message || "Error saving profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Same dark gradient family used across auth pages, scrollable since this is a longer form */
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035] px-4 py-10 sm:px-6">

      {/* Ambient glow blobs — matches auth pages */}
      <div className="fixed top-0 right-0 w-[26rem] h-[26rem] bg-blue-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[32rem] h-[32rem] bg-purple-500/8 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Header — logo + title, consistent branding */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm border border-white/10">
              <GraduationCap size={24} className="text-yellow-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Grad<span className="text-yellow-400">Legacy</span>
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

        {/* White card — same rounded-3xl + shadow language as auth pages */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* Card header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="inline-flex items-center gap-2 bg-[#0f172a]/8 px-3.5 py-1 rounded-full text-[10px] font-bold text-[#0f172a] mb-3 tracking-[0.15em] uppercase">
              <Sparkles size={10} className="text-yellow-500" />
              {existingId ? "Edit Profile" : "Get Started"}
            </div>
            <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
              Profile Setup
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              This information will appear on your graduation legacy page.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-8 py-6 space-y-5">

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

            {/* ── Images ── */}
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                label="Profile Image"
                onUpload={(url) => setForm((p) => ({ ...p, profileImage: url }))}
              />
              <ImageUpload
                label="Cover Image"
                onUpload={(url) => setForm((p) => ({ ...p, coverImage: url }))}
              />
            </div>

            {/* ── Full Name ── */}
            <div>
              <label htmlFor="fullName" className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 py-2.5 text-sm text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
                />
              </div>
            </div>

            {/* ── Username ── */}
            <div>
              <label htmlFor="username" className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  required
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe26"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 py-2.5 text-sm text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
                />
              </div>
            </div>

            {/* ── Bio ── */}
            <div>
              <label htmlFor="bio" className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell people a bit about yourself…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-[#0f172a] placeholder:text-gray-400 outline-none transition-all resize-none focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
              />
            </div>

            {/* ── University + Department ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="university" className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  University
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="university"
                    name="university"
                    value={form.university}
                    onChange={handleChange}
                    placeholder="Wolaita Sodo University"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 py-2.5 text-sm text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="department" className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Department
                </label>
                <div className="relative">
                  <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 py-2.5 text-sm text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* ── Graduation Year ── */}
            <div>
              <label htmlFor="graduationYear" className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Graduation Year
              </label>
              <div className="relative">
                <CalendarDays size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  inputMode="numeric"
                  value={form.graduationYear}
                  onChange={handleChange}
                  placeholder="2026"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 py-2.5 text-sm text-[#0f172a] placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
                />
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 py-3 font-semibold text-sm text-[#0f172a] transition-all hover:shadow-lg hover:shadow-yellow-400/30 hover:from-yellow-300 hover:to-yellow-400 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#0f172a] shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {existingId ? "Updating…" : "Applying…"}
                </>
              ) : (
                <>{existingId ? "Update" : "Apply"} <ArrowRight size={14} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}