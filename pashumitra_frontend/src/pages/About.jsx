"use client";

import HeroSection from "../components/About/HeroSection";
import AboutSection from "../components/About/AboutSection";
import ServicesSection from "../components/About/ServiceSection";
import ImpactSection from "../components/About/ImpactSection";
import CTASection from "../components/About/CtaSection";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ImpactSection />
        <CTASection />
      </div>
      <Footer />
    </>
  );
}
