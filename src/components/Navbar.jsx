import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

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
            if (token) {
                const response = await fetch("http://localhost:5000/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setDropdownOpen(false);
        navigate('/');
    };

    const toggleDropdown = () => setDropdownOpen(prev => !prev);

    return (
        <nav className="glass-nav sticky top-0 z-50 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* Logo + Name */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/3176/3176363.png" 
                            alt="Logo" 
                            className="w-6 h-6"
                        />
                    </div>
                    <span className="font-display font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                        Contest<span className="text-blue-600">Hub</span>
                    </span>
                </Link>

                {/* Menu + User */}
                <div className="flex gap-6 items-center">
                    {/* Navigation Links */}
                    <div className="hidden md:flex gap-6 items-center">
                        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link to="/all-contests" className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                            All Contests
                        </Link>
                        <Link to="/leaderboard" className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                            Leaderboard
                        </Link>
                        <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                            About
                        </Link>
                        <Link to="/help" className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                            Help
                        </Link>
                        {user?.role === 'creator' && (
                            <Link to="/packages" className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                                Packages
                            </Link>
                        )}
                        {user?.role === 'admin' && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Admin
                            </span>
                        )}
                        {user?.role === 'creator' && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                Creator
                            </span>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* User Profile */}
                    {user ? (
                        <div className="relative">
                            <button 
                                onClick={toggleDropdown} 
                                className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                            >
                                <img 
                                    src={user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
                                    alt="Profile" 
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md ring-2 ring-gray-100 dark:ring-gray-700" 
                                />
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-fade-in-down z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
                                    </div>
                                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        Dashboard
                                    </Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                            <span>Get Started</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </Link>
                    )}

                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 space-y-3">
                        <Link 
                            to="/" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link 
                            to="/all-contests" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            All Contests
                        </Link>
                        <Link 
                            to="/leaderboard" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Leaderboard
                        </Link>
                        <Link 
                            to="/about" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            About
                        </Link>
                        <Link 
                            to="/help" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Help
                        </Link>
                        {user?.role === 'creator' && (
                            <Link 
                                to="/packages" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                Packages
                            </Link>
                        )}
                        {!user && (
                            <Link 
                                to="/login" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
