import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SubmittedTasks() {
  const { contestId } = useParams();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch(`/api/creator/submissions/${contestId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setSubmissions(data));
  }, [contestId]);

  const declareWinner = (submissionId) => {
    fetch(`/api/creator/declare-winner/${submissionId}`, { method: "POST", credentials: "include" })
      .then(() => alert("Winner declared!"));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Submitted Tasks</h2>
      <ul className="space-y-2">
        {submissions.map(s => (
          <li key={s.id} className="border p-2 rounded">
            <p><strong>Name:</strong> {s.participantName}</p>
            <p><strong>Email:</strong> {s.email}</p>
            <p><strong>Task Info:</strong> {s.taskInfo}</p>
            {!s.winner && <button className="bg-green-500 text-white px-2 py-1 rounded mt-2" onClick={() => declareWinner(s.id)}>Declare Winner</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
