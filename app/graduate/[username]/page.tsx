"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  GraduationCap,
  Building2,
  BookOpen,
  CalendarDays,
  Heart,
  Share2,
  QrCode,
  Globe,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Send,
} from "lucide-react";

import { profileService } from "@/services/profile";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Profile {
  $id: string;
  fullName: string;
  username: string;
  bio?: string;
  university?: string;
  department?: string;
  graduationYear?: number;
  profileImage?: string;
  coverImage?: string;
  status?: string;
}

// ─── Wish Form ───────────────────────────────────────────────────────────────
function WishForm({ profileId }: { profileId: string }) {
  const [name, setName]       = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      setError("");

      // Replace with your actual wish service call
      // await wishService.createWish({ profileId, name, message });

      // Simulate for now
      await new Promise((r) => setTimeout(r, 800));

      setSent(true);
      setName("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Failed to send wish. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-emerald-600" />
        </div>
        <p className="font-bold text-gray-900">Wish sent! 🎉</p>
        <p className="text-sm text-gray-500">Thank you for celebrating this milestone.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-2 text-xs font-semibold text-[#0f172a] hover:underline underline-offset-2"
        >
          Send another wish
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Your Name (optional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Anonymous"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Your Wish <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a heartfelt message…"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all resize-none focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
        />
      </div>

      <button
        type="submit"
        disabled={sending || !message.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:from-[#1a2a4a] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? (
          <>
            <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            <Send size={14} />
            Send Wish
          </>
        )}
      </button>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GraduateProfilePage() {
  const params  = useParams();
  const username = params?.username as string;

  const [profile, setProfile]   = useState<Profile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied]     = useState(false);
  const [activeTab, setActiveTab] = useState<"wishes" | "gallery" | "timeline">("wishes");

  useEffect(() => {
    if (!username) return;
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      const p = await profileService.getProfileByUsername(username);
      if (!p || p.status !== "approved") {
        setNotFound(true);
      } else {
        setProfile(p);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile?.fullName}'s Graduation Page`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* user cancelled share */ }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-7 w-7 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-white/60">Loading profile…</p>
        </div>
      </div>
    );
  }

  // ── Not Found ──
  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035] px-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-[#0f172a] flex items-center justify-center mx-auto mb-5">
            <GraduationCap size={28} className="text-yellow-400" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900">Page Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">
            This graduation page doesn't exist or hasn't been approved yet.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-5 py-2.5 text-sm font-bold text-white hover:shadow-lg transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "wishes",   label: "Wishes",   icon: Heart },
    { key: "gallery",  label: "Gallery",  icon: Globe },
    { key: "timeline", label: "Timeline", icon: CalendarDays },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035]">

      {/* Ambient glow blobs */}
      <div className="fixed top-0 right-0 w-[26rem] h-[26rem] bg-blue-500/10 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[32rem] h-[32rem] bg-purple-500/8 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* ── Cover Image ── */}
      <div className="relative w-full h-52 sm:h-72">
        {profile.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#0f172a] via-[#1e3a5f] to-[#0f172a]" />
        )}
        {/* Overlay so content below reads clearly */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />

        {/* Nav bar over cover */}
        <div className="absolute top-0 left-0 right-0 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/15 backdrop-blur-sm p-2 rounded-xl border border-white/20">
              <GraduationCap size={18} className="text-yellow-400" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Grad<span className="text-yellow-400">Legacy</span>
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          >
            <Share2 size={13} />
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* ── Profile card — overlaps cover ── */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 -mt-16 p-6 sm:p-8">

          {/* Avatar + name row */}
          <div className="flex items-end gap-5 flex-wrap">
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-[#0f172a] flex items-center justify-center shrink-0 -mt-16 sm:-mt-20">
              {profile.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                <GraduationCap size={36} className="text-yellow-400" />
              )}
            </div>

            <div className="flex-1 min-w-0 pb-1">
              {/* Class of badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#0f172a] px-3 py-1 rounded-full text-[10px] font-bold text-yellow-400 mb-2 tracking-widest uppercase">
                <Sparkles size={9} />
                {profile.graduationYear ? `Class of ${profile.graduationYear}` : "Graduate"}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight truncate">
                {profile.fullName}
              </h1>

              <p className="mt-0.5 text-sm text-gray-400 font-medium">
                @{profile.username}
              </p>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-5">
              {profile.bio}
            </p>
          )}

          {/* University / Department / Year chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.university && (
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700">
                <Building2 size={12} className="text-[#0f172a]" />
                {profile.university}
              </span>
            )}
            {profile.department && (
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700">
                <BookOpen size={12} className="text-[#0f172a]" />
                {profile.department}
              </span>
            )}
            {profile.graduationYear && (
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700">
                <CalendarDays size={12} className="text-[#0f172a]" />
                {profile.graduationYear}
              </span>
            )}
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="mt-5 bg-white rounded-2xl shadow-xl shadow-black/20 p-1.5 flex gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === key
                  ? "bg-[#0f172a] text-yellow-400 shadow-md"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="mt-4">

          {/* WISHES TAB */}
          {activeTab === "wishes" && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/20 overflow-hidden">
              <div className="px-7 pt-7 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={16} className="text-[#0f172a]" />
                  <h2 className="text-base font-extrabold text-gray-900">Send a Wish</h2>
                </div>
                <p className="text-xs text-gray-400">
                  Celebrate {profile.fullName.split(" ")[0]}'s graduation with a heartfelt message.
                </p>
              </div>
              <div className="px-7 py-6">
                <WishForm profileId={profile.$id} />
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/20 px-7 py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#0f172a]/8 flex items-center justify-center mx-auto mb-3">
                <Globe size={22} className="text-[#0f172a]" />
              </div>
              <p className="font-bold text-gray-900">No photos yet</p>
              <p className="text-xs text-gray-400 mt-1">
                {profile.fullName.split(" ")[0]} hasn't added gallery photos yet.
              </p>
            </div>
          )}

          {/* TIMELINE TAB */}
          {activeTab === "timeline" && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/20 px-7 py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#0f172a]/8 flex items-center justify-center mx-auto mb-3">
                <CalendarDays size={22} className="text-[#0f172a]" />
              </div>
              <p className="font-bold text-gray-900">No timeline yet</p>
              <p className="text-xs text-gray-400 mt-1">
                {profile.fullName.split(" ")[0]} hasn't added timeline events yet.
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/30">
            Powered by{" "}
            <span className="text-white/50 font-semibold">
              Grad<span className="text-yellow-400/70">Legacy</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}