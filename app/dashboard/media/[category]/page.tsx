"use client";

import { useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, RefreshCw, Search, Star } from "lucide-react";

import { useMediaContext } from "@/context/MediaContext";
import { getCategory } from "@/lib/media/categories";
import CategoryMotif from "@/components/media/CategoryMotif";
import MediaGrid from "@/components/media/MediaGrid";
import UploadMediaModal from "@/components/media/UploadMediaModal";
import MediaViewer from "@/components/media/MediaViewer";
import EditMediaModal from "@/components/media/EditMediaModal";
import { Media } from "@/types/media";

type TypeFilter = "all" | "image" | "video" | "audio";
type VisibilityFilter = "all" | "public" | "private" | "unlisted";

export default function MediaCategoryPage() {
  const params = useParams<{ category: string }>();
  const category = getCategory(params.category);
  if (!category) notFound();

  const { userId, media, loading, refreshing, refresh, deleteMedia } = useMediaContext();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Media | null>(null);

  const scoped = useMemo(() => media.filter(category.match), [media, category]);

  const filtered = useMemo(() => {
    let list = scoped;

    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title?.toLowerCase().includes(kw) ||
          m.description?.toLowerCase().includes(kw) ||
          m.album?.toLowerCase().includes(kw)
      );
    }
    if (!category.typeLocked && typeFilter !== "all") {
      list = list.filter((m) => m.type === typeFilter);
    }
    if (!category.visibilityLocked && visibilityFilter !== "all") {
      list = list.filter((m) => m.visibility === visibilityFilter);
    }
    if (category.slug !== "featured" && featuredOnly) {
      list = list.filter((m) => m.featured);
    }
    return list;
  }, [scoped, search, typeFilter, visibilityFilter, featuredOnly, category]);

  const Icon = category.icon;

  const handleView = (item: Media) => {
    setSelected(item);
    setViewerOpen(true);
  };

  const handleEdit = (item: Media) => {
    setSelected(item);
    setViewerOpen(false);
    setEditOpen(true);
  };

  const handleEditSaved = async () => {
    setEditOpen(false);
    setSelected(null);
    await refresh();
  };

  const handleEditDelete = async (item: Media) => {
    await deleteMedia(item);
    setEditOpen(false);
    setSelected(null);
    await refresh();
  };

  return (
    <div className="space-y-7 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/media"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#FFD700]"
          >
            <ArrowLeft size={13} />
            Media Vault
          </Link>

          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${category.accent.bg} shadow-md`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">{category.eyebrow}</p>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{category.label}</h1>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-400">{category.description}</p>
        </div>

        <div className="flex shrink-0 gap-2.5">
          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:border-slate-600 disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-5 py-2.5 text-sm font-bold text-[#FFD700] transition-all hover:border-[#FFD700] active:scale-[0.99]"
          >
            <Plus size={15} />
            Upload
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${category.label.toLowerCase()}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 hover:border-slate-600 focus:border-[#FFD700]/60 focus:ring-4 focus:ring-[#FFD700]/10"
            />
          </div>

          {!category.typeLocked && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="cursor-pointer rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 outline-none transition-all hover:border-slate-600 focus:border-[#FFD700]/60 focus:ring-4 focus:ring-[#FFD700]/10"
            >
              <option value="all">All Types</option>
              <option value="image">🖼 Images</option>
              <option value="video">🎬 Videos</option>
              <option value="audio">🎵 Audio</option>
            </select>
          )}

          {!category.visibilityLocked && (
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as VisibilityFilter)}
              className="cursor-pointer rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 outline-none transition-all hover:border-slate-600 focus:border-[#FFD700]/60 focus:ring-4 focus:ring-[#FFD700]/10"
            >
              <option value="all">All Visibility</option>
              <option value="public">🌍 Public</option>
              <option value="private">🔒 Private</option>
              <option value="unlisted">🔗 Unlisted</option>
            </select>
          )}

          {category.slug !== "featured" && (
            <label className="flex cursor-pointer select-none items-center gap-2.5 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5 transition-colors hover:border-slate-600">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded accent-[#FFD700]"
              />
              <Star size={14} className={featuredOnly ? "text-[#FFD700]" : "text-slate-500"} />
              <span className="text-sm font-medium text-slate-300">Featured</span>
            </label>
          )}

          <span className="ml-auto text-xs font-semibold text-slate-500">
            {filtered.length} of {scoped.length}
          </span>
        </div>
      </div>

      {/* Gallery / empty state */}
      {filtered.length === 0 && !loading ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 py-24">
          <div className="flex flex-col items-center px-6 text-center">
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${category.accent.soft}`}>
              <CategoryMotif slug={category.slug} className="relative" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {scoped.length === 0 ? `No ${category.label.toLowerCase()} yet` : "No results found"}
            </h2>
            <p className="mt-2 max-w-xs text-sm text-slate-400">
              {scoped.length === 0
                ? "Upload something to fill this category."
                : "Try adjusting your search or filters."}
            </p>
            {scoped.length === 0 && (
              <button
                onClick={() => setUploadOpen(true)}
                className="mt-6 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-6 py-3 text-sm font-bold text-[#FFD700] transition-all hover:border-[#FFD700]"
              >
                <Plus size={15} />
                Upload {category.label}
              </button>
            )}
          </div>
        </div>
      ) : (
        <MediaGrid media={filtered} loading={loading} onView={handleView} onEdit={handleEdit} onDelete={deleteMedia} />
      )}

      <UploadMediaModal
        open={uploadOpen}
        userId={userId}
        onClose={() => setUploadOpen(false)}
        onUploaded={async () => {
          setUploadOpen(false);
          await refresh();
        }}
      />

      <MediaViewer
        open={viewerOpen}
        media={selected}
        onClose={() => {
          setViewerOpen(false);
          setSelected(null);
        }}
        onEdit={handleEdit}
        onDelete={deleteMedia}
      />

      <EditMediaModal
        open={editOpen}
        media={selected}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
        }}
        onSaved={handleEditSaved}
        onDelete={handleEditDelete}
      />
    </div>
  );
}