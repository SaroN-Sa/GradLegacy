"use client";

import { UserCheck, Heart, Eye, Images, TrendingUp } from "lucide-react";

interface StatItem {
  title: string;
  value: string | number;
  icon: typeof UserCheck;
  suffix?: string;
  /** Optional trend — positive = green up arrow, negative = red down */
  trend?: number;
}

interface Props {
  completion: number;
  wishes?: number;
  visitors?: number;
  gallery?: number;
}

export default function ProfileStats({
  completion,
  wishes = 0,
  visitors = 0,
  gallery = 0,
}: Props) {
  const stats: StatItem[] = [
    {
      title: "Profile Completion",
      value: completion,
      suffix: "%",
      icon: UserCheck,
    },
    {
      title: "Wishes Received",
      value: wishes,
      icon: Heart,
    },
    {
      title: "Page Visitors",
      value: visitors,
      icon: Eye,
    },
    {
      title: "Gallery Items",
      value: gallery,
      icon: Images,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isCompletion = stat.suffix === "%";
        const pct = isCompletion ? Number(stat.value) : null;

        // Determine completion ring colour
        const ringColor =
          pct === null ? ""
          : pct >= 80 ? "text-emerald-400"
          : pct >= 50 ? "text-yellow-400"
          : "text-red-400";

        return (
          <div
            key={stat.title}
            className="
              group relative flex flex-col justify-between
              bg-white rounded-3xl p-6
              border border-gray-100
              shadow-lg shadow-black/5
              transition-all duration-200
              hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10
              overflow-hidden
            "
          >
            {/* Subtle navy top-left glow — brand accent */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#0f172a]/5 rounded-full pointer-events-none" />

            {/* Header row */}
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div>
                {/* Label */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  {stat.title}
                </p>

                {/* Value */}
                <div className="mt-2 flex items-end gap-1 leading-none">
                  <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    {stat.value}
                  </h2>
                  {stat.suffix && (
                    <span className="text-xl font-bold text-gray-400 mb-0.5">
                      {stat.suffix}
                    </span>
                  )}
                </div>
              </div>

              {/* Icon chip — navy bg with yellow icon, matches sidebar/logo style */}
              <div className="
                w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                bg-[#0f172a]
                shadow-md shadow-[#0f172a]/20
                transition-transform duration-200 group-hover:scale-110
              ">
                <Icon size={20} className="text-yellow-400" />
              </div>
            </div>

            {/* Completion progress bar — only shown for the completion stat */}
            {isCompletion && pct !== null && (
              <div className="mt-5 relative z-10">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      pct >= 80
                        ? "bg-emerald-400"
                        : pct >= 50
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className={`mt-1.5 text-[11px] font-semibold ${ringColor}`}>
                  {pct >= 80
                    ? "Looking great!"
                    : pct >= 50
                    ? "Almost there"
                    : "Keep going"}
                </p>
              </div>
            )}

            {/* Bottom separator line — yellow accent, matches brand */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0f172a] to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        );
      })}
    </div>
  );
}