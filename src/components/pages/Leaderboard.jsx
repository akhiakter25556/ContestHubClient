import { useState, useEffect } from "react";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLeaderboard();
  }, [currentPage]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/leaderboard?page=${currentPage}&limit=${itemsPerPage}`);
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "text-yellow-600 bg-yellow-50";
      case 2: return "text-gray-600 bg-gray-50";
      case 3: return "text-orange-600 bg-orange-50";
      default: return "text-gray-700 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full mb-4">
            <span className="text-2xl text-white">🏆</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contest Champions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the top performers in our contest community. Rankings are based on total contest wins.
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Top Contest Winners
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                No Winners Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to win a contest and claim your spot on the leaderboard!
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {currentPage === 1 && users.length >= 3 && (
                <div className="p-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                  <div className="flex justify-center items-end space-x-8">
                    {/* 2nd Place */}
                    <div className="text-center">
                      <div className="relative">
                        <img
                          src={users[1]?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"}
                          alt={users[1]?.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-gray-300"
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          2
                        </div>
                      </div>
                      <div className="mt-3">
                        <h3 className="font-bold text-gray-900 dark:text-white">{users[1]?.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{users[1]?.wins} wins</p>
                      </div>
                      <div className="w-16 h-20 bg-gray-300 dark:bg-gray-600 mt-4 mx-auto rounded-t-lg"></div>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center">
                      <div className="relative">
                        <img
                          src={users[0]?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                          alt={users[0]?.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-yellow-400"
                        />
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <span className="text-2xl">👑</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{users[0]?.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{users[0]?.wins} wins</p>
                      </div>
                      <div className="w-16 h-24 bg-yellow-400 mt-4 mx-auto rounded-t-lg"></div>
                    </div>

                    {/* 3rd Place */}
                    <div className="text-center">
                      <div className="relative">
                        <img
                          src={users[2]?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"}
                          alt={users[2]?.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-orange-400"
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          3
                        </div>
                      </div>
                      <div className="mt-3">
                        <h3 className="font-bold text-gray-900 dark:text-white">{users[2]?.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{users[2]?.wins} wins</p>
                      </div>
                      <div className="w-16 h-16 bg-orange-400 dark:bg-orange-500 mt-4 mx-auto rounded-t-lg"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Leaderboard Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Wins
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Participated
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user, index) => {
                      const rank = (currentPage - 1) * itemsPerPage + index + 1;
                      const winRate = user.participatedCount > 0 ? Math.round((user.wins / user.participatedCount) * 100) : 0;
                      
                      return (
                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${getRankColor(rank)}`}>
                              {getRankIcon(rank)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={user.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{user.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-green-600 dark:text-green-400 mr-2">
                                {user.wins}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">contests</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            {user.participatedCount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                                <div
                                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                                  style={{ width: `${Math.min(winRate, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                {winRate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === i + 1
                              ? "bg-red-600 text-white"
                              : "text-gray-500 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {users.reduce((sum, user) => sum + (user.participatedCount || 0), 0)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Participations</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {users.reduce((sum, user) => sum + (user.wins || 0), 0)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Wins</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {users.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Active Competitors</p>
          </div>
        </div>
      </div>
    </div>
  );
}