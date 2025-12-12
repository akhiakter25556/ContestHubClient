import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 text-9xl font-bold text-blue-200 -z-10 transform translate-x-2 translate-y-2">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            The page you're looking for seems to have vanished into thin air.
          </p>
          <p className="text-gray-500">
            Don't worry, even the best explorers get lost sometimes!
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            🏠 Go Back Home
          </Link>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors"
            >
              ← Go Back
            </button>
            <Link
              to="/all-contests"
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              Browse Contests
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            <strong>Need help?</strong> Try searching for contests or check out our popular categories.
          </p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            <Link to="/all-contests?search=Logo Design" className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
              Logo Design
            </Link>
            <Link to="/all-contests?search=Web Design" className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
              Web Design
            </Link>
            <Link to="/all-contests?search=Writing" className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
              Writing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
