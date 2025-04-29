"use client"

import HeroSection from "../components/About/HeroSection"
import AboutSection from "../components/About/AboutSection"
import ServicesSection from "../components/About/ServiceSection"
import ImpactSection from "../components/About/ImpactSection"
import CTASection from "../components/About/CtaSection"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ImpactSection />
      <CTASection />
    </div>
  )
}
