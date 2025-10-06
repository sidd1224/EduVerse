import React, { useState, useEffect } from "react";
import { fetchStudent, fetchProgress } from "../firebaseConfig";


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
import { Link, Outlet } from "react-router-dom"; // ✅ 1. Import Outlet

/* Sidebar link component made functional with a 'to' prop */
const SidebarLink = ({ emoji, text, expanded, to }) => (
  <Link to={to} className="w-full">
    <motion.div
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.35)" }}
      className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 bg-white/20 w-full"
    >
      <span className="text-2xl">{emoji}</span>
      {expanded && <span className="font-semibold text-lg">{text}</span>}
    </motion.div>
  </Link>
);

/* Progress data */

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

// ✅ 2. Renamed the main component to be the Layout
const DashboardLayout = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        animate={{ width: expanded ? 240 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-b from-purple-300 via-purple-400 to-purple-800 text-white min-h-screen p-4 flex flex-col justify-between shadow-lg"
      >
        <div>
          <div className="flex items-center justify-center mb-10 h-10">
            <div className="bg-purple-400 p-3 rounded-xl text-xl flex items-center justify-center">
              🎓
            </div>
            {expanded && <span className="font-bold text-lg ml-2">Dashboard</span>}
          </div>
          <nav className="space-y-4 flex flex-col items-center">
            <SidebarLink to="/dashboard" expanded={expanded} emoji="🏠" text="Home" />
            <SidebarLink to="/dashboard/lessons" expanded={expanded} emoji="📚" text="Lessons" />
            <SidebarLink to="/dashboard/quiz" expanded={expanded} emoji="📊" text="Quiz" />
            <SidebarLink to="/dashboard/virtuallab" expanded={expanded} emoji="🧪" text="Virtual Lab" />
          </nav>
        </div>
        <div className="flex justify-center mt-4">
          <SidebarLink to="/logout" expanded={expanded} emoji="🚪" text="Logout" />
        </div>
      </motion.aside>

      {/* ✅ 3. Main Content Area now uses Outlet to render child routes */}
      <div className="flex-1 p-6 min-h-screen">
          <Outlet />
      </div>
    </div>
  );
};

// Firebase function to fetch progress

// Animated BarChart Component



export const DashboardHome = () => {
  const [student, setStudent] = useState({});
  const [lessonsProgress, setLessonsProgress] = useState({});
  const [quizzesProgress, setQuizzesProgress] = useState({});
  const [vlabsProgress, setVlabsProgress] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    const loadStudentAndProgress = async () => {
      setLoadingProgress(true);
      try {
        // Fetch logged-in student info
        const studentData = await fetchStudent();
        setStudent({
          name: studentData.name,
          grade: studentData.student_class,
        });

        // Fetch progress
        const progress = await fetchProgress();
        setLessonsProgress(progress.lessons || {});
        setQuizzesProgress(progress.quizzes || {});
        setVlabsProgress(progress.vlabs || {});
      } catch (err) {
        console.error("Error fetching student or progress:", err);
      } finally {
        setLoadingProgress(false);
      }
    };

    loadStudentAndProgress();
  }, []);

  // Calculate progress per subject
  const subjects = ["Physics", "Chemistry", "Biology"];
  const progressData = subjects.map((subject) => {
    // Lessons
    const lessonKeys = Object.keys(lessonsProgress).filter((k) =>
      k.toLowerCase().includes(subject.toLowerCase())
    );
    const completedLessons = lessonKeys.filter((k) => lessonsProgress[k]).length;

    // Quizzes
    const quizKeys = Object.keys(quizzesProgress).filter((k) =>
      k.toLowerCase().includes(subject.toLowerCase())
    );
    const completedQuizzes = quizKeys.filter((k) => quizzesProgress[k]).length;

    // Virtual Labs
    const vlabKeys = Object.keys(vlabsProgress).filter((k) =>
      k.toLowerCase().includes(subject.toLowerCase())
    );
    const completedVlabs = vlabKeys.filter((k) => vlabsProgress[k]).length;

    const totalItems = lessonKeys.length + quizKeys.length + vlabKeys.length;
    const completedItems = completedLessons + completedQuizzes + completedVlabs;

    const percent = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
    const colorMap = { Physics: "#6a9684ff", Chemistry: "#6d6896ff", Biology: "#9f5b5bff" };

    return { name: subject, value: percent, fill: colorMap[subject] };
  });

  return (
    <>
      {/* Search bar + Profile */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center bg-white rounded-xl shadow p-2 w-1/2">
          <input
            type="text"
            placeholder="Search lessons, quizzes..."
            className="flex-1 p-2 rounded-l-xl outline-none"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-full cursor-pointer">🔔</div>
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
          <p className="text-purple-100 text-sm">Always stay updated in your portal</p>
        </div>
        <div className="absolute right-3 top-3 animate-bounce text-3xl">🎓</div>
      </div>

      {/* Active Lessons */}
      <h3 className="text-lg font-bold mb-2">Active Lessons</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Biology */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
          <img
            src="https://b3801007.smushcdn.com/3801007/wp-content/uploads/2022/05/DNA-structure-2048x1152.jpg?lossy=2&strip=1&webp=1"
            alt="Biology"
            className="w-32 h-32 object-cover rounded-xl mb-4"
          />
          <p className="font-bold text-purple-700 text-lg mb-2">Biology</p>
          <p className="text-gray-500 text-sm text-center mb-3">DNA structure and functions</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">View Lesson</button>
        </div>
        {/* Chemistry */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
          <img
            src="https://wallpapers.com/images/high/chemistry-pictures-4qvzw3gjed2dk7me.webp"
            alt="Chemistry"
            className="w-32 h-32 object-cover rounded-xl mb-4"
          />
          <p className="font-bold text-purple-700 text-lg mb-2">Chemistry</p>
          <p className="text-gray-500 text-sm text-center mb-3">Introduction to Molecular Chemistry</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">View Lesson</button>
        </div>
        {/* Physics */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
          <img
            src="https://universidadeuropea.com/resources/media/images/ramas-fisica-800x450.width-1200.format-webp.webp"
            alt="Physics"
            className="w-32 h-32 object-cover rounded-xl mb-4"
          />
          <p className="font-bold text-purple-700 text-lg mb-2">Physics</p>
          <p className="text-gray-500 text-sm text-center mb-3">Fundamentals of Mechanics and Motion</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">View Lesson</button>
        </div>
      </div>

      {/* Progress Section */}
      <h3 className="text-lg font-bold mb-2">Your Progress</h3>
      {loadingProgress ? <p>Loading progress...</p> : <AnimatedBarChart data={progressData} />}
    </>
  );
};



export default DashboardLayout;

