import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Menu, 
  Home, 
  Users, 
  Calendar, 
  Trophy, 
  Settings,
  LogIn,
  UserPlus,
  Sparkles,
  LogOut,
  LayoutDashboard
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Societies", href: "/societies", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Gallery", href: "/gallery", icon: Trophy },
    ...(user?.role === 'admin' ? [{ name: "Admin", href: "/admin", icon: Settings }] : []),
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-text bg-clip-text text-transparent">
                Cultural Corner
              </h1>
              <p className="text-xs text-muted-foreground">MSI</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(item.href) 
                      ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                      : "hover:bg-accent/50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {user?.role === 'society' && (
                  <Link to="/society/dashboard">
                    <Button variant="outline" size="sm">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={() => {
                  logout();
                  navigate('/');
                }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 backdrop-blur-lg">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-text bg-clip-text text-transparent">
                      Cultural Corner
                    </h1>
                    <p className="text-xs text-muted-foreground">MSI</p>
                  </div>
                </div>

                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-gradient-primary text-primary-foreground"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {isActive(item.href) && (
                      <Badge variant="secondary" className="ml-auto">Active</Badge>
                    )}
                  </Link>
                ))}

                <div className="border-t border-border/50 pt-4 mt-6">
                  <div className="space-y-2">
                    {isAuthenticated ? (
                      <>
                        {user?.role === 'society' && (
                          <Link to="/society/dashboard" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full justify-start">
                              <LayoutDashboard className="h-4 w-4 mr-2" />
                              Dashboard
                            </Button>
                          </Link>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            logout();
                            navigate('/');
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full justify-start">
                            <LogIn className="h-4 w-4 mr-2" />
                            Login
                          </Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          <Button variant="default" className="w-full justify-start">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Register Society
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;