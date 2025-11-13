import { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function Profile() {
  const [userStats] = useState({
    name: "User",
    articlesRead: 42,
    quizzesGiven: 17,
    quizData: [
      { id: 1, score: 80, winRate: "70%" },
      { id: 2, score: 95, winRate: "90%" },
      { id: 3, score: 50, winRate: "45%" },
    ],
    rank: 8,
    badges: ["🔥 Streak Master", "🎯 Quiz Ace", "📰 Insightful Reader"],
  });

  // ✅ Full year of data
  const today = new Date();
  const heatmapData = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return {
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 3), // 0 to 2 quizzes read
    };
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-md border border-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {userStats.name}’s Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Tracking your unbiased reading and quiz journey 🧭
          </p>
        </div>
        <div className="text-center md:text-right mt-4 md:mt-0">
          <div className="text-4xl font-bold text-blue-600">#{userStats.rank}</div>
          <p className="text-sm text-gray-500">Global Rank</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 text-center">
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-700">{userStats.articlesRead}</div>
          <p className="text-gray-600 text-sm">Articles Read</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-700">{userStats.quizzesGiven}</div>
          <p className="text-gray-600 text-sm">Quizzes Attempted</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-yellow-700">
            {Math.round(
              userStats.quizData.reduce((a, q) => a + q.score, 0) /
                userStats.quizData.length
            )}
            %
          </div>
          <p className="text-gray-600 text-sm">Avg Quiz Score</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-700">
            {(
              userStats.quizData.reduce(
                (a, q) => a + parseInt(q.winRate.replace("%", "")),
                0
              ) / userStats.quizData.length
            ).toFixed(0)}
            %
          </div>
          <p className="text-gray-600 text-sm">Avg Win Rate</p>
        </div>
      </div>

      {/* Quiz History */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Quiz ID</th>
                <th className="p-3 text-left">Score</th>
                <th className="p-3 text-left">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {userStats.quizData.map((quiz) => (
                <tr key={quiz.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">#{quiz.id}</td>
                  <td className="p-3 text-gray-700">{quiz.score}%</td>
                  <td className="p-3 text-gray-700">{quiz.winRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Reading & Quiz Activity 📅
        </h2>
        <div className="border rounded-lg p-3 bg-gray-50 overflow-x-auto">
          <div className="scale-90 sm:scale-95 md:scale-100 origin-top-left">
            <CalendarHeatmap
              startDate={new Date(today.getFullYear(), 0, 1)} // Jan 1 this year
              endDate={new Date(today.getFullYear(), 11, 31)} // Dec 31 this year
              values={heatmapData}
              classForValue={(value) => {
                if (!value) return "color-empty";
                return `color-scale-${value.count}`;
              }}
              tooltipDataAttrs={(value) => ({
                "data-tip": `${value.date}: ${value.count} quizzes read`,
              })}
              gutterSize={2} // tighter spacing
            />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Badges 🏅</h2>
        <div className="flex flex-wrap gap-3">
          {userStats.badges.map((badge, i) => (
            <span
              key={i}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
