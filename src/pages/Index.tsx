import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import FlashDeals from "@/components/FlashDeals";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Dream Ladder — Land & Plots for Sale in Ranchi, Jharkhand"
        description="Buy residential, agricultural and investment land in and around Ranchi with Dream Ladder. Verified plots, clear titles and expert guidance from local land specialists."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "Dream Ladder",
          image: "https://dreamladder.lovable.app/og-dream-ladder.jpg",
          url: "https://dreamladder.lovable.app/",
          email: "dreamladderranchi@gmail.com",
          telephone: ["+917004088007", "+918797770777"],
          address: {
            "@type": "PostalAddress",
            streetAddress: "House No. 384/B, Road No-4, Ashok Nagar",
            addressLocality: "Ranchi",
            addressRegion: "Jharkhand",
            addressCountry: "IN",
          },
          areaServed: "Ranchi, Jharkhand",
          openingHours: "Mo-Sa 09:00-20:00",
        }}
      />
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <FlashDeals />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
