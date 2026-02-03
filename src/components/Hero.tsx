import { Link } from "react-router-dom";
import { Phone, MessageCircle, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const whatsappLink = "https://wa.me/917004088007?text=Hello%20Dream%20Ladder%2C%20I%20am%20interested%20in%20your%20properties.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroBg}
          alt="Premium Land Development in Ranchi"
          className="w-full h-full object-cover zoom-animation"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/95 via-forest/85 to-forest-dark/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 via-transparent to-transparent" />
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 texture-overlay pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-copper/15 border border-copper/30 mb-6 animate-fade-in backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-copper animate-pulse" />
            <span className="text-sm font-medium text-copper-light tracking-wide uppercase">Jharkhand's Trusted Land Partner</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Helping You Climb Towards Your{" "}
            <span className="gradient-text italic">Dream Property</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Discover premium residential plots, agricultural land, and investment opportunities across Ranchi and Jharkhand. 
            Your journey to land ownership starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/properties">
              <Button size="lg" className="btn-gold gap-2 text-base">
                <Building2 className="w-5 h-5" />
                View Properties
              </Button>
            </Link>
            <a href="tel:+917004088007">
              <Button size="lg" variant="outline" className="gap-2 text-base bg-white/10 backdrop-blur-sm border-white/50 text-white hover:bg-white/20 hover:border-white">
                <Phone className="w-5 h-5" />
                Request Call Back
              </Button>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2 text-base bg-emerald-600 border-emerald-600 text-primary-foreground hover:bg-emerald-700">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-primary-foreground/20 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "50+", label: "Properties Listed" },
              { value: "200+", label: "Happy Clients" },
              { value: "10+", label: "Years Experience" },
              { value: "100%", label: "Legal Verified" },
            ].map((stat, index) => (
              <div key={index} className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-serif font-bold text-copper">{stat.value}</p>
                <p className="text-sm text-primary-foreground/60 tracking-wide">{stat.label}</p>
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
