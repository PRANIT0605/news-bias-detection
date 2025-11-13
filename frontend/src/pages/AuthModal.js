// frontend/src/components/AuthModal.js
import { useState } from "react";

export default function AuthModal({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white w-96 rounded-xl shadow-lg p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">
          {isSignup ? "Create an Account" : "Welcome!"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isSignup ? "Join FairFeed AI today" : "Log in to continue"}
        </p>

        {/* Form */}
        <form className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Footer switch */}
        <div className="text-center text-sm mt-5 text-gray-600">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
