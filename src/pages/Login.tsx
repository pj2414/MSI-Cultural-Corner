import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Sparkles, Users, Shield } from "lucide-react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [societyEmail, setSocietyEmail] = useState("");
  const [societyPassword, setSocietyPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSocietyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(societyEmail, societyPassword, 'society');
      toast({
        title: "Login Successful",
        description: "Welcome back to your society dashboard!",
      });
      navigate('/society/dashboard');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(adminEmail, adminPassword, 'admin');
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard!",
      });
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid admin credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/80" />
      
      <div className="relative z-10 w-full max-w-md">
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
          
          <h2 className="text-3xl font-bold mb-2 text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Login Tabs */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="society" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="society" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Society
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="society">
                <form onSubmit={handleSocietyLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="society-email">Email</Label>
                    <Input
                      id="society-email"
                      type="email"
                      placeholder="society@example.com"
                      value={societyEmail}
                      onChange={(e) => setSocietyEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="society-password">Password</Label>
                    <Input
                      id="society-password"
                      type="password"
                      placeholder="••••••••"
                      value={societyPassword}
                      onChange={(e) => setSocietyPassword(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Society"}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline">
                      Register your society
                    </Link>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="admin">
                <div className="mb-4">
                  <Badge variant="outline" className="w-full justify-center border-primary/30">
                    Administrative Access Only
                  </Badge>
                </div>
                
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@msijanakpuri.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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

export default Login;