// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout, { DashboardHome } from "./components/Dashboard.jsx";

import Landing from "./components/Landing";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/auth/Register";
import TeacherDashboard from "./components/teacherDashboard/TeacherDashboard.jsx";
import Quiz from "./components/quiz/Quiz";

// ✅ Import all lab components from the labs folder via index.js
import { VirtualLab, PhysicsLab, ChemistryLab, BiologyLab,ExperimentPage } from "./components/labs";
import LessonsDashboard from "./components/lessons/LessonsDashboard.jsx";


// inside <Routes>



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
        <Route path="/experiment" element={<ExperimentPage />} />

        {/* Quiz */}
        <Route path="/dashboard/quiz" element={<Quiz />} />

        <Route path="/dashboard/lessons">
           <Route index element={<LessonsDashboard />} />
           <Route path=":classId" element={<LessonsDashboard />} />
            <Route path=":classId/:subject" element={<LessonsDashboard />} />
           <Route path=":classId/:subject/:chapter" element={<LessonsDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
