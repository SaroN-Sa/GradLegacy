import Link from "next/link";
import { GraduationCap, Mail } from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Get Started", href: "#cta" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  { label: "GitHub", icon: FaGithub, href: "https://github.com" },
  { label: "Twitter", icon: FaXTwitter, href: "https://twitter.com" },
  { label: "Email", icon: Mail, href: "mailto:hello@gradlegacy.com" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 sm:mt-16 md:mt-20 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-14">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-foreground text-background shrink-0">
                <GraduationCap size={17} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-foreground">
                GradLegacy
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-xs sm:text-sm text-muted-foreground">
              Create a beautiful graduation page to share your journey and
              collect wishes from the people who supported you.
            </p>

            <div className="mt-4 sm:mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground"
                  >
                    <Icon size={15} className="sm:w-4 sm:h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground">
                {col.heading}
              </h3>
              <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-3 sm:gap-4 border-t border-border pt-5 sm:pt-6 sm:flex-row">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            © {year} GradLegacy. All rights reserved.
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground text-center">
            Made for graduates, by graduates.
          </p>
        </div>
      </div>
    </footer>
  );
}