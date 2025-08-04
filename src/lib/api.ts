const API_BASE_URL = 'https://cultural-backend.onrender.com/api';

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'society';
}

export interface Society {
  _id: string;
  name: string;
  description: string;
  email: string;
  profilePic?: string;
  contactInfo?: {
    phone?: string;
    address?: string;
    website?: string;
  };
  establishedYear?: number;
  category?: string;
  isActive?: boolean;
  totalMembers?: number;
  totalEvents?: number;
  lastActivity?: string;
  memberCount?: number;
  eventCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  _id: string;
  societyId: string;
  name: string;
  department: string;
  enrollmentNo: string;
  designation: string;
  email?: string;
  phone?: string;
  year?: string;
  isActive?: boolean;
  profilePic?: string;
  achievements?: string[];
  skills?: string[];
  societyName?: string;
  joinedDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  _id: string;
  societyId: string;
  eventName: string;
  day: string;
  membersParticipated: string[];
  prizesWon: string;
  photosLink: string;
  reportLink: string;
  eventType?: string;
  venue?: string;
  description?: string;
  budget?: number;
  audience?: number;
  duration?: string;
  status?: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';
  feedback?: {
    rating?: number;
    comments?: string;
  };
  societyName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  targetSocieties: Society[];
  createdBy: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  category?: 'General' | 'Event' | 'Registration' | 'Deadline' | 'Achievement';
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  readBy?: {
    societyId: string;
    readAt: string;
  }[];
  expiresAt?: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

export interface ActivityLog {
  _id: string;
  adminId: string;
  action: string;
  targetType: 'Society' | 'Member' | 'Event' | 'Announcement';
  targetId?: string;
  targetName?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface SocietySummary {
  society: {
    id: string;
    name: string;
    email: string;
    category?: string;
    establishedYear?: number;
    isActive: boolean;
    createdAt: string;
    lastActivity: string;
  };
  statistics: {
    totalMembers: number;
    totalEvents: number;
    newMembersThisMonth: number;
    eventsThisMonth: number;
  };
  recentMembers: {
    _id: string;
    name: string;
    designation: string;
    joinedDate: string;
  }[];
  recentEvents: {
    _id: string;
    eventName: string;
    day: string;
    prizesWon: string;
  }[];
}

// API Service Class
class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async adminLogin(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async societyRegister(data: {
    name: string;
    description: string;
    email: string;
    password: string;
    category?: string;
    establishedYear?: number;
    contactInfo?: {
      phone?: string;
      address?: string;
      website?: string;
    };
  }): Promise<{ token: string; user: User }> {
    return this.request('/society/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async societyLogin(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request('/society/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Society Management
  async getSocietyProfile(): Promise<Society> {
    return this.request('/society/profile');
  }

  async updateSocietyProfile(data: Partial<Society>): Promise<Society> {
    return this.request('/society/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAllSocieties(): Promise<Society[]> {
    return this.request('/admin/societies');
  }

  async deleteSociety(id: string): Promise<{ message: string; deletedMembers: number; deletedEvents: number }> {
    return this.request(`/admin/society/${id}`, {
      method: 'DELETE',
    });
  }

  // NEW: Get society members by ID (for admin)
  async getSocietyMembers(societyId: string): Promise<Member[]> {
    return this.request(`/admin/society/${societyId}/members`);
  }

  // NEW: Get society events by ID (for admin)
  async getSocietyEvents(societyId: string): Promise<Event[]> {
    return this.request(`/admin/society/${societyId}/events`);
  }

  // Member Management
  async addMember(data: {
    name: string;
    department: string;
    enrollmentNo: string;
    designation: string;
    email?: string;
    phone?: string;
    year?: string;
    profilePic?: string;
    achievements?: string[];
    skills?: string[];
  }): Promise<Member> {
    return this.request('/society/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMembers(): Promise<Member[]> {
    return this.request('/society/members');
  }

  async updateMember(id: string, data: Partial<Member>): Promise<Member> {
    return this.request(`/society/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMember(id: string): Promise<{ message: string }> {
    return this.request(`/society/members/${id}`, {
      method: 'DELETE',
    });
  }

  // NEW: Get all members across all societies (for admin)
  async getAllMembers(): Promise<Member[]> {
    return this.request('/admin/members');
  }

  // Event Management
  async addEvent(data: {
    eventName: string;
    day: string;
    membersParticipated: string[];
    prizesWon: string;
    photosLink: string;
    reportLink: string;
    eventType?: string;
    venue?: string;
    description?: string;
    budget?: number;
    audience?: number;
    duration?: string;
    status?: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';
    feedback?: {
      rating?: number;
      comments?: string;
    };
  }): Promise<Event> {
    return this.request('/society/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEvents(): Promise<Event[]> {
    return this.request('/society/events');
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    return this.request(`/society/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string): Promise<{ message: string }> {
    return this.request(`/society/events/${id}`, {
      method: 'DELETE',
    });
  }

  // NEW: Get all events across all societies (for admin)
  async getAllEvents(): Promise<Event[]> {
    return this.request('/admin/events');
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return this.request('/society/announcements');
  }

  async createAnnouncement(data: {
    title: string;
    content: string;
    targetSocieties?: string[];
    priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
    category?: 'General' | 'Event' | 'Registration' | 'Deadline' | 'Achievement';
    expiresAt?: string;
    isPinned?: boolean;
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
  }): Promise<Announcement> {
    return this.request('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.request('/admin/announcements');
  }

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement> {
    return this.request(`/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAnnouncement(id: string): Promise<{ message: string }> {
    return this.request(`/admin/announcements/${id}`, {
      method: 'DELETE',
    });
  }

  // NEW: Mark announcement as read
  async markAnnouncementAsRead(id: string): Promise<{ message: string }> {
    return this.request(`/society/announcements/${id}/read`, {
      method: 'POST',
    });
  }

  // Dashboard Stats
  async getAdminStats(): Promise<{
    totalSocieties: number;
    totalMembers: number;
    totalEvents: number;
    totalAnnouncements: number;
    activeSocieties?: number;
    recentEvents?: number;
    pendingAnnouncements?: number;
    averageMembersPerSociety?: number;
    averageEventsPerSociety?: number;
  }> {
    return this.request('/admin/stats');
  }

  async getSocietyStats(): Promise<{
    totalMembers: number;
    totalEvents: number;
    upcomingEvents?: number;
    thisMonthEvents?: number;
    newMembers?: number;
    recentEvents: Event[];
  }> {
    return this.request('/society/stats');
  }

  // NEW: Activity Logs
  async getRecentActivities(limit?: number): Promise<ActivityLog[]> {
    const endpoint = limit ? `/admin/activities?limit=${limit}` : '/admin/activities';
    return this.request(endpoint);
  }

  // Reports (Existing)
  async generateExcelReport(payload: { societyIds?: string[] } = {}): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/admin/report/excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate Excel report');
    }

    return response.blob();
  }

  async generatePdfReport(payload: { societyIds?: string[] } = {}): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/admin/report/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate PDF report');
    }

    return response.blob();
  }

  // NEW: Individual Society Reports
  async generateIndividualExcelReport(societyId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/admin/society/${societyId}/report/excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate individual Excel report');
    }

    return response.blob();
  }

  async generateIndividualPdfReport(societyId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/admin/society/${societyId}/report/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate individual PDF report');
    }

    return response.blob();
  }

  // NEW: Get Society Summary
  async getSocietySummary(societyId: string): Promise<SocietySummary> {
    return this.request(`/admin/society/${societyId}/summary`);
  }

  // NEW: Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    return this.request('/health');
  }

  // Utility method for file downloads
  async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Helper method to format society name for filenames
  formatFilename(societyName: string, type: 'excel' | 'pdf', isIndividual = false): string {
    const formattedName = societyName.replace(/[^a-zA-Z0-9]/g, '_');
    const prefix = isIndividual ? `${formattedName}_detailed_report` : 'societies_report';
    const date = new Date().toISOString().split('T')[0];
    const extension = type === 'excel' ? 'xlsx' : 'pdf';
    return `${prefix}_${date}.${extension}`;
  }
}

export const apiService = new ApiService();
