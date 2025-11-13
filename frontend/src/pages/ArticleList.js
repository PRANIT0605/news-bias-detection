// frontend/src/pages/ArticleList.js
import { useNavigate } from 'react-router-dom';

export default function ArticleList({ articles, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-16 text-lg">
        No unbiased articles found. Try refreshing 🔄
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6">
      {/* Responsive Card Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((art, i) => (
          <div
            key={i}
            onClick={() => navigate('/article', { state: art })}
            className="cursor-pointer bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl hover:border-blue-200 transition duration-300 group p-5 relative flex flex-col justify-between"
          >
            {/* Top Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition my-6">
                {art.title.length > 100 ? art.title.slice(0, 100) + '...' : art.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                A neutral perspective from{' '}
                <span className="font-medium text-gray-800">{art.source}</span>.  
                Confidence score indicates how balanced the content is.
              </p>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100">
              <span className="truncate">{art.source || 'Unknown Source'}</span>
              <a
                href={art.url}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Visit →
              </a>
            </div>

            {/* Confidence Badge */}
            <div
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                art.confidence > 0.8
                  ? 'bg-green-100 text-green-700'
                  : art.confidence > 0.6
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              Neutral {(art.confidence * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
