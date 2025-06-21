import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BirthChartDisplay from '../components/BirthChartDisplay';
import { getBirthChart } from '../firebase/chartService';
import { BirthChart } from '../astrology/models/types';
import { Loader2, ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';

type ChartParams = {
  chartId: string;
};

const ChartView: React.FC = () => {
  const { chartId } = useParams<ChartParams>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadChart = async () => {
      if (!chartId || !currentUser) {
        setError('Invalid chart ID or user not authenticated');
        setLoading(false);
        return;
      }
      
      try {
        const chartData = await getBirthChart(chartId, currentUser.uid);
        if (!chartData) {
          setError('Chart not found or you do not have permission to view it');
          setLoading(false);
          return;
        }
        
        setChart(chartData);
      } catch (err) {
        console.error('Error loading chart:', err);
        setError('Failed to load birth chart');
      } finally {
        setLoading(false);
      }
    };
    
    loadChart();
  }, [chartId, currentUser]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleDownload = () => {
    if (!chart) return;
    
    // Create a downloadable JSON file
    const chartJson = JSON.stringify(chart, null, 2);
    const blob = new Blob([chartJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chart.birthData.name || 'birth-chart'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleShare = () => {
    // Implement sharing functionality (could use navigator.share API)
    if (navigator.share && chart) {
      navigator.share({
        title: `Birth Chart - ${chart.birthData.name || chart.birthData.location}`,
        text: 'Check out this birth chart from AstroGuide Pro!',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link'));
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Loading birth chart...</p>
      </div>
    );
  }
  
  if (error || !chart) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error || 'Failed to load birth chart'}</p>
          <button
            onClick={handleBack}
            className="mt-6 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-800">
            {chart.birthData.name ? `${chart.birthData.name}'s Birth Chart` : 'Birth Chart'}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            aria-label="Download Chart"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Download</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            aria-label="Share Chart"
          >
            <Share2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="text-lg font-semibold">{chart.birthData.name || 'Not specified'}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Birth Date</h3>
            <p className="text-lg font-semibold">{new Date(chart.birthData.date).toLocaleDateString()}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Birth Time</h3>
            <p className="text-lg font-semibold">{chart.birthData.time || 'Not specified'}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="text-lg font-semibold">{chart.birthData.location}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Coordinates</h3>
            <p className="text-lg font-semibold">
              {chart.birthData.latitude.toFixed(4)}°, {chart.birthData.longitude.toFixed(4)}°
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Ascendant</h3>
            <p className="text-lg font-semibold">
              {chart.ascendant.sign} {chart.ascendant.degree.toFixed(2)}°
            </p>
          </div>
        </div>
        
        <BirthChartDisplay birthChart={chart} />
      </div>
    </div>
  );
};

export default ChartView;
