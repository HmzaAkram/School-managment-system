import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PricingComponent from "@/components/landing/Pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-50">
      <Navbar />
      <main className="flex-1 w-full pt-20">
        <PricingComponent />
      </main>
      <Footer />
    </div>
  );
}
