import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BirthChartForm from '../components/BirthChartForm';
import BirthChartDisplay from '../components/BirthChartDisplay';
import { getBirthChart } from '../astrology/calculations/chartCalculator';
import { BirthChart } from '../astrology/models/types';

const BirthChartPage: React.FC = () => {
  const { chartId } = useParams<{ chartId?: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch chart data if chartId is provided
  useEffect(() => {
    const fetchChart = async () => {
      if (!chartId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const chartData = await getBirthChart(chartId);
        
        if (!chartData) {
          setError('Chart not found');
          return;
        }
        
        setChart(chartData);
      } catch (err) {
        console.error('Error fetching chart:', err);
        setError('An error occurred while fetching the chart');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChart();
  }, [chartId]);
  
  // Handle chart creation success
  const handleChartCreated = (newChartId: string) => {
    navigate(`/chart/${newChartId}`);
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chart data...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-6">
          <p>{error}</p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/create-chart')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Chart
          </button>
        </div>
      </div>
    );
  }
  
  // If no user is logged in, show login prompt
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="p-4 bg-amber-100 text-amber-700 rounded-md mb-6">
          <p>Please log in to create or view birth charts.</p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }
  
  // If chart is loaded, display it
  if (chart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BirthChartDisplay chart={chart} />
        
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/create-chart')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Chart
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // If no chartId is provided, show the form to create a new chart
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">Create Birth Chart</h1>
      <BirthChartForm onSubmit={handleChartCreated} />
    </div>
  );
};

export default BirthChartPage;
