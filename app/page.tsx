"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import { useLanguage } from "@/store/language-context";

const content = {
  en: {
    title: "Preserve Your Graduation Legacy",
    description:
      "Collect wishes, photos, videos and memories from family and friends.",
  },

  am: {
    title: "የምረቃ ትውስታዎችዎን ያስቀምጡ",
    description:
      "ከቤተሰብ እና ከጓደኞች መልዕክቶችን ይሰብስቡ።",
  },

  it: {
    title: "Conserva il tuo ricordo di laurea",
    description:
      "Raccogli auguri, foto e video da amici e familiari.",
  },
};

export default function Home() {
  const { language } = useLanguage();

  const t = content[language];

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-bold mb-6">
          {t.title}
        </h1>

        <p className="max-w-2xl text-lg">
          {t.description}
        </p>
      </main>

      <Footer />
    </>
  );
}