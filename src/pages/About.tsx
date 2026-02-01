import { Link } from "react-router-dom";
import { CheckCircle2, Users, Award, Shield, Target, Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description: "We believe in complete transparency in all our dealings, ensuring every transaction is clear and documented."
    },
    {
      icon: Target,
      title: "Integrity",
      description: "Our commitment to ethical practices has earned us the trust of hundreds of satisfied clients."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our priority. We go above and beyond to meet your property requirements."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every property we list and every service we provide."
    }
  ];

  const milestones = [
    { year: "2014", title: "Company Founded", description: "Dream Ladder was established in Ranchi with a vision to simplify land transactions." },
    { year: "2016", title: "100 Properties Sold", description: "Reached our first major milestone of helping 100 families find their dream plots." },
    { year: "2019", title: "Expanded Services", description: "Added agricultural and commercial land to our portfolio." },
    { year: "2024", title: "Digital Presence", description: "Launched our online platform to serve clients across Jharkhand." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
              Your Trusted Partner in Land Investments
            </h1>
            <p className="text-lg text-muted-foreground">
              For over a decade, Dream Ladder has been helping individuals and families find the perfect 
              land for their homes, farms, and investments across Jharkhand.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Dream Ladder was founded in 2014 by Abhishek Singh and Saurabh Singh with a simple mission: 
                  to make land ownership accessible and hassle-free for everyone in Jharkhand.
                </p>
                <p>
                  Growing up in Ranchi, we witnessed firsthand the challenges people faced when trying to 
                  purchase land—opaque pricing, unclear titles, and unreliable agents. We knew there had 
                  to be a better way.
                </p>
                <p>
                  Today, Dream Ladder stands as one of the most trusted names in Jharkhand's real estate 
                  sector. We specialize in residential plots, agricultural land, and investment properties, 
                  with a focus on verified documentation and transparent dealings.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/properties">
                  <Button className="btn-gold gap-2">
                    View Our Properties
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent hover:text-primary">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "200+", label: "Happy Clients" },
                { value: "50+", label: "Properties Listed" },
                { value: "10+", label: "Years Experience" },
                { value: "100%", label: "Legal Verification" }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl p-6 border border-border shadow-card text-center"
                >
                  <p className="text-3xl md:text-4xl font-serif font-bold text-accent">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground">
              These principles guide everything we do at Dream Ladder, from how we select properties 
              to how we interact with our clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground">
              Key milestones in our mission to transform land ownership in Jharkhand.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4 md:gap-8 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pt-2 pb-4">
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              Meet the Founders
            </h2>
            <p className="text-muted-foreground">
              The visionaries behind Dream Ladder's success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              { name: "Abhishek Singh", role: "Co-Founder & Director" },
              { name: "Saurabh Singh", role: "Co-Founder & Director" }
            ].map((person, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border shadow-card text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-gold-dark flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-serif font-bold text-primary">
                    {person.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {person.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {person.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

export default About;
