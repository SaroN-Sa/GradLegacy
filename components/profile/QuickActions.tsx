"use client";

import { Pencil, Eye, Share2, QrCode, Globe } from "lucide-react";

interface Props {
  onEdit: () => void;
  onPreview: () => void;
  onPublicPage: () => void;
  onShare: () => void;
  onQr: () => void;
}

export default function QuickActions({
  onEdit,
  onPreview,
  onPublicPage,
  onShare,
  onQr,
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
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      {actions.map((item) => {
        const Icon = item.icon;
        const isBrandNavy = item.bgClass.includes("[#0f172a]");

        return (
          <button
            key={item.title}
            onClick={item.onClick}
            className={`
              group relative flex flex-col items-center justify-center
              rounded-3xl p-6 text-center
              shadow-lg shadow-black/10 dark:shadow-black/30
              transition-all duration-200
              hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 dark:hover:shadow-black/40
              active:scale-[0.97] active:translate-y-0
              ${item.bgClass}
            `}
          >
            {/* Icon container */}
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center mb-3
              transition-transform duration-200 group-hover:scale-110
              ${isBrandNavy ? "bg-white/10" : "bg-[#0f172a]/8 dark:bg-yellow-400/10"}
            `}>
              <Icon size={22} className={item.iconClass} />
            </div>

            <h3 className={`text-sm font-bold ${item.textClass}`}>
              {item.title}
            </h3>
            <p className={`mt-0.5 text-[11px] ${item.subClass}`}>
              {item.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}