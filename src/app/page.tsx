import Hero from "@/components/home/Hero";
import PainPoint from "@/components/home/PainPoint";
import BrandPillars from "@/components/home/BrandPillars";
import ServicesGrid from "@/components/home/ServicesGrid";
import CaseStudies from "@/components/home/CaseStudies";
import Process from "@/components/home/Process";
import Metrics from "@/components/home/Metrics";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PainPoint />
      <BrandPillars />
      <ServicesGrid />
      <CaseStudies />
      <Process />
      <Metrics />
      <FinalCTA />
    </>
  );
}
