// src/components/Quiz.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/Dashboard"); // ✅ takes user back to dashboard
  };

  return (
    <div className="min-h-screen bg-purple-100 py-10">
      {/* 🔹 Quiz Header */}
      <div className="bg-white p-8 shadow-lg text-center mb-8 w-full rounded-none relative">
        {/* Back Button */}
        <button
          onClick={handleReturn}
          className="absolute top-4 right-4 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-lg shadow text-sm font-medium text-purple-700 hover:bg-white/70 transition flex items-center space-x-1"
        >
          <span>🏠</span>
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-purple-700 mb-4">📝 Quiz</h1>
        <p className="text-gray-600">
          Test your knowledge with fun and interactive quizzes!
        </p>
      </div>

      {/* 🔹 Quiz Section */}
      <div className="bg-white p-8 shadow-lg w-full rounded-none">
        <h3 className="text-lg font-bold mb-6 text-purple-700">Available Quizzes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quiz 1 */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <p className="font-bold text-purple-700 text-lg mb-2">Biology Quiz</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              DNA, cells, and genetics
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              Start Quiz
            </button>
          </div>

          {/* Quiz 2 */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <p className="font-bold text-purple-700 text-lg mb-2">Chemistry Quiz</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              Molecules and reactions
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              Start Quiz
            </button>
          </div>

          {/* Quiz 3 */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <p className="font-bold text-purple-700 text-lg mb-2">Physics Quiz</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              Motion and mechanics
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
