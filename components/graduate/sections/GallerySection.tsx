"use client";

import { useEffect, useState } from "react";
import { Globe, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";

import { mediaService } from "@/services/media";
import { Media } from "@/types/media";
import PublicMediaCard from "@/components/media/PublicMediaCard";
import GalleryLightbox from "@/components/media/GalleryLightbox";

interface GallerySectionProps {
  graduateName: string;
  userId: string;
}

const PREVIEW_LIMIT = 9;

export default function GallerySection({ graduateName, userId }: GallerySectionProps) {
  const [publicMedia, setPublicMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPublicMedia() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setError(false);
        const media = await mediaService.getPublicMedia(userId);
        const visual = media.filter((item) => item.type === "image" || item.type === "video");

        // Featured items first, then newest first
        const sorted = [...visual].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
        });

        if (isMounted) setPublicMedia(sorted);
      } catch (err) {
        console.error("Failed to load gallery media:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPublicMedia();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleView = (item: Media) => {
    const idx = publicMedia.findIndex((m) => m.$id === item.$id);
    setLightboxIndex(idx === -1 ? 0 : idx);
  };

  const visibleMedia = publicMedia.slice(0, PREVIEW_LIMIT);
  const remaining = publicMedia.length - visibleMedia.length;

  return (
    <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-black/20 w-full">
      {/* Header */}
      <div className="border-b border-gray-100 px-4 sm:px-6 md:px-7 py-4 sm:py-5 md:py-6">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-[#0f172a] sm:w-[17px] sm:h-[17px] shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Graduation Gallery</h2>
        </div>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
          Browse photos and videos shared by <span className="font-semibold">{graduateName}</span>.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center px-4 sm:px-7 py-12 sm:py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#0f172a]" />
        </div>
      ) : error ? (
        <div className="px-4 sm:px-7 py-10 sm:py-12 text-center">
          <div className="mx-auto mb-4 sm:mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle size={26} className="text-red-400 sm:w-7 sm:h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Couldn't load the gallery</h3>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">Something went wrong. Please try again shortly.</p>
        </div>
      ) : visibleMedia.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 px-4 sm:px-6 md:px-7 py-5 sm:py-6 md:py-7 sm:grid-cols-2 xl:grid-cols-3">
            {visibleMedia.map((item) => (
              <PublicMediaCard key={item.$id} media={item} onView={handleView} />
            ))}
          </div>

          {remaining > 0 && (
            <p className="border-t border-gray-100 px-4 sm:px-7 py-3 sm:py-4 text-center text-xs font-semibold text-gray-400">
              +{remaining} more in the full gallery
            </p>
          )}
        </>
      ) : (
        <div className="px-4 sm:px-7 py-10 sm:py-12 text-center">
          <div className="mx-auto mb-4 sm:mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-100">
            <ImageIcon size={28} className="text-gray-400 sm:w-[30px] sm:h-[30px]" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">No Gallery Yet</h3>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">{graduateName} hasn't published any photos or videos yet.</p>
        </div>
      )}

      {/* Read-only lightbox with slide navigation between gallery items */}
      <GalleryLightbox
        mediaList={publicMedia}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}