import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { propertiesAPI } from "@/lib/api";
import { useState, useEffect } from "react";

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await propertiesAPI.getAll({ featured: true, limit: 6 });
        if (response.success) {
          setFeaturedProperties(response.data.properties);
        }
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  if (isLoading) {
    return (
      <section className="section-padding" style={{ backgroundColor: '#F5F1E8' }}>
        <div className="container mx-auto">
          <div className="text-center py-12">Loading featured properties...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding" style={{ backgroundColor: '#F5F1E8' }}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Featured Listings</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              Discover Our Premium Properties
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Hand-picked land opportunities across Ranchi and Jharkhand, perfect for your investment or dream home.
            </p>
          </div>
          <Link to="/properties">
            <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent hover:text-primary">
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
