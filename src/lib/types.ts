// API Response Types

export interface APIProperty {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  pricePerSqFt?: number;
  area: string;
  areaInSqFt: number;
  location: string;
  fullAddress: string;
  googleMapsLink: string;
  type: "residential" | "agricultural" | "commercial";
  status: "available" | "sold" | "upcoming";
  featured: boolean;
  images: string[];
  amenities: string[];
  highlights: string[];
  legalInfo?: Record<string, any>;
  nearbyPlaces?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PropertiesResponse {
  success: boolean;
  data: {
    properties: APIProperty[];
    pagination: PaginationInfo;
  };
}

export interface PropertyResponse {
  success: boolean;
  data: {
    property: APIProperty;
  };
}

// Convert API property to display format
export const formatProperty = (apiProperty: APIProperty) => {
  return {
    id: apiProperty.id,
    title: apiProperty.title,
    size: apiProperty.area,
    price: `₹${(apiProperty.price / 100000).toFixed(2)} L`,
    pricePerSqFt: apiProperty.pricePerSqFt ? `₹${apiProperty.pricePerSqFt.toLocaleString()}/sq ft` : undefined,
    area: apiProperty.location.split(',')[1]?.trim() || apiProperty.location,
    locality: apiProperty.location,
    description: apiProperty.description,
    shortDescription: apiProperty.shortDescription,
    type: apiProperty.type as "residential" | "agricultural" | "commercial" | "investment",
    featured: apiProperty.featured,
    images: apiProperty.images,
    mapLink: apiProperty.googleMapsLink,
    amenities: apiProperty.amenities,
    highlights: apiProperty.highlights,
    status: apiProperty.status,
    fullAddress: apiProperty.fullAddress,
    nearbyPlaces: apiProperty.nearbyPlaces || [],
    legalInfo: apiProperty.legalInfo || {},
  };
};

export interface EnquiryData {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  propertyId?: string;
  status: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProperties: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  featuredProperties: number;
}
