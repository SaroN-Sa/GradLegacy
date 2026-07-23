"use client";

import { Pencil, Eye, Share2, QrCode, Globe, ArrowLeft } from "lucide-react";

interface Props {
  onEdit: () => void;
  onPreview: () => void;
  onPublicPage: () => void;
  onShare: () => void;
  onQr: () => void;
  onBack?: () => void; // optional — only renders a back button if provided
}

export default function QuickActions({
  onEdit,
  onPreview,
  onPublicPage,
  onShare,
  onQr,
  onBack,
}: Props) {
  const actions = [
    {
      title: "Edit Profile",
      description: "Update your information",
      icon: Pencil,
      onClick: onEdit,
      // Navy gradient — primary brand color, fixed across themes
      bgClass: "bg-[#0f172a]",
      iconClass: "text-yellow-400",
      textClass: "text-white",
      subClass: "text-white/70",
    },
    {
      title: "Preview",
      description: "See how it looks",
      icon: Eye,
      onClick: onPreview,
      bgClass: "bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800",
      iconClass: "text-[#0f172a] dark:text-yellow-400",
      textClass: "text-gray-900 dark:text-white",
      subClass: "text-gray-500 dark:text-slate-400",
    },
    {
      title: "Public Page",
      description: "Open your live page",
      icon: Globe,
      onClick: onPublicPage,
      bgClass: "bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800",
      iconClass: "text-[#0f172a] dark:text-yellow-400",
      textClass: "text-gray-900 dark:text-white",
      subClass: "text-gray-500 dark:text-slate-400",
    },
    {
      title: "Share",
      description: "Copy public link",
      icon: Share2,
      onClick: onShare,
      bgClass: "bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800",
      iconClass: "text-[#0f172a] dark:text-yellow-400",
      textClass: "text-gray-900 dark:text-white",
      subClass: "text-gray-500 dark:text-slate-400",
    },
    {
      title: "QR Code",
      description: "Generate QR code",
      icon: QrCode,
      onClick: onQr,
      // Yellow accent — secondary brand color, fixed across themes
      bgClass: "bg-yellow-400",
      iconClass: "text-[#0f172a]",
      textClass: "text-[#0f172a]",
      subClass: "text-[#0f172a]/70",
    },
  ] as const;

  return (
    <div className="w-full">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium
                     text-gray-600 dark:text-slate-300
                     hover:text-gray-900 dark:hover:text-white
                     transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}

      <div
        className="
          grid gap-3 sm:gap-4
          grid-cols-2 md:grid-cols-3 xl:grid-cols-5
        "
      >
        {actions.map((item) => {
          const Icon = item.icon;
          const isBrandNavy = item.bgClass.includes("[#0f172a]");

          return (
            <button
              key={item.title}
              onClick={item.onClick}
              className={`
                group relative flex flex-col items-center justify-center
                rounded-2xl sm:rounded-3xl
                p-4 sm:p-5 md:p-6 text-center
                shadow-lg shadow-black/10 dark:shadow-black/30
                transition-all duration-200
                hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 dark:hover:shadow-black/40
                active:scale-[0.97] active:translate-y-0
                ${item.bgClass}
              `}
            >
              {/* Icon container */}
              <div
                className={`
                  w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
                  rounded-xl sm:rounded-2xl
                  flex items-center justify-center mb-2 sm:mb-3
                  transition-transform duration-200 group-hover:scale-110
                  ${isBrandNavy ? "bg-white/10" : "bg-[#0f172a]/8 dark:bg-yellow-400/10"}
                `}
              >
                <Icon size={20} className={`sm:hidden ${item.iconClass}`} />
                <Icon size={22} className={`hidden sm:block ${item.iconClass}`} />
              </div>

              <h3 className={`text-xs sm:text-sm font-bold ${item.textClass}`}>
                {item.title}
              </h3>
              <p className={`mt-0.5 text-[10px] sm:text-[11px] leading-tight ${item.subClass}`}>
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}