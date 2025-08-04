import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Sparkles, Info } from "lucide-react";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    password: "",
    confirmPassword: "",
    category: "",
    establishedYear: "",
    phone: "",
    website: "",
  });

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const registrationData = {
        name: formData.name,
        description: formData.description,
        email: formData.email,
        password: formData.password,
        category: formData.category,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : undefined,
        contactInfo: {
          phone: formData.phone || undefined,
          website: formData.website || undefined,
        },
      };

      await register(registrationData);
      toast({
        title: "Registration Successful",
        description: "Your society has been registered successfully!",
      });
      navigate('/society/dashboard');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register society. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categories = [
    "Performing Arts",
    "Visual Arts", 
    "Literary Arts",
    "Music",
    "Dance",
    "Drama & Theatre",
    "Cultural Heritage",
    "Modern Arts",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/80" />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-text bg-clip-text text-transparent">
                Cultural Corner
              </h1>
              <p className="text-sm text-muted-foreground">MSI</p>
            </div>
          </Link>
          
          <h2 className="text-3xl font-bold mb-2 text-foreground">Register Your Society</h2>
          <p className="text-muted-foreground">Join our vibrant cultural community at MSI</p>
        </div>

        {/* Registration Form */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" />
              Society Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Society Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Dance Society"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select required value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your society's mission and activities..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="established-year">Established Year</Label>
                  <Input
                    id="established-year"
                    type="number"
                    placeholder="2024"
                    min="2000"
                    max="2025"
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="society@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://society-website.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Account Setup */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Account Setup</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password *</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-primary font-medium mb-1">Registration Review Process</p>
                    <p className="text-muted-foreground">
                      Your society registration will be reviewed by our administrative team. 
                      You'll receive an email confirmation once approved (usually within 2-3 business days).
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register Society"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000" />
    </div>
  );
};

export default Register;