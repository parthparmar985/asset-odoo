import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import Layouts and Pages (To be created next)
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrgSetup from './pages/OrgSetup';
import AssetDirectory from './pages/AssetDirectory';
import AssetAllocation from './pages/AssetAllocation';
import Bookings from './pages/Bookings';
import Maintenance from './pages/Maintenance';
import MyAssets from './pages/MyAssets';

import Audits from './pages/Audits';
import Reports from './pages/Reports';
import ActivityLogs from './pages/ActivityLogs';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (requiredRole && user.role !== 'Admin' && user.role !== requiredRole) {
    return <Navigate to="/" />; // Redirect if not authorized
  }
  
  return children;
};

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="org-setup" element={<ProtectedRoute requiredRole="Admin"><OrgSetup /></ProtectedRoute>} />
          <Route path="assets" element={<ProtectedRoute><AssetDirectory /></ProtectedRoute>} />
          <Route path="my-assets" element={<ProtectedRoute><MyAssets /></ProtectedRoute>} />
          <Route path="allocations" element={<ProtectedRoute><AssetAllocation /></ProtectedRoute>} />
          <Route path="bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
          <Route path="audits" element={<Audits />} />
          <Route path="reports" element={<Reports />} />
          <Route path="logs" element={<ActivityLogs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
