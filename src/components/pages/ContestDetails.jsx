import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ContestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [winner, setWinner] = useState(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Get user info
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
      } else {
        navigate("/login");
      }
    })
    .catch(() => navigate("/login"));
  }, [navigate]);

  // Fetch contest details
  useEffect(() => {
    if (!user) return;
    
    const fetchContest = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/contests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          setContest(data.contest);
          setIsRegistered(data.contest.participants?.includes(user.id) || false);
          
          // Fetch winner details if exists
          if (data.contest.winnerId) {
            const winnerRes = await fetch(`http://localhost:5000/api/user/${data.contest.winnerId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (winnerRes.ok) {
              const winnerData = await winnerRes.json();
              setWinner(winnerData.user);
            }
          }
        } else {
          navigate("/all-contests");
        }
      } catch (error) {
        console.error("Failed to fetch contest:", error);
        navigate("/all-contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, user, navigate]);

  // Countdown timer
  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(contest.deadline).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Contest Ended");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (days > 0) {
          setTimeLeft(`${days}d ${hrs}h ${mins}m ${secs}s`);
        } else {
          setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  // Handle payment/registration
  const handleRegisterPay = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/contests/${id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Payment successful! You are now registered for this contest.");
        setIsRegistered(true);
        // Refresh contest data
        window.location.reload();
      } else {
        alert(data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  // Handle task submission
  const handleTaskSubmit = async () => {
    if (!taskText.trim()) {
      alert("Please provide your submission details!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/contests/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ submissionLink: taskText }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Task submitted successfully!");
        setOpenModal(false);
        setTaskText("");
      } else {
        alert(data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contest details...</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contest Not Found</h2>
          <button
            onClick={() => navigate("/all-contests")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse All Contests
          </button>
        </div>
      </div>
    );
  }

  const isContestEnded = timeLeft === "Contest Ended";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={contest.imageURL || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop"}
          alt={contest.name}
          className="w-full h-64 md:h-96 object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="max-w-7xl mx-auto px-6 py-8 text-white w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
              <div>
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {contest.type}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">{contest.name}</h1>
                <p className="text-xl text-gray-200">Prize: ${contest.prizeMoney}</p>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <div className={`text-2xl font-bold mb-2 ${isContestEnded ? 'text-red-400' : 'text-green-400'}`}>
                  {timeLeft}
                </div>
                <p className="text-gray-300">
                  {contest.participants?.length || 0} participants joined
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Contest Description */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contest Description</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {contest.description || "No description provided for this contest."}
              </p>
              
              {contest.taskInstruction && (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Task Instructions</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700">{contest.taskInstruction}</p>
                  </div>
                </>
              )}
            </div>

            {/* Winner Section */}
            {winner && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-3xl">🏆</span>
                  Contest Winner
                </h2>
                <div className="flex items-center gap-6">
                  <img
                    src={winner.photoURL || "https://via.placeholder.com/80x80?text=Winner"}
                    alt={winner.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{winner.name}</h3>
                    <p className="text-gray-600">Contest Winner</p>
                    <p className="text-green-600 font-semibold">Won ${contest.prizeMoney}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contest Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contest Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Entry Fee:</span>
                  <span className="font-semibold text-gray-800">${contest.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prize Money:</span>
                  <span className="font-bold text-green-600 text-lg">${contest.prizeMoney}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-semibold text-gray-800">{contest.participants?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(contest.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${isContestEnded ? 'text-red-600' : 'text-green-600'}`}>
                    {isContestEnded ? 'Ended' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                {!isRegistered ? (
                  <button
                    onClick={handleRegisterPay}
                    disabled={isContestEnded}
                    className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                      isContestEnded
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105"
                    }`}
                  >
                    {isContestEnded ? "Contest Ended" : `Register Now - $${contest.price}`}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-medium">
                      ✅ You're registered!
                    </div>
                    {!isContestEnded && (
                      <button
                        onClick={() => setOpenModal(true)}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-green-700 transition-colors"
                      >
                        Submit Your Task
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit Your Task</h2>
            <p className="text-gray-600 mb-4">
              Provide links to your work, portfolio, or any relevant materials for this contest.
            </p>
            <textarea
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Paste your submission links here...&#10;&#10;Example:&#10;- Portfolio: https://myportfolio.com&#10;- Design files: https://drive.google.com/..."
              className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTaskSubmit}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
