import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        "https://contesthub-akhi.vercel.app/api/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Auth check failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const navLinkClass =
    "text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-white transition-colors";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="https://i.ibb.co/7x7MMxyK/log-removebg-preview.png"
            alt="ContestHub"
            className="h-19 w-auto"
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Contest<span className="text-red-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/all-contests" className={navLinkClass}>
            Contests
          </NavLink>
          <NavLink to="/leaderboard" className={navLinkClass}>
            Leaderboard
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/help" className={navLinkClass}>
            Help
          </NavLink>

          {user?.role === "creator" && (
            <NavLink to="/packages" className={navLinkClass}>
              Packages
            </NavLink>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* User */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={
                    user.photoURL ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  }
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shadow-md"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-6 py-4 space-y-3">
            {[
              ["/", "Home"],
              ["/all-contests", "Contests"],
              ["/leaderboard", "Leaderboard"],
              ["/about", "About"],
              ["/help", "Help"],
            ].map(([path, label]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
