
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BloodDataProvider } from "./contexts/BloodDataContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Common Pages
import Dashboard from "./pages/Dashboard";
import RequestBlood from "./pages/RequestBlood";
import RequestHistory from "./pages/RequestHistory";
import NotFound from "./pages/NotFound";

// Donor Pages
import DonateBlood from "./pages/donor/DonateBlood";
import DonationHistory from "./pages/donor/DonationHistory";

// Admin Pages
import BloodStock from "./pages/admin/BloodStock";
import DonationRequests from "./pages/admin/DonationRequests";
import BloodRequests from "./pages/admin/BloodRequests";
import Donors from "./pages/admin/Donors";
import Patients from "./pages/admin/Patients";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BloodDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes - All Users */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/request-blood" 
                element={
                  <ProtectedRoute allowedRoles={['donor', 'patient']}>
                    <RequestBlood />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/request-history" 
                element={
                  <ProtectedRoute allowedRoles={['donor', 'patient']}>
                    <RequestHistory />
                  </ProtectedRoute>
                } 
              />
              
              {/* Donor Specific Routes */}
              <Route 
                path="/donate" 
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonateBlood />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/donation-history" 
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonationHistory />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Specific Routes */}
              <Route 
                path="/blood-stock" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <BloodStock />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/donation-requests" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DonationRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/blood-requests" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <BloodRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/donors" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Donors />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patients" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Patients />
                  </ProtectedRoute>
                } 
              />
              
              {/* Remove the duplicated Route with path="/" that redirects to "/login" */}
              {/* Instead add a catch-all redirect for unauthenticated users at the end */}
              
              {/* Catch-all route for 404s */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BloodDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
