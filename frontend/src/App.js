// frontend/src/App.js
import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ArticleList from "./pages/ArticleList";
import ArticleDetail from "./pages/ArticleDetail";
import AuthModal from "./pages/AuthModal";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingStreak, setReadingStreak] = useState(5);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // ✅ NEW STATE

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/unbiased-news");
      const data = await res.json();
      setArticles(data.articles || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch news.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="relative flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        {/* Left - Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          FairFeed <span className="text-gray-800">AI</span>
        </Link>

        {/* Center - Navigation Links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
          <Link to="/" className="hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/explore" className="hover:text-blue-600 font-medium">
            Explore
          </Link>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4">
          {/* Reading Streak */}
          <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full text-orange-600 font-semibold">
            🔥 {readingStreak}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchNews}
            disabled={loading}
            title="Refresh Feed"
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v6h6M20 20v-6h-6M4 10a8.001 8.001 0 0113.657-5.657L20 10M4 14a8.001 8.001 0 0013.657 5.657L20 14"
                />
              </svg>
            )}
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 hover:bg-gray-200 px-3 py-1 rounded-full transition"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    window.location.href = "/profile";
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Achievements
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Settings
                </button>
                <hr />
                <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Login Button */}
          <button
            onClick={() => setShowAuthModal(true)} // ✅ Open modal
            className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <Routes>
          <Route
            path="/"
            element={<ArticleList articles={articles} loading={loading} />}
          />
          <Route path="/article" element={<ArticleDetail />} />
          <Route
            path="/explore"
            element={
              <h2 className="text-xl font-semibold text-center mt-12 text-gray-700">
                Explore new unbiased articles 🔎
              </h2>
            }
          />
          <Route path="/profile" element={<Profile />} />
          
        </Routes>
      </main>

      {/* ✅ Login/Signup Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default App;
