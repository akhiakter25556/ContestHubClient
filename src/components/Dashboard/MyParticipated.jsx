import React, { useEffect, useState } from "react";

export default function MyParticipated({ user }) {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipatedContests();
  }, []);

  const fetchParticipatedContests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://contesthub-akhi.vercel.app/api/user/participated", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Sort by upcoming deadline
        const sortedContests = (data.contests || []).sort((a, b) =>
          new Date(a.deadline) - new Date(b.deadline)
        );
        setContests(sortedContests);
      }
    } catch (error) {
      console.error("Failed to fetch participated contests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return "Contest Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} days, ${hours} hours left`;
    return `${hours} hours left`;
  };

  const getPaymentStatus = (contest) => {
    // Assuming if user is in participants array, payment is completed
    return contest.participants?.includes(user.id) ? "Paid" : "Pending";
  };

  if (loading) return <div className="p-6">Loading participated contests...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Participated Contests</h2>
      {contests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't participated in any contests yet.</p>
          <a href="/all-contests" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Browse Contests
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {contests.map((contest) => (
            <div key={contest._id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{contest.name}</h3>
                  <p className="text-gray-600 mb-3">{contest.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Type:</span>
                      <p className="text-gray-600">{contest.type}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Prize:</span>
                      <p className="text-green-600 font-bold">${contest.prizeMoney}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Entry Fee:</span>
                      <p className="text-gray-600">${contest.price}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Participants:</span>
                      <p className="text-gray-600">{contest.participants?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="ml-6 text-right">
                  <div className="mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatus(contest) === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {getPaymentStatus(contest)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Deadline:</span>
                    <p className={`${getTimeRemaining(contest.deadline) === "Contest Ended"
                        ? "text-red-600"
                        : "text-blue-600"
                      } font-medium`}>
                      {getTimeRemaining(contest.deadline)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Joined: {new Date(contest.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/contest/${contest._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </a>
                  {contest.winnerId && (
                    <span className={`px-3 py-2 rounded text-sm font-medium ${contest.winnerId === user.id
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}>
                      {contest.winnerId === user.id ? "🏆 Winner!" : "Not Won"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
