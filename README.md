# Cultural Corner - MSI Cultural Societies Management System

A comprehensive web application for managing cultural societies at Maharaja Surajmal Institute. This system provides both admin and society management capabilities with a beautiful, modern UI.

## 🚀 Features

### Authentication & Authorization
- **Admin Login**: Secure admin access with role-based permissions
- **Society Registration**: Complete society registration with profile management
- **Society Login**: Individual society access to their dashboard
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different interfaces for admin and society users

### Society Management
- **Society Registration**: Complete registration form with validation
- **Profile Management**: Update society information, contact details, and descriptions
- **Society Dashboard**: Overview of society activities and statistics
- **Admin Society Management**: View, manage, and delete societies

### Member Management
- **Add Members**: Complete member registration with all required fields
- **Edit Members**: Update member information and details
- **Delete Members**: Remove members from society
- **Search & Filter**: Advanced search and filtering capabilities
- **Member Profiles**: Detailed member information display

### Event Management
- **Add Events**: Comprehensive event creation with all details
- **Edit Events**: Update event information and participants
- **Delete Events**: Remove events from society records
- **Event Types**: Categorized events (Cultural Festival, Competition, Workshop, etc.)
- **Participant Management**: Select members who participated in events
- **Links Management**: Photos and report links for each event

### Admin Features
- **Dashboard Analytics**: Real-time statistics and overview
- **Society Management**: View and manage all registered societies
- **Announcement System**: Create and manage announcements
- **Report Generation**: Excel and PDF report generation
- **Data Export**: Export society and event data

### UI/UX Features
- **Modern Design**: Beautiful gradient-based design with animations
- **Responsive Layout**: Works perfectly on all device sizes
- **Dark Theme**: Elegant dark theme with proper contrast
- **Loading States**: Smooth loading indicators
- **Toast Notifications**: User-friendly feedback messages
- **Form Validation**: Comprehensive input validation
- **Search & Filter**: Advanced filtering capabilities

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **ExcelJS** for Excel report generation
- **PDFKit** for PDF report generation
- **CORS** for cross-origin requests

## 📁 Project Structure

```
cultural-canvas-msi-main/
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn/ui components
│   │   ├── HomePage.tsx  # Landing page
│   │   └── Navigation.tsx # Navigation component
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/
│   │   └── use-toast.ts  # Toast notifications
│   ├── lib/
│   │   ├── api.ts        # API service layer
│   │   └── utils.ts      # Utility functions
│   ├── pages/
│   │   ├── Admin.tsx     # Admin dashboard
│   │   ├── Login.tsx     # Login page
│   │   ├── Register.tsx  # Society registration
│   │   ├── SocietyDashboard.tsx # Society dashboard
│   │   ├── MemberManagement.tsx # Member management
│   │   └── EventManagement.tsx # Event management
│   └── App.tsx           # Main app component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cultural-canvas-msi-main
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately
   npm run dev          # Frontend (port 5173)
   cd ../backend && npm start  # Backend (port 3000)
   ```

## 🔐 Default Admin Credentials

- **Email**: `cul@msijanakpuri.com`
- **Password**: `cul321`

## 📋 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/society/register` - Society registration
- `POST /api/society/login` - Society login

### Society Management
- `GET /api/society/profile` - Get society profile
- `PUT /api/society/profile` - Update society profile
- `GET /api/admin/societies` - Get all societies (Admin)
- `DELETE /api/admin/society/:id` - Delete society (Admin)

### Member Management
- `POST /api/society/members` - Add member
- `GET /api/society/members` - Get members
- `PUT /api/society/members/:id` - Update member
- `DELETE /api/society/members/:id` - Delete member

### Event Management
- `POST /api/society/events` - Add event
- `GET /api/society/events` - Get events
- `PUT /api/society/events/:id` - Update event
- `DELETE /api/society/events/:id` - Delete event

### Announcements
- `POST /api/admin/announcements` - Create announcement
- `GET /api/society/announcements` - Get announcements
- `GET /api/admin/announcements` - Get all announcements (Admin)
- `DELETE /api/admin/announcements/:id` - Delete announcement

### Reports
- `POST /api/admin/report/excel` - Generate Excel report
- `POST /api/admin/report/pdf` - Generate PDF report

## 🎨 UI Components

The application uses a custom design system with:
- **Gradient Cards**: Beautiful gradient backgrounds
- **Glass Effects**: Modern glassmorphism design
- **Hover Animations**: Smooth hover effects
- **Loading States**: Elegant loading indicators
- **Toast Notifications**: User feedback system
- **Responsive Design**: Mobile-first approach

## 🔧 Customization

### Colors
The application uses a custom color palette defined in `tailwind.config.ts`:
- Primary colors with gradients
- Accent colors for highlights
- Muted colors for text and backgrounds

### Components
All UI components are built using Shadcn/ui with custom styling to match the design system.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Cross-origin request protection
- **Role-based Access**: Different permissions for admin and society users

## 📊 Data Management

- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB with schema validation
- **Real-time Updates**: Immediate UI updates after data changes
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist folder to your hosting service
```

### Backend Deployment
```bash
# Set up environment variables
npm start
# Deploy to your Node.js hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for MSI Cultural Corner**
