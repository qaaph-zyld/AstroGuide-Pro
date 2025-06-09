import React, { useState } from 'react';
import { BirthChart, CelestialBody, ZodiacSign, House, PlanetaryAspect } from '../astrology/models/types';

interface BirthChartDisplayProps {
  chart: BirthChart;
}

const BirthChartDisplay: React.FC<BirthChartDisplayProps> = ({ chart }) => {
  const [activeTab, setActiveTab] = useState('chart' as 'chart' | 'planets' | 'houses' | 'aspects');
  
  // Helper function to format degrees as degrees, minutes, seconds
  const formatDegree = (degree: number): string => {
    const degrees = Math.floor(degree);
    const minutesDecimal = (degree - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.round((minutesDecimal - minutes) * 60);
    
    return `${degrees}° ${minutes}' ${seconds}"`;
  };
  
  // Helper function to get planet symbol
  const getPlanetSymbol = (planet: CelestialBody): string => {
    const symbols: Record<CelestialBody, string> = {
      [CelestialBody.SUN]: '☉',
      [CelestialBody.MOON]: '☽',
      [CelestialBody.MERCURY]: '☿',
      [CelestialBody.VENUS]: '♀',
      [CelestialBody.MARS]: '♂',
      [CelestialBody.JUPITER]: '♃',
      [CelestialBody.SATURN]: '♄',
      [CelestialBody.RAHU]: '☊',
      [CelestialBody.KETU]: '☋',
    };
    
    return symbols[planet] || '';
  };
  
  // Helper function to get zodiac symbol
  const getZodiacSymbol = (sign: ZodiacSign): string => {
    const symbols: Record<ZodiacSign, string> = {
      [ZodiacSign.ARIES]: '♈',
      [ZodiacSign.TAURUS]: '♉',
      [ZodiacSign.GEMINI]: '♊',
      [ZodiacSign.CANCER]: '♋',
      [ZodiacSign.LEO]: '♌',
      [ZodiacSign.VIRGO]: '♍',
      [ZodiacSign.LIBRA]: '♎',
      [ZodiacSign.SCORPIO]: '♏',
      [ZodiacSign.SAGITTARIUS]: '♐',
      [ZodiacSign.CAPRICORN]: '♑',
      [ZodiacSign.AQUARIUS]: '♒',
      [ZodiacSign.PISCES]: '♓',
    };
    
    return symbols[sign] || '';
  };
  
  // Helper function to get aspect symbol
  const getAspectSymbol = (aspect: PlanetaryAspect): string => {
    const symbols: Record<string, string> = {
      'Conjunction': '☌',
      'Opposition': '☍',
      'Trine': '△',
      'Square': '□',
      'Sextile': '⚹',
    };
    
    return symbols[aspect.aspect] || '';
  };
  
  // Render chart summary
  const renderChartSummary = () => {
    const { birthData, ascendant } = chart;
    const date = new Date(birthData.date);
    
    return (
      <div className="space-y-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">Birth Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Name:</span> {birthData.name || 'Not provided'}</p>
              <p><span className="font-medium">Date:</span> {date.toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {birthData.time}</p>
            </div>
            <div>
              <p><span className="font-medium">Location:</span> {birthData.location}</p>
              <p><span className="font-medium">Coordinates:</span> {birthData.latitude.toFixed(4)}°, {birthData.longitude.toFixed(4)}°</p>
              <p><span className="font-medium">Timezone:</span> {birthData.timezone}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">Ascendant</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getZodiacSymbol(ascendant.sign)}</span>
            <div>
              <p><span className="font-medium">Sign:</span> {ascendant.sign}</p>
              <p><span className="font-medium">Degree:</span> {formatDegree(ascendant.degree)}</p>
              <p><span className="font-medium">Nakshatra:</span> {ascendant.nakshatra} (Pada {ascendant.nakshatraPada})</p>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">Chart Highlights</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Sun Sign:</span> {chart.planetPositions.find(p => p.planet === CelestialBody.SUN)?.sign}</p>
            <p><span className="font-medium">Moon Sign:</span> {chart.planetPositions.find(p => p.planet === CelestialBody.MOON)?.sign}</p>
            <p><span className="font-medium">Rising Sign:</span> {ascendant.sign}</p>
            <p><span className="font-medium">Retrograde Planets:</span> {chart.planetPositions.filter(p => p.isRetrograde).map(p => p.planet).join(', ') || 'None'}</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Render planets tab
  const renderPlanetsTab = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Planet</th>
              <th className="py-2 px-4 border-b text-left">Sign</th>
              <th className="py-2 px-4 border-b text-left">House</th>
              <th className="py-2 px-4 border-b text-left">Degree</th>
              <th className="py-2 px-4 border-b text-left">Nakshatra</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {chart.planetPositions.map((position, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getPlanetSymbol(position.planet)}</span>
                    <span>{position.planet}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getZodiacSymbol(position.sign)}</span>
                    <span>{position.sign}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">{position.house}</td>
                <td className="py-2 px-4 border-b">{formatDegree(position.degree)}</td>
                <td className="py-2 px-4 border-b">{position.nakshatra} (Pada {position.nakshatraPada})</td>
                <td className="py-2 px-4 border-b">
                  {position.isRetrograde && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Retrograde
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render houses tab
  const renderHousesTab = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">House</th>
              <th className="py-2 px-4 border-b text-left">Sign</th>
              <th className="py-2 px-4 border-b text-left">Degree</th>
              <th className="py-2 px-4 border-b text-left">Planets</th>
            </tr>
          </thead>
          <tbody>
            {chart.houses.map((house, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-2 px-4 border-b">{house.house}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getZodiacSymbol(house.sign)}</span>
                    <span>{house.sign}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">{formatDegree(house.degree)}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex flex-wrap gap-2">
                    {house.planets.map((planet, i) => (
                      <div key={i} className="flex items-center space-x-1">
                        <span className="text-lg">{getPlanetSymbol(planet)}</span>
                        <span>{planet}</span>
                      </div>
                    ))}
                    {house.planets.length === 0 && <span className="text-gray-500">None</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render aspects tab
  const renderAspectsTab = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Planet 1</th>
              <th className="py-2 px-4 border-b text-left">Aspect</th>
              <th className="py-2 px-4 border-b text-left">Planet 2</th>
              <th className="py-2 px-4 border-b text-left">Orb</th>
              <th className="py-2 px-4 border-b text-left">Strength</th>
            </tr>
          </thead>
          <tbody>
            {chart.aspects.map((aspect, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getPlanetSymbol(aspect.planet1)}</span>
                    <span>{aspect.planet1}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getAspectSymbol(aspect)}</span>
                    <span>{aspect.aspect}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getPlanetSymbol(aspect.planet2)}</span>
                    <span>{aspect.planet2}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">{aspect.orb.toFixed(2)}°</td>
                <td className="py-2 px-4 border-b">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${aspect.strength}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{Math.round(aspect.strength)}%</span>
                </td>
              </tr>
            ))}
            {chart.aspects.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No aspects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Birth Chart</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('chart')}
            className={`${
              activeTab === 'chart'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Chart Summary
          </button>
          <button
            onClick={() => setActiveTab('planets')}
            className={`${
              activeTab === 'planets'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Planets
          </button>
          <button
            onClick={() => setActiveTab('houses')}
            className={`${
              activeTab === 'houses'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Houses
          </button>
          <button
            onClick={() => setActiveTab('aspects')}
            className={`${
              activeTab === 'aspects'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Aspects
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'chart' && renderChartSummary()}
        {activeTab === 'planets' && renderPlanetsTab()}
        {activeTab === 'houses' && renderHousesTab()}
        {activeTab === 'aspects' && renderAspectsTab()}
      </div>
    </div>
  );
};

export default BirthChartDisplay;
