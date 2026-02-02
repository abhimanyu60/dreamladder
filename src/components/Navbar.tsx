import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Home, Building2, Mail, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/properties", label: "Properties", icon: Building2 },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Dream Ladder Logo" className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold text-primary">Dream Ladder</span>
              <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">Climb Towards Your Dreams</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isActive(link.path) 
                    ? "text-accent" 
                    : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+917004088007">
              <Button size="sm" className="gap-2 bg-accent text-primary font-semibold hover:bg-accent/90 shadow-md hover:shadow-lg transition-all">
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
            </a>
            <Link to="/contact">
              <Button size="sm" className="btn-gold">
                Get in Touch
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? "bg-accent/10 text-accent"
                        : "hover:bg-muted text-foreground/80"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 mt-4 px-4">
                <a href="tel:+917004088007">
                  <Button className="w-full gap-2 bg-accent text-primary font-semibold hover:bg-accent/90 shadow-md">
                    <Phone className="w-4 h-4" />
                    +91 7004088007
                  </Button>
                </a>
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button className="w-full btn-gold">Get in Touch</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
