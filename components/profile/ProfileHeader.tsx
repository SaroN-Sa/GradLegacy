"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Calendar,
  GraduationCap,
  Pencil,
  School,
} from "lucide-react";

import ImageUpload from "@/components/ImageUpload";
import type { GraduateProfile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: GraduateProfile;

  onEdit?: () => void;

  onProfileImageChange?: (
    url: string
  ) => Promise<void> | void;

  onCoverImageChange?: (
    url: string
  ) => Promise<void> | void;
}

export default function ProfileHeader({
  profile,
  onEdit,
  onProfileImageChange,
  onCoverImageChange,
}: ProfileHeaderProps) {

  if (!profile) return null;

  return (

    <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-black/30">

      {/* COVER */}

      <div className="relative h-72 w-full">

        <Image
          src={
            profile.coverImage ||
            "/images/default-cover.jpg"
          }
          alt="Cover Image"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* upload cover */}

        <div className="absolute right-5 top-5">

          <ImageUpload
            onUpload={(url) =>
              onCoverImageChange?.(url)
            }
          />

        </div>

        {/* edit profile */}

        {onEdit && (

          <button
            onClick={onEdit}
            className="absolute bottom-6 right-6 flex items-center gap-2 rounded-xl bg-white/90 dark:bg-slate-900/90 px-5 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 shadow-lg backdrop-blur transition hover:bg-white dark:hover:bg-slate-900"
          >

            <Pencil size={16} />

            Edit Profile

          </button>

        )}

      </div>

      {/* CONTENT */}

      <div className="relative px-6 pb-8 lg:px-10">

        {/* AVATAR */}

        <div className="-mt-20 flex justify-center lg:justify-start">

          <div className="relative">

            <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 shadow-2xl">

              <Image
                src={
                  profile.profileImage ||
                  "/images/default-avatar.png"
                }
                alt={profile.fullName}
                fill
                sizes="160px"
                className="object-cover"
              />

            </div>

            {/* upload avatar */}

            <div className="absolute bottom-1 right-1">

              <ImageUpload
                onUpload={(url) =>
                  onProfileImageChange?.(url)
                }
              />

            </div>

          </div>

        </div>

        {/* HEADER */}

        <div className="mt-6 flex flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div className="text-center lg:text-left">

            <div className="flex items-center justify-center gap-2 lg:justify-start">

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">

                {profile.fullName}

              </h1>

              <BadgeCheck
                size={22}
                className="text-green-600 dark:text-green-400"
              />

            </div>

            <p className="mt-1 text-gray-500 dark:text-slate-400">

              @{profile.username}

            </p>

            <span className="mt-4 inline-flex rounded-full bg-blue-100 dark:bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">

              🎓 Graduate

            </span>

          </div>

        </div>

        {/* EDUCATION */}

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <InfoCard
            icon={
              <School
                className="text-blue-600 dark:text-blue-400"
              />
            }
            title="University"
            value={
              profile.university ||
              "Not Added"
            }
          />

          <InfoCard
            icon={
              <GraduationCap
                className="text-green-600 dark:text-green-400"
              />
            }
            title="Department"
            value={
              profile.department ||
              "Not Added"
            }
          />

          <InfoCard
            icon={
              <Calendar
                className="text-purple-600 dark:text-purple-400"
              />
            }
            title="Graduation Year"
            value={
              profile.graduationYear?.toString() ||
              "Not Added"
            }
          />

        </div>

        {/* ABOUT */}

        <div className="mt-10 rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 p-6">

          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">

            About Me

          </h2>

          <p className="leading-8 text-gray-600 dark:text-slate-300 italic">

            {profile.bio ||

              "No biography has been added yet. Tell visitors about yourself and your graduation journey."}

          </p>

        </div>

      </div>

    </div>

  );
}


function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;

  title: string;

  value: string;
}) {

  return (

    <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/30">

      <div className="mb-3 flex items-center gap-3">

        {icon}

        <span className="font-semibold text-gray-900 dark:text-white">

          {title}

        </span>

      </div>

      <p className="text-gray-600 dark:text-slate-300">

        {value}

      </p>

    </div>

  );

}