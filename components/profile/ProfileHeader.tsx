"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
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

  onBack?: () => void;

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
  onBack,
  onProfileImageChange,
  onCoverImageChange,
}: ProfileHeaderProps) {

  const router = useRouter();

  if (!profile) return null;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (

    <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-black/30">

      {/* COVER */}

      <div className="relative h-44 w-full sm:h-56 lg:h-72">

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

        {/* back */}

        <button
          onClick={handleBack}
          aria-label="Back"
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 py-2 pl-2.5 pr-3 text-sm font-medium text-gray-700 dark:text-slate-200 shadow-lg backdrop-blur transition hover:bg-white dark:hover:bg-slate-900 sm:left-5 sm:top-5"
        >

          <ArrowLeft size={16} />

          <span className="hidden sm:inline">Back</span>

        </button>

        {/* upload cover */}

        <div className="absolute right-3 top-3 sm:right-5 sm:top-5">

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
            className="absolute bottom-4 right-3 flex items-center gap-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-slate-200 shadow-lg backdrop-blur transition hover:bg-white dark:hover:bg-slate-900 sm:bottom-6 sm:right-6 sm:gap-2 sm:px-5 sm:text-sm"
          >

            <Pencil size={15} className="sm:hidden" />
            <Pencil size={16} className="hidden sm:block" />

            Edit Profile

          </button>

        )}

      </div>

      {/* CONTENT */}

      <div className="relative px-4 pb-6 sm:px-6 sm:pb-8 lg:px-10">

        {/* AVATAR */}

        <div className="-mt-14 flex justify-center sm:-mt-16 lg:-mt-20 lg:justify-start">

          <div className="relative">

            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 shadow-2xl sm:h-32 sm:w-32 lg:h-40 lg:w-40">

              <Image
                src={
                  profile.profileImage ||
                  "/images/default-avatar.png"
                }
                alt={profile.fullName}
                fill
                sizes="(max-width:640px) 112px, (max-width:1024px) 128px, 160px"
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

        <div className="mt-5 flex flex-col items-center gap-4 sm:mt-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="text-center lg:text-left">

            <div className="flex items-center justify-center gap-2 lg:justify-start">

              <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">

                {profile.fullName}

              </h1>

              <BadgeCheck
                size={20}
                className="shrink-0 text-green-600 dark:text-green-400 sm:h-[22px] sm:w-[22px]"
              />

            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 sm:text-base">

              @{profile.username}

            </p>

            <span className="mt-3 inline-flex rounded-full bg-blue-100 dark:bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 sm:mt-4">

              🎓 Graduate

            </span>

          </div>

        </div>

        {/* EDUCATION */}

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">

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

        <div className="mt-8 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 p-4 sm:mt-10 sm:rounded-3xl sm:p-6">

          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white sm:mb-4 sm:text-xl">

            About Me

          </h2>

          <p className="leading-7 text-gray-600 dark:text-slate-300 italic sm:leading-8">

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

    <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/30 sm:p-5">

      <div className="mb-2.5 flex items-center gap-3 sm:mb-3">

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