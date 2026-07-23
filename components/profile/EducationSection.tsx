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

const INPUT_CLASS =
  "w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 py-2.5 sm:py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white outline-none transition placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950";

export default function EducationSection({
  form,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-black/20 sm:p-6">

      {/* Header */}

      <div className="mb-5 sm:mb-6">

        <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
          Education
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Tell visitors about your academic journey.
        </p>

      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">

        {/* University */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
            University
          </label>

          <div className="relative">

            <Building2
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            />

            <input
              type="text"
              name="university"
              value={form.university || ""}
              onChange={onChange}
              placeholder="Harvard University"
              className={INPUT_CLASS}
            />

          </div>

        </div>

        {/* Department */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
            Department
          </label>

          <div className="relative">

            <BookOpen
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            />

            <input
              type="text"
              name="department"
              value={form.department || ""}
              onChange={onChange}
              placeholder="Software Engineering"
              className={INPUT_CLASS}
            />

          </div>

        </div>

      </div>

      {/* Graduation Year */}

      <div className="mt-4 sm:mt-5">

        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
          Graduation Year
        </label>

        <div className="relative">

          <CalendarDays
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          />

          <input
            type="number"
            name="graduationYear"
            value={form.graduationYear || ""}
            onChange={onChange}
            placeholder="2026"
            className={INPUT_CLASS}
          />

        </div>

      </div>

    </div>
  );
}