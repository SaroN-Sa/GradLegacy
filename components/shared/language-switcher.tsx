"use client";

import { useLanguage } from "@/store/language-context";

export default function LanguageSwitcher() {
  const { language, setLanguage } =
    useLanguage();

  return (
    <select
      value={language}
      onChange={(e) =>
        setLanguage(
          e.target.value as "en" | "am" | "it"
        )
      }
      className="border rounded-lg p-2"
    >
      <option value="en">English</option>
      <option value="am">አማርኛ</option>
      <option value="it">Italiano</option>
    </select>
  );
}