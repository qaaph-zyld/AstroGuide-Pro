/**
 * Astronomy Engine integration for AstroGuide Pro
 * Provides accurate astronomical calculations for planetary positions
 */

import { 
  Body, 
  EclipticLongitude, 
  MakeTime, 
  MoonPhase,
  Equator, 
  Observer, 
  HorizontalCoordinates,
  Horizon,
  SiderealTime
} from 'astronomy-engine';
import { CelestialBody, ZodiacSign, Nakshatra } from '../models/types';
import { longitudeToZodiacPosition, longitudeToNakshatra } from './astroMath';

// No initialization needed for astronomy-engine
const initializeEphemeris = async () => {
  // No initialization required
  return Promise.resolve();
};

// Map our celestial bodies to Astronomy Engine constants
const bodyToAstronomyEngineBody = (body: CelestialBody): Body => {
  const mapping: Record<CelestialBody, Body> = {
    [CelestialBody.SUN]: Body.Sun,
    [CelestialBody.MOON]: Body.Moon,
    [CelestialBody.MERCURY]: Body.Mercury,
    [CelestialBody.VENUS]: Body.Venus,
    [CelestialBody.MARS]: Body.Mars,
    [CelestialBody.JUPITER]: Body.Jupiter,
    [CelestialBody.SATURN]: Body.Saturn,
    [CelestialBody.URANUS]: Body.Uranus,
    [CelestialBody.NEPTUNE]: Body.Neptune,
    [CelestialBody.PLUTO]: Body.Pluto,
    // Special cases that need custom handling
    [CelestialBody.RAHU]: Body.Moon, // We'll calculate Rahu separately
    [CelestialBody.KETU]: Body.Moon // We'll calculate Ketu separately
  };
  return mapping[body];
};



/**
 * Calculate Julian Day Number from date and time
 * @param year - Year (e.g., 1987)
 * @param month - Month (1-12)
 * @param day - Day (1-31)
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @param second - Second (0-59)
 * @returns Julian Day Number
 */
export const calculateJulianDay = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number
): number => {
  const date = new Date(year, month - 1, day, hour, minute, second);
  const astroTime = MakeTime(date);
  return astroTime.tt; // Return the Terrestrial Time as Julian Day
};

/**
 * Parse ISO date string and time string to Julian Day
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param timeString - Time string (HH:MM or HH:MM:SS)
 * @returns Julian Day Number
 */
export const parseDateTime = (
  dateString: string,
  timeString: string
): number => {
  // Parse date
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Parse time
  const [hour, minute, second = 0] = timeString.split(':').map(Number);
  
  const date = new Date(year, month - 1, day, hour, minute, second);
  const astroTime = MakeTime(date);
  return astroTime.tt; // Return the Terrestrial Time as Julian Day
};

/**
 * Calculate planetary positions
 * @param julianDay - Julian Day Number
 * @returns Record of celestial body to longitude
 */
export const calculatePlanetaryPositions = async (
  julianDay: number
): Promise<Record<CelestialBody, number>> => {
  const positions: Partial<Record<CelestialBody, number>> = {};

  // Calculate positions for standard planets
  for (const body of Object.values(CelestialBody)) {
    if (body === CelestialBody.KETU || body === CelestialBody.RAHU) continue;
    const result = await calculatePlanetaryPosition(julianDay, body as CelestialBody);
    positions[body] = result.longitude;
  }

  // Calculate Rahu (North Node) - approximated using Moon's orbit
  const moonPhase = MoonPhase(MakeTime(new Date(julianDay * 86400000)));
  positions[CelestialBody.RAHU] = (moonPhase + 90) % 360; // Approximation for North Node

  // Calculate Ketu (180 degrees opposite to Rahu)
  positions[CelestialBody.KETU] = (positions[CelestialBody.RAHU] + 180) % 360;

  return positions as Record<CelestialBody, number>;
};

/**
 * Calculate ascendant
 * @param julianDay - Julian Day Number
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns Ascendant longitude
 */
export const calculateAscendant = async (
  julianDay: number,
  latitude: number,
  longitude: number
): Promise<number> => {
  // Convert Julian Day to astronomy-engine time
  const date = new Date(julianDay * 86400000);
  const time = MakeTime(date);
  
  // Create observer at the specified location
  const observer = new Observer(latitude, longitude, 0);
  
  // Calculate local sidereal time and adjust for longitude
  const siderealTime = SiderealTime(time); // Get hours from SiderealTime object
  const localSiderealTime = (siderealTime + longitude / 15) % 24; // Adjust for longitude (degrees to hours)
  
  // Calculate ascendant (approximation)
  const ascendant = (localSiderealTime * 15) % 360; // Convert hours to degrees
  
  return ascendant;
};

/**
 * Calculate house cusps
 * @param julianDay - Julian Day Number
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns Array of house cusp longitudes (12 houses)
 */
