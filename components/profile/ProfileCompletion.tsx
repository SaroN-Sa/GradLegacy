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

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold">

            Profile Completion

          </h2>

          <p className="mt-1 text-sm text-gray-500">

            Complete your profile to
            unlock all GradLegacy
            features.

          </p>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">

          <CheckCircle2
            size={18}
            className="text-blue-600"
          />

          <span className="font-semibold text-blue-700">

            {percentage}%

          </span>

        </div>

      </div>

      {/* progress */}

      <div className="mt-6">

        <div className="h-3 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

      {/* stats */}

      <div className="mt-5 grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-green-50 p-4">

          <p className="text-sm text-gray-500">

            Completed

          </p>

          <h3 className="text-2xl font-bold text-green-600">

            {completed}

          </h3>

        </div>

        <div className="rounded-2xl bg-orange-50 p-4">

          <p className="text-sm text-gray-500">

            Remaining

          </p>

          <h3 className="text-2xl font-bold text-orange-600">

            {remaining}

          </h3>

        </div>

      </div>

      {/* footer */}

      <div className="mt-5 rounded-2xl bg-gray-50 p-4">

        <p className="text-sm text-gray-600">

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