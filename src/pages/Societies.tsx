import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Trophy, ExternalLink, Loader2, AlertCircle } from "lucide-react";

const Societies = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch societies from the database
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get admin token from localStorage
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('/api/admin/societies', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch societies`);
        }

        const societiesData = await response.json();
        setSocieties(societiesData);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching societies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading societies...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-lg font-semibold mb-2">Failed to Load Societies</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
              Our Cultural Societies
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover {societies.length}+ vibrant societies where creativity flourishes and talents shine
            </p>
            <div className="mt-6">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {societies.length}+ Active Societies
              </Badge>
            </div>
          </div>

          {/* Societies Grid */}
          {societies.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No Societies Found</h3>
              <p className="text-muted-foreground">No societies have been registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {societies.map((society, index) => (
                <Card key={society._id} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                          {society.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {society.category || "Cultural"}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Est. {society.establishedYear || "N/A"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {society.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-sm font-semibold">--</p>
                        <p className="text-xs text-muted-foreground">Members</p>
                      </div>
                      <div className="text-center">
                        <Calendar className="h-5 w-5 mx-auto mb-1 text-accent" />
                        <p className="text-sm font-semibold">--</p>
                        <p className="text-xs text-muted-foreground">Events</p>
                      </div>
                      <div className="text-center">
                        <Trophy className="h-5 w-5 mx-auto mb-1 text-primary-glow" />
                        <p className="text-sm font-semibold">5+</p>
                        <p className="text-xs text-muted-foreground">Awards</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    {(society.email || society.contactInfo?.phone || society.contactInfo?.website) && (
                      <div className="space-y-1 mb-4 text-xs text-muted-foreground">
                        {society.email && (
                          <p><span className="font-medium">Email:</span> {society.email}</p>
                        )}
                        {society.contactInfo?.phone && (
                          <p><span className="font-medium">Phone:</span> {society.contactInfo.phone}</p>
                        )}
                        {society.contactInfo?.website && (
                          <p><span className="font-medium">Website:</span> {society.contactInfo.website}</p>
                        )}
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full group-hover:bg-primary/10">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16 p-8 bg-gradient-card rounded-2xl border border-border/50">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
              Want to Start Your Own Society?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Have a passion you'd like to share? Join our growing community of cultural societies
              and make your mark at MSI.
            </p>
            <Button variant="hero">
              Apply for New Society
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Societies;