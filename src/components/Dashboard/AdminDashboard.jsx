import { useState, useEffect } from "react";
import {
  FaTachometerAlt, FaTrophy, FaUsers, FaCheckCircle,
  FaTimesCircle, FaTrash, FaSync, FaSearch, FaBars,
  FaTimes, FaSignOutAlt, FaCrown, FaDollarSign, FaClock
} from "react-icons/fa";

export default function AdminDashboard({ user }) {
  const [contests, setContests] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalContests: 0, pendingContests: 0, totalPrizePool: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContests, setFilteredContests] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    setFilteredContests(searchTerm ? contests.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase())
    ) : contests);
    setFilteredUsers(searchTerm ? users.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : users);
  }, [searchTerm, contests, users]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [contestsRes, usersRes] = await Promise.all([
        fetch("https://contesthub-akhi.vercel.app/api/admin/contests", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("https://contesthub-akhi.vercel.app/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (contestsRes.ok) {
        const d = await contestsRes.json();
        const list = d.contests || [];
        setContests(list); setFilteredContests(list);
        setStats(prev => ({ ...prev, totalContests: list.length, pendingContests: list.filter(c => c.status === "pending").length, totalPrizePool: list.reduce((s, c) => s + (c.prizeMoney || 0), 0) }));
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        const list = d.users || [];
        setUsers(list); setFilteredUsers(list);
        setStats(prev => ({ ...prev, totalUsers: list.length }));
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleContestStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://contesthub-akhi.vercel.app/api/admin/contests/${id}/status`, {
      method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchData();
  };

  const handleDeleteContest = async (id) => {
    if (!confirm("Delete this contest?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`https://contesthub-akhi.vercel.app/api/admin/contests/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) fetchData();
  };

  const handleUserRole = async (id, role) => {
    if (!confirm(`Change role to ${role}?`)) return;
    const token = localStorage.getItem("token");
    await fetch(`https://contesthub-akhi.vercel.app/api/admin/users/${id}/role`, {
      method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role }),
    });
    fetchData();
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: <FaTachometerAlt /> },
    { id: "contests", label: "Contests", icon: <FaTrophy /> },
    { id: "users", label: "Users", icon: <FaUsers /> },
  ];

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: <FaUsers />, light: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
    { label: "Total Contests", value: stats.totalContests, icon: <FaTrophy />, light: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" },
    { label: "Pending Approval", value: stats.pendingContests, icon: <FaClock />, light: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400" },
    { label: "Total Prize Pool", value: `$${stats.totalPrizePool}`, icon: <FaDollarSign />, light: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading admin dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow">
              <FaCrown />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[110px]">{user?.displayName || "Admin"}</p>
              <p className="text-xs text-red-500 font-semibold">Administrator</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><FaTimes /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Admin Panel</p>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              <span className={`text-base ${activeTab === item.id ? "text-red-500" : "text-gray-400"}`}>{item.icon}</span>
              {item.label}
              {item.id === "contests" && stats.pendingContests > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.pendingContests}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><FaBars size={20} /></button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">{navItems.find(n => n.id === activeTab)?.label}</h1>
              <p className="text-xs text-gray-400">Admin Control Panel</p>
            </div>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 transition-colors">
            <FaSync className="text-xs" /> Refresh
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {statCards.map((c, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className={`w-11 h-11 rounded-xl ${c.light} flex items-center justify-center ${c.text} text-lg mb-4`}>{c.icon}</div>
                <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">{c.value}</p>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Search bar for contests/users */}
          {(activeTab === "contests" || activeTab === "users") && (
            <div className="mb-4 flex gap-3">
              <div className="relative flex-1 max-w-sm">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
          )}

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recent Contests</h2>
                  <button onClick={() => setActiveTab("contests")} className="text-xs font-semibold text-red-500">View All →</button>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {contests.slice(0, 5).map(c => (
                    <div key={c._id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <img src={c.imageURL || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40"} alt={c.name} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.type}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${c.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : c.status === "rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button onClick={() => setActiveTab("contests")} className="w-full flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 transition-colors text-left">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600"><FaClock /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Pending Approvals</p>
                      <p className="text-xs text-amber-600">{stats.pendingContests} contests waiting</p>
                    </div>
                  </button>
                  <button onClick={() => setActiveTab("users")} className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 transition-colors text-left">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600"><FaUsers /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Manage Users</p>
                      <p className="text-xs text-blue-600">{stats.totalUsers} registered users</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contests Table */}
          {activeTab === "contests" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Contest Management</h2>
                <p className="text-xs text-gray-400 mt-0.5">Showing {filteredContests.length} of {contests.length} contests</p>
              </div>
              {filteredContests.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FaTrophy className="text-4xl mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No contests found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        {["Contest", "Type", "Prize", "Status", "Participants", "Actions"].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {filteredContests.map(c => (
                        <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={c.imageURL || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40"} alt={c.name} className="w-10 h-10 rounded-lg object-cover" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{c.type}</td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600">${c.prizeMoney}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : c.status === "rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>{c.status}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{c.participants?.length || 0}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {c.status === "pending" && (
                                <>
                                  <button onClick={() => handleContestStatus(c._id, "confirmed")} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
                                    <FaCheckCircle /> Approve
                                  </button>
                                  <button onClick={() => handleContestStatus(c._id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                                    <FaTimesCircle /> Reject
                                  </button>
                                </>
                              )}
                              <button onClick={() => handleDeleteContest(c._id)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
                                <FaTrash />
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

          {/* Users Table */}
          {activeTab === "users" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">User Management</h2>
                <p className="text-xs text-gray-400 mt-0.5">Showing {filteredUsers.length} of {users.length} users</p>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FaUsers className="text-4xl mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        {["User", "Email", "Role", "Wins", "Participated", "Change Role"].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {filteredUsers.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={u.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40"} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-red-100 text-red-600" : u.role === "creator" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>{u.role}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600">{u.wins || 0}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{u.participatedCount || 0}</td>
                          <td className="px-6 py-4">
                            <select value={u.role} onChange={e => handleUserRole(u._id, e.target.value)}
                              className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500">
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
        </main>
      </div>
    </div>
  );
}