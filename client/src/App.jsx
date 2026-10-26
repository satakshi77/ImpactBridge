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

// App Layout with conditional Navbar/Footer (Hidden on Login & Register)
const AppLayout = () => {
  const location = useLocation();
  // Hide Navbar & Footer completely on authentication pages
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Site opens directly to Login or Role Dashboard */}
          <Route path="/" element={<RootRedirect />} />

          {/* Authentication Pages (No Navbar) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:rolePortal" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Public & Explore Pages */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/volunteers" element={<VolunteerPage />} />
          <Route path="/map" element={<ImpactMapPage />} />
          <Route path="/ngos" element={<NgosPage />} />
          <Route path="/ngos/:id" element={<NgoDetailPage />} />

          {/* User Dashboards (Donor & Volunteer) */}
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

          {/* Admin Dashboard: Strictly for Administrator */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
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