export const calculateHouseCusps = async (
  julianDay: number,
  latitude: number,
  longitude: number
): Promise<number[]> => {
  // Convert Julian Day to astronomy-engine time
  const date = new Date(julianDay * 86400000);
  const time = MakeTime(date);
  
  // Create observer at the specified location
  const observer = new Observer(latitude, longitude, 0);
  
  // Calculate local sidereal time and adjust for longitude
  const siderealTime = SiderealTime(time); // Get hours from SiderealTime object
  const localSiderealTime = (siderealTime + longitude / 15) % 24; // Adjust for longitude (degrees to hours)
  
  // Calculate house cusps (approximation using equal house system)
  const ascendant = (localSiderealTime * 15) % 360; // Convert hours to degrees
  
  // Generate 12 equal houses
  const houseCusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    houseCusps.push((ascendant + i * 30) % 360);
  }
  
  return houseCusps;
};

/**
 * Calculate all positions for a birth chart
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param timeString - Time string (HH:MM or HH:MM:SS)
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns Object containing planetary positions, ascendant, and house cusps
 */
export const calculateAllPositions = async (
  dateString: string,
  timeString: string,
  latitude: number,
  longitude: number
): Promise<{
  planets: Record<CelestialBody, number>;
  ascendant: number;
  houseCusps: number[];
  zodiacPositions: Record<CelestialBody, { sign: ZodiacSign; degrees: number }>;
  nakshatras: Record<CelestialBody, Nakshatra>;
  isRetrograde: Record<CelestialBody, boolean>;
}> => {
  // Calculate Julian Day
  const julianDay = parseDateTime(dateString, timeString);

  // No initialization needed for astronomy-engine

  // Calculate ascendant
  const ascendant = await calculateAscendant(julianDay, latitude, longitude);

  // Calculate house cusps
  const houseCusps = await calculateHouseCusps(julianDay, latitude, longitude);

  // Calculate zodiac positions
  const zodiacPositions: Record<CelestialBody, { sign: ZodiacSign; degrees: number }> = {} as any;
  const nakshatras: Record<CelestialBody, Nakshatra> = {} as any;
  const isRetrograde: Record<CelestialBody, boolean> = {} as any;
  const planets: Record<CelestialBody, number> = {} as any;

  // Calculate planetary positions, zodiac positions, and nakshatras in a single loop
  for (const body of Object.values(CelestialBody)) {
    // Get planetary position and retrograde status in a single call
    const planetInfo = await calculatePlanetaryPosition(julianDay, body as CelestialBody);
    const longitude = planetInfo.longitude;
    
    // Store the longitude and retrograde status
    planets[body] = longitude;
    isRetrograde[body] = planetInfo.isRetrograde;
    
    // Convert from astroMath's return type to our expected type
    const zodiacPos = longitudeToZodiacPosition(longitude, julianDay);
    zodiacPositions[body] = {
      sign: Object.values(ZodiacSign)[zodiacPos.signIndex],
      degrees: zodiacPos.degree
    };
    
    // Convert from astroMath's return type to our expected type
    const nakshatra = longitudeToNakshatra(longitude, julianDay);
    nakshatras[body] = Object.values(Nakshatra)[nakshatra.nakshatraIndex];
  }

  return {
    planets,
    ascendant,
    houseCusps,
    zodiacPositions,
    nakshatras,
    isRetrograde
  };
};

/**
 * Calculate planetary position using Astronomy Engine
 * @param julianDay - Julian Day Number
 * @param body - Celestial body to calculate
 * @returns Longitude in degrees (0-360)
 */
export const calculatePlanetaryPosition = async (
  julianDay: number,
  body: CelestialBody
): Promise<{ longitude: number; isRetrograde: boolean }> => {
  // Special cases for nodes and Lilith
  if (body === CelestialBody.KETU) {
    // Calculate Rahu (North Node) first
    const rahuResult = await calculatePlanetaryPosition(julianDay, CelestialBody.RAHU);
    // Ketu is 180 degrees opposite to Rahu
    return {
      longitude: (rahuResult.longitude + 180) % 360,
      isRetrograde: false // Nodes are always direct in this implementation
    };
  }
  
  if (body === CelestialBody.RAHU) {
    // Approximate North Node using Moon's phase
    const date = new Date(julianDay * 86400000);
    const time = MakeTime(date);
    const moonPhase = MoonPhase(time);
    return {
      longitude: (moonPhase + 90) % 360, // Approximation
      isRetrograde: false // Nodes are always direct in this implementation
    };
  }
  


  // Calculate planetary position using Astronomy Engine
  const astronomyBody = bodyToAstronomyEngineBody(body);
  const date = new Date(julianDay * 86400000);
  const time = MakeTime(date);
  
  // Get ecliptic longitude
  const longitude = EclipticLongitude(astronomyBody, time);
  
  // Note: Astronomy Engine doesn't provide direct retrograde information
  // We would need to calculate it by comparing positions over time
  // For simplicity, we'll assume all planets are direct
  return {
    longitude,
    isRetrograde: false
  };
};



export default {
  initializeEphemeris,
  calculateJulianDay,
  parseDateTime,
  calculatePlanetaryPosition,
  calculateAscendant,
  calculateAllPositions,
  calculatePlanetaryPositions,
  calculateHouseCusps
};
