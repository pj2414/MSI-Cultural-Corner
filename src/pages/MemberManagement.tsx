import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, Member } from "@/lib/api";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Search,
  Filter,
  Download,
  Upload,
  Sparkles,
  User,
  Hash,
  Building2,
  Briefcase,
  Mail,
  Phone,
  CalendarDays,
  Menu,
  X
} from "lucide-react";

interface MemberFormData {
  name: string;
  department: string;
  enrollmentNo: string;
  designation: string;
  email: string;
  phone: string;
  year: string;
}

interface MemberFormProps {
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  formData: MemberFormData;
  handleInputChange: (field: string, value: string) => void;
  handleSelectChange: (field: string, value: string) => void;
  onCancel: () => void;
  departments: string[];
  designations: string[];
  years: string[];
  isMobile?: boolean;
}

const MemberForm = ({ 
  onSubmit, 
  title, 
  formData, 
  handleInputChange, 
  handleSelectChange, 
  onCancel,
  departments,
  designations,
  years,
  isMobile = false
}: MemberFormProps) => {
  return (
    <div className={`${isMobile ? 'px-1' : ''}`}>
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6 py-2">
        {/* Personal & Academic Information */}
        <div className="space-y-2">
          <h3 className="font-medium text-foreground text-sm sm:text-base">Personal & Academic Info</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Enter the member's primary details.</p>
        </div>
        
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          <div>
            <Label htmlFor="name" className="text-xs sm:text-sm">Full Name *</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleInputChange('name', e.target.value)} 
                placeholder="e.g., Jane Doe" 
                required 
                className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="enrollmentNo" className="text-xs sm:text-sm">Enrollment Number *</Label>
            <div className="relative mt-1">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input 
                id="enrollmentNo" 
                value={formData.enrollmentNo} 
                onChange={(e) => handleInputChange('enrollmentNo', e.target.value)} 
                placeholder="e.g., 0123456789" 
                required 
                className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
              />
            </div>
          </div>
        </div>

        {/* Society Role Information */}
        <div className="space-y-2 pt-2">
          <h3 className="font-medium text-foreground text-sm sm:text-base">Society Role</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Assign their role and department within the society.</p>
        </div>
        
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          <div>
            <Label htmlFor="department" className="text-xs sm:text-sm">Department *</Label>
            <Select value={formData.department || undefined} onValueChange={(value) => handleSelectChange('department', value)} required>
              <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept} className="text-sm">{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="designation" className="text-xs sm:text-sm">Designation *</Label>
            <Select value={formData.designation || undefined} onValueChange={(value) => handleSelectChange('designation', value)} required>
              <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                {designations.map((d) => (
                  <SelectItem key={d} value={d} className="text-sm">{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="year" className="text-xs sm:text-sm">Year</Label>
          <Select value={formData.year || undefined} onValueChange={(value) => handleSelectChange('year', value)}>
            <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm">
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y} className="text-sm">{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 pt-2">
          <h3 className="font-medium text-foreground text-sm sm:text-base">Contact Details (Optional)</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Provide ways to contact the member.</p>
        </div>
        
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          <div>
            <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleInputChange('email', e.target.value)} 
                placeholder="e.g., member@example.com" 
                className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => handleInputChange('phone', e.target.value)} 
                placeholder="e.g., 98765 43210" 
                className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="w-full sm:w-auto text-sm h-9 sm:h-10">
            Cancel
          </Button>
          <Button type="submit" className="w-full sm:w-auto text-sm h-9 sm:h-10">
            {title}
          </Button>
        </div>
      </form>
    </div>
  );
};

const MemberCard = ({ member, onEdit, onDelete }: { 
  member: Member; 
  onEdit: (member: Member) => void; 
  onDelete: (memberId: string) => void; 
}) => (
  <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500">
    <CardContent className="p-3 sm:p-4 lg:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarFallback className="text-xs sm:text-sm">{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base truncate">{member.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{member.designation}</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(member)}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(member._id)}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">{member.department}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Hash className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">{member.enrollmentNo}</span>
        </div>
        {member.email && (
          <div className="flex items-center space-x-2">
            <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{member.email}</span>
          </div>
        )}
        {member.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{member.phone}</span>
          </div>
        )}
        {member.year && (
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{member.year}</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    name: "",
    department: "",
    enrollmentNo: "",
    designation: "",
    email: "",
    phone: "",
    year: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication", 
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Applied Sciences",
    "Management Studies",
    "Other"
  ];

  const designations = [
    "President",
    "Vice President", 
    "Secretary",
    "Treasurer",
    "General Secretary",
    "Joint Secretary",
    "Cultural Secretary",
    "Technical Secretary",
    "Member",
    "Coordinator"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  useEffect(() => {
    if (!user || user.role !== 'society') {
      navigate('/login');
      return;
    }
    loadMembers();
  }, [user, navigate]);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, filterDepartment]);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getMembers();
      setMembers(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartment && filterDepartment !== "all") {
      filtered = filtered.filter(member => member.department === filterDepartment);
    }

    setFilteredMembers(filtered);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMember = await apiService.addMember(formData);
      setMembers([...members, newMember]);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Member added successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMember) return;

    try {
      const updatedMember = await apiService.updateMember(editingMember._id, formData);
      setMembers(members.map(m => m._id === editingMember._id ? updatedMember : m));
      setIsEditDialogOpen(false);
      setEditingMember(null);
      resetForm();
      toast({
        title: "Success",
        description: "Member updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await apiService.deleteMember(memberId);
      setMembers(members.filter(m => m._id !== memberId));
      toast({
        title: "Success",
        description: "Member deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete member", 
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      department: member.department,
      enrollmentNo: member.enrollmentNo,
      designation: member.designation,
      email: member.email || "",
      phone: member.phone || "",
      year: member.year || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSelectChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      department: "",
      enrollmentNo: "",
      designation: "",
      email: "",
      phone: "",
      year: ""
    });
  }, []);

  const commonFormProps = {
    formData,
    handleInputChange,
    handleSelectChange,
    departments,
    designations,
    years
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Button variant="ghost" size="sm" onClick={() => navigate('/society/dashboard')} className="p-1 sm:p-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Back to Dashboard</span>
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-text bg-clip-text text-transparent truncate">
                  Member Management
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Manage your society members</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Mobile Add Button */}
              <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" className="sm:hidden">
                    <Plus className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Add New Member</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <MemberForm 
                      {...commonFormProps}
                      onSubmit={handleAddMember} 
                      title="Add Member"
                      onCancel={() => {
                        setIsAddDialogOpen(false);
                        resetForm();
                      }}
                      isMobile={true}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Add Button */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="hidden sm:flex">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                  </DialogHeader>
                  <MemberForm 
                    {...commonFormProps}
                    onSubmit={handleAddMember} 
                    title="Add Member"
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
        {/* Search and Filters */}
        <div className="mb-4 sm:mb-6">
          {/* Mobile Search */}
          <div className="sm:hidden mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
          </div>

          {/* Mobile Filter Sheet */}
          <div className="flex justify-between items-center sm:hidden mb-4">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {filterDepartment !== "all" && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">1</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[300px]">
                <SheetHeader>
                  <SheetTitle>Filter Members</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label className="text-sm">Department</Label>
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => setIsFilterSheetOpen(false)} 
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Desktop Filters */}
          <Card className="bg-gradient-card border-border/50 shadow-card hidden sm:block">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search" className="text-sm">Search Members</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, enrollment, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="department-filter" className="text-sm">Filter by Department</Label>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredMembers.length} of {members.length} members
          </p>
          {(searchTerm || filterDepartment !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchTerm("");
                setFilterDepartment("all");
              }}
              className="text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              onEdit={openEditDialog}
              onDelete={handleDeleteMember}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No members found</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
              {searchTerm || (filterDepartment !== "all")
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first member."
              }
            </p>
            {!searchTerm && filterDepartment === "all" && (
              <>
                {/* Mobile Add Button */}
                <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <SheetTrigger asChild>
                    <Button className="sm:hidden">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Member
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Add New Member</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <MemberForm 
                        {...commonFormProps}
                        onSubmit={handleAddMember} 
                        title="Add Member"
                        onCancel={() => {
                          setIsAddDialogOpen(false);
                          resetForm();
                        }}
                        isMobile={true}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Desktop Add Button */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="hidden sm:flex">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Member</DialogTitle>
                    </DialogHeader>
                    <MemberForm 
                      {...commonFormProps}
                      onSubmit={handleAddMember} 
                      title="Add Member"
                      onCancel={() => {
                        setIsAddDialogOpen(false);
                        resetForm();
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Edit Sheet */}
      <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md sm:hidden">
          <SheetHeader>
            <SheetTitle>Edit Member</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <MemberForm 
              {...commonFormProps}
              onSubmit={handleEditMember} 
              title="Update Member"
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingMember(null);
                resetForm();
              }}
              isMobile={true}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto hidden sm:block">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <MemberForm 
            {...commonFormProps}
            onSubmit={handleEditMember} 
            title="Update Member"
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingMember(null);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManagement;
