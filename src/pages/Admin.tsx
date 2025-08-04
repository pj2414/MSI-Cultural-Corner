import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, Society, Announcement, Member, Event } from "@/lib/api";
import { 
  Users, 
  Calendar, 
  Bell, 
  FileText, 
  Download,
  Plus,
  Settings,
  BarChart3,
  TrendingUp,
  Trash2,
  Edit,
  Eye,
  UserCheck,
  Activity,
  Target,
  AlertCircle
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const Admin = () => {
  const [stats, setStats] = useState({
    totalSocieties: 0,
    totalMembers: 0,
    totalEvents: 0,
    totalAnnouncements: 0
  });
  const [societies, setSocieties] = useState<Society[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [isSocietiesDialogOpen, setIsSocietiesDialogOpen] = useState(false);
  const [isEventsDialogOpen, setIsEventsDialogOpen] = useState(false);
  const [isAnnouncementsDialogOpen, setIsAnnouncementsDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [isSocietyReportDialogOpen, setIsSocietyReportDialogOpen] = useState(false);
  
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    targetSocieties: [] as string[]
  });

  const [selectedSocietyForReport, setSelectedSocietyForReport] = useState<Society | null>(null);
  const [societySummary, setSocietySummary] = useState<any>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
        await loadAdminData();
        loadRecentActivities(); // This depends on data from loadAdminData
    };

    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    // This effect runs when societies or announcements change, to update recent activities
    if (societies.length > 0 || announcements.length > 0) {
        loadRecentActivities();
    }
  }, [societies, announcements]);


  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const [statsData, societiesData, announcementsData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAllSocieties(),
        apiService.getAllAnnouncements()
      ]);

      setStats(statsData);
      setSocieties(societiesData);
      setAnnouncements(announcementsData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllMembers = async () => {
    try {
      const members: (Member & { societyName?: string })[] = [];
      for (const society of societies) {
        const societyMembers = await apiService.getSocietyMembers(society._id);
        members.push(...societyMembers.map(member => ({
          ...member,
          societyName: society.name
        })));
      }
      setAllMembers(members);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load members data",
        variant: "destructive",
      });
    }
  };

  const loadAllEvents = async () => {
    try {
      const events: (Event & { societyName?: string })[] = [];
      for (const society of societies) {
        const societyEvents = await apiService.getSocietyEvents(society._id);
        events.push(...societyEvents.map(event => ({
          ...event,
          societyName: society.name
        })));
      }
      setAllEvents(events.sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load events data",
        variant: "destructive",
      });
    }
  };

  const loadRecentActivities = () => {
      const activities: any[] = [];
      
      // Recent societies
      const recentSocieties = [...societies]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);
      
      recentSocieties.forEach(society => {
        activities.push({
          type: "Society Registration",
          description: `${society.name} registered`,
          time: getTimeAgo(society.createdAt),
          status: "completed",
          icon: Users
        });
      });

      // Recent announcements
      const recentAnnouncements = [...announcements]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);

      recentAnnouncements.forEach(announcement => {
        activities.push({
          type: "Announcement",
          description: `"${announcement.title}" published`,
          time: getTimeAgo(announcement.createdAt),
          status: "active",
          icon: Bell
        });
      });

      setRecentActivities(activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4));
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleDeleteSociety = async (societyId: string) => {
    // Replace window.confirm with a custom dialog for better UX if possible
    if (!window.confirm("Are you sure you want to delete this society? This will also delete all associated members and events.")) {
      return;
    }

    try {
      await apiService.deleteSociety(societyId);
      setSocieties(societies.filter(s => s._id !== societyId));
      await loadAdminData(); // Refresh stats
      toast({
        title: "Success",
        description: "Society deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete society",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      await apiService.deleteAnnouncement(announcementId);
      setAnnouncements(announcements.filter(a => a._id !== announcementId));
      await loadAdminData(); // Refresh stats
      toast({
        title: "Success",
        description: "Announcement deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive",
      });
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAnnouncement = await apiService.createAnnouncement(announcementForm);
      setAnnouncements([newAnnouncement, ...announcements]);
      setAnnouncementForm({ title: "", content: "", targetSocieties: [] });
      setIsCreateAnnouncementOpen(false);
      await loadAdminData(); // Refresh stats
      toast({
        title: "Success",
        description: "Announcement created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create announcement",
        variant: "destructive",
      });
    }
  };

  // FIXED REPORT GENERATION FUNCTION
  // Replace the existing handleGenerateReport function with this:
const handleGenerateReport = async (type: 'excel' | 'pdf', selectedSocieties: string[] = []) => {
  try {
    console.log('Generating report:', { type, selectedSocieties });
    
    let blob: Blob;
    
    if (type === 'excel') {
      blob = await apiService.generateExcelReport({ societyIds: selectedSocieties });
    } else {
      blob = await apiService.generatePdfReport({ societyIds: selectedSocieties });
    }
    
    if (blob.size === 0) {
      toast({
        title: "No Data",
        description: "No data available to generate a report. This may be because there are no active societies.",
        variant: "default",
      });
      return;
    }
    
    // Download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `societies_report_${new Date().toISOString().split('T')[0]}.${type === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Success",
      description: `${type.toUpperCase()} report generated successfully!`,
    });
  } catch (error: any) {
    console.error('Report generation error:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to generate report",
      variant: "destructive",
    });
  }
};

