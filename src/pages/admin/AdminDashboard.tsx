import { Building2, MessageSquare, Eye, TrendingUp, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { title: "Total Properties", value: "4", icon: Building2, change: "+2 this month" },
  { title: "Total Enquiries", value: "12", icon: MessageSquare, change: "+5 this week" },
  { title: "Page Views", value: "1,234", icon: Eye, change: "+18% this month" },
  { title: "Conversion Rate", value: "3.2%", icon: TrendingUp, change: "+0.5% this week" },
];

const recentEnquiries = [
  { id: 1, name: "Rahul Kumar", phone: "+91 9876543210", property: "Premium Plot in Bariatu", type: "enquiry", time: "2 hours ago" },
  { id: 2, name: "Priya Singh", phone: "+91 8765432109", property: "Agricultural Land", type: "callback", time: "5 hours ago" },
  { id: 3, name: "Amit Sharma", phone: "+91 7654321098", property: "Plotted Development in Ratu", type: "enquiry", time: "1 day ago" },
  { id: 4, name: "Neha Gupta", phone: "+91 6543210987", property: "Investment Land in Hatia", type: "callback", time: "2 days ago" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
        </div>
        <Button className="btn-gold" onClick={() => navigate("/admin/properties/new")}>
          + Add New Property
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Enquiries */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif">Recent Enquiries</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/enquiries")}>
            View All →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    enquiry.type === "callback" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                  }`}>
                    {enquiry.type === "callback" ? (
                      <Phone className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{enquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{enquiry.property}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{enquiry.phone}</p>
                  <p className="text-xs text-muted-foreground">{enquiry.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
