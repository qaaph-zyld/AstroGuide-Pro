import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BirthData } from '../astrology/models/types';
import { saveBirthChart } from '../firebase/chartService';

interface BirthChartFormProps {
  onSubmit?: (chartId: string) => void;
}

const BirthChartForm: React.FC<BirthChartFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // ISO date string format
    time: '12:00',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC',
    location: '',
    name: '',
    gender: 'other',
  } as BirthData);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  
  // Handle form field changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle date change specifically
  const handleDateChange = (e: any) => {
    const dateValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      date: dateValue, // Store as string directly
    }));
  };
  
  // Get current geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get location name
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              const location = data.display_name || 'Unknown Location';
              
              setFormData(prev => ({
                ...prev,
                latitude,
                longitude,
                location,
              }));
              
              setUseCurrentLocation(true);
              setIsLoading(false);
            })
            .catch(err => {
              console.error('Error getting location name:', err);
              
              setFormData(prev => ({
                ...prev,
                latitude,
                longitude,
                location: 'Unknown Location',
              }));
              
              setUseCurrentLocation(true);
              setIsLoading(false);
            });
        },
        (err) => {
          console.error('Error getting current position:', err);
          setError('Unable to get your current location. Please enter it manually.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a birth chart.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Save the birth data directly using our chart service
      // The service will calculate the chart internally
      const chartId = await saveBirthChart(
        formData, 
        currentUser.uid,
        formData.name || `${formData.location} Chart`
      );
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(chartId);
      } else {
        // Navigate to the chart view page
        navigate(`/chart/${chartId}`);
      }
    } catch (err) {
      console.error('Error creating birth chart:', err);
      setError('An error occurred while creating your birth chart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Create Your Birth Chart</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter name"
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender (Optional)
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Birth Date and Time */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Birth Date and Time</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Birth Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleDateChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Birth Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Birth Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Birth Location</h3>
          
          <div className="flex items-center mb-4">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isLoading || useCurrentLocation}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Getting Location...' : 'Use Current Location'}
            </button>
            
            {useCurrentLocation && (
              <span className="ml-2 text-sm text-green-600">
                Current location set!
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location Name
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="City, Country"
                required
              />
            </div>
            
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="UTC">UTC</option>
                <option value="UTC-12">UTC-12</option>
                <option value="UTC-11">UTC-11</option>
                <option value="UTC-10">UTC-10</option>
                <option value="UTC-9">UTC-9</option>
                <option value="UTC-8">UTC-8 (PST)</option>
                <option value="UTC-7">UTC-7 (MST)</option>
                <option value="UTC-6">UTC-6 (CST)</option>
                <option value="UTC-5">UTC-5 (EST)</option>
                <option value="UTC-4">UTC-4</option>
                <option value="UTC-3">UTC-3</option>
                <option value="UTC-2">UTC-2</option>
                <option value="UTC-1">UTC-1</option>
                <option value="UTC+1">UTC+1 (CET)</option>
                <option value="UTC+2">UTC+2 (EET)</option>
                <option value="UTC+3">UTC+3</option>
                <option value="UTC+4">UTC+4</option>
                <option value="UTC+5">UTC+5</option>
                <option value="UTC+5:30">UTC+5:30 (IST)</option>
                <option value="UTC+6">UTC+6</option>
                <option value="UTC+7">UTC+7</option>
                <option value="UTC+8">UTC+8</option>
                <option value="UTC+9">UTC+9 (JST)</option>
                <option value="UTC+10">UTC+10</option>
                <option value="UTC+11">UTC+11</option>
                <option value="UTC+12">UTC+12</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="0.000001"
                min="-90"
                max="90"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="0.000001"
                min="-180"
                max="180"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating Chart...' : 'Create Birth Chart'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BirthChartForm;
