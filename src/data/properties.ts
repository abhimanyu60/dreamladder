import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

export interface Property {
  id: string;
  title: string;
  size: string;
  price: string;
  pricePerSqFt?: string;
  area: string;
  locality: string;
  description: string;
  shortDescription: string;
  type: "residential" | "agricultural" | "commercial" | "investment";
  featured: boolean;
  images: string[];
  mapLink: string;
  amenities: string[];
  highlights: string[];
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Premium Residential Plot in Bariatu",
    size: "2,400 sq ft",
    price: "₹48,00,000",
    pricePerSqFt: "₹2,000/sq ft",
    area: "Bariatu",
    locality: "Near Bariatu Road, Ranchi",
    description: "This premium residential plot is located in the heart of Bariatu, one of the most sought-after localities in Ranchi. The plot offers excellent connectivity to major roads, hospitals, schools, and shopping centers. With clear legal titles and all necessary approvals in place, this is a perfect investment for building your dream home or for long-term appreciation.",
    shortDescription: "Prime residential plot with excellent connectivity and clear legal titles. Ideal for building your dream home.",
    type: "residential",
    featured: true,
    images: [property1],
    mapLink: "https://maps.google.com/?q=23.3700,85.3200",
    amenities: ["Water Supply", "Electricity", "Road Access", "Drainage"],
    highlights: ["Corner Plot", "East Facing", "Near Hospital", "School Nearby"]
  },
  {
    id: "2",
    title: "Agricultural Land in Ormanjhi",
    size: "2 Acres",
    price: "₹85,00,000",
    pricePerSqFt: "₹9.80/sq ft",
    area: "Ormanjhi",
    locality: "Ormanjhi Block, Ranchi",
    description: "Expansive agricultural land perfect for farming or future development. Located in the rapidly developing Ormanjhi area, this land offers great potential for organic farming, farmhouse construction, or holding as an investment. The land has good soil quality and access to water sources.",
    shortDescription: "Fertile agricultural land with excellent potential for farming or future development.",
    type: "agricultural",
    featured: true,
    images: [property2],
    mapLink: "https://maps.google.com/?q=23.4100,85.2800",
    amenities: ["Bore Well", "Boundary Wall", "Caretaker Shed"],
    highlights: ["Fertile Soil", "Water Available", "Road Frontage", "Future Growth Area"]
  },
  {
    id: "3",
    title: "Plotted Development in Ratu",
    size: "1,600 sq ft",
    price: "₹24,00,000",
    pricePerSqFt: "₹1,500/sq ft",
    area: "Ratu",
    locality: "Ratu Road, Ranchi",
    description: "Part of a well-planned plotted development project with modern amenities. This plot comes with proper demarcation, internal roads, drainage system, and future provision for community spaces. Excellent for families looking to build their home in a planned community.",
    shortDescription: "Well-planned plotted development with modern amenities and community spaces.",
    type: "residential",
    featured: true,
    images: [property3],
    mapLink: "https://maps.google.com/?q=23.4200,85.3400",
    amenities: ["Gated Community", "24/7 Security", "Park", "Wide Roads"],
    highlights: ["RERA Approved", "Bank Loan Available", "Immediate Possession", "Society Formation"]
  },
  {
    id: "4",
    title: "Investment Land in Hatia",
    size: "5,000 sq ft",
    price: "₹1,25,00,000",
    pricePerSqFt: "₹2,500/sq ft",
    area: "Hatia",
    locality: "Near Hatia Railway Station, Ranchi",
    description: "Strategic investment land located near Hatia Railway Station. This property offers exceptional growth potential due to its proximity to the railway station and commercial areas. Ideal for commercial development or long-term investment with high appreciation value.",
    shortDescription: "Strategic location near railway station with high appreciation potential.",
    type: "investment",
    featured: false,
    images: [property4],
    mapLink: "https://maps.google.com/?q=23.3100,85.3000",
    amenities: ["Commercial Zone", "Main Road Access", "Public Transport"],
    highlights: ["High ROI Potential", "Near Railway Station", "Commercial Zoning", "Growing Area"]
  }
];

export const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "residential", label: "Residential" },
  { value: "agricultural", label: "Agricultural" },
  { value: "commercial", label: "Commercial" },
  { value: "investment", label: "Investment" }
];

export const areaOptions = [
  { value: "all", label: "All Areas" },
  { value: "Bariatu", label: "Bariatu" },
  { value: "Ormanjhi", label: "Ormanjhi" },
  { value: "Ratu", label: "Ratu" },
  { value: "Hatia", label: "Hatia" },
  { value: "Kanke", label: "Kanke" },
  { value: "Namkum", label: "Namkum" }
];
