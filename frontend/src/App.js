// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout, { DashboardHome } from "./components/Dashboard.jsx";

import Landing from "./components/Landing";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/Register";
import TeacherDashboard from "./components/TeacherDashboard";
import Quiz from "./components/Quiz";

// ✅ Import all lab components from the labs folder via index.js
import { VirtualLab, PhysicsLab, ChemistryLab, BiologyLab } from "./components/labs";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth + Landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="teacher" element={<TeacherDashboard />} />
        </Route>

        {/* Virtual Labs */}
        <Route path="/dashboard/virtuallab" element={<VirtualLab />} />
        <Route path="/VirtualLab/physics" element={<PhysicsLab />} />
        {/* 👇 BiologyLab now takes a classId param */}
        <Route path="/VirtualLab/biology/:classId" element={<BiologyLab />} />
        <Route path="/VirtualLab/chemistry" element={<ChemistryLab />} />

        {/* Quiz */}
        <Route path="/dashboard/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
