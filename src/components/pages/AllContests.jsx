import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export default function AllContests() {
  const [contests, setContests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token");

  // Fetch contests with search
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const url = searchQuery 
          ? `http://localhost:5000/api/contests?search=${encodeURIComponent(searchQuery)}`
          : "http://localhost:5000/api/contests";
        
        const response = await fetch(url);
        const data = await response.json();
        setContests(data.contests || []);
        
        // If search query exists, set activeTab to "all" to show search results
        if (searchQuery) {
          setActiveTab("all");
        }
      } catch (err) {
        console.error("Failed to load contests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [searchQuery]);

  // Enhanced tabs list with icons
  const tabs = [
    { key: "all", label: "All Contests", icon: "🎯" },
    { key: "Image Design", label: "Image Design", icon: "🎨" },
    { key: "Article Writing", label: "Article Writing", icon: "✍️" },
    { key: "Logo Design", label: "Logo Design", icon: "🏷️" },
    { key: "Web Design", label: "Web Design", icon: "💻" },
    { key: "UI/UX", label: "UI/UX", icon: "📱" },
  ];

  // Filtering contest data by type
  const filteredContests =
    activeTab === "all"
      ? contests
      : contests.filter((c) => c.type === activeTab);

  const handleDetailsClick = (contestId) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/contest/${contestId}`);
    }
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days left`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hours left`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing contests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Contests
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {searchQuery 
              ? `Search results for "${searchQuery}"` 
              : "Explore all approved contests and find your perfect creative challenge"
            }
          </p>
          <div className="mt-6 text-blue-200">
            <span className="bg-blue-500 bg-opacity-30 px-4 py-2 rounded-full">
              {filteredContests.length} Contest{filteredContests.length !== 1 ? 's' : ''} Available
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all duration-300 font-medium ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.key && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {tab.key === "all" ? contests.length : contests.filter(c => c.type === tab.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contest Cards */}
        {filteredContests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Contests Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery 
                ? `No contests match your search for "${searchQuery}"`
                : `No contests available in ${activeTab} category`
              }
            </p>
            <button
              onClick={() => setActiveTab("all")}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              View All Contests
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContests.map((contest) => (
              <div
                key={contest._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:transform hover:scale-105"
              >
                {/* Contest Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={contest.imageURL || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop"}
                    alt={contest.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {contest.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getTimeRemaining(contest.deadline) === "Ended" 
                        ? "bg-red-500 text-white" 
                        : "bg-green-500 text-white"
                    }`}>
                      {getTimeRemaining(contest.deadline)}
                    </span>
                  </div>
                </div>

                {/* Contest Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                    {contest.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {contest.description || "No description available"}
                  </p>

                  {/* Contest Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <span>{contest.participants?.length || 0} participants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                      <span>${contest.price} entry</span>
                    </div>
                  </div>

                  {/* Prize and Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        ${contest.prizeMoney}
                      </p>
                      <p className="text-xs text-gray-500">Prize Money</p>
                    </div>
                    <button
                      onClick={() => handleDetailsClick(contest._id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
