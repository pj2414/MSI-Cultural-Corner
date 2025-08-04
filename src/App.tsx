import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer"; // Add this import
import Index from "./pages/Index";
import Societies from "./pages/Societies";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import SocietyDashboard from "./pages/SocietyDashboard";
import MemberManagement from "./pages/MemberManagement";
import EventManagement from "./pages/EventManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/societies" element={<Societies />} />
                <Route path="/events" element={<Events />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/society/dashboard" element={<SocietyDashboard />} />
                <Route path="/society/members" element={<MemberManagement />} />
                <Route path="/society/events" element={<EventManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer /> {/* Add the Footer here */}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;