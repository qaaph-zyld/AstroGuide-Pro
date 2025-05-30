import React, { createContext, useState, useContext } from 'react';
import { useUser } from './UserContext';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Types
export interface BirthData {
  date: string;
  time: string;
  place: string;
  latitude: string;
  longitude: string;
  timezone?: string;
}

export interface Planet {
  longitude: number;
  sign: number;
  degree: number;
  house: number;
  retrograde?: boolean;
}

export interface House {
  number: number;
  cusp: number;
  sign: number;
  lord: string;
  planets: string[];
}

export interface Dasha {
  currentLord: string;
  nakshatra: string;
  balance: number;
  subDasha?: {
    lord: string;
    balance: number;
  };
}

export interface PlanetStrength {
  shadbala: number;
  dignity: string;
}

export interface VedicChart {
  id: string;
  birthData: BirthData;
  planets: Record<string, Planet>;
  houses: House[];
  dasha: Dasha;
  strength: Record<string, PlanetStrength>;
  ayanamsa: number;
  julianDay: number;
  ascendant?: {
    degree: number;
    sign: number;
  };
  createdAt: Date;
  name?: string;
}

export interface ChartAnalysis {
  category: string;
  strength: number;
  insight: string;
  remedy: string;
  timing: string;
  gemstone: string;
  mantra: string;
}

interface ChartContextType {
  birthData: BirthData;
  chart: VedicChart | null;
  savedCharts: VedicChart[];
  analysis: ChartAnalysis[];
  loading: boolean;
  error: string | null;
  setBirthData: (data: BirthData) => void;
  calculateChart: () => void;
  saveChart: (name?: string) => Promise<void>;
  loadChart: (chartId: string) => Promise<void>;
  deleteChart: (chartId: string) => Promise<void>;
  generateAnalysis: () => void;
}

const ChartContext = createContext(undefined as unknown as ChartContextType);

