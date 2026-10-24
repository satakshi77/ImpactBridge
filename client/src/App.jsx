import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoBar } from './components/common/DemoBar';
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

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
          <DemoBar />
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="/volunteers" element={<VolunteerPage />} />
              <Route path="/map" element={<ImpactMapPage />} />
              <Route path="/ngos" element={<NgosPage />} />
              <Route path="/ngos/:id" element={<NgoDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Role Dashboards */}
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['donor', 'volunteer', 'ngo', 'admin']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['volunteer', 'donor', 'ngo', 'admin']}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
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

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
