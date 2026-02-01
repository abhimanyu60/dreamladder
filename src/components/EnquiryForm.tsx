import { useState } from "react";
import { Send, User, Phone, Mail, Building2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { properties } from "@/data/properties";

interface EnquiryFormProps {
  selectedProperty?: string;
  variant?: "default" | "compact";
}

const EnquiryForm = ({ selectedProperty, variant = "default" }: EnquiryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    property: selectedProperty || "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Enquiry submitted successfully!", {
      description: "Our team will get back to you within 24 hours.",
    });

    setFormData({ name: "", phone: "", email: "", property: "", message: "" });
    setIsSubmitting(false);
  };

  const isCompact = variant === "compact";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid gap-4 ${isCompact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        <div className="space-y-2">
          <Label htmlFor="enquiry-name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="enquiry-name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="enquiry-phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="enquiry-phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className={`grid gap-4 ${isCompact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        <div className="space-y-2">
          <Label htmlFor="enquiry-email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email Address
          </Label>
          <Input
            id="enquiry-email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="enquiry-property" className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Interested Property
          </Label>
          <Select
            value={formData.property}
            onValueChange={(value) => setFormData({ ...formData, property: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Enquiry</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enquiry-message" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          Message
        </Label>
        <Textarea
          id="enquiry-message"
          placeholder="Tell us about your requirements..."
          rows={isCompact ? 3 : 4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full btn-gold gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Enquiry
          </>
        )}
      </Button>
    </form>
  );
};

export default EnquiryForm;
