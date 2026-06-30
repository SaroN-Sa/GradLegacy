interface DashboardCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>

      {value !== undefined && (
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      )}

      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}