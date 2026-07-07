"use client";

import Link from "next/link";

import {
  Globe,
  ExternalLink,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

import { GraduateProfile } from "@/types/profile";

interface Props {
  profile: GraduateProfile;
}

export default function SocialLinksCard({
  profile,
}: Props) {
  const links = [
    {
      name: "Website",
      value: profile.website,
      icon: Globe,
      color: "text-blue-600",
    },
    {
      name: "GitHub",
      value: profile.github,
      icon: FaGithub,
      color: "text-gray-800",
    },
    {
      name: "LinkedIn",
      value: profile.linkedin,
      icon: FaLinkedin,
      color: "text-blue-700",
    },
    {
      name: "Facebook",
      value: profile.facebook,
      icon: FaFacebook,
      color: "text-blue-600",
    },
    {
      name: "Instagram",
      value: profile.instagram,
      icon: FaInstagram,
      color: "text-pink-600",
    },
    {
      name: "X (Twitter)",
      value: profile.twitter,
      icon: FaXTwitter,
      color: "text-black",
    },
  ];

  const availableLinks = links.filter(
    (item) => item.value
  );

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            Social Links
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Connect with me across the web.
          </p>

        </div>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          {availableLinks.length} Connected
        </span>

      </div>

      {/* Empty State */}

      {availableLinks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">

          <Globe
            size={48}
            className="mx-auto mb-4 text-gray-400"
          />

          <h3 className="text-lg font-semibold text-gray-700">
            No Social Links Yet
          </h3>

          <p className="mt-2 text-gray-500">
            Add your social accounts from the
            Edit Profile section.
          </p>

        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">

          {availableLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.value!}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all hover:-translate-y-1 hover:border-blue-500 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-white p-3 shadow-sm">

                    <Icon
                      size={24}
                      className={item.color}
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="max-w-[180px] truncate text-sm text-gray-500">
                      {item.value}
                    </p>

                  </div>

                </div>

                <ExternalLink
                  size={18}
                  className="text-gray-400 transition group-hover:text-blue-600"
                />

              </Link>
            );
          })}

        </div>
      )}

    </div>
  );
}