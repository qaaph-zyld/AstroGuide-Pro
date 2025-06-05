import React from 'react';
import { Link } from 'react-router-dom';

const TestNavigation: React.FC = () => {
  return (
    <div className="bg-indigo-800 text-white p-4 mb-4">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-2">AstroGuide Pro - Test Navigation</h2>
        <nav className="flex flex-wrap gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/birth-data" className="hover:underline">Birth Data Form</Link>
          <Link to="/chart-analysis" className="hover:underline">Chart Analysis</Link>
          <Link to="/profile" className="hover:underline">User Profile</Link>
          <Link to="/premium" className="hover:underline">Premium Features</Link>
          <Link to="/test" className="hover:underline font-bold">Test Page</Link>
        </nav>
      </div>
    </div>
  );
};

export default TestNavigation;
