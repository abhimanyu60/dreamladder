import { useState, useEffect } from "react";
import { User, Lock, Bell, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { settingsAPI } from "@/lib/api";

const AdminSettings = () => {
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: "Abhishek Singh",
    email: "abhishek@dreamladder.com",
    phone: "+91 7004088007",
  });

  const [company, setCompany] = useState({
    name: "Dream Ladder",
    address: "House No. 384/B, Road No-4, Ashok Nagar, Ranchi, Jharkhand",
    email: "dreamladderranchi@gmail.com",
    phone1: "+91 7004088007",
    phone2: "+91 8797770777",
    workingHours: "Mon – Sat, 09:00 AM – 08:00 PM",
  });

  const [hero, setHero] = useState({
    badgeText: "TRUSTED BY 200+ FAMILIES",
    heading: "Find Your Perfect Property in",
    location: "Ranchi",
    subheading: "Premium residential plots, agricultural land, and commercial properties. Your trusted partner in real estate since 2014.",
    stat1Value: "50+",
    stat1Label: "Properties Listed",
    stat2Value: "200+",
    stat2Label: "Happy Clients",
    stat3Value: "10+",
    stat3Label: "Years Experience",
    stat4Value: "100%",
    stat4Label: "Legal Verified",
  });

  const [notifications, setNotifications] = useState({
    emailEnquiries: true,
    emailCallbacks: true,
    browserNotifications: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getAll();
        if (response.success && response.data.hero) {
          setHero(response.data.hero);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (section: string) => {
    try {
      if (section === "hero") {
        await settingsAPI.update({ hero });
      }
      
      toast({
        title: "Settings saved",
        description: `Your ${section} settings have been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <h2 className="font-semibold text-lg">Profile Information</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="btn-gold" onClick={() => handleSave("profile")}>
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <h2 className="font-semibold text-lg">Company Information</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={company.email}
                  onChange={(e) => setCompany({ ...company, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone1">Phone Number 1</Label>
                <Input
                  id="phone1"
                  value={company.phone1}
                  onChange={(e) => setCompany({ ...company, phone1: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone2">Phone Number 2</Label>
                <Input
                  id="phone2"
                  value={company.phone2}
                  onChange={(e) => setCompany({ ...company, phone2: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="address">Office Address</Label>
                <Input
                  id="address"
                  value={company.address}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workingHours">Working Hours</Label>
                <Input
                  id="workingHours"
                  value={company.workingHours}
                  onChange={(e) => setCompany({ ...company, workingHours: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="btn-gold" onClick={() => handleSave("company")}>
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <h2 className="font-semibold text-lg">Hero Section Settings</h2>
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="badgeText">Badge Text</Label>
                <Input
                  id="badgeText"
                  placeholder="TRUSTED BY 200+ FAMILIES"
                  value={hero.badgeText}
                  onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heading">Heading</Label>
                  <Input
                    id="heading"
                    placeholder="Find Your Perfect Property in"
                    value={hero.heading}
                    onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Highlighted)</Label>
                  <Input
                    id="location"
                    placeholder="Ranchi"
                    value={hero.location}
                    onChange={(e) => setHero({ ...hero, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subheading">Subheading</Label>
                <Input
                  id="subheading"
                  placeholder="Premium residential plots, agricultural land..."
                  value={hero.subheading}
                  onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Statistics</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stat1Value">Stat 1 Value</Label>
                    <Input
                      id="stat1Value"
                      placeholder="50+"
                      value={hero.stat1Value}
                      onChange={(e) => setHero({ ...hero, stat1Value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stat1Label">Stat 1 Label</Label>
                    <Input
                      id="stat1Label"
                      placeholder="Properties Listed"
                      value={hero.stat1Label}
                      onChange={(e) => setHero({ ...hero, stat1Label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stat2Value">Stat 2 Value</Label>
                    <Input
                      id="stat2Value"
                      placeholder="200+"
                      value={hero.stat2Value}
                      onChange={(e) => setHero({ ...hero, stat2Value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stat2Label">Stat 2 Label</Label>
                    <Input
                      id="stat2Label"
                      placeholder="Happy Clients"
                      value={hero.stat2Label}
                      onChange={(e) => setHero({ ...hero, stat2Label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stat3Value">Stat 3 Value</Label>
                    <Input
                      id="stat3Value"
                      placeholder="10+"
                      value={hero.stat3Value}
                      onChange={(e) => setHero({ ...hero, stat3Value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stat3Label">Stat 3 Label</Label>
                    <Input
                      id="stat3Label"
                      placeholder="Years Experience"
                      value={hero.stat3Label}
                      onChange={(e) => setHero({ ...hero, stat3Label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stat4Value">Stat 4 Value</Label>
                    <Input
                      id="stat4Value"
                      placeholder="100%"
                      value={hero.stat4Value}
                      onChange={(e) => setHero({ ...hero, stat4Value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stat4Label">Stat 4 Label</Label>
                    <Input
                      id="stat4Label"
                      placeholder="Legal Verified"
                      value={hero.stat4Label}
                      onChange={(e) => setHero({ ...hero, stat4Label: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="btn-gold" onClick={() => handleSave("hero")}>
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <h2 className="font-semibold text-lg">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Email for New Enquiries</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for new property enquiries
                  </p>
                </div>
                <Switch
                  checked={notifications.emailEnquiries}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailEnquiries: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Email for Callback Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for callback requests
                  </p>
                </div>
                <Switch
                  checked={notifications.emailCallbacks}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailCallbacks: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show browser notifications for new leads
                  </p>
                </div>
                <Switch
                  checked={notifications.browserNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, browserNotifications: checked })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="btn-gold" onClick={() => handleSave("notification")}>
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <h2 className="font-semibold text-lg">Change Password</h2>
            
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="btn-gold" onClick={() => handleSave("password")}>
                Update Password
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
