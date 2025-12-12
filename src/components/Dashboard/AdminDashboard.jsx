import { useState, useEffect } from "react";

export default function AdminDashboard({ user }) {
  const [contests, setContests] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContests: 0,
    pendingContests: 0,
    totalPrizePool: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContests, setFilteredContests] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter contests based on search term
    if (searchTerm) {
      const filtered = contests.filter(contest =>
        contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contest.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contest.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContests(filtered);
    } else {
      setFilteredContests(contests);
    }

    // Filter users based on search term
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, contests, users]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch all contests (including pending)
      const contestsRes = await fetch("http://localhost:5000/api/admin/contests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Fetch all users
      const usersRes = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (contestsRes.ok) {
        const contestsData = await contestsRes.json();
        const contestsList = contestsData.contests || [];
        setContests(contestsList);
        setFilteredContests(contestsList);
        
        // Calculate stats
        setStats({
          totalUsers: 0, // Will be set from users data
          totalContests: contestsList.length,
          pendingContests: contestsList.filter(c => c.status === 'pending').length,
          totalPrizePool: contestsList.reduce((sum, c) => sum + (c.prizeMoney || 0), 0)
        });
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const usersList = usersData.users || [];
        setUsers(usersList);
        setFilteredUsers(usersList);
        
        // Update stats with user count
        setStats(prev => ({ ...prev, totalUsers: usersList.length }));
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContestStatus = async (contestId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/contests/${contestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert(`Contest ${status} successfully!`);
      } else {
        alert("Failed to update contest status");
      }
    } catch (error) {
      console.error("Error updating contest status:", error);
      alert("Error updating contest status");
    }
  };

  const handleDeleteContest = async (contestId) => {
    if (!confirm("Are you sure you want to delete this contest? This action cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/contests/${contestId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert("Contest deleted successfully!");
      } else {
        alert("Failed to delete contest");
      }
    } catch (error) {
      console.error("Error deleting contest:", error);
      alert("Error deleting contest");
    }
  };

  const handleUserRole = async (userId, newRole) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert(`User role updated to ${newRole}!`);
      } else {
        alert("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Error updating user role");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">👑</span>
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-red-100">Welcome back, {user.name}! You have full platform control.</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="text-sm font-medium text-red-100 dark:text-gray-300">Total Users</h3>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="text-sm font-medium text-red-100 dark:text-gray-300">Total Contests</h3>
                  <p className="text-2xl font-bold text-white">{stats.totalContests}</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <h3 className="text-sm font-medium text-red-100 dark:text-gray-300">Pending Approval</h3>
                  <p className="text-2xl font-bold text-white">{stats.pendingContests}</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <h3 className="text-sm font-medium text-red-100 dark:text-gray-300">Total Prize Pool</h3>
                  <p className="text-2xl font-bold text-white">${stats.totalPrizePool}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar and Actions */}
        {(activeTab === "contests" || activeTab === "users") && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder={`Search ${activeTab === "contests" ? "contests" : "users"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            </div>
            <button
              onClick={fetchData}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <span>🔄</span> Refresh Data
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === "overview" 
                ? "bg-red-600 text-white shadow-lg" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab("contests")}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === "contests" 
                ? "bg-red-600 text-white shadow-lg" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            🎯 Contest Management
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === "users" 
                ? "bg-red-600 text-white shadow-lg" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            👥 User Management
          </button>
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {contests.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  contests.slice(0, 5).map((contest) => (
                  <div key={contest._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={contest.imageURL || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=50&h=50&fit=crop"}
                      alt={contest.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{contest.name}</h4>
                      <p className="text-sm text-gray-500">{contest.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contest.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : contest.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {contest.status}
                    </span>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("contests")}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-medium">Manage Contests</h4>
                      <p className="text-sm text-blue-600">{stats.pendingContests} pending approval</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <h4 className="font-medium">Manage Users</h4>
                      <p className="text-sm text-green-600">{stats.totalUsers} total users</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contest Management */}
        {activeTab === "contests" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Contest Management</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Approve, reject, or delete contests</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Showing {filteredContests.length} of {contests.length} contests
                  </p>
                  {searchTerm && (
                    <p className="text-xs text-blue-600">Filtered by: "{searchTerm}"</p>
                  )}
                </div>
              </div>
            </div>
            
            {filteredContests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {searchTerm ? "No Matching Contests" : "No Contests Found"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `No contests match "${searchTerm}". Try a different search term.`
                    : "No contests have been created yet."
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Contest</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Creator</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Prize</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Participants</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredContests.map((contest) => (
                      <tr key={contest._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={contest.imageURL || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop"}
                              alt={contest.name}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{contest.name}</h4>
                              <p className="text-sm text-gray-500">{contest.description?.slice(0, 50)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {contest.creatorId.slice(0, 8)}...
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{contest.type}</td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">${contest.prizeMoney}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            contest.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : contest.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {contest.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{contest.participants?.length || 0}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {contest.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleContestStatus(contest._id, "confirmed")}
                                  className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-200 font-medium transition-colors flex items-center gap-1"
                                >
                                  <span className="text-xs">✅</span> Confirm
                                </button>
                                <button
                                  onClick={() => handleContestStatus(contest._id, "rejected")}
                                  className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-200 font-medium transition-colors flex items-center gap-1"
                                >
                                  <span className="text-xs">❌</span> Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteContest(contest._id)}
                              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 font-medium transition-colors flex items-center gap-1"
                              title="Delete Contest"
                            >
                              <span className="text-xs">🗑️</span> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user roles and permissions</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Showing {filteredUsers.length} of {users.length} users
                  </p>
                  {searchTerm && (
                    <p className="text-xs text-blue-600">Filtered by: "{searchTerm}"</p>
                  )}
                </div>
              </div>
            </div>
            
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {searchTerm ? "No Matching Users" : "No Users Found"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `No users match "${searchTerm}". Try a different search term.`
                    : "No users have registered yet."
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Current Role</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Wins</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Participated</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Change Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={u.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{u.name}</h4>
                              <p className="text-sm text-gray-500">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              u.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : u.role === "creator"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">{u.wins || 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{u.participatedCount || 0}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUserRole(u._id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          >
                            <option value="user">User</option>
                            <option value="creator">Creator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}