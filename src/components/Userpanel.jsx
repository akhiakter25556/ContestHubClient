import React from "react";
import { Routes, Route, Link } from "react-router-dom";

function Participated() { return <div>My Participated Contests</div>; }
function Wins() { return <div>My Winning Contests</div>; }
function Profile() { return <div>My Profile</div>; }

export default function UserPanel() {
  return (
    <div>
      <h1>User Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <Link to="participated">Participated</Link>
        <Link to="wins">Wins</Link>
        <Link to="profile">Profile</Link>
      </div>

      <Routes>
        <Route path="participated" element={<Participated />} />
        <Route path="wins" element={<Wins />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Participated />} />
      </Routes>
    </div>
  );
}
