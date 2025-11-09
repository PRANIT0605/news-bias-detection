// frontend/src/pages/ArticleDetail.js
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ArticleDetail() {
  const { state } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state?.url) {
      fetch(`http://127.0.0.1:8000/article-detail?url=${encodeURIComponent(state.url)}`)
        .then(r => r.json())
        .then(d => {
          setData(d);
          setLoading(false);
        });
    }
  }, [state?.url]);

  if (!state) return <p>No article selected. Go back to list.</p>;
  if (loading) return <p>Loading full article and bias analysis...</p>;

  return (
    <div className="detail-container">
      <div className="article-column">
        <h1>{state.title}</h1>
        <p className="meta">
          Source: <strong>{state.source}</strong> • Published: {new Date(state.publishedAt).toLocaleString()}
        </p>
        <div 
          className="article-body" 
          dangerouslySetInnerHTML={{ __html: data.highlighted || data.text }}
        />
      </div>

      <div className="bias-sidebar">
        <h2>Top Detected Biases</h2>
        {data.biases.length === 0 ? (
          <p>No strong biases detected. Article appears balanced.</p>
        ) : (
          data.biases.map((b, i) => (
            <div key={i} className="bias-card">
              <h3>#{i + 1} {b.type}</h3>
              <p className="example">"{b.example}"</p>
              <div className="score">
                Intensity: {(b.score * 100).toFixed(0)}%
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}