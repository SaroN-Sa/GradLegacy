"use client";
import Link from "next/link";
import { scrollTo } from "@/lib/scrollTo";

export function Navbar() {
  return (
    <nav>
      <div className="brand">
        Grad<span className="accent">Legacy</span>
      </div>
      <div className="navlinks">
        <a onClick={() => scrollTo("features")}>Features</a>
        <a onClick={() => scrollTo("how-it-works")}>How It Works</a>
        <a onClick={() => scrollTo("story")}>The Story</a>
        <a onClick={() => scrollTo("cta")}>Get Started</a>
      </div>
      <div className="nav-auth">
        <Link href="/login" className="nav-login">
          Log In
        </Link>
        <Link href="/egister" className="nav-signup">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}