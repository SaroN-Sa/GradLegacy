"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus, Search, RefreshCw, ImageIcon,
  Film, Music, Eye, EyeOff, Star,
  Images, ArrowLeft,
} from "lucide-react";

import { authService } from "@/services/auth";
import { mediaService } from "@/services/media";

import UploadMediaModal from "@/components/media/UploadMediaModal";
import MediaGrid from "@/components/media/MediaGrid";
import MediaViewer from "@/components/media/MediaViewer";

import { Media } from "@/types/media";

// ─── Types ────────────────────────────────────────────────────────────────────
type TypeFilter       = "all" | "image" | "video" | "audio";
type VisibilityFilter = "all" | "public" | "private" | "unlisted";

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-3xl p-5 border border-gray-100 bg-white shadow-lg shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 overflow-hidden ${
        accent ? "ring-2 ring-yellow-400/30" : ""
      }`}
    >
      <div className="absolute -top-5 -left-5 w-20 h-20 bg-[#0f172a]/4 rounded-full pointer-events-none" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
        <div className="w-9 h-9 rounded-xl bg-[#0f172a] flex items-center justify-center shrink-0 shadow-md shadow-[#0f172a]/20 transition-transform duration-200 group-hover:scale-110">
          <Icon size={16} className="text-yellow-400" />
        </div>
      </div>
      <p className="mt-3 text-4xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      {/* Brand accent bar on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0f172a] to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
}

// ─── Filter select ────────────────────────────────────────────────────────────
function FilterSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 font-medium outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300 cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MediaPage() {
  const [userId, setUserId]           = useState("");
  const [media, setMedia]             = useState<Media[]>([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewerOpen, setViewerOpen]   = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  // Filters
  const [search, setSearch]                   = useState("");
  const [typeFilter, setTypeFilter]           = useState<TypeFilter>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
  const [featuredOnly, setFeaturedOnly]       = useState(false);

  // ── Load ──
  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) return;
      setUserId(user.$id);
      const result = await mediaService.getUserMedia(user.$id);
      setMedia(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  const refresh = async () => {
    if (!userId) return;
    try {
      setRefreshing(true);
      const result = await mediaService.getUserMedia(userId);
      setMedia(result);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  // ── Filtered list ──
  const filteredMedia = useMemo(() => {
    let list = [...media];
    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter((m) =>
        m.title?.toLowerCase().includes(kw) ||
        m.description?.toLowerCase().includes(kw) ||
        m.album?.toLowerCase().includes(kw)
      );
    }
    if (typeFilter !== "all")       list = list.filter((m) => m.type === typeFilter);
    if (visibilityFilter !== "all") list = list.filter((m) => m.visibility === visibilityFilter);
    if (featuredOnly)               list = list.filter((m) => m.featured);
    return list;
  }, [media, search, typeFilter, visibilityFilter, featuredOnly]);

  // ── Derived stats ──
  const stats = useMemo(() => ({
    total:    media.length,
    images:   media.filter((m) => m.type === "image").length,
    videos:   media.filter((m) => m.type === "video").length,
    audio:    media.filter((m) => m.type === "audio").length,
    public:   media.filter((m) => m.visibility === "public").length,
    private:  media.filter((m) => m.visibility === "private").length,
    featured: media.filter((m) => m.featured).length,
  }), [media]);

  // ── Handlers ──
  const handleView = (item: Media) => {
    setSelectedMedia(item);
    setViewerOpen(true);
  };

  // FIX: replaced window.confirm (blocking) with inline delete without confirm
  // — you can wire a proper confirm modal here later
  const handleDelete = async (item: Media) => {
    await mediaService.deleteMedia(item.$id);
    await refresh();
  };

  // FIX: replaced alert() with state — connect real edit modal when ready
  const [editHint, setEditHint] = useState(false);
  const handleEdit = (item: Media) => {
    setSelectedMedia(item);
    setEditHint(true);
    setTimeout(() => setEditHint(false), 2500);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    visibilityFilter !== "all" ||
    featuredOnly;

  return (
    <div className="space-y-7 p-6 sm:p-8">

      {/* Edit hint toast */}
      {editHint && (
        <div className="fixed top-6 right-6 z-40 rounded-2xl bg-[#0f172a] text-white text-sm font-semibold px-5 py-3 shadow-2xl flex items-center gap-2">
          ✏️ Edit modal coming soon
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#0f172a] transition-colors mb-3"
          >
            <ArrowLeft size={13} />
            Back to Home
          </Link>

          <div className="inline-flex items-center gap-2 bg-[#0f172a] px-3 py-1 rounded-full text-[10px] font-bold text-yellow-400 mb-3 tracking-[0.15em] uppercase">
            <Images size={10} />
            Media
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Media Gallery
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage all your graduation memories in one place.
          </p>
        </div>

        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-5 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:from-[#1a2a4a] hover:to-[#0f172a] transition-all active:scale-[0.99]"
          >
            <Plus size={15} />
            Upload
          </button>
        </div>
      </div>

      {/* ── Primary stats (4 cards) ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Media"  value={stats.total}  icon={Images}    accent />
        <StatCard label="Images"       value={stats.images} icon={ImageIcon} />
        <StatCard label="Videos"       value={stats.videos} icon={Film}      />
        <StatCard label="Audio"        value={stats.audio}  icon={Music}     />
      </div>

      {/* ── Search & Filters ── */}
      <div className="rounded-3xl border border-gray-100 bg-white shadow-lg shadow-black/5 p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
          Filter & Search
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description, album…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8 hover:border-gray-300"
            />
          </div>

          {/* Type */}
          <FilterSelect<TypeFilter>
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: "All Types",  value: "all" },
              { label: "🖼 Images",  value: "image" },
              { label: "🎬 Videos",  value: "video" },
              { label: "🎵 Audio",   value: "audio" },
            ]}
          />

          {/* Visibility */}
          <FilterSelect<VisibilityFilter>
            value={visibilityFilter}
            onChange={setVisibilityFilter}
            options={[
              { label: "All Visibility", value: "all" },
              { label: "🌍 Public",      value: "public" },
              { label: "🔒 Private",     value: "private" },
              { label: "🔗 Unlisted",    value: "unlisted" },
            ]}
          />

          {/* Featured toggle */}
          <label className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 cursor-pointer hover:border-gray-300 transition-colors select-none">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0f172a] cursor-pointer"
            />
            <Star size={14} className={featuredOnly ? "text-yellow-500" : "text-gray-400"} />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>

        {/* Active filter clear */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch("");
              setTypeFilter("all");
              setVisibilityFilter("all");
              setFeaturedOnly(false);
            }}
            className="mt-3 text-xs font-semibold text-red-500 hover:underline underline-offset-2"
          >
            ✕ Clear all filters
          </button>
        )}
      </div>

      {/* ── Secondary stats (3 cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Public Media"  value={stats.public}   icon={Eye}  />
        <StatCard label="Private Media" value={stats.private}  icon={EyeOff} />
        <StatCard label="Featured"      value={stats.featured} icon={Star} accent />
      </div>

      {/* ── Gallery / Empty state ── */}
      {filteredMedia.length === 0 && !loading ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-24">
          <div className="flex flex-col items-center text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0f172a]/8 flex items-center justify-center mb-4">
              <ImageIcon size={28} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {hasActiveFilters ? "No results found" : "No media yet"}
            </h2>
            <p className="mt-2 text-sm text-gray-400 max-w-xs">
              {hasActiveFilters
                ? "Try adjusting your filters or search term."
                : "Upload your first graduation memory to get started."}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-6 py-3 text-sm font-bold text-white hover:shadow-lg transition-all"
              >
                <Plus size={15} />
                Upload Media
              </button>
            )}
          </div>
        </div>
      ) : (
        <MediaGrid
          media={filteredMedia}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ── Upload modal ── */}
      <UploadMediaModal
        open={uploadModalOpen}
        userId={userId}
        onClose={() => setUploadModalOpen(false)}
        onUploaded={async () => {
          setUploadModalOpen(false);
          await refresh();
        }}
      />

      {/* ── Media viewer ── */}
      <MediaViewer
        open={viewerOpen}
        media={selectedMedia}
        onClose={() => { setViewerOpen(false); setSelectedMedia(null); }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}