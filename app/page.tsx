"use client";
import "@/components/home/Gradlegacy.css";

import { ScrollProgressBar } from "@/components/home/ScrollProgressBar";
import { AmbientParticles } from "@/components/home/AmbientParticles";
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StorySection } from "@/components/home/StorySection";
import { MomentsSection } from "@/components/home/MomentsSection";
import { WishesSection } from "@/components/home/WishesSection";
import { QuoteSection } from "@/components/home/QuoteSection";
import { CTA } from "@/components/home/CTA";
import { Footer } from "@/components/home/Footer";

export default function GraduationPage() {
  return (
    <div className="gp-root">
      <ScrollProgressBar />
      <AmbientParticles count={34} />

      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <StorySection />
      <MomentsSection />
      <WishesSection />
      <QuoteSection />
      <CTA />
      <Footer />
    </div>
  );
}