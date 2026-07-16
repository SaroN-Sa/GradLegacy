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
    <footer className="mt-20 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
                <GraduationCap size={18} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                GradLegacy
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Create a beautiful graduation page to share your journey and
              collect wishes from the people who supported you.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-foreground">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} GradLegacy. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made for graduates, by graduates.
          </p>
        </div>
      </div>
    </footer>
  );
}