// Replace the existing handleGenerateIndividualReport function with this:
const handleGenerateIndividualReport = async (societyId: string, type: 'excel' | 'pdf') => {
  try {
    console.log('Generating individual report:', { societyId, type });
    
    let blob: Blob;
    
    if (type === 'excel') {
      blob = await apiService.generateIndividualExcelReport(societyId);
    } else {
      blob = await apiService.generateIndividualPdfReport(societyId);
    }
    
    const society = societies.find(s => s._id === societyId);
    const societyName = society?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'society';
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${societyName}_detailed_report_${new Date().toISOString().split('T')[0]}.${type === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Success",
      description: `Individual ${type.toUpperCase()} report generated successfully!`,
    });
  } catch (error: any) {
    console.error('Individual report generation error:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to generate individual report",
      variant: "destructive",
    });
  }
};

  // New function for individual society reports
  // const handleGenerateIndividualReport = async (societyId: string, type: 'excel' | 'pdf') => {
  //   try {
  //     const token = apiService.getToken(); // FIX: Use apiService to get the token
  //     if (!token) {
  //       throw new Error('Authentication token not found');
  //     }
      
  //     const response = await fetch(`/api/admin/society/${societyId}/report/${type}`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
      
  //     if (!response.ok) {
  //       throw new Error(`Failed to generate ${type} report`);
  //     }
      
  //     const blob = await response.blob();

  //     const society = societies.find(s => s._id === societyId);
  //     const societyName = society?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'society';
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `${societyName}_detailed_report_${new Date().toISOString().split('T')[0]}.${type === 'excel' ? 'xlsx' : 'pdf'}`;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);

  //     toast({
  //       title: "Success",
  //       description: `Individual ${type.toUpperCase()} report generated successfully!`,
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to generate individual report",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // New function to load society summary
  const loadSocietySummary = async (societyId: string) => {
    try {
      const summary = await apiService.getSocietySummary(societyId);
      setSocietySummary(summary);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load society summary",
        variant: "destructive",
      });
    }
  };

  // New function to open individual society report dialog
  const handleOpenSocietyReport = async (society: Society) => {
    setSelectedSocietyForReport(society);
    await loadSocietySummary(society._id);
    setIsSocietyReportDialogOpen(true);
  };

  const handleTargetSocietyChange = (societyId: string, checked: boolean | 'indeterminate') => {
    if (checked) {
      setAnnouncementForm({
        ...announcementForm,
        targetSocieties: [...announcementForm.targetSocieties, societyId]
      });
    } else {
      setAnnouncementForm({
        ...announcementForm,
        targetSocieties: announcementForm.targetSocieties.filter(id => id !== societyId)
      });
    }
  };

  const statsCards = [
    { 
      title: "Total Societies", 
      value: stats.totalSocieties.toString(), 
      change: societies.filter(s => {
        const createdDate = new Date(s.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return createdDate > monthAgo;
      }).length > 0 ? `+${societies.filter(s => {
        const createdDate = new Date(s.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return createdDate > monthAgo;
      }).length} this month` : "No new this month",
      icon: Users,
      color: "text-blue-500"
    },
    { 
      title: "Active Members", 
      value: stats.totalMembers.toString(), 
      change: `Across ${stats.totalSocieties} societies`,
      icon: UserCheck,
      color: "text-green-500"
    },
    { 
      title: "Total Events", 
      value: stats.totalEvents.toString(), 
      change: "All time events",
      icon: Calendar,
      color: "text-purple-500"
    },
    { 
      title: "Announcements", 
      value: stats.totalAnnouncements.toString(), 
      change: announcements.filter(a => {
        const createdDate = new Date(a.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
      }).length > 0 ? `+${announcements.filter(a => {
        const createdDate = new Date(a.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
      }).length} this week` : "No new this week",
      icon: Bell,
      color: "text-orange-500"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "approved":
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage cultural societies, events, and activities
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsCreateAnnouncementOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsSocietiesDialogOpen(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Societies
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    loadAllEvents();
                    setIsEventsDialogOpen(true);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Review Events
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsAnalyticsDialogOpen(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2 bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <activity.icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{activity.type}</h4>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activities</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {/* Society Management */}
            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Society Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">{societies.length}</div>
                  <p className="text-sm text-muted-foreground">Registered Societies</p>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsSocietiesDialogOpen(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All Societies ({societies.length})
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      loadAllMembers();
                      setIsMembersDialogOpen(true);
                    }}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    View All Members ({stats.totalMembers})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Event Management */}
            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Event Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.totalEvents}</div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      loadAllEvents();
                      setIsEventsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All Events ({stats.totalEvents})
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsAnalyticsDialogOpen(true)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Event Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reports & Analytics */}
            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Reports & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">{announcements.length}</div>
                  <p className="text-sm text-muted-foreground">Announcements</p>
                </div>
                <div className="space-y-2">
                  {/* FIXED BUTTON CLICK */}
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateReport('excel', [])}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  {/* FIXED BUTTON CLICK */}
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateReport('pdf', [])}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Announcements */}
          <Card className="mt-8 bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Announcements
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsCreateAnnouncementOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAnnouncementsDialogOpen(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.length > 0 ? announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement._id} className="p-4 bg-background/50 rounded-lg border-l-4 border-primary">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {announcement.content.length > 100 
                            ? `${announcement.content.substring(0, 100)}...` 
                            : announcement.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Posted {new Date(announcement.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>By {announcement.createdBy}</span>
                          {announcement.targetSocieties.length > 0 && (
                            <>
                              <span>•</span>
                              <span>Targeted to {announcement.targetSocieties.length} societies</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteAnnouncement(announcement._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No announcements yet</p>
                  </div>
                )}
              </div>
              {announcements.length > 3 && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsAnnouncementsDialogOpen(true)}
                  >
                    View All Announcements ({announcements.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Announcement Dialog */}
      <Dialog open={isCreateAnnouncementOpen} onOpenChange={setIsCreateAnnouncementOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                placeholder="Enter announcement title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                placeholder="Enter announcement content"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Target Societies (Leave empty for all societies)</Label>
              <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-2">
                {societies.map((society) => (
                  <div key={society._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={society._id}
                      checked={announcementForm.targetSocieties.includes(society._id)}
                      onCheckedChange={(checked) => handleTargetSocietyChange(society._id, checked)}
                    />
                    <Label htmlFor={society._id} className="text-sm font-normal">{society.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateAnnouncementOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Announcement
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Societies Management Dialog */}
      <Dialog open={isSocietiesDialogOpen} onOpenChange={setIsSocietiesDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Societies ({societies.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {societies.length > 0 ? societies.map((society) => (
              <div key={society._id} className="p-4 border rounded-lg bg-background/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{society.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{society.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Email:</span> {society.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {society.contactInfo?.phone || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Established:</span> {society.establishedYear || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {society.category || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Registered:</span> {new Date(society.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenSocietyReport(society)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Report
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteSociety(society._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No societies registered yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Society Report Dialog */}
      <Dialog open={isSocietyReportDialogOpen} onOpenChange={setIsSocietyReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSocietyForReport?.name} - Individual Report
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {societySummary ? (
              <>
                {/* Society Info */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Society Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Email:</span> {societySummary.society.email}
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Category:</span> {societySummary.society.category || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Established:</span> {societySummary.society.establishedYear || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Status:</span> {societySummary.society.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">{societySummary.statistics.totalMembers}</div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-500">{societySummary.statistics.totalEvents}</div>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-500">{societySummary.statistics.newMembersThisMonth}</div>
                      <p className="text-sm text-muted-foreground">New Members (30 days)</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-500">{societySummary.statistics.eventsThisMonth}</div>
                      <p className="text-sm text-muted-foreground">Recent Events (30 days)</p>
                    </div>
                  </div>
                </div>

                {/* Recent Members */}
                {societySummary.recentMembers.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Recent Members</h3>
                    <div className="space-y-2">
                      {societySummary.recentMembers.map((member: Member) => (
                        <div key={member._id} className="flex justify-between text-sm p-2 bg-background/50 rounded">
                          <span>{member.name} - {member.designation}</span>
                          <span className="text-muted-foreground">{new Date(member.joinedDate).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Events */}
                {societySummary.recentEvents.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Recent Events</h3>
                    <div className="space-y-2">
                      {societySummary.recentEvents.map((event: Event) => (
                        <div key={event._id} className="flex justify-between text-sm p-2 bg-background/50 rounded">
                          <span>{event.eventName}</span>
                          <span className="text-muted-foreground">{new Date(event.day).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Report Generation */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Generate Detailed Report</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto p-4"
                      onClick={() => handleGenerateIndividualReport(selectedSocietyForReport!._id, 'excel')}
                    >
                      <Download className="h-6 w-6 mb-2 text-green-500" />
                      <span>Excel Report</span>
                      <span className="text-xs text-muted-foreground">Detailed spreadsheet</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto p-4"
                      onClick={() => handleGenerateIndividualReport(selectedSocietyForReport!._id, 'pdf')}
                    >
                      <FileText className="h-6 w-6 mb-2 text-red-500" />
                      <span>PDF Report</span>
                      <span className="text-xs text-muted-foreground">Formatted document</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading summary...</p>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Events Management Dialog */}
      <Dialog open={isEventsDialogOpen} onOpenChange={setIsEventsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Events ({allEvents.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {allEvents.length > 0 ? allEvents.map((event) => (
              <div key={event._id} className="p-4 border rounded-lg bg-background/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{event.eventName}</h4>
                      <Badge variant="outline">{event.societyName}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Date:</span> {new Date(event.day).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Venue:</span> {event.venue || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Participants:</span> {event.membersParticipated.length}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Prizes:</span> {event.prizesWon}
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      {event.photosLink && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={event.photosLink} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-3 w-3 mr-1" />
                            Photos
                          </a>
                        </Button>
                      )}
                      {event.reportLink && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={event.reportLink} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-3 w-3 mr-1" />
                            Report
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No events found</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* All Announcements Dialog */}
      <Dialog open={isAnnouncementsDialogOpen} onOpenChange={setIsAnnouncementsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Announcements ({announcements.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {announcements.length > 0 ? announcements.map((announcement) => (
              <div key={announcement._id} className="p-4 border rounded-lg bg-background/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{announcement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Posted {new Date(announcement.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>By {announcement.createdBy}</span>
                      {announcement.targetSocieties.length > 0 ? (
                        <>
                          <span>•</span>
                          <span>Targeted to {announcement.targetSocieties.length} societies</span>
                        </>
                      ) : (
                        <>
                          <span>•</span>
                          <span>All societies</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No announcements yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* All Members Dialog */}
      <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Members ({allMembers.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {allMembers.length > 0 ? allMembers.map((member) => (
              <div key={member._id} className="p-4 border rounded-lg bg-background/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{member.name}</h4>
                      <Badge variant="outline">{member.societyName}</Badge>
                      <Badge className="bg-blue-500/20 text-blue-400">{member.designation}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Department:</span> {member.department}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Enrollment:</span> {member.enrollmentNo}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Email:</span> {member.email || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Phone:</span> {member.phone || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Year:</span> {member.year || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Joined:</span> {new Date(member.joinedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No members found</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics & Reports Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reports & Analytics</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{societies.length}</div>
                <p className="text-sm text-muted-foreground">Total Societies</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-500">{stats.totalMembers}</div>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-500">{stats.totalEvents}</div>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-500">{announcements.length}</div>
                <p className="text-sm text-muted-foreground">Announcements</p>
              </div>
            </div>

            {/* Report Generation */}
            <div className="space-y-4">
              <h3 className="font-medium">Generate Reports</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* FIXED BUTTON CLICK */}
                <Button 
                  variant="outline" 
                  className="flex-col h-auto p-4"
                  onClick={() => handleGenerateReport('excel', [])}
                >
                  <Download className="h-6 w-6 mb-2 text-green-500" />
                  <span>Excel Report</span>
                  <span className="text-xs text-muted-foreground">Complete data export</span>
                </Button>
                {/* FIXED BUTTON CLICK */}
                <Button 
                  variant="outline" 
                  className="flex-col h-auto p-4"
                  onClick={() => handleGenerateReport('pdf', [])}
                >
                  <FileText className="h-6 w-6 mb-2 text-red-500" />
                  <span>PDF Report</span>
                  <span className="text-xs text-muted-foreground">Formatted document</span>
                </Button>
              </div>
            </div>

            {/* Recent Activity Summary */}
            <div className="space-y-4">
              <h3 className="font-medium">Activity Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Societies registered this month:</span>
                  <span className="font-medium">
                    {societies.filter(s => {
                      const createdDate = new Date(s.createdAt);
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return createdDate > monthAgo;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Announcements this week:</span>
                  <span className="font-medium">
                    {announcements.filter(a => {
                      const createdDate = new Date(a.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return createdDate > weekAgo;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average members per society:</span>
                  <span className="font-medium">
                    {societies.length > 0 ? Math.round(stats.totalMembers / societies.length) : 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average events per society:</span>
                  <span className="font-medium">
                    {societies.length > 0 ? Math.round(stats.totalEvents / societies.length) : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;