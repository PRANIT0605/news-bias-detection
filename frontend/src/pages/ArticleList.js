// frontend/src/pages/ArticleList.js
import { useNavigate } from 'react-router-dom';

export default function ArticleList({ articles, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">Loading neutral articles...</div>;
  }

  return (
    <div className="article-list">
      {articles.length === 0 ? (
        <p>No neutral articles found. Try refreshing.</p>
      ) : (
        articles.map((art, i) => (
          <div
            key={i}
            className="list-card"
            onClick={() => navigate('/article', { state: art })}
          >
            <h3>{art.title}</h3>
            <div className="meta">
              <span><strong>{art.source}</strong></span>
              <span>• {new Date(art.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="confidence-tag">
              Neutral: {(art.confidence * 100).toFixed(0)}%
            </div>
          </div>
        ))
      )}
    </div>
  );
}