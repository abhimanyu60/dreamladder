import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/EnquiryForm";
import CallbackModal from "@/components/CallbackModal";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const whatsappLink = "https://wa.me/917004088007?text=Hello%20Dream%20Ladder%2C%20I%20would%20like%20to%20enquire%20about%20your%20properties.";

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Address",
      content: "House No. 384/B, Road No-4, Ashok Nagar, Ranchi, Jharkhand",
      action: {
        label: "Get Directions",
        href: "https://maps.google.com/?q=House+No.+384/B,+Road+No-4,+Ashok+Nagar,+Ranchi,+Jharkhand",
      },
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      content: "+91 7004088007 | +91 8797770777",
      action: {
        label: "Call Now",
        href: "tel:+917004088007",
      },
    },
    {
      icon: Mail,
      title: "Email Address",
      content: "dreamladderranchi@gmail.com",
      action: {
        label: "Send Email",
        href: "mailto:dreamladderranchi@gmail.com",
      },
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Monday – Saturday, 09:00 AM – 08:00 PM",
      action: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our properties or want to schedule a site visit? 
              We're here to help you find your dream property.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Contact Information
                </h2>
                <p className="text-muted-foreground">
                  Reach out to us through any of the channels below. Our team is ready to assist you.
                </p>
              </div>

              <div className="grid gap-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className="bg-card rounded-xl p-5 border border-border shadow-card hover:shadow-card-hover transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{info.content}</p>
                          {info.action && (
                            <a
                              href={info.action.href}
                              target={info.action.href.startsWith("http") ? "_blank" : undefined}
                              rel={info.action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="text-sm font-medium text-accent hover:underline"
                            >
                              {info.action.label} →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <CallbackModal
                  trigger={
                    <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent hover:text-primary">
                      <Phone className="w-4 h-4" />
                      Request Callback
                    </Button>
                  }
                />
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </Button>
                </a>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  src="https://maps.google.com/maps?q=Ashok+Nagar,+Ranchi,+Jharkhand&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-card h-fit">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Send Us an Enquiry
              </h2>
              <p className="text-muted-foreground mb-6">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
