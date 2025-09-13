import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/Register";
import VLabDashboard from './components/VLabDashboard';
// Correctly import both the layout and the home page content for the dashboard
import DashboardLayout, { DashboardHome } from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes> 
        {/* Your existing top-level routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* The new, corrected nested routes for the dashboard and V-Lab */}
        <Route path="/dashboard" element={<DashboardLayout />}>
            {/* This route renders DashboardHome inside the layout when the URL is exactly "/dashboard" */}
            <Route index element={<DashboardHome />} />
            
            {/* This route renders VLabDashboard inside the layout when the URL is "/dashboard/virtual-lab" */}
            <Route path="virtual-lab" element={<VLabDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

