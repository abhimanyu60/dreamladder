import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { properties, propertyTypes, areaOptions } from "@/data/properties";

const AdminPropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    size: "",
    price: "",
    pricePerSqFt: "",
    area: "",
    locality: "",
    description: "",
    shortDescription: "",
    type: "residential" as "residential" | "agricultural" | "commercial" | "investment",
    featured: false,
    mapLink: "",
    amenities: [""],
    highlights: [""],
  });

  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const property = properties.find((p) => p.id === id);
      if (property) {
        setFormData({
          title: property.title,
          size: property.size,
          price: property.price,
          pricePerSqFt: property.pricePerSqFt || "",
          area: property.area,
          locality: property.locality,
          description: property.description,
          shortDescription: property.shortDescription,
          type: property.type,
          featured: property.featured,
          mapLink: property.mapLink,
          amenities: property.amenities.length > 0 ? property.amenities : [""],
          highlights: property.highlights.length > 0 ? property.highlights : [""],
        });
        setImages(property.images);
      }
    }
  }, [id, isEditing]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: "amenities" | "highlights", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "amenities" | "highlights") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field: "amenities" | "highlights", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: isEditing ? "Property updated" : "Property added",
        description: isEditing
          ? "The property has been updated successfully."
          : "The property has been added successfully.",
      });
      navigate("/admin/properties");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/properties")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {isEditing ? "Edit Property" : "Add New Property"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update property details" : "Fill in the property details below"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Basic Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Premium Residential Plot in Bariatu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Property Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.slice(1).map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area *</Label>
              <Select
                value={formData.area}
                onValueChange={(value) => handleInputChange("area", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areaOptions.slice(1).map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size *</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                placeholder="e.g., 2,400 sq ft or 2 Acres"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="e.g., ₹48,00,000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerSqFt">Price per Sq Ft</Label>
              <Input
                id="pricePerSqFt"
                value={formData.pricePerSqFt}
                onChange={(e) => handleInputChange("pricePerSqFt", e.target.value)}
                placeholder="e.g., ₹2,000/sq ft"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locality">Locality *</Label>
              <Input
                id="locality"
                value={formData.locality}
                onChange={(e) => handleInputChange("locality", e.target.value)}
                placeholder="e.g., Near Bariatu Road, Ranchi"
                required
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Description</h2>
          
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description *</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => handleInputChange("shortDescription", e.target.value)}
              placeholder="Brief description for property cards (1-2 sentences)"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Detailed property description..."
              rows={5}
              required
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Images</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent">
              <Upload className="w-6 h-6" />
              <span className="text-xs">Upload</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Upload property images. First image will be used as the main image.
          </p>
        </div>

        {/* Amenities & Highlights */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-lg">Amenities</h2>
            {formData.amenities.map((amenity, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={amenity}
                  onChange={(e) => handleArrayChange("amenities", index, e.target.value)}
                  placeholder="e.g., Water Supply"
                />
                {formData.amenities.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem("amenities", index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("amenities")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Amenity
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-lg">Highlights</h2>
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={highlight}
                  onChange={(e) => handleArrayChange("highlights", index, e.target.value)}
                  placeholder="e.g., Corner Plot"
                />
                {formData.highlights.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem("highlights", index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("highlights")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Highlight
            </Button>
          </div>
        </div>

        {/* Map & Settings */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Location & Settings</h2>
          
          <div className="space-y-2">
            <Label htmlFor="mapLink">Google Maps Link</Label>
            <Input
              id="mapLink"
              value={formData.mapLink}
              onChange={(e) => handleInputChange("mapLink", e.target.value)}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="featured">Featured Property</Label>
              <p className="text-sm text-muted-foreground">
                Show this property on the homepage
              </p>
            </div>
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange("featured", checked)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/properties")}
          >
            Cancel
          </Button>
          <Button type="submit" className="btn-gold" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
              ? "Update Property"
              : "Add Property"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminPropertyForm;
