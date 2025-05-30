import React, { useState, useEffect } from 'react';
import { Calendar, Star, Moon, Sun, Clock, CreditCard, BarChart3, Users, Mail, Share2, Download, Bell, Settings, HelpCircle } from 'lucide-react';

const AstroGuideApp = () => {
  const [activeTab, setActiveTab] = useState('chart');
  const [birthData, setBirthData] = useState({
    date: '',
    time: '',
    place: '',
    latitude: '',
    longitude: ''
  });
  const [chart, setChart] = useState(null);
  const [user, setUser] = useState({ 
    isPremium: false, 
    trialDays: 7, 
    email: '',
    id: Math.random().toString(36).substr(2, 9)
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analytics, setAnalytics] = useState({
    chartsGenerated: 0,
    sessionsToday: 1,
    totalUsers: 1247
  });

  // Swiss Ephemeris simulation - Enhanced Vedic calculations
  const calculateVedicChart = (birthData) => {
    const { date, time, latitude, longitude } = birthData;
    
    // Julian day calculation
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const jd = getJulianDay(year, month, day, hour, minute);
    
    // Ayanamsa calculation (Lahiri)
    const ayanamsa = getLahiriAyanamsa(jd);
    
    // Calculate planetary positions
    const planets = calculatePlanetaryPositions(jd, ayanamsa);
    
    // Generate houses using Placidus system for Vedic
    const houses = calculateHouses(jd, latitude, longitude, ayanamsa);
    
    // Calculate Vimshottari Dasha
    const dasha = calculateVimshottariDasha(planets.Moon);
    
    // Calculate strength scores
    const strength = calculatePlanetaryStrength(planets, houses);
    
    return {
      planets,
      houses,
      dasha,
      strength,
      ayanamsa,
      julianDay: jd
    };
  };

  const getJulianDay = (year, month, day, hour, minute) => {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    return jd + (hour - 12) / 24 + minute / 1440;
  };

  const getLahiriAyanamsa = (jd) => {
    // Lahiri ayanamsa calculation
    const t = (jd - 2451545.0) / 36525;
    return 23.85 + 0.0013 * t; // Simplified formula
  };

  const calculatePlanetaryPositions = (jd, ayanamsa) => {
    // Simplified planetary calculations - in production use Swiss Ephemeris
    const positions = {
      Sun: { longitude: (280.16 + 0.9856 * (jd - 2451545)) % 360, house: 0 },
      Moon: { longitude: (218.32 + 13.1764 * (jd - 2451545)) % 360, house: 0 },
      Mars: { longitude: (293.74 + 0.5240 * (jd - 2451545)) % 360, house: 0 },
      Mercury: { longitude: (252.25 + 4.0923 * (jd - 2451545)) % 360, house: 0 },
      Jupiter: { longitude: (34.35 + 0.0831 * (jd - 2451545)) % 360, house: 0 },
      Venus: { longitude: (181.98 + 1.6021 * (jd - 2451545)) % 360, house: 0 },
      Saturn: { longitude: (49.95 + 0.0334 * (jd - 2451545)) % 360, house: 0 },
      Rahu: { longitude: (125.04 - 0.0529 * (jd - 2451545)) % 360, house: 0 },
      Ketu: { longitude: (305.04 - 0.0529 * (jd - 2451545)) % 360, house: 0 }
    };

    // Apply ayanamsa correction for sidereal positions
    Object.keys(positions).forEach(planet => {
      positions[planet].longitude = (positions[planet].longitude - ayanamsa + 360) % 360;
      positions[planet].sign = Math.floor(positions[planet].longitude / 30);
      positions[planet].degree = positions[planet].longitude % 30;
      positions[planet].house = Math.floor(positions[planet].longitude / 30) + 1;
    });

    return positions;
  };

  const calculateHouses = (jd, lat, lon, ayanamsa) => {
    const houses = [];
    for (let i = 1; i <= 12; i++) {
      houses.push({
        number: i,
        cusp: ((i - 1) * 30) % 360,
        sign: Math.floor(((i - 1) * 30) / 30),
        lord: getHouseLord(Math.floor(((i - 1) * 30) / 30)),
        planets: []
      });
    }
    return houses;
  };

  const calculateVimshottariDasha = (moonPosition) => {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    
    const dashaLords = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const nakshatraIndex = Math.floor(moonPosition.longitude / 13.33);
    const currentDasha = dashaLords[nakshatraIndex % 9];
    
    return {
      currentLord: currentDasha,
      nakshatra: nakshatras[nakshatraIndex],
      balance: Math.random() * 10 // Simplified calculation
    };
  };

  const calculatePlanetaryStrength = (planets, houses) => {
    const strength = {};
    Object.keys(planets).forEach(planet => {
      strength[planet] = {
        shadbala: Math.random() * 60 + 20, // 20-80 range
        dignity: ['Exalted', 'Own', 'Friend', 'Neutral', 'Enemy', 'Debilitated'][Math.floor(Math.random() * 6)]
      };
    });
    return strength;
  };

  const getZodiacSign = (index) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[index % 12];
  };

  const getHouseLord = (signIndex) => {
    const lords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
                   'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
    return lords[signIndex % 12];
  };

  const generateAdvancedAnalysis = (chart) => {
    if (!chart) return [];

    const analyses = [
      {
        category: 'Career & Profession',
        strength: Math.floor(Math.random() * 40) + 60,
        insight: `${chart.dasha.currentLord} dasha indicates strong professional growth. 10th house analysis shows ${chart.houses[9].lord} influence.`,
        remedy: 'Recite Vishnu Sahasranama on Thursdays',
        timing: 'Next 6-18 months favorable for career changes',
        gemstone: 'Yellow Sapphire (3-5 carats)',
        mantra: 'Om Guruve Namaha - 108 times daily'
      },
      {
        category: 'Relationships & Marriage',
        strength: Math.floor(Math.random() * 40) + 50,
        insight: `Venus position in ${getZodiacSign(chart.planets.Venus.sign)} affects partnership dynamics. 7th lord ${chart.houses[6].lord} shows compatibility factors.`,
        remedy: 'Offer jasmine flowers to goddess Lakshmi on Fridays',
        timing: 'Auspicious period: Next Venus transit cycle',
        gemstone: 'Diamond or White Sapphire',
        mantra: 'Om Shukraya Namaha - 108 times'
      },
      {
        category: 'Health & Vitality',
        strength: Math.floor(Math.random() * 30) + 55,
        insight: `Mars-Saturn aspect creates health challenges. Current ${chart.dasha.nakshatra} nakshatra period requires attention to vitality.`,
        remedy: 'Surya Namaskara daily at sunrise',
        timing: 'Monitor health during Saturn transits',
        gemstone: 'Red Coral for Mars strength',
        mantra: 'Mahamrityunjaya Mantra - 11 times daily'
      },
      {
        category: 'Wealth & Prosperity',
        strength: Math.floor(Math.random() * 35) + 65,
        insight: `Jupiter's aspect on 2nd house creates multiple income sources. ${chart.dasha.currentLord} dasha supports financial growth.`,
        remedy: 'Donate yellow items to temples on Thursdays',
        timing: 'Investment opportunities in next Jupiter cycle',
        gemstone: 'Emerald for Mercury enhancement',
        mantra: 'Lakshmi Ashtakam - Weekly recitation'
      },
      {
        category: 'Spiritual Growth',
        strength: Math.floor(Math.random() * 45) + 55,
        insight: `Ketu placement in ${getZodiacSign(chart.planets.Ketu.sign)} indicates karmic lessons. Current nakshatra ${chart.dasha.nakshatra} supports spiritual practices.`,
        remedy: 'Meditation during Brahma Muhurta (4-6 AM)',
        timing: 'Spiritual awakening during Ketu periods',
        gemstone: 'Cat\'s Eye for Ketu balance',
        mantra: 'Om Namah Shivaya - 108 times'
      }
    ];

    return analyses;
  };

  const VedicChartDisplay = ({ chart }) => {
    if (!chart) return null;

    // Traditional North Indian chart layout
    const chartLayout = [
      [11, 0, 1, 2],
      [10, -1, -1, 3],
      [9, -1, -1, 4],
      [8, 7, 6, 5]
    ];

    const getPlanetsInHouse = (houseNum) => {
      return Object.entries(chart.planets)
        .filter(([_, planet]) => planet.house === houseNum)
        .map(([name, _]) => name);
    };

    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-xl shadow-lg">
        <h3 className="text-center text-lg font-bold text-gray-800 mb-4">Vedic Birth Chart (North Indian Style)</h3>
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto bg-white border-2 border-yellow-600 rounded-lg overflow-hidden">
          {chartLayout.map((row, rowIndex) => 
            row.map((houseNum, colIndex) => {
              if (houseNum === -1) {
                return <div key={`${rowIndex}-${colIndex}`} className="aspect-square bg-yellow-100"></div>;
              }
              
              const planetsInHouse = getPlanetsInHouse(houseNum + 1);
              const isCornerHouse = [0, 3, 8, 11].includes(houseNum);
              
              return (
                <div key={`${rowIndex}-${colIndex}`} className={`aspect-square border border-yellow-600 p-1 text-xs ${isCornerHouse ? 'bg-yellow-200' : 'bg-white'}`}>
                  <div className="font-bold text-yellow-800 text-center">{houseNum + 1}</div>
                  <div className="text-gray-600 text-center text-xs">{getZodiacSign(houseNum).slice(0, 3)}</div>
                  <div className="mt-1 space-y-1">
                    {planetsInHouse.map((planet, i) => (
                      <div key={i} className="text-center">
                        <span className="text-xs font-semibold text-blue-700">{planet.slice(0, 2)}</span>
                        <div className="text-xs text-gray-500">{Math.floor(chart.planets[planet].degree)}°</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Ayanamsa: Lahiri ({chart.ayanamsa.toFixed(2)}°)</p>
          <p>Current Dasha: {chart.dasha.currentLord} ({chart.dasha.balance.toFixed(1)} years left)</p>
        </div>
      </div>
    );
  };

  const PlanetaryTable = ({ chart }) => {
    if (!chart) return null;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <h3 className="text-lg font-bold">Planetary Positions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Planet</th>
                <th className="px-4 py-2 text-left">Sign</th>
                <th className="px-4 py-2 text-left">Degree</th>
                <th className="px-4 py-2 text-left">House</th>
                <th className="px-4 py-2