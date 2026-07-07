"use client";

import { User, AtSign } from "lucide-react";
import { ProfileFormData } from "@/types/profile-form";

interface Props {
  form: ProfileFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function PersonalInfoSection({
  form,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Tell visitors who you are.
        </p>

      </div>

      <div className="space-y-5">

        {/* Full Name */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:bg-white"
            />

          </div>

        </div>

        {/* Username */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Username
          </label>

          <div className="relative">

            <AtSign
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="john_doe"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:bg-white"
            />

          </div>

        </div>

        {/* Bio */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Bio
          </label>

          <textarea
            rows={5}
            name="bio"
            value={form.bio}
            onChange={onChange}
            placeholder="Write something about yourself..."
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm outline-none transition resize-none focus:border-blue-600 focus:bg-white"
          />

        </div>

      </div>

    </div>
  );
}