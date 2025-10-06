import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  BookOpen,
  GraduationCap,
  UserCheck,
  Calendar,
  Bell,
  Plus,
  Search,
} from "lucide-react";

const TeacherDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeSection, setActiveSection] = useState("Dashboard");

  // Data for charts
  const statisticsData = [
    { year: "2019", value: 300 },
    { year: "2020", value: 450 },
    { year: "2021", value: 680 },
    { year: "2022", value: 520 },
    { year: "2023", value: 750 },
    { year: "2024", value: 890 },
  ];

  const courseActivityData = [
    { name: "In Progress", value: 75, color: "#4F46E5" },
    { name: "Completed", value: 25, color: "#E5E7EB" },
  ];

  const studentData = [
    {
      name: "Sarah Mitchell",
      score: "95/100",
      submitted: "12/15/24 02:15 PM",
      grade: "A",
      status: "Pass",
    },
    {
      name: "John Rodriguez",
      score: "78/100",
      submitted: "12/15/24 01:45 PM",
      grade: "B",
      status: "Pass",
    },
    {
      name: "Emily Chen",
      score: "88/100",
      submitted: "12/15/24 03:22 PM",
      grade: "B+",
      status: "Pass",
    },
    {
      name: "Michael Johnson",
      score: "92/100",
      submitted: "12/15/24 01:30 PM",
      grade: "A-",
      status: "Pass",
    },
  ];

  const notices = [
    {
      title: "Notice of Special Examinations of Semester Spring 2025",
      author: "Dr. Sarah Johnson",
      time: "2 hours ago",
      type: "exam",
    },
    {
      title: "Time Extension Notice of Semester Admission Applications",
      author: "Admin Office",
      time: "5 hours ago",
      type: "admission",
    },
    {
      title: "COVID-19 Vaccination Survey December 2024",
      author: "Health Department",
      time: "1 day ago",
      type: "health",
    },
    {
      title: "Scholarship Vice Notice Spring 2025",
      author: "Financial Aid",
      time: "2 days ago",
      type: "scholarship",
    },
  ];

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDate; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) =>
    date && date.toDateString() === selectedDate.toDateString();

  const menuItems = [
    { icon: <Calendar className="w-5 h-5" />, label: "Dashboard" },
    { icon: <Users className="w-5 h-5" />, label: "Overview" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Courses" },
    { icon: <Users className="w-5 h-5" />, label: "Students" },
    { icon: <UserCheck className="w-5 h-5" />, label: "Teachers" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Exam" },
    { icon: <Calendar className="w-5 h-5" />, label: "Result" },
    { icon: <Bell className="w-5 h-5" />, label: "Videos" },
  ];

  const statCards = [
    {
      title: "Total Students",
      count: "1220",
      icon: <Users className="w-8 h-8 text-white" />,
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      color: "text-blue-600",
    },
    {
      title: "Total Teachers",
      count: "120",
      icon: <UserCheck className="w-8 h-8 text-white" />,
      bg: "bg-gradient-to-r from-pink-500 to-pink-600",
      color: "text-pink-600",
    },
    {
      title: "Total Courses",
      count: "15",
      icon: <BookOpen className="w-8 h-8 text-white" />,
      bg: "bg-gradient-to-r from-cyan-500 to-cyan-600",
      color: "text-cyan-600",
    },
    {
      title: "Faculty Room",
      count: "100",
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      bg: "bg-gradient-to-r from-orange-500 to-orange-600",
      color: "text-orange-600",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">EduPortal</h2>
              <p className="text-sm text-gray-500">Teacher Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(item.label)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeSection === item.label
                  ? "bg-purple-50 border-r-4 border-purple-500 text-purple-700"
                  : "text-gray-600"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Invite Colleagues */}
        <div className="mt-8 mx-6 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Invite Colleagues</h3>
            <p className="text-sm text-gray-600 mb-3">
              Share resources with other teachers
            </p>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-shadow">
              <Plus className="w-4 h-4 inline-block mr-1" />
              Send Invite
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{activeSection}</h1>
              <p className="text-gray-600">{formatDate(currentDate)}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              
                </div>
                <span className="font-medium text-gray-700">Harshitha</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <button
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${card.bg} group-hover:scale-110 transition-transform`}
                  >
                    {card.icon}
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    {card.title}
                  </h3>
                  <p className={`text-3xl font-bold ${card.color}`}>{card.count}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Charts + Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Statistics */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statisticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Course Activities */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Course Activities
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={courseActivityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {courseActivityData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">In Progress (75%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Completed (25%)</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => (
                  <button
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`h-8 w-8 text-sm rounded-lg flex items-center justify-center transition-colors
                      ${
                        !date
                          ? ""
                          : isToday(date)
                          ? "bg-purple-500 text-white font-semibold"
                          : isSelected(date)
                          ? "bg-purple-100 text-purple-700"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    {date ? date.getDate() : ""}
                  </button>
                ))}
              </div>

              {/* Events */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-2">Today's Events</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Math Class - 10:00 AM
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Staff Meeting - 2:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submissions + Notices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submissions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Submissions
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Student
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Score
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.map((student, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {student.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {student.submitted}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-gray-800 font-medium">
                          {student.score}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === "Pass"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notice Board */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Notice Board
                </h3>
              </div>
              <div className="space-y-4">
                {notices.map((notice, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <h4 className="font-medium text-gray-800 mb-1">
                      {notice.title}
                    </h4>
                    <p className="text-sm text-gray-600">{notice.author}</p>
                    <p className="text-xs text-gray-500">{notice.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
