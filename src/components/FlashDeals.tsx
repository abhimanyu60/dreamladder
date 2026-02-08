import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface FlashProperty {
  id: string;
  title: string;
  slug: string;
  price: number;
  location: string;
  area: string;
  images: string[];
  flashDealEndDate: string;
}

export default function FlashDeals() {
  const [flashProperties, setFlashProperties] = useState<FlashProperty[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlashDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, [flashProperties]);

  const fetchFlashDeals = async () => {
    try {
      const response = await fetch("https://dreamladder-api.azurewebsites.net/api/properties?flash_deals=true");
      const data = await response.json();
      if (data.success) {
        setFlashProperties(data.data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch flash deals:", error);
    }
  };

  const updateTimeLeft = () => {
    const newTimeLeft: Record<string, string> = {};
    flashProperties.forEach((prop) => {
      if (prop.flashDealEndDate) {
        const now = new Date().getTime();
        const end = new Date(prop.flashDealEndDate).getTime();
        const distance = end - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          newTimeLeft[prop.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[prop.id] = "EXPIRED";
        }
      }
    });
    setTimeLeft(newTimeLeft);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % flashProperties.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + flashProperties.length) % flashProperties.length);
  };

  const handlePropertyClick = (slug: string) => {
    navigate(`/properties/${slug}`);
  };

  if (flashProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 animate-bounce">
            <TrendingUp className="w-4 h-4" />
            <span>HOT DEALS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Flash Properties
            </span>
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
            ⚡ 7 Days Only! ⚡
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Exclusive deals that won't last long. Grab your dream property before time runs out!
          </p>
        </div>

        {/* Carousel Section */}
        <div className="mb-16">
          <div className="relative max-w-5xl mx-auto">
            {/* Main Carousel */}
            <div className="relative h-[500px] sm:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              {flashProperties.map((property, index) => (
                <div
                  key={property.id}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentSlide
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                  onClick={() => handlePropertyClick(property.slug)}
                >
                  <div className="relative h-full cursor-pointer group">
                    <img
                      src={property.images[0] || "/placeholder.jpg"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <Badge className="bg-red-600 text-white mb-4 px-4 py-2 text-lg">
                          <Clock className="w-5 h-5 mr-2" />
                          {timeLeft[property.id] || "Loading..."}
                        </Badge>
                        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                          {property.title}
                        </h3>
                        <p className="text-xl text-gray-200 mb-4">
                          📍 {property.location} | {property.area}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-4xl sm:text-5xl font-extrabold text-white">
                            {formatCurrency(property.price)}
                          </span>
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-8"
                          >
                            View Details →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            {flashProperties.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {flashProperties.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {flashProperties.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "w-8 bg-gradient-to-r from-orange-600 to-red-600"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid Section */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            All Flash Deals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => handlePropertyClick(property.slug)}
              >
                <div className="relative h-48">
                  <img
                    src={property.images[0] || "/placeholder.jpg"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeLeft[property.id]?.split(" ").slice(0, 2).join(" ") || ""}
                  </Badge>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 line-clamp-1">{property.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    📍 {property.location}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(property.price)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
