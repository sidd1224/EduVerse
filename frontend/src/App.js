// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />

        {/* Virtual Labs */}
        <Route path="/virtuallab" element={<VirtualLab />} />
        <Route path="/virtuallab/physics" element={<PhysicsLab />} />
        <Route path="/virtuallab/biology" element={<BiologyLab />} />
        <Route path="/virtuallab/chemistry" element={<ChemistryLab />} />

        {/* Quiz */}
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
