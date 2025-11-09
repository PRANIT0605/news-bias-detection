// frontend/src/App.js

import { Routes, Route } from 'react-router-dom';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {

    setLoading(true);

    try {

      const res = await fetch('http://127.0.0.1:8000/unbiased-news');

      const data = await res.json();

      setArticles(data.articles || []);

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  };



  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        {/* 1. Name changed to FairFeed AI */}
        <h1>FairFeed AI</h1>

        {/* 2. New Refresh Button */}
        <button 
          className="refresh-button" 
          onClick={fetchNews} 
          disabled={loading}
          title="Refresh Feed"
        >
          {loading ? (
            <div className="loader"></div> // This will be a CSS spinner
          ) : (
            // This is an inline SVG icon for "refresh"
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
          )}
        </button>
      </nav>

      {/* 3. Added <main> for better semantic structure */}
      <main>
        {error && <div className="error-message">{error}</div>}
        <Routes>
          <Route 
            path="/" 
            element={<ArticleList articles={articles} loading={loading} />} 
          />
          {/* Note: I'm using the route you provided. */}
          <Route path="/article" element={<ArticleDetail />} />
        </Routes>
      </main>
    </div>
  );

}
export default App;