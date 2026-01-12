import { useState } from "react";

export default function About() {
  const [activeTab, setActiveTab] = useState("mission");

  const features = [
    {
      icon: "🎯",
      title: "Contest Creation",
      description: "Create and manage contests with ease. Set prizes, deadlines, and requirements."
    },
    {
      icon: "👥",
      title: "Community Driven",
      description: "Join a vibrant community of creators, designers, and innovators."
    },
    {
      icon: "🏆",
      title: "Fair Competition",
      description: "Transparent judging process with clear winner selection criteria."
    },
    {
      icon: "💰",
      title: "Real Rewards",
      description: "Win actual prizes and build your portfolio with meaningful achievements."
    },
    {
      icon: "📊",
      title: "Performance Tracking",
      description: "Track your progress with detailed analytics and leaderboards."
    },
    {
      icon: "🔒",
      title: "Secure Platform",
      description: "Your data and payments are protected with enterprise-grade security."
    }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
      bio: "Passionate about connecting creative minds through meaningful competitions. 10+ years in tech entrepreneurship."
    },
    {
      name: "Sarah Chen",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
      bio: "Designing user experiences that inspire creativity and foster community. Former Google UX designer."
    },
    {
      name: "Michael Rodriguez",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
      bio: "Building robust, scalable solutions that power creative competitions. Full-stack expert with 8+ years experience."
    },
    {
      name: "Emily Watson",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
      bio: "Fostering vibrant creator communities and ensuring fair contest experiences for all participants."
    },
    {
      name: "David Kim",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Connecting talented creators with opportunities worldwide. Digital marketing strategist and growth expert."
    },
    {
      name: "Lisa Thompson",
      role: "Operations Director",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Ensuring smooth contest operations and timely prize distributions. Operations excellence specialist."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "2,500+", label: "Contests Hosted" },
    { number: "$500K+", label: "Prizes Awarded" },
    { number: "50+", label: "Countries" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className=" text-black py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About ContestHub</h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize creativity by connecting talented individuals 
            with meaningful opportunities to showcase their skills and win amazing prizes.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab("mission")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === "mission"
                    ? "bg-blue-700 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Our Mission
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === "features"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === "team"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Our Team
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "mission" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full mb-4">
                  <span className="text-2xl text-white">🚀</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Empowering Creativity Worldwide
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Why ContestHub Exists
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    We believe that everyone has unique creative talents that deserve recognition. 
                    Traditional platforms often favor established creators, leaving emerging talent 
                    without opportunities to shine.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    ContestHub levels the playing field by providing a transparent, merit-based 
                    platform where the best ideas win, regardless of your background or follower count.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Fair and transparent judging</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Real monetary rewards</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Global community access</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=400&fit=crop"
                    alt="Team collaboration"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "team" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Meet Our Team
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  We're a passionate team of creators, developers, and innovators working 
                  to build the future of creative competitions.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                    <div className="relative mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-red-100 dark:border-red-900 group-hover:border-red-300 dark:group-hover:border-red-700 transition-colors"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face";
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 dark:text-red-400 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Showcase Your Talent?</h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of creators who are already winning contests and building their careers.
          </p>
          <div className="space-x-4">
            <a
              href="/register"
              className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
            >
              Get Started Today
            </a>
            <a
              href="/all-contests"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-red-600 transition-colors inline-block"
            >
              Browse Contests
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}