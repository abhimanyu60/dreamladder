import { Link } from "react-router-dom";
import { MapPin, Maximize, Tag, ArrowRight } from "lucide-react";
import { Property } from "@/data/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const typeColors = {
    residential: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    agricultural: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    commercial: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    investment: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  return (
    <div className="card-property group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <Badge className="bg-accent text-primary font-semibold">Featured</Badge>
          )}
          <Badge variant="outline" className={`${typeColors[property.type]} border capitalize`}>
            {property.type}
          </Badge>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-2xl font-serif font-bold text-primary-foreground">{property.price}</p>
          {property.pricePerSqFt && (
            <p className="text-sm text-primary-foreground/80">{property.pricePerSqFt}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.locality}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.shortDescription}
        </p>

        {/* Info Row */}
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">{property.size}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium capitalize">{property.area}</span>
          </div>
        </div>

        {/* CTA */}
        <Link to={`/property/${property.id}`}>
          <Button variant="outline" className="w-full group/btn border-accent text-accent hover:bg-accent hover:text-primary">
            View Details
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
