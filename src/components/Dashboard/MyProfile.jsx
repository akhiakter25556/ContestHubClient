import React, { useState, useEffect } from "react";

export default function MyProfile({ user, onUpdate }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photoURL: "",
    bio: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalParticipated: 0,
    totalWon: 0,
    winPercentage: 0,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        bio: user.bio || "",
        address: user.address || "",
      });
    }
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://contesthub-akhi.vercel.app/api/user/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://contesthub-akhi.vercel.app/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        if (onUpdate) onUpdate();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Win percentage chart (simple CSS-based)
  const WinPercentageChart = ({ percentage }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Form */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Update Profile Information</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
              <input
                type="url"
                value={profile.photoURL}
                onChange={(e) => setProfile({ ...profile, photoURL: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                placeholder="Your address..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Profile Stats & Preview */}
        <div className="space-y-6">
          {/* Profile Preview */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Profile Preview</h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={profile.photoURL || "https://via.placeholder.com/80x80?text=User"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80x80?text=User";
                }}
              />
              <div>
                <h4 className="text-lg font-bold">{profile.name || "Your Name"}</h4>
                <p className="text-gray-600">{profile.email}</p>
                {profile.bio && <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>}
              </div>
            </div>
            {profile.address && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Address:</span> {profile.address}
              </div>
            )}
          </div>

          {/* Win Percentage Chart */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Performance Statistics</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Win Percentage</span>
                  <span className="text-sm font-bold text-green-600">{stats.winPercentage}%</span>
                </div>
                <WinPercentageChart percentage={stats.winPercentage} />
                <p className="text-xs text-gray-500">
                  {stats.totalWon} wins out of {stats.totalParticipated} contests
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalParticipated}</div>
                  <div className="text-sm text-gray-600">Total Participated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalWon}</div>
                  <div className="text-sm text-gray-600">Total Won</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.totalParticipated >= 1 && (
                <div className="bg-blue-100 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-xs font-medium text-blue-800">First Participant</div>
                </div>
              )}
              {stats.totalWon >= 1 && (
                <div className="bg-yellow-100 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs font-medium text-yellow-800">First Winner</div>
                </div>
              )}
              {stats.totalParticipated >= 5 && (
                <div className="bg-purple-100 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🚀</div>
                  <div className="text-xs font-medium text-purple-800">Active Participant</div>
                </div>
              )}
              {stats.winPercentage >= 50 && (
                <div className="bg-green-100 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-xs font-medium text-green-800">High Performer</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
