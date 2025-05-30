import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Settings, Trash2, Save, ChevronRight, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { useChart } from '../contexts/ChartContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const UserProfile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userProfile, updateUserProfile, logout } = useUser();
  const { savedCharts, loadChart, deleteChart } = useChart();
  const { addNotification } = useNotification();
  const { theme, setTheme } = useTheme();
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    birthData: {
      date: '',
      time: '',
      place: '',
      latitude: '',
      longitude: ''
    },
    preferences: {
      language: '',
      theme: '',
      notifications: true
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        displayName: userProfile.displayName || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        birthData: userProfile.birthData || {
          date: '',
          time: '',
          place: '',
          latitude: '',
          longitude: ''
        },
        preferences: {
          language: userProfile.preferences?.language || i18n.language || 'en',
          theme: userProfile.preferences?.theme || theme || 'light',
          notifications: userProfile.preferences?.notifications !== undefined 
            ? userProfile.preferences.notifications 
            : true
        }
      });
    }
  }, [userProfile, i18n.language, theme]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      await updateUserProfile({
        displayName: profileData.displayName,
        phoneNumber: profileData.phoneNumber,
        birthData: profileData.birthData,
        preferences: profileData.preferences
      });
      
      // Update language and theme
      if (i18n.language !== profileData.preferences.language) {
        i18n.changeLanguage(profileData.preferences.language);
      }
      
      if (theme !== profileData.preferences.theme) {
        setTheme(profileData.preferences.theme as any);
      }
      
      addNotification({
        type: 'success',
        message: t('profile.saveSuccess')
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification({
        type: 'error',
        message: t('profile.saveError')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would delete the user account
      // For now, just log the user out
      await logout();
      
      addNotification({
        type: 'success',
        message: t('profile.deleteSuccess')
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      addNotification({
        type: 'error',
        message: t('profile.deleteError')
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLoadChart = (chartId: string) => {
    loadChart(chartId)
      .then(() => {
        addNotification({
          type: 'success',
          message: t('chart.loadSuccess')
        });
      })
      .catch((error) => {
        addNotification({
          type: 'error',
          message: error.message || t('chart.loadError')
        });
      });
  };

  const handleDeleteChart = (chartId: string) => {
    deleteChart(chartId)
      .then(() => {
        addNotification({
          type: 'success',
          message: t('chart.deleteSuccess')
        });
      })
      .catch((error) => {
        addNotification({
          type: 'error',
          message: error.message || t('chart.deleteError')
        });
      });
  };

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

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 text-mystical-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      {/* Profile Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-mystical-500 to-cosmic-600 flex items-center justify-center text-white text-2xl font-bold">
              {userProfile.displayName?.charAt(0) || <User size={32} />}
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {userProfile.displayName || t('profile.user')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {userProfile.email}
            </p>
            <div className="mt-2 flex items-center">
              {userProfile.isPremium ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mystical-100 text-mystical-800 dark:bg-mystical-900 dark:text-mystical-200">
                  {t('premium.premiumMember')}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {t('premium.freeMember')}
                </span>
              )}
              
              {userProfile.trialDays > 0 && !userProfile.isPremium && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('premium.trialDays', { days: userProfile.trialDays })}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Tabs */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'personal'
                  ? 'border-mystical-600 text-mystical-600 dark:border-mystical-400 dark:text-mystical-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('profile.personalInfo')}
            </button>
            
            <button
              onClick={() => setActiveTab('charts')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'charts'
                  ? 'border-mystical-600 text-mystical-600 dark:border-mystical-400 dark:text-mystical-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('profile.savedCharts')}
            </button>
            
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'preferences'
                  ? 'border-mystical-600 text-mystical-600 dark:border-mystical-400 dark:text-mystical-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('profile.preferences')}
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.name')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    readOnly
                    className="input-field pl-10 bg-gray-50 dark:bg-gray-700"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('profile.emailReadOnly')}
                </p>
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.phone')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                  {t('profile.birthDetails')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="birthData.date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('birthData.date')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="birthData.date"
                        name="birthData.date"
                        value={profileData.birthData.date}
                        onChange={handleChange}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="birthData.time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('birthData.time')}
                    </label>
                    <input
                      type="time"
                      id="birthData.time"
                      name="birthData.time"
                      value={profileData.birthData.time}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="birthData.place" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('birthData.place')}
                    </label>
                    <input
                      type="text"
                      id="birthData.place"
                      name="birthData.place"
                      value={profileData.birthData.place}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('profile.delete')}
                </button>
                
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mystical-600 hover:bg-mystical-700"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                      {t('common.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t('profile.save')}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Saved Charts */}
          {activeTab === 'charts' && (
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                {t('profile.savedCharts')}
              </h3>
              
              {savedCharts && savedCharts.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {savedCharts.map((chart) => (
                      <li key={chart.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {chart.name || `Chart - ${chart.birthData.place}`}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {chart.birthData.date} • {chart.birthData.time} • {chart.birthData.place}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(chart.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleLoadChart(chart.id)}
                              className="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-mystical-600 hover:bg-mystical-700"
                            >
                              {t('common.view')}
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteChart(chart.id)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t('chart.noSavedCharts')}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="preferences.language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.language')}
                </label>
                <select
                  id="preferences.language"
                  name="preferences.language"
                  value={profileData.preferences.language}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="sa">संस्कृतम् (Sanskrit)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="preferences.theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.theme')}
                </label>
                <select
                  id="preferences.theme"
                  name="preferences.theme"
                  value={profileData.preferences.theme}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="light">{t('profile.lightTheme')}</option>
                  <option value="dark">{t('profile.darkTheme')}</option>
                  <option value="cosmic">{t('profile.cosmicTheme')}</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preferences.notifications"
                    name="preferences.notifications"
                    checked={profileData.preferences.notifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-mystical-600 focus:ring-mystical-500 border-gray-300 rounded"
                  />
                  <label htmlFor="preferences.notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    {t('profile.enableNotifications')}
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('profile.notificationsDescription')}
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mystical-600 hover:bg-mystical-700"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                      {t('common.saving')}
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      {t('profile.savePreferences')}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('profile.confirmDelete')}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {t('profile.deleteWarning')}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
              >
                {t('common.cancel')}
              </button>
              
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                {t('profile.confirmDeleteButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserProfile;