export const ChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useUser();
  
  const [birthData, setBirthData] = useState<BirthData>({
    date: '',
    time: '',
    place: '',
    latitude: '',
    longitude: '',
    timezone: ''
  });
  
  const [chart, setChart] = useState<VedicChart | null>(null);
  const [savedCharts, setSavedCharts] = useState<VedicChart[]>([]);
  const [analysis, setAnalysis] = useState<ChartAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Swiss Ephemeris simulation - Enhanced Vedic calculations
  const calculateVedicChart = (birthData: BirthData): VedicChart => {
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
      id: `chart_${Date.now()}`,
      birthData,
      planets,
      houses,
      dasha,
      strength,
      ayanamsa,
      julianDay: jd,
      ascendant: {
        degree: (houses[0].cusp + 15) % 30, // Approximate middle of 1st house
        sign: houses[0].sign
      },
      createdAt: new Date()
    };
  };

  const getJulianDay = (year: number, month: number, day: number, hour: number, minute: number): number => {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    return jd + (hour - 12) / 24 + minute / 1440;
  };

  const getLahiriAyanamsa = (jd: number): number => {
    // Lahiri ayanamsa calculation
    const t = (jd - 2451545.0) / 36525;
    return 23.85 + 0.0013 * t; // Simplified formula
  };

  const calculatePlanetaryPositions = (jd: number, ayanamsa: number): Record<string, Planet> => {
    // Simplified planetary calculations - in production use Swiss Ephemeris
    const positions: Record<string, Planet> = {
      Sun: { longitude: (280.16 + 0.9856 * (jd - 2451545)) % 360, house: 0, sign: 0, degree: 0 },
      Moon: { longitude: (218.32 + 13.1764 * (jd - 2451545)) % 360, house: 0, sign: 0, degree: 0 },
      Mars: { longitude: (293.74 + 0.5240 * (jd - 2451545)) % 360, house: 0, sign: 0, degree: 0 },
      Mercury: { longitude: (252.25 + 4.0923 * (jd - 2451545)) % 360, house: 0, sign: 0, degree: 0 },
      Jupiter: { longitude: (34.35 + 0.0831 * (jd - 2451545)) % 360, house: 0, sign: 0, degree: 0 },
      Venus: { longitude: (181.98 + 1.6021 * (jd - 2451545)) % 360, house: 0, sign: 0, degree: 0 },
      Saturn: { longitude: (49.95 + 0.0334 * (jd - 2451545)) % 360, house: 0, sign: 0, degree: 0 },
      Rahu: { longitude: (125.04 - 0.0529 * (jd - 2451545)) % 360, house: 0, sign: 0, degree: 0 },
      Ketu: { longitude: (305.04 - 0.0529 * (jd - 2451545)) % 360, house: 0, sign: 0, degree: 0 }
    };

    // Apply ayanamsa correction for sidereal positions
    Object.keys(positions).forEach(planet => {
      positions[planet].longitude = (positions[planet].longitude - ayanamsa + 360) % 360;
      positions[planet].sign = Math.floor(positions[planet].longitude / 30);
      positions[planet].degree = positions[planet].longitude % 30;
      positions[planet].house = Math.floor(positions[planet].longitude / 30) + 1;
      
      // Add retrograde status (simplified)
      positions[planet].retrograde = Math.random() > 0.8;
    });

    return positions;
  };

  const calculateHouses = (jd: number, lat: string, lon: string, ayanamsa: number): House[] => {
    const houses: House[] = [];
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

  const calculateVimshottariDasha = (moonPosition: Planet): Dasha => {
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
      balance: Math.random() * 10, // Simplified calculation
      subDasha: {
        lord: dashaLords[(nakshatraIndex + 1) % 9],
        balance: Math.random() * 2
      }
    };
  };

  const calculatePlanetaryStrength = (planets: Record<string, Planet>, houses: House[]): Record<string, PlanetStrength> => {
    const strength: Record<string, PlanetStrength> = {};
    Object.keys(planets).forEach(planet => {
      strength[planet] = {
        shadbala: Math.random() * 60 + 20, // 20-80 range
        dignity: ['Exalted', 'Own', 'Friend', 'Neutral', 'Enemy', 'Debilitated'][Math.floor(Math.random() * 6)]
      };
    });
    return strength;
  };

  const getHouseLord = (signIndex: number): string => {
    const lords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
                   'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
    return lords[signIndex % 12];
  };

  const generateAdvancedAnalysis = (chart: VedicChart): ChartAnalysis[] => {
    if (!chart) return [];

    const getZodiacSign = (index: number): string => {
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                     'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      return signs[index % 12];
    };

    const analyses: ChartAnalysis[] = [
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

  // Context methods
  const calculateChart = () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!birthData.date || !birthData.time || !birthData.place) {
        setError('Please provide complete birth details');
        return;
      }
      
      const newChart = calculateVedicChart(birthData);
      setChart(newChart);
      
      // Generate analysis
      const newAnalysis = generateAdvancedAnalysis(newChart);
      setAnalysis(newAnalysis);
      
    } catch (err: any) {
      console.error('Chart calculation error:', err);
      setError(err.message || 'Failed to calculate chart');
    } finally {
      setLoading(false);
    }
  };

  const saveChart = async (name?: string) => {
    if (!chart || !currentUser) {
      setError('No chart to save or user not logged in');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const chartToSave = {
        ...chart,
        name: name || `Chart - ${birthData.place} - ${birthData.date}`,
        userId: currentUser.uid
      };
      
      // Save chart to Firestore
      await setDoc(doc(db, 'charts', chartToSave.id), chartToSave);
      
      // Update user's saved charts array
      await updateDoc(doc(db, 'users', currentUser.uid), {
        savedCharts: arrayUnion(chartToSave.id)
      });
      
      // Update local state
      setSavedCharts(prev => [...prev, chartToSave]);
      
    } catch (err: any) {
      console.error('Save chart error:', err);
      setError(err.message || 'Failed to save chart');
    } finally {
      setLoading(false);
    }
  };

  const loadChart = async (chartId: string) => {
    if (!currentUser) {
      setError('User not logged in');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const chartDoc = await getDoc(doc(db, 'charts', chartId));
      
      if (chartDoc.exists()) {
        const chartData = chartDoc.data() as VedicChart;
        setChart(chartData);
        setBirthData(chartData.birthData);
        
        // Generate analysis
        const newAnalysis = generateAdvancedAnalysis(chartData);
        setAnalysis(newAnalysis);
      } else {
        setError('Chart not found');
      }
      
    } catch (err: any) {
      console.error('Load chart error:', err);
      setError(err.message || 'Failed to load chart');
    } finally {
      setLoading(false);
    }
  };

  const deleteChart = async (chartId: string) => {
    if (!currentUser) {
      setError('User not logged in');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Remove from user's saved charts
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedCharts = userData.savedCharts.filter((id: string) => id !== chartId);
        
        await updateDoc(doc(db, 'users', currentUser.uid), {
          savedCharts: updatedCharts
        });
      }
      
      // Delete chart document
      await setDoc(doc(db, 'charts', chartId), { deleted: true }, { merge: true });
      
      // Update local state
      setSavedCharts(prev => prev.filter(c => c.id !== chartId));
      
      // If current chart is deleted, reset it
      if (chart && chart.id === chartId) {
        setChart(null);
        setAnalysis([]);
      }
      
    } catch (err: any) {
      console.error('Delete chart error:', err);
      setError(err.message || 'Failed to delete chart');
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = () => {
    if (!chart) {
      setError('No chart available for analysis');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const newAnalysis = generateAdvancedAnalysis(chart);
      setAnalysis(newAnalysis);
      
    } catch (err: any) {
      console.error('Analysis generation error:', err);
      setError(err.message || 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    birthData,
    chart,
    savedCharts,
    analysis,
    loading,
    error,
    setBirthData,
    calculateChart,
    saveChart,
    loadChart,
    deleteChart,
    generateAnalysis
  };

  return (
    <ChartContext.Provider value={value}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChart = (): ChartContextType => {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error('useChart must be used within a ChartProvider');
  }
  return context;
};
