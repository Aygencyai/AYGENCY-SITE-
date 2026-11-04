import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import SystemTeaser from "@/components/home/SystemTeaser";
import ServicesGrid from "@/components/home/ServicesGrid";
import Proof from "@/components/home/Proof";
import SystemCore from "@/components/home/SystemCore";
import WhyAygency from "@/components/home/WhyAygency";
import DataSecurity from "@/components/home/DataSecurity";
import CTABanner from "@/components/home/CTABanner";
import PageTransition from "@/components/ui/PageTransition";

// Canonical lives here, not in the root layout, so other pages never inherit "/".
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <SystemTeaser />
      <Proof />
      <SystemCore />
      <WhyAygency />
      <ServicesGrid />
      <DataSecurity />
      <CTABanner />
    </PageTransition>
  );
}
