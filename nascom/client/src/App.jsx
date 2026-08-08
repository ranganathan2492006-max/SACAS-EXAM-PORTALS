import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Lazily load page routes for on-demand bundle splitting
const Home = lazy(() => import('./pages/Home'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ContactSupport = lazy(() => import('./pages/ContactSupport'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AssessmentRoom = lazy(() => import('./pages/AssessmentRoom'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AIChatbot = lazy(() => import('./pages/AIChatbot'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Route protection wrapper for authenticated student workspace access
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

// Route protection wrapper for admin console access
function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  const isAdmin = currentUser.email === 'admin@sacas.com';
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
}

// Redirect wrapper to route already logged-in users directly to dashboard
function GuestRoute({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" replace />;
}

// Sleek transition placeholder skeleton for lazy-loaded route bounds
const PageLoading = () => (
  <div className="flex-grow flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-9 w-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider animate-pulse select-none">
        Loading Secure Module...
      </p>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/faq" element={<Layout><FAQ /></Layout>} />

            {/* Guest Auth routes */}
            <Route 
              path="/login" 
              element={
                <GuestRoute>
                  <Layout><Login /></Layout>
                </GuestRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <GuestRoute>
                  <Layout><Register /></Layout>
                </GuestRoute>
              } 
            />

            {/* Protected Portal routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chatbot" 
              element={
                <ProtectedRoute>
                  <Layout><AIChatbot /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <Layout><AdminDashboard /></Layout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/assessment/:id" 
              element={
                <ProtectedRoute>
                  <AssessmentRoom />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all redirect to 404 */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
