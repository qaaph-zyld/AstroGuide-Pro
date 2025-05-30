import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, Clock, BarChart2, Users, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { useChart } from '../contexts/ChartContext';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { userProfile } = useUser();
  const { chart, savedCharts, loadChart } = useChart();
  const [analytics, setAnalytics] = useState({
    chartsGenerated: 0,
    sessionsToday: 1,
    totalUsers: 1247
  });

  // Simulated data for dashboard
  useEffect(() => {
    // In a real app, this would fetch from Firebase
    setAnalytics({
      chartsGenerated: savedCharts.length || Math.floor(Math.random() * 10) + 1,
      sessionsToday: Math.floor(Math.random() * 3) + 1,
      totalUsers: 1247 + Math.floor(Math.random() * 50)
    });
  }, [savedCharts.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('app.name')}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {userProfile ? (
                <>
                  {t('app.tagline')}, <span className="font-medium">{userProfile.displayName}</span>
                </>
              ) : (
                t('app.tagline')
              )}
            </p>
          </div>
          
          {!userProfile?.isPremium && (
            <Link
              to="/premium"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-mystical-600 to-cosmic-600 hover:from-mystical-700 hover:to-cosmic-700"
            >
              <Star className="mr-2 h-4 w-4" />
              {t('premium.upgrade')}
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-mystical-100 dark:bg-mystical-900 text-mystical-600 dark:text-mystical-300">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('chart.vedicChart')}
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {analytics.chartsGenerated}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-cosmic-100 dark:bg-cosmic-900 text-cosmic-600 dark:text-cosmic-300">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('common.sessions')}
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {analytics.sessionsToday}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('common.community')}
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {analytics.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Charts */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('chart.recentCharts')}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {savedCharts && savedCharts.length > 0 ? (
              savedCharts.slice(0, 5).map((savedChart) => (
                <div 
                  key={savedChart.id}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {savedChart.name || `Chart - ${savedChart.birthData.place}`}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {savedChart.birthData.date} • {savedChart.birthData.time}
                      </p>
                    </div>
                    <button
                      onClick={() => loadChart(savedChart.id)}
                      className="text-mystical-600 hover:text-mystical-700 dark:text-mystical-400 dark:hover:text-mystical-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('chart.noCharts')}
                </p>
                <Link
                  to="/birth-data"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mystical-600 hover:bg-mystical-700"
                >
                  {t('chart.createFirst')}
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('common.quickActions')}
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <Link
              to="/birth-data"
              className="block w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-mystical-600 dark:text-mystical-400" />
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                  {t('birthData.title')}
                </span>
              </div>
            </Link>
            
            <Link
              to="/chart-analysis"
              className="block w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-cosmic-600 dark:text-cosmic-400" />
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                  {t('analysis.title')}
                </span>
              </div>
            </Link>
            
            <Link
              to="/premium"
              className="block w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                  {t('premium.title')}
                </span>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Cosmic Insight of the Day */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-mystical-600 to-cosmic-700 rounded-xl shadow-lg p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {t('common.cosmicInsight')}
            </h2>
            <p className="mt-2 text-mystical-100">
              "{t('common.cosmicQuote')}"
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link
              to="/chart-analysis"
              className="inline-flex items-center px-4 py-2 border border-white border-opacity-30 rounded-md text-sm font-medium text-white bg-white bg-opacity-10 hover:bg-opacity-20"
            >
              {t('common.discover')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
