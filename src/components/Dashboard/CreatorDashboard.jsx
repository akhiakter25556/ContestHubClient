import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaTachometerAlt, FaListAlt, FaPlus, FaFileAlt,
  FaSignOutAlt, FaBars, FaTimes, FaEdit, FaTrash,
  FaTrophy, FaUsers, FaClock, FaChartLine, FaBoxOpen
} from "react-icons/fa";

export default function CreatorDashboard({ user }) {
  const [contests, setContests] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [editingContest, setEditingContest] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [userPackage, setUserPackage] = useState(null);
  const [canCreate, setCanCreate] = useState({ canCreate: false, reason: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const contestTypes = ["Logo Design", "Article Writing", "Web Design", "UI/UX", "Image Design"];

  useEffect(() => { fetchMyContests(); fetchUserPackage(); checkCanCreate(); }, []);

  const fetchUserPackage = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://contesthub-akhi.vercel.app/api/user/package", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); if (d.hasPackage) setUserPackage(d.package); }
    } catch (e) { }
  };

  const checkCanCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://contesthub-akhi.vercel.app/api/user/can-create-contest", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setCanCreate(await res.json());
    } catch (e) { }
  };

  const fetchMyContests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://contesthub-akhi.vercel.app/api/creator/contests", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setContests(d.contests || []); }
    } catch (e) { } finally { setLoading(false); }
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    const url = editingContest ? `https://contesthub-akhi.vercel.app/api/contests/${editingContest._id}` : "https://contesthub-akhi.vercel.app/api/contests";
    const method = editingContest ? "PUT" : "POST";
    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...data, deadline: selectedDate.toISOString() }),
    });
    if (res.ok) {
      setEditingContest(null); reset(); setSelectedDate(new Date());
      setActiveTab("contests"); fetchMyContests(); fetchUserPackage(); checkCanCreate();
    } else {
      const d = await res.json();
      if (d.requiresPackage) window.location.href = "/packages";
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this contest?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`https://contesthub-akhi.vercel.app/api/contests/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) fetchMyContests();
  };

  const fetchSubmissions = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://contesthub-akhi.vercel.app/api/contests/${id}/submissions`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { const d = await res.json(); setSubmissions(d.submissions || []); setSelectedContestId(id); setActiveTab("submissions"); }
  };

  const handleWinner = async (contestId, winnerId) => {
    if (!confirm("Declare winner?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`https://contesthub-akhi.vercel.app/api/contests/${contestId}/winner`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ winnerId }),
    });
    if (res.ok) { fetchMyContests(); setActiveTab("contests"); }
  };

  const handleEditClick = (c) => {
    setEditingContest(c); setSelectedDate(new Date(c.deadline));
    setValue("name", c.name); setValue("imageURL", c.imageURL); setValue("description", c.description);
    setValue("type", c.type); setValue("taskInstruction", c.taskInstruction);
    setValue("price", c.price); setValue("prizeMoney", c.prizeMoney);
    setActiveTab("add-contest");
  };

  const stats = [
    { label: "Total Contests", value: contests.length, icon: <FaListAlt />, light: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600" },
    { label: "Pending", value: contests.filter(c => c.status === "pending").length, icon: <FaClock />, light: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600" },
    { label: "Active", value: contests.filter(c => c.status === "confirmed").length, icon: <FaChartLine />, light: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600" },
    { label: "Participants", value: contests.reduce((s, c) => s + (c.participants?.length || 0), 0), icon: <FaUsers />, light: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600" },
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: <FaTachometerAlt /> },
    { id: "contests", label: "My Contests", icon: <FaListAlt /> },
    { id: "add-contest", label: "Add Contest", icon: <FaPlus /> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold shadow">
              {user?.displayName?.[0]?.toUpperCase() || "C"}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[110px]">{user?.displayName || "Creator"}</p>
              <p className="text-xs text-blue-500 font-semibold">Creator</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><FaTimes /></button>
        </div>

        {/* Package info */}
        <div className="mx-3 mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <FaBoxOpen className="text-blue-500 text-xs" />
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
              {userPackage ? userPackage.packageName : "No Package"}
            </p>
          </div>
          <p className="text-[10px] text-blue-500">
            {userPackage
              ? userPackage.contestLimit === -1 ? "Unlimited contests" : `${userPackage.contestLimit - userPackage.contestsUsed} contests left`
              : <a href="/packages" className="underline">Buy a package →</a>}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Creator Panel</p>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); if (item.id === "add-contest") { setEditingContest(null); reset(); } }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              <span className={`text-base ${activeTab === item.id ? "text-blue-500" : "text-gray-400"}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          {activeTab === "submissions" && (
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-violet-50 text-violet-600">
              <FaFileAlt className="text-violet-500" /> Submissions
            </button>
          )}
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
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingContest ? "Edit Contest" : navItems.find(n => n.id === activeTab)?.label || "Submissions"}
              </h1>
              <p className="text-xs text-gray-400">Creator Dashboard</p>
            </div>
          </div>
          {canCreate.canCreate && (
            <button onClick={() => { setActiveTab("add-contest"); setEditingContest(null); reset(); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors">
              <FaPlus /> New Contest
            </button>
          )}
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {stats.map((c, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${c.light} flex items-center justify-center ${c.text} text-sm mb-3`}>{c.icon}</div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{c.value}</p>
                <p className="text-xs text-gray-400 mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recent Contests</h2>
                <button onClick={() => setActiveTab("contests")} className="text-xs font-semibold text-blue-500">View All →</button>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {contests.slice(0, 5).map(c => (
                  <div key={c._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <img src={c.imageURL || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40"} alt={c.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.type} · {c.participants?.length || 0} participants</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : c.status === "rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contests Table */}
          {activeTab === "contests" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">My Created Contests</h2>
              </div>
              {contests.length === 0 ? (
                <div className="text-center py-16">
                  <FaListAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 mb-4">No contests yet</p>
                  {canCreate.canCreate
                    ? <button onClick={() => setActiveTab("add-contest")} className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">Create Contest</button>
                    : <p className="text-xs text-red-500">{canCreate.reason}</p>}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        {["Contest", "Type", "Status", "Participants", "Prize", "Deadline", "Actions"].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {contests.map(c => (
                        <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={c.imageURL || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40"} alt={c.name} className="w-10 h-10 rounded-lg object-cover" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{c.type}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : c.status === "rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>{c.status}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{c.participants?.length || 0}</td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600">${c.prizeMoney}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.deadline).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {c.status === "pending" && (
                                <>
                                  <button onClick={() => handleEditClick(c)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs"><FaEdit /></button>
                                  <button onClick={() => handleDelete(c._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-xs"><FaTrash /></button>
                                </>
                              )}
                              {c.status === "confirmed" && c.participants?.length > 0 && (
                                <button onClick={() => fetchSubmissions(c._id)} className="px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-xs font-bold hover:bg-violet-100 transition-colors">
                                  Submissions
                                </button>
                              )}
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

          {/* Add/Edit Contest Form */}
          {activeTab === "add-contest" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 max-w-3xl">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                {editingContest ? "Edit Contest" : "Create New Contest"}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Contest Name *</label>
                    <input {...register("name", { required: true })} className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter contest name" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Type *</label>
                    <select {...register("type", { required: true })} className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {contestTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Entry Price ($) *</label>
                    <input type="number" {...register("price", { required: true, min: 0 })} className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Prize Money ($) *</label>
                    <input type="number" {...register("prizeMoney", { required: true, min: 0 })} className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Image URL</label>
                  <input type="url" {...register("imageURL")} className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Description *</label>
                  <textarea {...register("description", { required: true })} rows="3" className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe your contest..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Task Instructions *</label>
                  <textarea {...register("taskInstruction", { required: true })} rows="3" className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Instructions for participants..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Deadline *</label>
                  <DatePicker selected={selectedDate} onChange={setSelectedDate} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMMM d, yyyy h:mm aa" minDate={new Date()}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                    {editingContest ? "Update Contest" : "Create Contest"}
                  </button>
                  <button type="button" onClick={() => { setActiveTab("contests"); setEditingContest(null); reset(); }} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Submissions */}
          {activeTab === "submissions" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Submissions ({submissions.length})</h2>
                <button onClick={() => setActiveTab("contests")} className="text-xs font-semibold text-blue-500">← Back</button>
              </div>
              {submissions.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FaFileAlt className="text-4xl mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No submissions yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {submissions.map(s => (
                    <div key={s._id} className="px-6 py-5 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <div className="flex items-start gap-4">
                        <img src={s.user?.photoURL || "https://via.placeholder.com/40"} alt={s.user?.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{s.user?.name}</p>
                          <p className="text-xs text-gray-400 mb-2">{s.user?.email}</p>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-lg">
                            {s.submissionLink}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">{new Date(s.submittedAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <button onClick={() => handleWinner(selectedContestId, s.userId)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap">
                        <FaTrophy /> Declare Winner
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}