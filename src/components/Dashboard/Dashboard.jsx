import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/Context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import CreatorDashboard from "./CreatorDashboard";
import UserDashboard from "./UserDashboard";

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ navigate must be inside useEffect, not during render
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  // Firebase user-এ role নেই — JWT token থেকে নিন
  // যদি token না থাকে, Firebase user হিসেবে "user" role দিন
  let role = "user";
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role || "user";
    } catch {
      role = "user";
    }
  }

  switch (role) {
    case "admin":
      return <AdminDashboard user={user} />;
    case "creator":
      return <CreatorDashboard user={user} />;
    case "user":
    default:
      return <UserDashboard user={user} />;
  }
}