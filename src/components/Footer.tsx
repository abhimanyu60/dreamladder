import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-gold-dark flex items-center justify-center">
                <span className="text-primary font-serif font-bold text-xl">D</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Dream Ladder</h3>
                <p className="text-xs text-primary-foreground/70">Real Estate Solutions</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Helping you climb towards your dream property. Your trusted partner for land investments in Jharkhand.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent transition-colors group">
                <Facebook className="w-4 h-4 text-accent group-hover:text-primary" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent transition-colors group">
                <Instagram className="w-4 h-4 text-accent group-hover:text-primary" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent transition-colors group">
                <Twitter className="w-4 h-4 text-accent group-hover:text-primary" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent transition-colors group">
                <Linkedin className="w-4 h-4 text-accent group-hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Properties", path: "/properties" },
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Property Types</h4>
            <ul className="space-y-2">
              {[
                "Residential Plots",
                "Agricultural Land",
                "Commercial Land",
                "Investment Properties",
                "Plotted Developments",
              ].map((type) => (
                <li key={type}>
                  <Link
                    to="/properties"
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/80">
                  House No. 384/B, Road No-4, Ashok Nagar, Ranchi, Jharkhand
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div className="text-sm text-primary-foreground/80">
                  <a href="tel:+917004088007" className="hover:text-accent transition-colors">+91 7004088007</a>
                  <span className="mx-2">|</span>
                  <a href="tel:+918797770777" className="hover:text-accent transition-colors">+91 8797770777</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:dreamladderranchi@gmail.com" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  dreamladderranchi@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  Mon – Sat, 09:00 AM – 08:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2025 Dream Ladder. All rights reserved.
            </p>
            <p className="text-sm text-primary-foreground/60">
              Owned by Abhishek Singh & Saurabh Singh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
