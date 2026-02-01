import { CheckCircle2, Users, Award, Shield } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Legal Verified Properties",
      description: "Every property undergoes thorough legal verification ensuring clear titles and documentation."
    },
    {
      icon: Users,
      title: "Trusted by 200+ Clients",
      description: "Building lasting relationships through transparent dealings and customer satisfaction."
    },
    {
      icon: Award,
      title: "10+ Years Experience",
      description: "Deep understanding of Jharkhand's real estate market and investment opportunities."
    }
  ];

  const specializations = [
    "Plotted Developments",
    "Residential Land",
    "Agricultural Land", 
    "Investment Properties",
    "Large Land Parcels",
    "Commercial Land"
  ];

  return (
    <section className="section-padding bg-muted/50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">About Dream Ladder</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
                Your Trusted Partner for Land Investments in Jharkhand
              </h2>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              Dream Ladder is a premier real estate company based in Ranchi, Jharkhand, specializing in land properties. 
              Founded by Abhishek Singh and Saurabh Singh, we are committed to helping individuals and investors 
              find the perfect land for their needs—whether it's for building a dream home, agricultural pursuits, 
              or strategic investment.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              With over a decade of experience in the Jharkhand real estate market, we understand the nuances of 
              land transactions and are dedicated to providing transparent, hassle-free services to all our clients.
            </p>

            {/* Specializations */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {specializations.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-border/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
