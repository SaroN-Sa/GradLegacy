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

    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">

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
            className="absolute bottom-6 right-6 flex items-center gap-2 rounded-xl bg-white/90 px-5 py-2 text-sm font-medium text-gray-700 shadow-lg backdrop-blur transition hover:bg-white"
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

            <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white bg-white shadow-2xl">

              <Image
                src={
                  profile.profileImage ||
                  "/images/default-avatar.png"
                }
                alt={profile.fullName}
                fill
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

              <h1 className="text-3xl font-bold text-gray-900">

                {profile.fullName}

              </h1>

              <BadgeCheck
                size={22}
                className="text-green-600"
              />

            </div>

            <p className="mt-1 text-gray-500">

              @{profile.username}

            </p>

            <span className="mt-4 inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">

              🎓 Graduate

            </span>

          </div>

        </div>

        {/* EDUCATION */}

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <InfoCard
            icon={
              <School
                className="text-blue-600"
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
                className="text-green-600"
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
                className="text-purple-600"
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

        <div className="mt-10 rounded-3xl border bg-gray-50 p-6">

          <h2 className="mb-4 text-xl font-semibold">

            About Me

          </h2>

          <p className="leading-8 text-gray-600 italic">

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

    <div className="rounded-2xl border bg-gray-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="mb-3 flex items-center gap-3">

        {icon}

        <span className="font-semibold">

          {title}

        </span>

      </div>

      <p className="text-gray-600">

        {value}

      </p>

    </div>

  );

}