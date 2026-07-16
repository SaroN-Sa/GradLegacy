"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Globe,
  ExternalLink,
  Pencil,
  X,
  Check,
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
  /**
   * Optional — called with the updated links when the user hits Save.
   * If omitted, changes are kept in local component state only
   * (frontend-only, nothing is persisted to a backend).
   */
  onSave?: (links: SocialLinksValue) => void;
}

interface SocialLinksValue {
  website: string;
  github: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

const PLATFORM_META = [
  { key: "website", name: "Website", icon: Globe, color: "text-blue-600 dark:text-blue-400", placeholder: "https://yoursite.com" },
  { key: "github", name: "GitHub", icon: FaGithub, color: "text-gray-800 dark:text-slate-200", placeholder: "https://github.com/username" },
  { key: "linkedin", name: "LinkedIn", icon: FaLinkedin, color: "text-blue-700 dark:text-blue-400", placeholder: "https://linkedin.com/in/username" },
  { key: "facebook", name: "Facebook", icon: FaFacebook, color: "text-blue-600 dark:text-blue-400", placeholder: "https://facebook.com/username" },
  { key: "instagram", name: "Instagram", icon: FaInstagram, color: "text-pink-600 dark:text-pink-400", placeholder: "https://instagram.com/username" },
  { key: "twitter", name: "X (Twitter)", icon: FaXTwitter, color: "text-black dark:text-white", placeholder: "https://x.com/username" },
] as const;

const INPUT_CLASS =
  "w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-600/10";

export default function SocialLinksCard({
  profile,
  onSave,
}: Props) {
  const [editing, setEditing] = useState(false);

  // Local, frontend-only state — this is the source of truth for display
  // once the user starts editing. Seeded from the profile prop.
  const [values, setValues] = useState<SocialLinksValue>({
    website: profile.website || "",
    github: profile.github || "",
    linkedin: profile.linkedin || "",
    facebook: profile.facebook || "",
    instagram: profile.instagram || "",
    twitter: profile.twitter || "",
  });

  // Draft state used while the form is open, so Cancel can discard changes
  const [draft, setDraft] = useState<SocialLinksValue>(values);

  const links = PLATFORM_META.map((meta) => ({
    ...meta,
    value: values[meta.key as keyof SocialLinksValue],
  }));

  const availableLinks = links.filter((item) => item.value);

  const startEditing = () => {
    setDraft(values);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const handleFieldChange = (key: keyof SocialLinksValue, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setValues(draft);
    onSave?.(draft);
    setEditing(false);
  };

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg dark:shadow-black/20">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between gap-3">

        <div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Social Links
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Connect with me across the web.
          </p>

        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!editing && (
            <span className="rounded-full bg-blue-100 dark:bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              {availableLinks.length} Connected
            </span>
          )}

          {!editing ? (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 transition hover:border-gray-400 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <Pencil size={14} />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                className="flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 transition hover:border-gray-400 dark:hover:border-slate-600"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-full bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Check size={14} />
                Save
              </button>
            </div>
          )}
        </div>

      </div>

      {editing ? (
        /* ── Edit form (frontend-only — updates local state on Save) ── */
        <div className="grid gap-4 md:grid-cols-2">
          {PLATFORM_META.map((meta) => {
            const Icon = meta.icon;
            return (
              <div key={meta.key}>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-slate-400">
                  <Icon size={14} className={meta.color} />
                  {meta.name}
                </label>
                <input
                  type="url"
                  value={draft[meta.key as keyof SocialLinksValue]}
                  onChange={(e) => handleFieldChange(meta.key as keyof SocialLinksValue, e.target.value)}
                  placeholder={meta.placeholder}
                  className={INPUT_CLASS}
                />
              </div>
            );
          })}
        </div>
      ) : availableLinks.length === 0 ? (
        /* ── Empty State ── */
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 px-6 py-12 text-center">

          <Globe
            size={48}
            className="mx-auto mb-4 text-gray-400 dark:text-slate-500"
          />

          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200">
            No Social Links Yet
          </h3>

          <p className="mt-2 text-gray-500 dark:text-slate-400">
            Click Edit above to add your social accounts.
          </p>

        </div>
      ) : (
        /* ── Link cards (read view) ── */
        <div className="grid gap-4 md:grid-cols-2">

          {availableLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.value!}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 p-5 transition-all hover:-translate-y-1 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-white dark:bg-slate-900 p-3 shadow-sm">

                    <Icon
                      size={24}
                      className={item.color}
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>

                    <p className="max-w-[180px] truncate text-sm text-gray-500 dark:text-slate-400">
                      {item.value}
                    </p>

                  </div>

                </div>

                <ExternalLink
                  size={18}
                  className="text-gray-400 dark:text-slate-500 transition group-hover:text-blue-600 dark:group-hover:text-blue-400"
                />

              </Link>
            );
          })}

        </div>
      )}

    </div>
  );
}