import React, { useEffect, useState } from "react";

export default function MyWinning({ user }) {
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrizeWon, setTotalPrizeWon] = useState(0);

  useEffect(() => {
    fetchWinnings();
  }, []);

  const fetchWinnings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://contesthub-akhi.vercel.app/api/user/winnings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWinnings(data.winnings || []);

        // Calculate total prize won
        const total = (data.winnings || []).reduce((sum, contest) => sum + (contest.prizeMoney || 0), 0);
        setTotalPrizeWon(total);
      }
    } catch (error) {
      console.error("Failed to fetch winnings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading winning contests...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Winning Contests</h2>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg">
          <div className="text-sm font-medium">Total Prize Won</div>
          <div className="text-2xl font-bold">${totalPrizeWon}</div>
        </div>
      </div>

      {winnings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-gray-500 mb-4 text-lg">You haven't won any contests yet.</p>
          <p className="text-gray-400 mb-6">Keep participating and showcase your skills!</p>
          <a href="/all-contests" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Browse Contests
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {winnings.map((contest, index) => (
            <div key={contest._id} className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-yellow-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-green-800 mb-2">{contest.name}</h3>
                    <p className="text-gray-700 mb-3">{contest.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Contest Type:</span>
                        <p className="text-gray-600">{contest.type}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Prize Won:</span>
                        <p className="text-green-600 font-bold text-lg">${contest.prizeMoney}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Participants:</span>
                        <p className="text-gray-600">{contest.participants?.length || 0}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Won Date:</span>
                        <p className="text-gray-600">{new Date(contest.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="bg-yellow-400 text-yellow-900 rounded-full p-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-green-700 font-semibold text-sm">Winner!</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Achievement:</span> Won among {contest.participants?.length || 0} participants
                  </div>
                  <a
                    href={`/contest/${contest._id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                  >
                    View Contest
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {winnings.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-bold text-blue-800 mb-2">🎉 Congratulations!</h3>
          <p className="text-blue-700">
            You've won {winnings.length} contest{winnings.length > 1 ? 's' : ''} and earned a total of ${totalPrizeWon} in prizes.
            Keep up the excellent work!
          </p>
        </div>
      )}
    </div>
  );
}
