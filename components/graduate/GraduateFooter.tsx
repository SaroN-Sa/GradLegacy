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
    <footer className="mt-10 overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/20">
      <div className="px-8 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] shadow-lg">
            <GraduationCap size={30} className="text-[#FFD700]" />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Grad<span className="text-[#B8860B]">Legacy</span>
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
            Celebrating graduates by preserving their achievements, memories and milestones in
            one beautiful digital graduation profile.
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-medium">
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
        <div className="mt-8 flex justify-center gap-4">
          <a
            href={`mailto:${contactEmail}`}
            aria-label="Email us"
            title={contactEmail}
            className="rounded-xl border border-gray-200 p-3 text-gray-700 transition hover:border-[#0f172a]/20 hover:bg-gray-100 hover:text-[#0f172a]"
          >
            <Mail size={18} />
          </a>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View our GitHub"
            className="rounded-xl border border-gray-200 p-3 text-gray-700 transition hover:border-[#0f172a]/20 hover:bg-gray-100 hover:text-[#0f172a]"
          >
            <FaGithub size={18} />
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-gray-500 md:flex-row">
          <p>© {currentYear} GradLegacy. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Made by Habtamu Samuel
            <Heart size={15} className="fill-red-500 text-red-500" />
            for graduates.
          </p>
        </div>
      </div>
    </footer>
  );
}