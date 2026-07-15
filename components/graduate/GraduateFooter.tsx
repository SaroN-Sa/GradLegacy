"use client";

import Link from "next/link";
import { GraduationCap, Heart, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function GraduateFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/20">
      <div className="px-8 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] shadow-lg">
            <GraduationCap
              size={30}
              className="text-yellow-400"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Grad<span className="text-yellow-500">Legacy</span>
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
            Celebrating graduates by preserving their achievements,
            memories and milestones in one beautiful digital graduation
            profile.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-gray-600 transition hover:text-[#0f172a]"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="text-gray-600 transition hover:text-[#0f172a]"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-gray-600 transition hover:text-[#0f172a]"
          >
            Contact
          </Link>

          <Link
            href="/privacy"
            className="text-gray-600 transition hover:text-[#0f172a]"
          >
            Privacy
          </Link>
        </div>

        {/* Social */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="rounded-xl border border-gray-200 p-3 transition hover:bg-gray-100">
            <Mail
              size={18}
              className="text-gray-700"
            />
          </button>

          <button className="rounded-xl border border-gray-200 p-3 transition hover:bg-gray-100">
            <FaGithub
              size={18}
              className="text-gray-700"
            />
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-gray-500 md:flex-row">
          <p>
            © {currentYear} GradLegacy. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Made with
            <Heart
              size={15}
              className="fill-red-500 text-red-500"
            />
            for graduates.
          </p>
        </div>
      </div>
    </footer>
  );
}