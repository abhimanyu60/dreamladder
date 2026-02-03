import { useState, useEffect } from "react";
import { Phone, Mail, MessageSquare, Check, X, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { enquiriesAPI } from "@/lib/api";

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  propertyId?: string;
  message?: string;
  type: "callback" | "property_enquiry" | "general";
  status: "pending" | "contacted" | "closed";
  preferredTime?: string;
  createdAt: string;
}

const AdminEnquiries = () => {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await enquiriesAPI.getAll({ limit: 100 });
      if (response.success && response.data) {
        setEnquiries(response.data.enquiries || []);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
      toast({
        title: "Error",
        description: "Failed to load enquiries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enquiry.propertyId && enquiry.propertyId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      enquiry.phone.includes(searchQuery);
    const matchesType = typeFilter === "all" || enquiry.type === typeFilter;
    const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const updateStatus = async (id: string, status: Enquiry["status"]) => {
    try {
      // For now, just update locally since we need to add the endpoint
      setEnquiries(
        enquiries.map((e) => (e.id === id ? { ...e, status } : e))
      );
      toast({
        title: "Status updated",
        description: `Enquiry marked as ${status}.`,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      closed: "bg-green-100 text-green-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Enquiries</h1>
        <p className="text-muted-foreground">Manage customer enquiries and callback requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="callback">Callback</SelectItem>
              <SelectItem value="property_enquiry">Property Enquiry</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading enquiries...
                </TableCell>
              </TableRow>
            ) : filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No enquiries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEnquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{enquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{enquiry.phone}</p>
                    {enquiry.email && (
                      <p className="text-xs text-muted-foreground">{enquiry.email}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-foreground line-clamp-1">
                      {enquiry.propertyId || 'General Enquiry'}
                    </p>
                    {enquiry.message && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        "{enquiry.message}"
                      </p>
                    )}
                    {enquiry.preferredTime && (
                      <p className="text-xs text-accent mt-1">
                        Preferred: {enquiry.preferredTime}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {enquiry.type === "callback" ? (
                      <Phone className="w-4 h-4 text-accent" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-primary" />
                    )}
                    <span className="capitalize text-sm">
                      {enquiry.type === 'property_enquiry' ? 'Property' : enquiry.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(enquiry.status)} variant="secondary">
                    {enquiry.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(enquiry.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <a href={`tel:${enquiry.phone.replace(/\s/g, "")}`}>
                      <Button variant="ghost" size="icon" className="text-accent">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </a>
                    {enquiry.email && (
                      <a href={`mailto:${enquiry.email}`}>
                        <Button variant="ghost" size="icon">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {enquiry.status !== "contacted" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600"
                        onClick={() => updateStatus(enquiry.id, "contacted")}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {enquiry.status !== "closed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600"
                        onClick={() => updateStatus(enquiry.id, "closed")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminEnquiries;
