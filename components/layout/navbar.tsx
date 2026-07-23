"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";

import ThemeToggle from "@/components/shared/theme-toggle";
import LanguageSwitcher from "@/components/shared/language-switcher";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Get Started", href: "#cta" },
] as const;

const LOGIN_BUTTON_CLASS =
  "flex items-center justify-center rounded-full bg-foreground px-4 sm:px-5 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-border bg-background/80 backdrop-blur-lg shadow-sm"
          : "border-transparent bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-foreground text-background">
            <GraduationCap size={17} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-foreground">
            GradLegacy
          </span>
        </Link>

        {/* Tablet/Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Tablet/Desktop actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />

          <Link href="/login" className={LOGIN_BUTTON_CLASS}>
            Login
          </Link>
        </div>

        {/* Mobile trigger — below md (covers phones and small tablets) */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            {mobileOpen ? <X size={19} className="sm:w-5 sm:h-5" /> : <Menu size={19} className="sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/tablet menu */}
      <div
        className={`md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-lg transition-[max-height] duration-300 ease-in-out ${
          mobileOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-3 sm:px-6 sm:py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}

          <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-3.5 sm:pt-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={`flex-1 ${LOGIN_BUTTON_CLASS} py-2.5`}
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}