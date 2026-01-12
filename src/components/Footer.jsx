import React from 'react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-auto" role="contentinfo">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Logo & Name */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="  ">
                              <img
            src="https://i.ibb.co/7x7MMxyK/log-removebg-preview.png"
            alt="ContestHub"
            className="h-29 w-auto"
          />
                            </div>
                            <h2 className="text-2xl font-bold">
                                Contest<span className="">Hub</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 max-w-md">
                            The ultimate platform for creative minds to compete, learn, and earn. 
                            Join thousands of creators showcasing their talents and winning amazing prizes.
                        </p>
                        <p className="text-gray-500 text-xs">Empowering creators since 2025</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/all-contests" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    All Contests
                                </Link>
                            </li>
                            <li>
                                <Link to="/leaderboard" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    Leaderboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/akhi.akter.751291"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <FaFacebook size={20} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/akhi-akter-578880396/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 hover:bg-blue-700 p-3 rounded-full transition-all duration-300 hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                        <p className="text-gray-400 text-xs mt-4">
                            Follow us for updates and contest announcements
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            &copy; 2025 ContestHub. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-xs text-gray-500">
                            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-gray-300 transition-colors">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
