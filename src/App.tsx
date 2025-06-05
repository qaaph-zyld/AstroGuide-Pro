import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BirthDataForm from './pages/BirthDataForm';
import ChartAnalysis from './pages/ChartAnalysis';
import UserProfile from './pages/UserProfile';
import PremiumFeatures from './pages/PremiumFeatures';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';
import TestPage from './pages/TestPage';

// Import test navigation
import TestNavigation from './components/TestNavigation';

// Import BasicTest for testing purposes
import BasicTest from './BasicTest';

const App: React.FC = () => {
  // For testing purposes, you can uncomment this to use the BasicTest component
  // return (
  //   <div style={{ 
  //     backgroundColor: '#f3f4f6', 
  //     minHeight: '100vh', 
  //     display: 'flex', 
  //     alignItems: 'center', 
  //     justifyContent: 'center' 
  //   }}>
  //     <BasicTest />
  //   </div>
  // );
  
  const [showTestNav, setShowTestNav] = useState(true);

  // Toggle test navigation visibility with keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle test navigation with Ctrl+Shift+T
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        setShowTestNav(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <div className="app-container">
        {showTestNav && <TestNavigation />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/birth-data" element={<BirthDataForm />} />
          <Route path="/chart-analysis" element={<ChartAnalysis />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/premium" element={<PremiumFeatures />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
