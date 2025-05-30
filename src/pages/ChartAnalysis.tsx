import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Star, 
  Download, 
  Share2, 
  Save, 
  BarChart2, 
  ChevronRight, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChart } from '../contexts/ChartContext';
import { useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const ChartAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { chart, analysis, birthData, saveChart, generateAnalysis } = useChart();
  const { userProfile } = useUser();
  const { addNotification } = useNotification();
  
  const [chartName, setChartName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Redirect to birth data form if no chart data
  useEffect(() => {
    if (!chart && !birthData.date) {
      navigate('/birth-data');
    }
  }, [chart, birthData, navigate]);

  // Generate analysis if chart exists but no analysis
  useEffect(() => {
    if (chart && (!analysis || analysis.length === 0)) {
      generateAnalysis();
    }
  }, [chart, analysis, generateAnalysis]);

  const handleSaveChart = () => {
    saveChart(chartName || undefined)
      .then(() => {
        addNotification({
          type: 'success',
          message: t('chart.saveSuccess')
        });
        setShowSaveModal(false);
      })
      .catch((error) => {
        addNotification({
          type: 'error',
          message: error.message || t('chart.saveError')
        });
      });
  };

  const handleDownloadPDF = () => {
    if (!userProfile?.isPremium) {
      addNotification({
        type: 'warning',
        message: t('premium.featureRestricted'),
        title: t('premium.upgrade')
      });
      return;
    }
    
    // In a real app, this would generate and download a PDF
    addNotification({
      type: 'info',
      message: t('chart.pdfGenerating')
    });
    
    setTimeout(() => {
      addNotification({
        type: 'success',
        message: t('chart.pdfReady')
      });
    }, 2000);
  };

  const handleShare = () => {
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(`https://astroguidepro.com/shared-chart/${chart?.id || 'demo'}`);
    
    addNotification({
      type: 'success',
      message: t('chart.linkCopied')
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
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

  if (!chart) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            {t('chart.noChartData')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('chart.enterBirthDetails')}
          </p>
          <button
            onClick={() => navigate('/birth-data')}
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mystical-600 hover:bg-mystical-700"
          >
            {t('birthData.title')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Chart Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('chart.vedicChart')}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {birthData.place} • {birthData.date} • {birthData.time}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
            >
              <Save className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              {t('common.save')}
            </button>
            
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
            >
              <Share2 className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              {t('common.share')}
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-mystical-600 to-cosmic-600 hover:from-mystical-700 hover:to-cosmic-700"
            >
              <Download className="mr-2 h-4 w-4" />
              {t('common.download')}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chart Tabs */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('chart')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'chart'
                  ? 'border-mystical-600 text-mystical-600 dark:border-mystical-400 dark:text-mystical-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('chart.vedicChart')}
            </button>
            
            <button
              onClick={() => setActiveTab('planets')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'planets'
                  ? 'border-mystical-600 text-mystical-600 dark:border-mystical-400 dark:text-mystical-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('chart.planets')}
            </button>
            
            <button
              onClick={() => setActiveTab('dashas')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'dashas'
                  ? 'border-mystical-600 text-mystical-600 dark:border-mystical-400 dark:text-mystical-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('chart.dashas')}
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Chart View */}
          {activeTab === 'chart' && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900 dark:to-orange-900 dark:bg-opacity-20 p-6 rounded-xl shadow-lg">
              <h3 className="text-center text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                {t('chart.northIndian')}
              </h3>
              
              {/* North Indian Chart Layout */}
              <div className="grid grid-cols-4 gap-1 max-w-md mx-auto bg-white dark:bg-gray-800 border-2 border-yellow-600 dark:border-yellow-500 rounded-lg overflow-hidden">
                {/* Chart grid - would be dynamically generated in a real app */}
                {Array.from({ length: 4 }).map((_, rowIndex) => (
                  Array.from({ length: 4 }).map((_, colIndex) => {
                    // Center cells are empty
                    if ((rowIndex === 1 || rowIndex === 2) && (colIndex === 1 || colIndex === 2)) {
                      return (
                        <div 
                          key={`${rowIndex}-${colIndex}`} 
                          className="aspect-square bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30"
                        ></div>
                      );
                    }
                    
                    // Calculate house number based on position
                    let houseNum;
                    if (rowIndex === 0) {
                      houseNum = colIndex === 0 ? 11 : colIndex === 3 ? 2 : colIndex + 1;
                    } else if (rowIndex === 3) {
                      houseNum = colIndex === 0 ? 8 : colIndex === 3 ? 5 : 7 - colIndex;
                    } else if (rowIndex === 1) {
                      houseNum = colIndex === 0 ? 10 : 3;
                    } else {
                      houseNum = colIndex === 0 ? 9 : 4;
                    }
                    
                    // Get planets in this house
                    const planetsInHouse = Object.entries(chart.planets)
                      .filter(([_, planet]) => planet.house === houseNum)
                      .map(([name, _]) => name);
                    
                    const isCornerHouse = [1, 4, 7, 10].includes(houseNum);
                    
                    return (
                      <div 
                        key={`${rowIndex}-${colIndex}`} 
                        className={`aspect-square border border-yellow-600 dark:border-yellow-500 p-1 text-xs ${
                          isCornerHouse 
                            ? 'bg-yellow-200 dark:bg-yellow-800 dark:bg-opacity-50' 
                            : 'bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="font-bold text-yellow-800 dark:text-yellow-300 text-center">
                          {houseNum}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 text-center text-xs">
                          {/* Display zodiac sign abbreviation */}
                          {['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'][houseNum - 1]}
                        </div>
                        <div className="mt-1 space-y-1">
                          {planetsInHouse.map((planet, i) => (
                            <div key={i} className="text-center">
                              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                {planet.slice(0, 2)}
                              </span>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {Math.floor(chart.planets[planet].degree)}°
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ))}
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                <p>
                  {t('chart.ayanamsa')}: {t('chart.lahiri')} ({chart.ayanamsa.toFixed(2)}°)
                </p>
                <p>
                  {t('chart.currentDasha')}: {chart.dasha.currentLord} ({chart.dasha.balance.toFixed(1)} {t('chart.years')})
                </p>
              </div>
            </div>
          )}
          
          {/* Planetary Positions */}
          {activeTab === 'planets' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-750">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('chart.planet')}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('chart.zodiacSign')}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('chart.degree')}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('chart.house')}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('chart.dignity')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(chart.planets).map(([name, planet]) => (
                    <tr key={name} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][planet.sign]}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {planet.degree.toFixed(2)}°
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {planet.house}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          chart.strength[name].dignity === 'Exalted' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : chart.strength[name].dignity === 'Debilitated'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : chart.strength[name].dignity === 'Own'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {chart.strength[name].dignity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Dasha View */}
          {activeTab === 'dashas' && (
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-mystical-600 to-cosmic-600 text-white p-4">
                  <h3 className="text-lg font-bold">{t('chart.vimshottariDasha')}</h3>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {t('chart.currentPeriod')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {chart.dasha.currentLord} Mahadasha
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {chart.dasha.balance.toFixed(1)} {t('chart.years')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('chart.remaining')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
                    <div 
                      className="bg-gradient-to-r from-mystical-600 to-cosmic-600 h-2.5 rounded-full" 
                      style={{ width: `${(chart.dasha.balance / 20) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Premium Feature Notice */}
                  {!userProfile?.isPremium && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start">
                        <Star className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            {t('premium.unlockFeature')}
                          </h4>
                          <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                            {t('premium.dashaDetails')}
                          </p>
                          <button
                            onClick={() => navigate('/premium')}
                            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-gradient-to-r from-mystical-600 to-cosmic-600 hover:from-mystical-700 hover:to-cosmic-700"
                          >
                            {t('premium.upgrade')}
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Analysis Section */}
      <motion.div variants={itemVariants}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-mystical-600 dark:text-mystical-400" />
              {t('analysis.title')}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {analysis && analysis.length > 0 ? (
              analysis.map((item, index) => (
                <div key={index} className="px-6 py-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCategory(item.category)}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-3" 
                        style={{ 
                          backgroundColor: `hsl(${(index * 50) % 360}, 70%, 60%)` 
                        }}
                      ></div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        {item.category}
                      </h3>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t('analysis.strength')}
                        </div>
                        <div className="font-medium text-sm">
                          {item.strength}%
                        </div>
                      </div>
                      {expandedCategory === item.category ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedCategory === item.category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pl-5 border-l-2 border-gray-200 dark:border-gray-700">
                          <div className="mb-3">
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              {t('analysis.insight')}
                            </h4>
                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                              {item.insight}
                            </p>
                          </div>
                          
                          <div className="mb-3">
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              {t('analysis.remedy')}
                            </h4>
                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                              {item.remedy}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                {t('analysis.timing')}
                              </h4>
                              <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                                {item.timing}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                {t('analysis.gemstone')}
                              </h4>
                              <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                                {item.gemstone}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                {t('analysis.mantra')}
                              </h4>
                              <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 font-vedic">
                                {item.mantra}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <BarChart2 className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('analysis.noData')}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Save Chart Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('chart.saveChart')}
            </h3>
            
            <div className="mb-4">
              <label htmlFor="chartName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('chart.chartName')}
              </label>
              <input
                type="text"
                id="chartName"
                value={chartName}
                onChange={(e) => setChartName(e.target.value)}
                placeholder={`Chart - ${birthData.place} - ${birthData.date}`}
                className="input-field"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
              >
                {t('common.cancel')}
              </button>
              
              <button
                onClick={handleSaveChart}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mystical-600 hover:bg-mystical-700"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChartAnalysis;
