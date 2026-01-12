import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AnimatedPage,
  AnimatedCard,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  FloatingElement,
  CountUp,
  buttonVariants
} from "../animations/AnimatedComponents";

export default function Home() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentWinners, setRecentWinners] = useState([]);
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token");

  useEffect(() => {
    fetchPopularContests();
    fetchRecentWinners();
  }, []);

  const fetchPopularContests = async () => {
    try {
      const response = await fetch("https://contesthub-akhi.vercel.app/api/contests");
      const data = await response.json();

      // Sort by participants count (highest first) and take top 5
      const sortedContests = (data.contests || [])
        .sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0))
        .slice(0, 5);

      setContests(sortedContests);
    } catch (error) {
      console.error("Failed to fetch contests:", error);
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentWinners = async () => {
    try {
      const response = await fetch("https://contesthub-akhi.vercel.app/api/recent-winners");
      if (response.ok) {
        const data = await response.json();
        setRecentWinners(data.winners || []);
      }
    } catch (error) {
      console.error("Failed to fetch recent winners:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/all-contests?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDetailsClick = (contestId) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/contest/${contestId}`);
    }
  };

  return (
    <AnimatedPage>
      {/* Hero Banner Section */}
 <section className="relative text-white overflow-hidden min-h-[90vh] flex items-center">
  {/* Background Image */}
  <img
    src="https://i.ibb.co/32572x4/home.jpg"
    alt="Hero Background"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
    <SlideIn direction="down">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
        Unleash Your <span className="text-green-400">Creativity</span>
        <br />
        Win Amazing <span className="text-blue-400">Prizes</span>
      </h1>
    </SlideIn>

    {/* Search Bar */}
    <SlideIn direction="up">
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contests (Logo, Web, Writing...)"
            className="w-full px-6 py-4 text-lg text-gray-800 rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-green-400"
          />

          <motion.button
            type="submit"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="absolute right-2 top-1/2 -translate-y-1/2
              bg-gradient-to-r from-green-500 to-blue-500
              text-white px-7 py-2.5 rounded-full
              font-semibold shadow-lg
              hover:scale-105 transition-all duration-300"
          >
            Search
          </motion.button>
        </div>
      </form>
    </SlideIn>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        to="/all-contests"
        className="bg-gradient-to-r from-green-500 to-blue-500
          text-white px-10 py-4 rounded-full text-lg font-semibold
          shadow-xl hover:scale-105 transition-all duration-300"
      >
        Browse All Contests
      </Link>

      {!isLoggedIn && (
        <Link
          to="/register"
          className="border-2 border-white text-white
            px-10 py-4 rounded-full text-lg font-semibold
            hover:bg-white hover:text-black
            transition-all duration-300"
        >
          Join Now — It’s Free
        </Link>
      )}
    </div>
  </div>
</section>


      {/* Popular Contests Section */}
      <section className="p-8 bg-white dark:bg-gray-800">
        <SlideIn direction="up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Contests</h2>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/all-contests"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Show All
              </Link>
            </motion.div>
          </div>
        </SlideIn>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading contests...</p>
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No contests available at the moment.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {contests.map((contest) => (
              <StaggerItem key={contest._id}>
                <AnimatedCard className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <img
                    src={contest.imageURL || `https://picsum.photos/300/200?random=${contest._id}`}
                    alt={contest.name}
                    className="w-full h-32 object-cover mb-3 rounded"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/300/200?random=${Math.random()}`;
                    }}
                  />
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{contest.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Participants: {contest.participants?.length || 0}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {contest.description
                      ? contest.description.length > 60
                        ? contest.description.slice(0, 60) + "..."
                        : contest.description
                      : "No description available"
                    }
                  </p>
                  <motion.button
                    onClick={() => handleDetailsClick(contest._id)}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Details
                  </motion.button>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* Winner Advertisement Section */}
      <section className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">🏆 Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of winners who have earned amazing prizes and recognition for their creativity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Winner Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥇</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Sarah Johnson</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Logo Design Contest</p>
                <p className="text-2xl font-bold text-green-600">$750 Won</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">"Amazing platform to showcase creativity!"</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500
                 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥈</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Mike Chen</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Web Design Challenge</p>
                <p className="text-2xl font-bold text-green-600">$500 Won</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">"Great competition and fair judging!"</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥉</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Emma Davis</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Article Writing Contest</p>
                <p className="text-2xl font-bold text-green-600">$300 Won</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">"Perfect platform for writers!"</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="rounded-2xl p-8 text-black text-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold mb-2">2,500+</div>
                <div className="text-gray-500">Total Winners</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">$125,000+</div>
                <div className="text-gray-500">Prizes Awarded</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">15,000+</div>
                <div className="text-gray-500">Active Participants</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-gray-500">Contests Completed</div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Join the Winners Circle?</h3>
              <Link
                to={isLoggedIn ? "/all-contests" : "/register"}
                className="bg-gradient-to-r from-purple-600 to-blue-600  text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                {isLoggedIn ? "Browse Contests" : "Start Your Journey"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Why Choose ContestHub?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The ultimate platform for creative minds to compete, learn, and earn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Fair & Transparent</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All contests are judged fairly with transparent criteria. Every participant gets equal opportunity to win.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Quick Payouts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Winners receive their prizes quickly and securely. No delays, no hassles - just pure reward for your creativity.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Global Community</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with creators worldwide. Learn from the best, share your skills, and grow your network.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Ready to Start Winning?</h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Join ContestHub today and turn your creativity into cash prizes!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      Sign Up Free
                    </Link>
                    <Link
                      to="/all-contests"
                      className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-full text-lg font-semibold hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      View Contests
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/all-contests"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Browse Contests Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
