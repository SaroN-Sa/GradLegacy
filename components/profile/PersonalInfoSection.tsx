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

const INPUT_CLASS =
  "w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 py-2.5 sm:py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white outline-none transition placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950";

export default function PersonalInfoSection({
  form,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-black/20 sm:p-6">

      {/* Header */}

      <div className="mb-5 sm:mb-6">

        <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Tell visitors who you are.
        </p>

      </div>

      <div className="space-y-4 sm:space-y-5">

        {/* Full Name */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            />

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="John Doe"
              className={INPUT_CLASS}
            />

          </div>

        </div>

        {/* Username */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
            Username
          </label>

          <div className="relative">

            <AtSign
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            />

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="john_doe"
              className={INPUT_CLASS}
            />

          </div>

        </div>

        {/* Bio */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
            Bio
          </label>

          <textarea
            rows={5}
            name="bio"
            value={form.bio}
            onChange={onChange}
            placeholder="Write something about yourself..."
            className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3.5 sm:p-4 text-sm text-gray-900 dark:text-white outline-none transition resize-none placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950"
          />

        </div>

      </div>

    </div>
  );
}