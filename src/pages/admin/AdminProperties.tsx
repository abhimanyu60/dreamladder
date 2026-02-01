import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { properties as initialProperties, Property } from "@/data/properties";

const AdminProperties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyList, setPropertyList] = useState<Property[]>(initialProperties);

  const filteredProperties = propertyList.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setPropertyList(propertyList.filter((p) => p.id !== id));
    toast({
      title: "Property deleted",
      description: "The property has been removed successfully.",
    });
  };

  const toggleFeatured = (id: string) => {
    setPropertyList(
      propertyList.map((p) =>
        p.id === id ? { ...p, featured: !p.featured } : p
      )
    );
    toast({
      title: "Property updated",
      description: "Featured status has been updated.",
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      residential: "bg-blue-100 text-blue-800",
      agricultural: "bg-green-100 text-green-800",
      commercial: "bg-purple-100 text-purple-800",
      investment: "bg-amber-100 text-amber-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button className="btn-gold" onClick={() => navigate("/admin/properties/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">
                        {property.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{property.locality}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(property.type)} variant="secondary">
                    {property.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{property.size}</TableCell>
                <TableCell className="font-medium">{property.price}</TableCell>
                <TableCell className="text-muted-foreground">{property.area}</TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleFeatured(property.id)}
                    className={`p-1 rounded transition-colors ${
                      property.featured
                        ? "text-accent"
                        : "text-muted-foreground hover:text-accent"
                    }`}
                  >
                    <Star className={`w-5 h-5 ${property.featured ? "fill-current" : ""}`} />
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(`/property/${property.id}`, "_blank")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Property</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{property.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(property.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredProperties.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No properties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProperties;
