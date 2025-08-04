import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react";

const Events = () => {
  const upcomingEvents = [
    {
      name: "Genesis 2025",
      description: "Annual cultural extravaganza featuring competitions in dance, music, drama, and arts",
      date: "2025-03-15",
      time: "9:00 AM",
      venue: "MSI Main Auditorium",
      organizer: "Cultural Committee",
      participants: "500+",
      category: "Main Festival",
      status: "Registration Open"
    },
    {
      name: "Navrang Classical Night",
      description: "An evening dedicated to classical Indian arts including dance and music",
      date: "2025-02-20",
      time: "6:00 PM", 
      venue: "Open Air Theatre",
      organizer: "Dance Society",
      participants: "200+",
      category: "Cultural Event",
      status: "Coming Soon"
    },
    {
      name: "Poetry Symposium",
      description: "A gathering of poets and literature enthusiasts for sharing creative works",
      date: "2025-02-10",
      time: "4:00 PM",
      venue: "Conference Hall",
      organizer: "Literary Society",
      participants: "100+",
      category: "Literary Event",
      status: "Registration Open"
    }
  ];

  const pastEvents = [
    {
      name: "Winter Fest 2024",
      description: "Celebrated with various cultural activities and performances",
      date: "2024-12-15",
      participants: "400+",
      awards: "15 Categories",
      highlights: "Best turnout in MSI history"
    },
    {
      name: "Talent Hunt 2024",
      description: "Platform for new talents to showcase their skills",
      date: "2024-11-20",
      participants: "250+",
      awards: "8 Categories", 
      highlights: "Discovered amazing talents"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registration Open":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Coming Soon":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
              Cultural Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join 100+ annual events that celebrate creativity, talent, and cultural diversity
            </p>
            <div className="mt-6">
              <Badge variant="outline" className="text-lg px-4 py-2">
                100+ Events Annually
              </Badge>
            </div>
          </div>

          {/* Upcoming Events */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-text bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {event.name}
                      </CardTitle>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {event.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-accent" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary-glow" />
                        <span className="text-sm">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm">{event.participants} Expected</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant={event.status === "Registration Open" ? "default" : "outline"}
                        className="w-full"
                      >
                        {event.status === "Registration Open" ? "Register Now" : "View Details"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Past Events */}
          <section>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-text bg-clip-text text-transparent">
              Past Events Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastEvents.map((event, index) => (
                <Card key={index} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      {event.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-sm font-semibold">{event.participants}</p>
                        <p className="text-xs text-muted-foreground">Participants</p>
                      </div>
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <Star className="h-5 w-5 mx-auto mb-1 text-accent" />
                        <p className="text-sm font-semibold">{event.awards}</p>
                        <p className="text-xs text-muted-foreground">Awards</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary font-medium">✨ {event.highlights}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center mt-16 p-8 bg-gradient-card rounded-2xl border border-border/50">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
              Want to Organize an Event?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Have an idea for a cultural event? Partner with us to bring your vision to life
              and engage the MSI community.
            </p>
            <Button variant="hero">
              Submit Event Proposal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;