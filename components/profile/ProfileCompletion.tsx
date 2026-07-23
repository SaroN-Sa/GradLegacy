"use client";

import type { GraduateProfile } from "@/types/profile";
import { CheckCircle2 } from "lucide-react";

interface Props {
  profile: GraduateProfile;
}

export default function ProfileCompletion({
  profile,
}: Props) {

  const fields = [
    profile.fullName,
    profile.username,
    profile.bio,
    profile.university,
    profile.department,
    profile.graduationYear,
    profile.profileImage,
    profile.coverImage,
  ];

  const completed =
    fields.filter(Boolean).length;

  const total =
    fields.length;

  const percentage =
    Math.round(
      (completed / total) * 100
    );

  const remaining =
    total - completed;

  return (

    <div className="rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm dark:shadow-black/20">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">

            Profile Completion

          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">

            Complete your profile to
            unlock all GradLegacy
            features.

          </p>

        </div>

        <div className="flex w-fit items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-500/10 px-3.5 py-2 sm:px-4">

          <CheckCircle2
            size={18}
            className="text-blue-600 dark:text-blue-400"
          />

          <span className="font-semibold text-blue-700 dark:text-blue-300">

            {percentage}%

          </span>

        </div>

      </div>

      {/* progress */}

      <div className="mt-5 sm:mt-6">

        <div className="h-2.5 sm:h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

      {/* stats */}

      <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 sm:gap-4">

        <div className="rounded-2xl bg-green-50 dark:bg-green-500/10 p-3.5 sm:p-4">

          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">

            Completed

          </p>

          <h3 className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">

            {completed}

          </h3>

        </div>

        <div className="rounded-2xl bg-orange-50 dark:bg-orange-500/10 p-3.5 sm:p-4">

          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">

            Remaining

          </p>

          <h3 className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">

            {remaining}

          </h3>

        </div>

      </div>

      {/* footer */}

      <div className="mt-4 sm:mt-5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 p-3.5 sm:p-4">

        <p className="text-sm text-gray-600 dark:text-slate-300">

          {percentage === 100
            ? "🎉 Congratulations! Your profile is fully completed."
            : `Add ${remaining} more field${
                remaining > 1 ? "s" : ""
              } to complete your profile.`}

        </p>

      </div>

    </div>

  );

}