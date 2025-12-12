import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreatorDashboard({ user }) {
  const [contests, setContests] = useState([]);
  const [activeTab, setActiveTab] = useState("my-contests");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContest, setEditingContest] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedContestForSubmissions, setSelectedContestForSubmissions] = useState(null);
  const [userPackage, setUserPackage] = useState(null);
  const [canCreateContest, setCanCreateContest] = useState({ canCreate: false, reason: "" });
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const contestTypes = [
    "Logo Design",
    "Article Writing", 
    "Web Design",
    "UI/UX",
    "Image Design"
  ];

  useEffect(() => {
    fetchMyContests();
    fetchUserPackage();
    checkCanCreateContest();
  }, []);

  const fetchUserPackage = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/package", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.hasPackage) {
          setUserPackage(data.package);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user package:", error);
    }
  };

  const checkCanCreateContest = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/can-create-contest", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCanCreateContest(data);
      }
    } catch (error) {
      console.error("Failed to check contest creation ability:", error);
    }
  };

  const fetchMyContests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/creator/contests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setContests(data.contests || []);
      }
    } catch (error) {
      console.error("Failed to fetch contests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContest = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const contestData = {
        ...data,
        deadline: selectedDate.toISOString(),
      };
      
      const response = await fetch("http://localhost:5000/api/contests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contestData),
      });

      if (response.ok) {
        alert("Contest created successfully! Waiting for admin approval.");
        setShowCreateForm(false);
        reset();
        setSelectedDate(new Date());
        fetchMyContests();
        fetchUserPackage(); // Refresh package info
        checkCanCreateContest(); // Check if can still create contests
      } else {
        const responseData = await response.json();
        if (responseData.requiresPackage) {
          alert("You need to purchase a package to create contests. Redirecting to packages page...");
          window.location.href = "/packages";
        } else {
          alert(responseData.message || "Failed to create contest");
        }
      }
    } catch (error) {
      console.error("Error creating contest:", error);
      alert("Error creating contest");
    }
  };

  const handleEditContest = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const contestData = {
        ...data,
        deadline: selectedDate.toISOString(),
      };
      
      const response = await fetch(`http://localhost:5000/api/contests/${editingContest._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contestData),
      });

      if (response.ok) {
        alert("Contest updated successfully!");
        setEditingContest(null);
        reset();
        setSelectedDate(new Date());
        fetchMyContests();
      } else {
        const responseData = await response.json();
        alert(responseData.message || "Failed to update contest");
      }
    } catch (error) {
      console.error("Error updating contest:", error);
      alert("Error updating contest");
    }
  };

  const handleDeleteContest = async (contestId) => {
    if (!confirm("Are you sure you want to delete this contest?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/contests/${contestId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Contest deleted successfully!");
        fetchMyContests();
      } else {
        alert("Failed to delete contest");
      }
    } catch (error) {
      console.error("Error deleting contest:", error);
      alert("Error deleting contest");
    }
  };

  const fetchSubmissions = async (contestId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/contests/${contestId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
        setSelectedContestForSubmissions(contestId);
        setActiveTab("submissions");
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  };

  const handleDeclareWinner = async (contestId, winnerId) => {
    if (!confirm("Are you sure you want to declare this participant as winner?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/contests/${contestId}/winner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ winnerId }),
      });

      if (response.ok) {
        alert("Winner declared successfully!");
        fetchMyContests();
        setActiveTab("my-contests");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to declare winner");
      }
    } catch (error) {
      console.error("Error declaring winner:", error);
      alert("Error declaring winner");
    }
  };

  const handleEditClick = (contest) => {
    setEditingContest(contest);
    setSelectedDate(new Date(contest.deadline));
    
    // Pre-fill form
    setValue("name", contest.name);
    setValue("imageURL", contest.imageURL);
    setValue("description", contest.description);
    setValue("type", contest.type);
    setValue("taskInstruction", contest.taskInstruction);
    setValue("price", contest.price);
    setValue("prizeMoney", contest.prizeMoney);
    
    setActiveTab("add-contest");
  };

  if (loading) return <div className="p-6">Loading creator dashboard...</div>;

  if (loading) return <div className="p-6">Loading creator dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-blue-100">Welcome back, {user.name}! Manage your contests and track submissions.</p>
          
          {/* Package Info */}
          {userPackage ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">Active Package: {userPackage.packageName}</h3>
                  <p className="text-blue-100 text-sm">
                    {userPackage.contestLimit === -1 
                      ? "Unlimited contests remaining"
                      : `${userPackage.contestLimit - userPackage.contestsUsed} of ${userPackage.contestLimit} contests remaining`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {userPackage.contestLimit === -1 ? "∞" : userPackage.contestLimit - userPackage.contestsUsed}
                  </div>
                  <div className="text-xs text-blue-100">contests left</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">No Active Package</h3>
                  <p className="text-red-100 text-sm">Purchase a package to create contests</p>
                </div>
                <a
                  href="/packages"
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  View Packages
                </a>
              </div>
            </div>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-100">Total Contests</h3>
              <p className="text-2xl font-bold">{contests.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-100">Pending Approval</h3>
              <p className="text-2xl font-bold">{contests.filter(c => c.status === 'pending').length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-100">Active Contests</h3>
              <p className="text-2xl font-bold">{contests.filter(c => c.status === 'confirmed').length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-100">Total Participants</h3>
              <p className="text-2xl font-bold">{contests.reduce((sum, c) => sum + (c.participants?.length || 0), 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab("my-contests")}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === "my-contests" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            📋 My Contests
          </button>
          <button
            onClick={() => {
              setActiveTab("add-contest");
              setEditingContest(null);
              reset();
              setSelectedDate(new Date());
            }}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === "add-contest" 
                ? "bg-green-600 text-white shadow-lg" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            ➕ Add Contest
          </button>
          {activeTab === "submissions" && (
            <button
              onClick={() => setActiveTab("submissions")}
              className="px-6 py-3 rounded-full font-medium bg-purple-600 text-white shadow-lg"
            >
              📝 Submissions
            </button>
          )}
        </div>

        {/* Add/Edit Contest Form */}
        {activeTab === "add-contest" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingContest ? "Edit Contest" : "Create New Contest"}
            </h2>
            
            <form onSubmit={handleSubmit(editingContest ? handleEditContest : handleCreateContest)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contest Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contest Name *</label>
                  <input
                    {...register("name", { required: "Contest name is required" })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contest name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Contest Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contest Type *</label>
                  <select
                    {...register("type", { required: "Contest type is required" })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {contestTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                </div>

                {/* Entry Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entry Price ($) *</label>
                  <input
                    type="number"
                    {...register("price", { required: "Entry price is required", min: 0 })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                </div>

                {/* Prize Money */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prize Money ($) *</label>
                  <input
                    type="number"
                    {...register("prizeMoney", { required: "Prize money is required", min: 0 })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                  {errors.prizeMoney && <p className="text-red-500 text-sm mt-1">{errors.prizeMoney.message}</p>}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contest Image URL</label>
                <input
                  type="url"
                  {...register("imageURL")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your contest..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Task Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Instructions *</label>
                <textarea
                  {...register("taskInstruction", { required: "Task instructions are required" })}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide detailed instructions for participants..."
                />
                {errors.taskInstruction && <p className="text-red-500 text-sm mt-1">{errors.taskInstruction.message}</p>}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contest Deadline *</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select deadline"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  {editingContest ? "Update Contest" : "Create Contest"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("my-contests");
                    setEditingContest(null);
                    reset();
                  }}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Contests Table */}
        {activeTab === "my-contests" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">My Created Contests</h2>
              <p className="text-gray-600 mt-1">Manage all your contests in one place</p>
            </div>
            
            {contests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Contests Yet</h3>
                <p className="text-gray-600 mb-6">Create your first contest to get started!</p>
                {canCreateContest.canCreate ? (
                  <button
                    onClick={() => setActiveTab("add-contest")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Create Contest
                  </button>
                ) : (
                  <div className="text-center">
                    <button
                      disabled
                      className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed mb-2"
                    >
                      Create Contest
                    </button>
                    <p className="text-red-600 text-sm">{canCreateContest.reason}</p>
                    <a
                      href="/packages"
                      className="text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                      View Packages
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Contest</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Participants</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Prize</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Deadline</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contests.map((contest) => (
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
                        <td className="px-6 py-4 text-sm text-gray-900">{contest.type}</td>
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
                        <td className="px-6 py-4 text-sm font-medium text-green-600">${contest.prizeMoney}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(contest.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {contest.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleEditClick(contest)}
                                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteContest(contest._id)}
                                  className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                            {contest.status === "confirmed" && contest.participants?.length > 0 && (
                              <button
                                onClick={() => fetchSubmissions(contest._id)}
                                className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-200"
                              >
                                See Submissions
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

        {/* Submissions Page */}
        {activeTab === "submissions" && (
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Contest Submissions</h2>
                  <p className="text-gray-600 mt-1">Review and manage participant submissions</p>
                </div>
                <button
                  onClick={() => setActiveTab("my-contests")}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Back to Contests
                </button>
              </div>
            </div>
            
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Submissions Yet</h3>
                <p className="text-gray-600">Participants haven't submitted their work yet.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid gap-6">
                  {submissions.map((submission) => (
                    <div key={submission._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <img
                              src={submission.user?.photoURL || "https://via.placeholder.com/50x50?text=User"}
                              alt={submission.user?.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900">{submission.user?.name}</h4>
                              <p className="text-sm text-gray-600">{submission.user?.email}</p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-800 mb-2">Submitted Work:</h5>
                            <p className="text-gray-700 whitespace-pre-wrap">{submission.submissionLink}</p>
                          </div>
                          
                          <p className="text-sm text-gray-500 mt-3">
                            Submitted: {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="ml-6">
                          <button
                            onClick={() => handleDeclareWinner(selectedContestForSubmissions, submission.userId)}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all"
                          >
                            🏆 Declare Winner
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}