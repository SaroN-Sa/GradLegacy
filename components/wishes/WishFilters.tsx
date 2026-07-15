"use client";

interface WishFiltersProps {
  search: string;
  status: "all" | "pending" | "published" | "hidden";
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: "all" | "pending" | "published" | "hidden"
  ) => void;
}

export default function WishFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: WishFiltersProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">

        {/* Search */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Search Wishes
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search by visitor, relationship or message..."
            className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value as
                  | "all"
                  | "pending"
                  | "published"
                  | "hidden"
              )
            }
            className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500"
          >
            <option value="all">
              All Wishes
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="published">
              Published
            </option>

            <option value="hidden">
              Hidden
            </option>
          </select>
        </div>

      </div>
    </div>
  );
}