import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import CreatorDashboard from "./CreatorDashboard";
import UserDashboard from "./UserDashboard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <p>Please login to access dashboard</p>
      </div>
    );
  }

  // Render dashboard based on user role
  switch (user.role) {
    case "admin":
      return <AdminDashboard user={user} />;
    case "creator":
      return <CreatorDashboard user={user} />;
    case "user":
    default:
      return <UserDashboard user={user} />;
  }
}