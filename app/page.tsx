"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorks from "@/components/home/how-it-works";
import CTASection from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <Navbar />

      <HeroSection />

      <FeaturesSection />

      <HowItWorks />

      <CTASection />

      <Footer />
    </>
  );
}