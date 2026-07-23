"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { scrollTo } from "@/lib/scrollTo";

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route/hash change or Escape, and lock body
  // scroll while it's open — same pattern as the dashboard Sidebar drawer.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNavClick = (id: string) => {
    setOpen(false);
    scrollTo(id);
  };

  return (
    <nav>
      <div className="brand">
        Grad<span className="accent">Legacy</span>
      </div>

      <div className={`navlinks${open ? " open" : ""}`}>
        <a onClick={() => handleNavClick("features")}>Features</a>
        <a onClick={() => handleNavClick("how-it-works")}>How It Works</a>
        <a onClick={() => handleNavClick("story")}>The Story</a>
        <a onClick={() => handleNavClick("cta")}>Get Started</a>
      </div>

      <div className="nav-auth">
        <Link href="/login" className="nav-login">
          Log In
        </Link>
        <Link href="/register" className="nav-signup">
          Register
        </Link>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </nav>
  );
}