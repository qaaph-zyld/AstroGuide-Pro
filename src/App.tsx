import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18nConfig';

// Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

// Contexts
import { UserProvider } from './contexts/UserContext';
import { ChartProvider } from './contexts/ChartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Pages
import Dashboard from './pages/Dashboard';
import ChartAnalysis from './pages/ChartAnalysis';
import BirthDataForm from './pages/BirthDataForm';
import PremiumFeatures from './pages/PremiumFeatures';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // PayPal configuration options
  const paypalOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "subscription"
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <NotificationProvider>
            <UserProvider>
              <ChartProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute user={user} />}>
                      <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/birth-data" element={<BirthDataForm />} />
                        <Route path="/chart-analysis" element={<ChartAnalysis />} />
                        <Route path="/premium" element={<PremiumFeatures />} />
                        <Route path="/profile" element={<UserProfile />} />
                      </Route>
                    </Route>
                    
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Router>
              </ChartProvider>
            </UserProvider>
          </NotificationProvider>
        </ThemeProvider>
      </I18nextProvider>
    </PayPalScriptProvider>
  );
};

export default App;
