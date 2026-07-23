"use client";

import Link from "next/link";
import { GraduationCap, Heart, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface GraduateFooterProps {
  contactEmail?: string;
  githubUrl?: string;
}

export default function GraduateFooter({
  contactEmail = "hello@gradlegacy.com",
  githubUrl = "https://github.com/gradlegacy",
}: GraduateFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-black/20 w-full">
      <div className="px-5 py-6 sm:px-6 sm:py-7 md:px-8 md:py-8">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] shadow-lg">
            <GraduationCap size={26} className="text-[#FFD700] sm:w-[30px] sm:h-[30px]" />
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Grad<span className="text-[#B8860B]">Legacy</span>
          </h2>

          <p className="mt-2 max-w-md text-xs sm:text-sm leading-6 text-gray-500 px-2 sm:px-0">
            Celebrating graduates by preserving their achievements, memories and milestones in
            one beautiful digital graduation profile.
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-6 text-xs sm:text-sm font-medium">
          <Link href="/" className="text-gray-600 transition hover:text-[#0f172a]">
            Home
          </Link>

          <Link href="/about" className="text-gray-600 transition hover:text-[#0f172a]">
            About
          </Link>

          <Link href="/contact" className="text-gray-600 transition hover:text-[#0f172a]">
            Contact
          </Link>

          <Link href="/privacy" className="text-gray-600 transition hover:text-[#0f172a]">
            Privacy
          </Link>
        </nav>

        {/* Social */}
        <div className="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4">
          <a
            href={`mailto:${contactEmail}`}
            aria-label="Email us"
            title={contactEmail}
            className="rounded-xl border border-gray-200 p-2.5 sm:p-3 text-gray-700 transition hover:border-[#0f172a]/20 hover:bg-gray-100 hover:text-[#0f172a]"
          >
            <Mail size={17} className="sm:w-[18px] sm:h-[18px]" />
          </a>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View our GitHub"
            className="rounded-xl border border-gray-200 p-2.5 sm:p-3 text-gray-700 transition hover:border-[#0f172a]/20 hover:bg-gray-100 hover:text-[#0f172a]"
          >
            <FaGithub size={17} className="sm:w-[18px] sm:h-[18px]" />
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex flex-col items-center justify-between gap-2 sm:gap-3 text-center text-xs sm:text-sm text-gray-500 md:flex-row">
          <p>© {currentYear} GradLegacy. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Made by Habtamu Samuel
            <Heart size={14} className="fill-red-500 text-red-500 sm:w-[15px] sm:h-[15px]" />
            for graduates.
          </p>
        </div>
      </div>
    </footer>
  );
}