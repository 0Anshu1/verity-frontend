import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import KYCCases from './pages/KYCCases';
import CaseDetail from './pages/CaseDetail';
import DocumentReview from './pages/DocumentReview';
import TeamManagement from './pages/TeamManagement';
import Settings from './pages/Settings';
import AuditLog from './pages/AuditLog';
import OnboardingPortal from './pages/OnboardingPortal';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="login-card__spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login defaultSignUp />} />
      <Route path="/onboard/:caseId" element={<OnboardingPortal />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cases" element={<KYCCases />} />
        <Route path="cases/:caseId" element={<CaseDetail />} />
        <Route path="documents" element={<DocumentReview />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="api-keys" element={<Settings />} />
        <Route path="settings" element={<Settings />} />
        <Route path="audit" element={<AuditLog />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
