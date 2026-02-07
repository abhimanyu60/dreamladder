import { Link } from "react-router-dom";
import { Phone, MessageCircle, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";

const Hero = () => {
  const whatsappLink = "https://wa.me/917004088007?text=Hello%20Dream%20Ladder%2C%20I%20am%20interested%20in%20your%20properties.";

  const [heroSettings, setHeroSettings] = useState({
    badgeText: "TRUSTED BY 200+ FAMILIES",
    heading: "Find Your Perfect Property in",
    location: "Ranchi",
    subheading: "Premium residential plots, agricultural land, and commercial properties. Your trusted partner in real estate since 2014.",
    stat1Value: "50+",
    stat1Label: "Properties Listed",
    stat2Value: "200+",
    stat2Label: "Happy Clients",
    stat3Value: "10+",
    stat3Label: "Years Experience",
    stat4Value: "100%",
    stat4Label: "Legal Verified",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getAll();
        if (response.success && response.data.hero) {
          setHeroSettings(response.data.hero);
        }
      } catch (error) {
        console.error("Failed to fetch hero settings:", error);
        // Use default values on error
      }
    };

    fetchSettings();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Tint */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroBg}
          alt="Premium Land Development in Ranchi"
          className="w-full h-full object-cover zoom-animation"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-3xl">
          {/* Badge with Glassmorphism */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-orange animate-pulse shadow-lg" />
            <span className="text-sm font-semibold text-white tracking-wide">{heroSettings.badgeText}</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s", textShadow: "2px 2px 10px rgba(0, 0, 0, 0.8)" }}>
            {heroSettings.heading}{" "}
            <span className="text-orange" style={{ textShadow: "2px 2px 10px rgba(0, 0, 0, 0.8)" }}>{heroSettings.location}</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white mb-8 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s", textShadow: "1px 1px 6px rgba(0, 0, 0, 0.7)" }}>
            {heroSettings.subheading}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/properties">
              <Button size="lg" className="btn-gold gap-2 text-base h-12 px-6">
                <Building2 className="w-5 h-5" />
                View Properties
              </Button>
            </Link>
            <a href="tel:+917004088007">
              <Button size="lg" className="gap-2 text-base h-12 px-6 bg-white text-black hover:bg-white/90 border-0 font-semibold transition-all shadow-lg">
                <Phone className="w-5 h-5" />
                Call Us Now
              </Button>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 text-base h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </Button>
            </a>
          </div>

          {/* Stats with Glassmorphism */}
          <div className="glass-card grid grid-cols-2 md:grid-cols-4 gap-8 p-6 rounded-2xl animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: heroSettings.stat1Value, label: heroSettings.stat1Label },
              { value: heroSettings.stat2Value, label: heroSettings.stat2Label },
              { value: heroSettings.stat3Value, label: heroSettings.stat3Label },
              { value: heroSettings.stat4Value, label: heroSettings.stat4Label },
            ].map((stat, index) => (
              <div key={index} className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-bold text-white mb-1" style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)" }}>{stat.value}</p>
                <p className="text-sm text-white/90" style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-md border-2 border-primary-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-sm bg-copper" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
