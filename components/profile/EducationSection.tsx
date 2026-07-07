"use client";

import {
  Building2,
  BookOpen,
  CalendarDays,
} from "lucide-react";

import { GraduateProfile } from "@/types/profile";

interface Props {
  form: GraduateProfile;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function EducationSection({
  form,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-900">
          Education
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Tell visitors about your academic journey.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* University */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            University
          </label>

          <div className="relative">

            <Building2
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="university"
              value={form.university || ""}
              onChange={onChange}
              placeholder="Harvard University"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:bg-white"
            />

          </div>

        </div>

        {/* Department */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Department
          </label>

          <div className="relative">

            <BookOpen
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="department"
              value={form.department || ""}
              onChange={onChange}
              placeholder="Software Engineering"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:bg-white"
            />

          </div>

        </div>

      </div>

      {/* Graduation Year */}

      <div className="mt-5">

        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Graduation Year
        </label>

        <div className="relative">

          <CalendarDays
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="number"
            name="graduationYear"
            value={form.graduationYear || ""}
            onChange={onChange}
            placeholder="2026"
            className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:bg-white"
          />

        </div>

      </div>

    </div>
  );
}