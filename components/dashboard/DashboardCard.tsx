interface DashboardCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  children?: React.ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  children,
  className = "",
}: DashboardCardProps) {
  const trendColor =
    trend?.direction === "up"
      ? "text-green-600 bg-green-50"
      : trend?.direction === "down"
      ? "text-red-600 bg-red-50"
      : "text-gray-500 bg-gray-50";

  return (
    <div
      className={`rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-black/5 transition-shadow hover:shadow-2xl hover:shadow-black/10 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {title}
        </h3>

        {icon && (
          <div className="w-9 h-9 rounded-xl bg-[#0f172a]/8 flex items-center justify-center text-[#0f172a] shrink-0">
            {icon}
          </div>
        )}
      </div>

      {value !== undefined && (
        <p className="mt-2 text-3xl font-extrabold text-[#0f172a] tracking-tight">
          {value}
        </p>
      )}

      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}

        {trend && (
          <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${trendColor}`}>
            {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "·"} {trend.value}
          </span>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}