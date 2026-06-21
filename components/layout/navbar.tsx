import ThemeToggle from "@/components/shared/theme-toggle";
import LanguageSwitcher from "@/components/shared/language-switcher";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="font-bold text-xl">
          🎓 GradLegacy
        </h1>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}