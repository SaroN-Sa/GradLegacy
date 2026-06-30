"use client";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  return (
    <header className="h-20 border-b bg-white dark:bg-zinc-900 px-8 flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-bold">
          {title}
        </h1>

        {subtitle && (
          <p className="text-gray-500 text-sm">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="font-semibold">
            Welcome 👋
          </p>

          <p className="text-sm text-gray-500">
            Manage your graduation page
          </p>

        </div>

      </div>

    </header>
  );
}