// ... existing imports
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login"; // must match file name exactly
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/Register";
import Dashboard from './components/Dashboard';
import VLabDashboard from './components/VLabDashboard'; // 👈 IMPORT THE NEW COMPONENT

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} /> {/* lowercase path is recommended */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/virtual-lab" element={
          <div className="relative bg-black min-h-screen">
            <VLabDashboard />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
/*YASHU*/
