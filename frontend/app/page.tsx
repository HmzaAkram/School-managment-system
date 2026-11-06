import dynamic from "next/dynamic";
import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";

// Above the fold: Navbar + Hero load immediately
// Below the fold: lazy load everything else
const StatsBar = dynamic(() => import("@/components/landing/StatsBar"));
const ProblemSolution = dynamic(() => import("@/components/landing/ProblemSolution"));
const Features = dynamic(() => import("@/components/landing/Features"));
const DashboardPreview = dynamic(() => import("@/components/landing/DashboardPreview"));
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"));
const Testimonials = dynamic(() => import("@/components/landing/Testimonials"));
const FinalCTA = dynamic(() => import("@/components/landing/FinalCTA"));
const Footer = dynamic(() => import("@/components/landing/Footer"));
const LenisProvider = dynamic(() => import("@/components/providers/LenisProvider"), { ssr: false });

function SectionFallback() {
  return <div className="py-20" />;
}

export default function Home() {
  return (
    <LenisProvider>
      <div className="min-h-screen flex flex-col w-full overflow-x-hidden" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Navbar />
        <main className="flex-1 w-full">
          <Hero />
          <Suspense fallback={<SectionFallback />}>
            <StatsBar />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ProblemSolution />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Features />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <DashboardPreview />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <HowItWorks />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Testimonials />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <FinalCTA />
          </Suspense>
        </main>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>
    </LenisProvider>
  );
}
