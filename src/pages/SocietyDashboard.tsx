import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, Society, Member, Event, Announcement } from "@/lib/api";
import { 
  Users, 
  Calendar, 
  Trophy, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Bell,
  Sparkles,
  TrendingUp,
  Award,
  Activity,
  Menu,
  X
} from "lucide-react";

const SocietyDashboard = () => {
  const [society, setSociety] = useState<Society | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    recentEvents: [] as Event[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'society') {
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [societyData, membersData, eventsData, announcementsData, statsData] = await Promise.all([
        apiService.getSocietyProfile(),
        apiService.getMembers(),
        apiService.getEvents(),
        apiService.getAnnouncements(),
        apiService.getSocietyStats()
      ]);

      setSociety(societyData);
      setMembers(membersData);
      setEvents(eventsData);
      setAnnouncements(announcementsData);
      setStats(statsData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await apiService.deleteMember(memberId);
      setMembers(members.filter(m => m._id !== memberId));
      toast({
        title: "Member Deleted",
        description: "Member has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await apiService.deleteEvent(eventId);
      setEvents(events.filter(e => e._id !== eventId));
      toast({
        title: "Event Deleted",
        description: "Event has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-text bg-clip-text text-transparent truncate">
                  {society?.name || 'Society Dashboard'}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
                  Welcome back, {user?.name || user?.email}
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/society/members')}>
                <Users className="h-4 w-4 mr-2" />
                Manage Members
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/society/events')}>
                <Calendar className="h-4 w-4 mr-2" />
                Manage Events
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-border/50">
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => {
                    navigate('/society/members');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Members
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    navigate('/society/events');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Events
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.totalMembers}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.totalEvents}</p>
                </div>
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 sm:col-span-1 col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Recent Events</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.recentEvents.length}</p>
                </div>
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
            <TabsTrigger value="members" className="text-xs sm:text-sm py-2">Members</TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm py-2">Events</TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs sm:text-sm py-2">News</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Society Profile */}
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  Society Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-base sm:text-lg font-semibold break-words">{society?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Category</p>
                    <Badge variant="outline" className="text-xs">{society?.category || 'Not specified'}</Badge>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base sm:text-lg break-all">{society?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Established</p>
                    <p className="text-base sm:text-lg">{society?.establishedYear || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-base sm:text-lg break-words">{society?.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  Recent Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentEvents.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {stats.recentEvents.map((event) => (
                      <div key={event._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-muted/20 rounded-lg space-y-2 sm:space-y-0">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm sm:text-base truncate">{event.eventName}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(event.day).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs self-start sm:self-center">{event.prizesWon}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8 text-sm sm:text-base">No recent events</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold">Society Members</h2>
              <Button 
                onClick={() => navigate('/society/members')}
                size="sm"
                className="self-start sm:self-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {members.map((member) => (
                <Card key={member._id} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarFallback className="text-sm">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{member.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{member.designation}</p>
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <p className="truncate"><span className="font-medium">Department:</span> {member.department}</p>
                      <p className="truncate"><span className="font-medium">Enrollment:</span> {member.enrollmentNo}</p>
                      {member.email && <p className="truncate"><span className="font-medium">Email:</span> {member.email}</p>}
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteMember(member._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {members.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">No members yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold">Society Events</h2>
              <Button 
                onClick={() => navigate('/society/events')}
                size="sm"
                className="self-start sm:self-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {events.map((event) => (
                <Card key={event._id} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                      <h3 className="font-semibold text-base sm:text-lg break-words flex-1 min-w-0">{event.eventName}</h3>
                      <Badge variant="outline" className="text-xs self-start sm:self-center">{event.prizesWon}</Badge>
                    </div>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <p><span className="font-medium">Date:</span> {new Date(event.day).toLocaleDateString()}</p>
                      <p className="break-words"><span className="font-medium">Venue:</span> {event.venue || 'Not specified'}</p>
                      <p className="break-words"><span className="font-medium">Participants:</span> {event.membersParticipated.join(', ')}</p>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">No events yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Announcements</h2>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement._id} className="bg-gradient-card border-border/50 shadow-card">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Bell className="h-4 w-4 text-primary flex-shrink-0" />
                            <h3 className="font-semibold text-sm sm:text-base break-words">{announcement.title}</h3>
                          </div>
                          <Badge variant="outline" className="text-xs self-start sm:self-center">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm sm:text-base break-words mb-2">{announcement.content}</p>
                        <p className="text-xs text-muted-foreground">
                          By: {announcement.createdBy}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {announcements.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm sm:text-base">No announcements yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocietyDashboard;