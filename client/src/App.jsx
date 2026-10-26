import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignDetailPage } from './pages/CampaignDetailPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { ImpactMapPage } from './pages/ImpactMapPage';
import { NgosPage } from './pages/NgosPage';
import { NgoDetailPage } from './pages/NgoDetailPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ProfilePage } from './pages/ProfilePage';
import { ImpactUpdatesPage } from './pages/ImpactUpdatesPage';

// Root Entry: Site opens directly to Login if not authenticated
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'volunteer') return <Navigate to="/volunteer/dashboard" replace />;
  if (user.role === 'ngo') return <Navigate to="/ngo/dashboard" replace />;
  return <Navigate to="/donor/dashboard" replace />;
};

// Protected Route Wrapper with Strict Role Access Isolation
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <UnauthorizedPage requiredRole={allowedRoles[0]} />;
  }
  return children;
};

// App Layout with unified modern experience
const AppLayout = () => {
  const location = useLocation();

  // Show legacy marketing navbar/footer only if explicitly on /landing
  const isLandingOnly = location.pathname === '/landing';

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f6fa] text-slate-800 selection:bg-blue-500 selection:text-white">
      {isLandingOnly && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Site opens directly to Login or Role Dashboard */}
          <Route path="/" element={<RootRedirect />} />

          {/* Authentication Pages (No Navbar) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:rolePortal" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* User Dashboards (Donor, Volunteer, NGO, Admin) */}
          <Route
            path="/dashboard"
            element={<RootRedirect />}
          />
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NgoDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Profile & Updates */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updates"
            element={
              <ProtectedRoute>
                <ImpactUpdatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <ImpactUpdatesPage />
              </ProtectedRoute>
            }
          />

          {/* Public & Explore Pages */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/volunteers" element={<VolunteerPage />} />
          <Route path="/map" element={<ImpactMapPage />} />
          <Route path="/ngos" element={<NgosPage />} />
          <Route path="/ngos/:id" element={<NgoDetailPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {isLandingOnly && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
