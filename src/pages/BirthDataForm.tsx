import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Search, Loader, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChart } from '../contexts/ChartContext';
import { useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';

const BirthDataForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { birthData, setBirthData, calculateChart, loading, error } = useChart();
  const { userProfile } = useUser();
  const { addNotification } = useNotification();
  
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [formErrors, setFormErrors] = useState({
    date: '',
    time: '',
    place: '',
  });

  // Validate form
  const validateForm = () => {
    const errors = {
      date: '',
      time: '',
      place: '',
    };
    
    if (!birthData.date) {
      errors.date = t('birthData.requiredField');
    }
    
    if (!birthData.time) {
      errors.time = t('birthData.requiredField');
    }
    
    if (!birthData.place) {
      errors.place = t('birthData.requiredField');
    }
    
    setFormErrors(errors);
    
    return !errors.date && !errors.time && !errors.place;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      calculateChart();
      navigate('/chart-analysis');
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setBirthData({
      ...birthData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Simulated location search
  const searchLocation = async (query: string) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([]);
      return;
    }
    
    setSearchingLocation(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock locations
      const mockLocations = [
        { 
          place: 'New York, NY, USA', 
          latitude: '40.7128', 
          longitude: '-74.0060' 
        },
        { 
          place: 'New Delhi, India', 
          latitude: '28.6139', 
          longitude: '77.2090' 
        },
        { 
          place: 'London, UK', 
          latitude: '51.5074', 
          longitude: '-0.1278' 
        },
        { 
          place: 'Tokyo, Japan', 
          latitude: '35.6762', 
          longitude: '139.6503' 
        },
        { 
          place: 'Sydney, Australia', 
          latitude: '-33.8688', 
          longitude: '151.2093' 
        }
      ];
      
      const filteredLocations = mockLocations.filter(
        location => location.place.toLowerCase().includes(query.toLowerCase())
      );
      
      setLocationSuggestions(filteredLocations);
      setSearchingLocation(false);
    }, 500);
  };

  // Select location from suggestions
  const selectLocation = (location: any) => {
    setBirthData({
      ...birthData,
      place: location.place,
      latitude: location.latitude,
      longitude: location.longitude
    });
    
    setLocationSuggestions([]);
  };

  // Handle location search input
  const handleLocationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setBirthData({
      ...birthData,
      place: value,
      latitude: '',
      longitude: ''
    });
    
    searchLocation(value);
  };

  // Show error notification if there's an error
  useEffect(() => {
    if (error) {
      addNotification({
        type: 'error',
        message: error
      });
    }
  }, [error, addNotification]);

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
      className="max-w-3xl mx-auto"
    >
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('birthData.title')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {t('birthData.description')}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Date of Birth */}
            <motion.div variants={itemVariants}>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('birthData.date')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={birthData.date}
                  onChange={handleChange}
                  className={`input-field pl-10 ${formErrors.date ? 'border-red-500 dark:border-red-500' : ''}`}
                  required
                />
              </div>
              {formErrors.date && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.date}</p>
              )}
            </motion.div>
            
            {/* Time of Birth */}
            <motion.div variants={itemVariants}>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('birthData.time')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={birthData.time}
                  onChange={handleChange}
                  className={`input-field pl-10 ${formErrors.time ? 'border-red-500 dark:border-red-500' : ''}`}
                  required
                />
              </div>
              {formErrors.time && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.time}</p>
              )}
              <div className="mt-1">
                <label className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="rounded text-mystical-600 focus:ring-mystical-500 h-3 w-3 mr-1"
                  />
                  {t('birthData.unknownTime')}
                </label>
              </div>
            </motion.div>
            
            {/* Place of Birth */}
            <motion.div variants={itemVariants}>
              <label htmlFor="place" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('birthData.place')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="place"
                  name="place"
                  value={birthData.place}
                  onChange={handleLocationSearch}
                  placeholder={t('birthData.searchLocation')}
                  className={`input-field pl-10 ${formErrors.place ? 'border-red-500 dark:border-red-500' : ''}`}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {searchingLocation ? (
                    <Loader className="h-4 w-4 text-gray-400 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
              {formErrors.place && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.place}</p>
              )}
              
              {/* Location Suggestions */}
              {locationSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 text-sm">
                  {locationSuggestions.map((location, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => selectLocation(location)}
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{location.place}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Coordinates (shown when place is selected) */}
            {birthData.latitude && birthData.longitude && (
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('birthData.latitude')}
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={birthData.latitude}
                    onChange={handleChange}
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('birthData.longitude')}
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={birthData.longitude}
                    onChange={handleChange}
                    className="input-field"
                    readOnly
                  />
                </div>
              </motion.div>
            )}
            
            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-mystical-600 to-cosmic-600 hover:from-mystical-700 hover:to-cosmic-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mystical-500"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('birthData.calculate')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </form>
      </motion.div>
      
      {/* Information Card */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-mystical-50 to-cosmic-50 dark:from-mystical-900 dark:to-cosmic-900 dark:bg-opacity-20 rounded-xl shadow-sm p-6 border border-mystical-100 dark:border-mystical-800"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {t('birthData.infoTitle')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('birthData.infoText')}
        </p>
        
        {!userProfile?.isPremium && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-md border border-yellow-100 dark:border-yellow-800">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              {t('birthData.premiumInfo')}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BirthDataForm;
