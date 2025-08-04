import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, Event, Member } from "@/lib/api";
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Search,
  Filter,
  Download,
  ExternalLink,
  Trophy,
  Users,
  MapPin,
  Sparkles,
  Menu,
  X
} from "lucide-react";

// --- RESPONSIVE FORM COMPONENT ---
interface EventFormData {
  eventName: string;
  day: string;
  membersParticipated: string[];
  prizesWon: string;
  photosLink: string;
  reportLink: string;
  eventType: string;
  venue: string;
  description: string;
}

interface EventFormProps {
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  formData: EventFormData;
  handleFieldChange: (field: keyof EventFormData, value: string | string[]) => void;
  handleMemberToggle: (memberName: string) => void;
  onCancel: () => void;
  members: Member[];
  eventTypes: string[];
  prizeCategories: string[];
}

const EventForm = ({
  onSubmit,
  title,
  formData,
  handleFieldChange,
  handleMemberToggle,
  onCancel,
  members,
  eventTypes,
  prizeCategories
}: EventFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6 p-1">
    {/* Basic Information */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="eventName" className="text-sm sm:text-base">Event Name *</Label>
        <Input
          id="eventName"
          value={formData.eventName}
          onChange={(e) => handleFieldChange('eventName', e.target.value)}
          placeholder="Enter event name"
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label htmlFor="day" className="text-sm sm:text-base">Event Date *</Label>
        <Input
          id="day"
          type="date"
          value={formData.day}
          onChange={(e) => handleFieldChange('day', e.target.value)}
          className="mt-1"
          required
        />
      </div>
    </div>

    {/* Event Details */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="eventType" className="text-sm sm:text-base">Event Type</Label>
        <Select value={formData.eventType} onValueChange={(value) => handleFieldChange('eventType', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="venue" className="text-sm sm:text-base">Venue</Label>
        <Input
          id="venue"
          value={formData.venue}
          onChange={(e) => handleFieldChange('venue', e.target.value)}
          placeholder="Enter venue"
          className="mt-1"
        />
      </div>
    </div>

    {/* Description */}
    <div>
      <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => handleFieldChange('description', e.target.value)}
        placeholder="Describe the event..."
        className="min-h-[80px] sm:min-h-[100px] mt-1"
      />
    </div>

    {/* Prizes and Links */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="prizesWon" className="text-sm sm:text-base">Prizes/Achievements *</Label>
        <Select value={formData.prizesWon} onValueChange={(value) => handleFieldChange('prizesWon', value)} required>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select prize category" />
          </SelectTrigger>
          <SelectContent>
            {prizeCategories.map((prize) => (
              <SelectItem key={prize} value={prize}>{prize}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="photosLink" className="text-sm sm:text-base">Photos Link *</Label>
        <Input
          id="photosLink"
          type="url"
          value={formData.photosLink}
          onChange={(e) => handleFieldChange('photosLink', e.target.value)}
          placeholder="https://photos-link.com"
          className="mt-1"
          required
        />
      </div>
    </div>

    {/* Report Link */}
    <div>
      <Label htmlFor="reportLink" className="text-sm sm:text-base">Report Link *</Label>
      <Input
        id="reportLink"
        type="url"
        value={formData.reportLink}
        onChange={(e) => handleFieldChange('reportLink', e.target.value)}
        placeholder="https://report-link.com"
        className="mt-1"
        required
      />
    </div>

    {/* Members Selection */}
    <div>
      <Label className="text-sm sm:text-base">Members Participated *</Label>
      <div className="mt-2 max-h-32 sm:max-h-40 overflow-y-auto border rounded-md p-3 space-y-2 bg-background">
        {members.length > 0 ? (
          members.map((member) => (
            <div key={member._id} className="flex items-start space-x-3">
              <Checkbox
                id={member._id}
                checked={formData.membersParticipated.includes(member.name)}
                onCheckedChange={() => handleMemberToggle(member.name)}
                className="mt-0.5"
              />
              <label 
                htmlFor={member._id} 
                className="text-sm leading-tight cursor-pointer flex-1 min-w-0"
              >
                <span className="font-medium break-words">{member.name}</span>
                <span className="text-muted-foreground block sm:inline sm:ml-1">
                  {member.designation}
                </span>
              </label>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No members available. Add members first.
          </p>
        )}
      </div>
    </div>

    {/* Form Actions */}
    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2 pt-4 border-t">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="order-2 sm:order-1"
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        className="order-1 sm:order-2"
      >
        {title}
      </Button>
    </div>
  </form>
);

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    eventName: "",
    day: "",
    membersParticipated: [],
    prizesWon: "",
    photosLink: "",
    reportLink: "",
    eventType: "",
    venue: "",
    description: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const eventTypes = [
    "Cultural Festival", "Competition", "Workshop", "Seminar", "Performance",
    "Exhibition", "Conference", "Celebration", "Other"
  ];

  const prizeCategories = [
    "1st Prize", "2nd Prize", "3rd Prize", "Special Recognition", "Participation",
    "Best Performance", "Innovation Award", "Excellence Award", "Other"
  ];

  useEffect(() => {
    if (!user || user.role !== 'society') {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filterType]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [eventsData, membersData] = await Promise.all([
        apiService.getEvents(),
        apiService.getMembers()
      ]);
      setEvents(eventsData);
      setMembers(membersData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType && filterType !== "all") {
      filtered = filtered.filter(event => event.eventType === filterType);
    }
    setFilteredEvents(filtered);
  };

  const handleFieldChange = useCallback((field: keyof EventFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleMemberToggle = useCallback((memberName: string) => {
    setFormData(prev => ({
      ...prev,
      membersParticipated: prev.membersParticipated.includes(memberName)
        ? prev.membersParticipated.filter(name => name !== memberName)
        : [...prev.membersParticipated, memberName]
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      eventName: "", day: "", membersParticipated: [], prizesWon: "",
      photosLink: "", reportLink: "", eventType: "", venue: "", description: ""
    });
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEvent = await apiService.addEvent(formData);
      setEvents([...events, newEvent]);
      setIsAddDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Event added successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add event", variant: "destructive" });
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const updatedEvent = await apiService.updateEvent(editingEvent._id, formData);
      setEvents(events.map(ev => ev._id === editingEvent._id ? updatedEvent : ev));
      setIsEditDialogOpen(false);
      setEditingEvent(null);
      resetForm();
      toast({ title: "Success", description: "Event updated successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update event", variant: "destructive" });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await apiService.deleteEvent(eventId);
      setEvents(events.filter(e => e._id !== eventId));
      toast({ title: "Success", description: "Event deleted successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete event", variant: "destructive" });
    }
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      eventName: event.eventName,
      day: new Date(event.day).toISOString().split('T')[0],
      membersParticipated: event.membersParticipated,
      prizesWon: event.prizesWon,
      photosLink: event.photosLink,
      reportLink: event.reportLink,
      eventType: event.eventType || "",
      venue: event.venue || "",
      description: event.description || ""
    });
    setIsEditDialogOpen(true);
  };
  
  const commonFormProps = {
    formData,
    handleFieldChange,
    handleMemberToggle,
    members,
    eventTypes,
    prizeCategories
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading events...</p>
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
            {/* Navigation and Title */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/society/dashboard')}
                className="flex-shrink-0 p-2 sm:px-3"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-text bg-clip-text text-transparent truncate">
                  Event Management
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Manage your society events
                </p>
              </div>
            </div>
            
            {/* Desktop Add Button */}
            <div className="hidden sm:block">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Add Event</span>
                    <span className="lg:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <EventForm 
                    {...commonFormProps}
                    onSubmit={handleAddEvent} 
                    title="Add Event" 
                    onCancel={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile Add Button */}
            <div className="sm:hidden">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg">Add New Event</DialogTitle>
                  </DialogHeader>
                  <EventForm 
                    {...commonFormProps}
                    onSubmit={handleAddEvent} 
                    title="Add Event" 
                    onCancel={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Filters */}
        <Card className="bg-gradient-card border-border/50 shadow-card mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-4 sm:hidden">
              <h3 className="font-medium">Search & Filter</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {isMobileFilterOpen ? 'Hide' : 'Show'}
              </Button>
            </div>

            {/* Filter Content */}
            <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} sm:block`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="search" className="text-sm">Search Events</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, venue, or type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <Label htmlFor="type-filter" className="text-sm">Filter by Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All event types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All event types</SelectItem>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Export Button */}
                <div className="flex items-end">
                  <Button variant="outline" className="w-full mt-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredEvents.map((event) => (
            <Card key={event._id} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
              <CardContent className="p-4 sm:p-6">
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg break-words">{event.eventName}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.day).toLocaleDateString()}
                        </span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground truncate">{event.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="self-start sm:self-center flex-shrink-0">
                    {event.prizesWon}
                  </Badge>
                </div>
                
                {/* Event Details */}
                <div className="space-y-1 sm:space-y-2 text-sm mb-4">
                  {event.eventType && (
                    <p className="break-words">
                      <span className="font-medium">Type:</span> {event.eventType}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Participants:</span> {event.membersParticipated.length} members
                  </p>
                  {event.description && (
                    <p className="break-words">
                      <span className="font-medium">Description:</span> 
                      <span className="block sm:inline sm:ml-1">{event.description}</span>
                    </p>
                  )}
                </div>

                {/* Action Links */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
                  <Button variant="outline" size="sm" asChild className="justify-center">
                    <a href={event.photosLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Photos
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="justify-center">
                    <a href={event.reportLink} target="_blank" rel="noopener noreferrer">
                      <Trophy className="h-3 w-3 mr-1" />
                      Report
                    </a>
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(event)}
                  >
                    <Edit className="h-3 w-3" />
                    <span className="ml-1 hidden sm:inline">Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="ml-1 hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
              {searchTerm || (filterType && filterType !== "all")
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first event."
              }
            </p>
            {!searchTerm && (!filterType || filterType === "all") && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <EventForm 
                    {...commonFormProps}
                    onSubmit={handleAddEvent} 
                    title="Add Event" 
                    onCancel={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm 
            {...commonFormProps}
            onSubmit={handleEditEvent} 
            title="Update Event" 
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingEvent(null);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagement;