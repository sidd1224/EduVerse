import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Reset password
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email and we'll send a password reset link.
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Reset link sent (demo)");
          }}
        >
          <input
            type="email"
            placeholder="Your email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            Send reset link
          </button>
        </form>
        <p className="text-sm mt-6 text-center text-gray-600">
          Remembered?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
/*YASHU*/