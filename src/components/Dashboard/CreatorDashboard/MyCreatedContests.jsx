import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyCreatedContests() {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    fetch("/api/creator/my-contests", { credentials: "include" })
      .then(res => res.json())
      .then(data => setContests(data));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contest?")) {
      fetch(`/api/creator/contest/${id}`, { method: "DELETE", credentials: "include" })
        .then(() => setContests(contests.filter(c => c.id !== id)));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Created Contests</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contests.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.status}</td>
              <td className="p-2 space-x-2">
                {c.status === "Pending" && (
                  <>
                    <Link className="text-blue-500" to={`edit/${c.id}`}>Edit</Link>
                    <button className="text-red-500" onClick={() => handleDelete(c.id)}>Delete</button>
                  </>
                )}
                <Link className="text-green-500" to={`submissions/${c.id}`}>See Submissions</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
