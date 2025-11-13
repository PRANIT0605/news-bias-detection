// frontend/src/pages/QuizPage.js
import { useLocation, useNavigate } from 'react-router-dom';

export default function QuizPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Quiz 🧠</h1>
      <p className="text-gray-600 mb-6">
        Our AI is preparing a quiz based on:
        <br />
        <span className="font-medium text-blue-600">
          {state?.article?.title || "this article"}
        </span>
      </p>

      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
      >
        Back to Feed
      </button>
    </div>
  );
}
