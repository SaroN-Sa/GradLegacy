import ThemeToggle from "@/components/shared/theme-toggle";
import LanguageSwitcher from "@/components/shared/language-switcher";

export default function Navbar() {
  return (
    <header className="sticky top-0 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">
            🎓 GradLegacy
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#cta">Get Started</a>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />

          <button className="rounded-lg border px-4 py-2">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}