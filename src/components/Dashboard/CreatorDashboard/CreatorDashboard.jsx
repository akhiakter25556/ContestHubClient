import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AddContest from "./AddContest";
import MyCreatedContests from "./MyCreatedContests";
import EditContest from "./EditContest";
import SubmittedTasks from "./SubmittedTasks";

export default function CreatorDashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <ul>
          <li><Link to="add-contest">Add Contest</Link></li>
          <li><Link to="my-contests">My Created Contests</Link></li>
        </ul>
      </aside>

      <main className="content">
        <Routes>
          <Route path="add-contest" element={<AddContest />} />
          <Route path="my-contests" element={<MyCreatedContests />} />
          <Route path="edit/:id" element={<EditContest />} />
          <Route path="submissions/:contestId" element={<SubmittedTasks />} />
        </Routes>
      </main>
    </div>
  );
}
