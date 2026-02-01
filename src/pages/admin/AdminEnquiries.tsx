import { useState } from "react";
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

interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  property: string;
  message?: string;
  type: "enquiry" | "callback";
  status: "pending" | "contacted" | "closed";
  preferredTime?: string;
  createdAt: string;
}

const mockEnquiries: Enquiry[] = [
  {
    id: 1,
    name: "Rahul Kumar",
    phone: "+91 9876543210",
    email: "rahul@email.com",
    property: "Premium Residential Plot in Bariatu",
    message: "I am interested in visiting this property. Please contact me.",
    type: "enquiry",
    status: "pending",
    createdAt: "2025-01-30T10:30:00",
  },
  {
    id: 2,
    name: "Priya Singh",
    phone: "+91 8765432109",
    property: "Agricultural Land in Ormanjhi",
    type: "callback",
    status: "contacted",
    preferredTime: "Morning (9AM - 12PM)",
    createdAt: "2025-01-30T08:15:00",
  },
  {
    id: 3,
    name: "Amit Sharma",
    phone: "+91 7654321098",
    email: "amit.sharma@email.com",
    property: "Plotted Development in Ratu",
    message: "Looking for plots under 30 lakhs. Is this negotiable?",
    type: "enquiry",
    status: "pending",
    createdAt: "2025-01-29T16:45:00",
  },
  {
    id: 4,
    name: "Neha Gupta",
    phone: "+91 6543210987",
    property: "Investment Land in Hatia",
    type: "callback",
    status: "closed",
    preferredTime: "Evening (5PM - 8PM)",
    createdAt: "2025-01-28T14:20:00",
  },
  {
    id: 5,
    name: "Vikash Mehta",
    phone: "+91 5432109876",
    email: "vikash.m@email.com",
    property: "Premium Residential Plot in Bariatu",
    message: "Can you arrange a site visit this weekend?",
    type: "enquiry",
    status: "contacted",
    createdAt: "2025-01-27T11:00:00",
  },
];

const AdminEnquiries = () => {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.phone.includes(searchQuery);
    const matchesType = typeFilter === "all" || enquiry.type === typeFilter;
    const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const updateStatus = (id: number, status: Enquiry["status"]) => {
    setEnquiries(
      enquiries.map((e) => (e.id === id ? { ...e, status } : e))
    );
    toast({
      title: "Status updated",
      description: `Enquiry marked as ${status}.`,
    });
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
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="enquiry">Enquiry</SelectItem>
              <SelectItem value="callback">Callback</SelectItem>
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
            {filteredEnquiries.map((enquiry) => (
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
                    <p className="text-foreground line-clamp-1">{enquiry.property}</p>
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
                    <span className="capitalize">{enquiry.type}</span>
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
            ))}
            {filteredEnquiries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No enquiries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminEnquiries;
