import React, { useState, useEffect } from "react";

export default function RoleManagement() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  const roleFeatures = {
    admin: {
      title: "Admin Dashboard",
      color: "red",
      icon: "👑",
      features: [
        "✅ Approve/reject contests",
        "✅ Change user roles (user/creator/admin)",
        "✅ View all contests and users",
        "✅ Manage platform settings",
        "✅ Monitor platform statistics"
      ]
    },
    creator: {
      title: "Contest Creator",
      color: "blue",
      icon: "🎨",
      features: [
        "✅ Add new contests",
        "✅ Edit/delete own contests (only before approval)",
        "✅ Declare winner after deadline",
        "✅ View contest submissions",
        "✅ Manage contest participants"
      ]
    },
    user: {
      title: "Normal User",
      color: "green",
      icon: "👤",
      features: [
        "✅ Join contests (after payment)",
        "✅ See participated & won contests",
        "✅ Update profile information",
        "✅ Submit contest tasks",
        "✅ View contest leaderboard"
      ]
    }
  };

  const currentRole = user?.role || "user";
  const roleInfo = roleFeatures[currentRole];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Role Management System</h1>
      
      {/* Current User Role */}
      <div className={`bg-${roleInfo.color}-50 border-2 border-${roleInfo.color}-200 rounded-xl p-6 mb-8`}>
        <div className="text-center">
          <div className="text-4xl mb-2">{roleInfo.icon}</div>
          <h2 className={`text-2xl font-bold text-${roleInfo.color}-800 mb-2`}>
            Your Role: {roleInfo.title}
          </h2>
          <p className={`text-${roleInfo.color}-600`}>
            Welcome, {user?.name}! You have {currentRole} privileges.
          </p>
        </div>
      </div>

      {/* Role Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(roleFeatures).map(([role, info]) => (
          <div
            key={role}
            className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
              currentRole === role 
                ? `border-${info.color}-300 ring-2 ring-${info.color}-200` 
                : 'border-gray-200'
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">{info.icon}</div>
              <h3 className={`text-xl font-bold text-${info.color}-800`}>
                {info.title}
              </h3>
              {currentRole === role && (
                <span className={`inline-block bg-${info.color}-100 text-${info.color}-800 px-3 py-1 rounded-full text-sm font-medium mt-2`}>
                  Your Current Role
                </span>
              )}
            </div>
            
            <ul className="space-y-2">
              {info.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Test Accounts */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Test Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-bold text-red-800">Admin Account</h4>
            <p className="text-sm text-red-600">admin@contesthub.com</p>
            <p className="text-sm text-red-600">Password: admin123</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800">Creator Account</h4>
            <p className="text-sm text-blue-600">creator@contesthub.com</p>
            <p className="text-sm text-blue-600">Password: creator123</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-bold text-green-800">User Account</h4>
            <p className="text-sm text-green-600">user@contesthub.com</p>
            <p className="text-sm text-green-600">Password: user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}