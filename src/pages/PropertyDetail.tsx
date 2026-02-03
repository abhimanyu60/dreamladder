import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Maximize, Tag, CheckCircle2, Phone, MessageCircle, Share2, Heart, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/EnquiryForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { propertiesAPI } from "@/lib/api";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const response = await propertiesAPI.getById(id);
        if (response.success) {
          setProperty(response.data.property);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-8">The property you're looking for doesn't exist.</p>
          <Link to="/properties">
            <Button className="btn-gold">View All Properties</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const whatsappLink = `https://wa.me/917004088007?text=Hello%20Dream%20Ladder%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`;

  const typeColors = {
    residential: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    agricultural: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    commercial: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    investment: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  // Format price
  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    const crores = price / 10000000;
    const lakhs = price / 100000;
    if (crores >= 1) {
      return `₹${crores.toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(2)} L`;
  };

  const formatPricePerSqFt = (pricePerSqFt?: number | string) => {
    if (!pricePerSqFt) return undefined;
    if (typeof pricePerSqFt === 'string') return pricePerSqFt;
    return `₹${pricePerSqFt.toLocaleString()}/sq ft`;
  };

  const displayPrice = formatPrice(property.price);
  const displayPricePerSqFt = formatPricePerSqFt(property.pricePerSqFt);
  const displayLocation = property.location || property.locality;
  const displaySize = property.area;
  const displayMapLink = property.googleMapsLink || property.mapLink;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Breadcrumb */}
      <section className="pt-24 md:pt-28 pb-4 bg-muted/30">
        <div className="container mx-auto px-4">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>
      </section>

      {/* Property Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              <div className="relative rounded-xl overflow-hidden aspect-video">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.featured && (
                    <Badge className="bg-accent text-primary font-semibold">Featured</Badge>
                  )}
                  <Badge variant="outline" className={`${typeColors[property.type]} border capitalize`}>
                    {property.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Title & Price */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <span>{displayLocation}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-serif font-bold text-accent">{displayPrice}</p>
                    {displayPricePerSqFt && (
                      <p className="text-sm text-muted-foreground">{displayPricePerSqFt}</p>
                    )}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                    <Maximize className="w-5 h-5 text-accent" />
                    <span className="font-medium">{displaySize}</span>
                  </div>
                  {property.type && (
                    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                      <Tag className="w-5 h-5 text-accent" />
                      <span className="font-medium capitalize">{property.type}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold text-foreground">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold text-foreground">Highlights</h2>
                <div className="grid grid-cols-2 gap-3">
                  {property.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <span className="text-sm text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold text-foreground">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1.5">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-foreground">Location</h2>
                  <a
                    href={displayMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline flex items-center gap-1"
                  >
                    Open in Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="rounded-xl overflow-hidden border border-border">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(displayLocation)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Property Location"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-card sticky top-28">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Interested in this property?
                </h3>
                <div className="space-y-3 mb-6">
                  <a href="tel:+917004088007">
                    <Button className="w-full gap-2" variant="outline">
                      <Phone className="w-4 h-4" />
                      Call +91 7004088007
                    </Button>
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-2 text-sm text-muted-foreground">or send enquiry</span>
                  </div>
                </div>

                <EnquiryForm selectedProperty={property.id} variant="compact" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
