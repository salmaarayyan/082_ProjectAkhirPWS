import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import AuthUser from './pages/AuthUser';
import AuthAdmin from './pages/AuthAdmin';

// Public Pages
import PublicMovies from './pages/PublicMovies';

// User Pages
import UserDashboard from './pages/UserDashboard';
import BrowseMovies from './pages/BrowseMovies';
import UserWatchlist from './pages/UserWatchlist';
import UserProfile from './pages/UserProfile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminPopular from './pages/AdminPopular';
import AdminProfile from './pages/AdminProfile';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicMovies />} />
          <Route path="/login" element={<AuthUser />} />
          <Route path="/admin/login" element={<AuthAdmin />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user/browse" element={
            <ProtectedRoute allowedRoles={['user']}>
              <BrowseMovies />
            </ProtectedRoute>
          } />
          <Route path="/user/watchlist" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserWatchlist />
            </ProtectedRoute>
          } />
          <Route path="/user/profile" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserProfile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/popular" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPopular />
            </ProtectedRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
