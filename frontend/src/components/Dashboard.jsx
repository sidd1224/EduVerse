import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { useInView } from "react-intersection-observer";

/* Sidebar link component */
const SidebarLink = ({ emoji, text, expanded }) => (
  <motion.div
    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.35)" }}
    className="flex items-center justify-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 bg-white/20 w-full"
  >
    <span className="text-2xl">{emoji}</span>
    {expanded && <span className="font-semibold text-lg">{text}</span>}
  </motion.div>
);

/* Progress data */
const progressData = [
  { name: "Biology", value: 68, fill: "#9f5b5bff" },
  { name: "Chemistry", value: 50, fill: "#6d6896ff" },
  { name: "Physics", value: 30, fill: "#6a9684ff" },
];

/* Animated BarChart Component */
const AnimatedBarChart = ({ data }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const animatedData = data.map((d) => ({
    ...d,
    value: inView ? d.value : 0,
  }));

  return (
    <div ref={ref} className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={animatedData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#4B5563", fontWeight: "bold" }}
          />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar
            dataKey="value"
            barSize={20}
            radius={[5, 5, 5, 5]}
            isAnimationActive={true}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const Dashboard = () => {
  const [expanded, setExpanded] = useState(false);

  // ✅ Get student data from localStorage
  const student = JSON.parse(localStorage.getItem("student")) || {
    name: "Guest",
    grade: "N/A",
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        animate={{ width: expanded ? 240 : 70 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-b from-purple-300 via-purple-400 to-purple-800 text-white min-h-screen p-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-center mb-10">
            <div className="bg-purple-400 p-3 rounded-xl text-xl flex items-center justify-center">
              🎓
            </div>
            {expanded && <span className="font-bold text-lg ml-2">Dashboard</span>}
          </div>
          <nav className="space-y-4 flex flex-col items-center">
            <SidebarLink expanded={expanded} emoji="🏠" text="Dashboard" />
            <SidebarLink expanded={expanded} emoji="📚" text="Lessons" />
            <SidebarLink expanded={expanded} emoji="📊" text="Quiz" />
            <SidebarLink expanded={expanded} emoji="🧪" text="Virtual Lab" />
          </nav>
        </div>
        <div className="flex justify-center mt-4">
          <SidebarLink expanded={expanded} emoji="🚪" text="Logout" />
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        {/* Search bar + Bell/Profile */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center bg-white rounded-xl shadow p-2 w-1/2">
            <input
              type="text"
              placeholder="Search lessons, quizzes..."
              className="flex-1 p-2 rounded-l-xl outline-none"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">🔔</div>
            <div className="flex items-center space-x-2">
              <div className="bg-purple-400 p-3 rounded-full text-white">👤</div>
              <div>
                <p className="font-bold">{student.name}</p>
                <p className="text-sm text-gray-500">{student.grade}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl text-white p-6 flex items-center space-x-4 w-full mb-6 relative overflow-hidden">
          <div>
            <h3 className="text-xl font-bold">Welcome back, {student.name}!</h3>
            <p className="text-purple-100 text-sm">
              Always stay updated in your portal
            </p>
          </div>
          <div className="absolute right-3 top-3 animate-bounce text-3xl">🎓</div>
        </div>

        {/* Active Lessons */}
        <h3 className="text-lg font-bold mb-2">Active Lessons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Biology Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://b3801007.smushcdn.com/3801007/wp-content/uploads/2022/05/DNA-structure-2048x1152.jpg?lossy=2&strip=1&webp=1"
              alt="Biology"
              className="w-32 h-32 object-cover rounded-xl mb-4"
            />
            <p className="font-bold text-purple-700 text-lg mb-2">Biology</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              DNA structure and functions
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              View Lesson
            </button>
          </div>

          {/* Chemistry Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://wallpapers.com/images/high/chemistry-pictures-4qvzw3gjed2dk7me.webp"
              alt="Chemistry"
              className="w-32 h-32 object-cover rounded-xl mb-4"
            />
            <p className="font-bold text-purple-700 text-lg mb-2">Chemistry</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              Introduction to Molecular Chemistry
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              View Lesson
            </button>
          </div>

          {/* Physics Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://universidadeuropea.com/resources/media/images/ramas-fisica-800x450.width-1200.format-webp.webp"
              alt="Physics"
              className="w-32 h-32 object-cover rounded-xl mb-4"
            />
            <p className="font-bold text-purple-700 text-lg mb-2">Physics</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              Fundamentals of Mechanics and Motion
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              View Lesson
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <h3 className="text-lg font-bold mb-2">Your Progress</h3>
        <AnimatedBarChart data={progressData} />
      </div>
    </div>
  );
};

export default Dashboard;
