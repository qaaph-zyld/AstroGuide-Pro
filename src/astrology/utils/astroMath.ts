/**
 * Utility functions for astrological calculations in AstroGuide Pro
 */

/**
 * Normalizes a degree value to the range [0, 360)
 * @param degree - The degree value to normalize
 * @returns The normalized degree value
 */
export const normalizeDegree = (degree: number): number => {
  let normalizedDegree = degree % 360;
  if (normalizedDegree < 0) {
    normalizedDegree += 360;
  }
  return normalizedDegree;
};

/**
 * Converts decimal degrees to degrees, minutes, and seconds format
 * @param degree - The decimal degree value
 * @returns An object containing degrees, minutes, and seconds
 */
export const decimalToDMS = (degree: number): { degrees: number; minutes: number; seconds: number } => {
  const normalizedDegree = normalizeDegree(degree);
  const degrees = Math.floor(normalizedDegree);
  const minutesDecimal = (normalizedDegree - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.round((minutesDecimal - minutes) * 60);
  
  return { degrees, minutes, seconds };
};

/**
 * Converts degrees, minutes, and seconds to decimal degrees
 * @param degrees - The degrees component
 * @param minutes - The minutes component
 * @param seconds - The seconds component
 * @returns The decimal degree value
 */
export const dmsToDecimal = (degrees: number, minutes: number, seconds: number): number => {
  const sign = degrees < 0 ? -1 : 1;
  return sign * (Math.abs(degrees) + minutes / 60 + seconds / 3600);
};

/**
 * Calculates the angular distance between two points on a circle
 * @param degree1 - The first degree value
 * @param degree2 - The second degree value
 * @returns The angular distance in degrees [0, 180]
 */
export const angularDistance = (degree1: number, degree2: number): number => {
  const normalized1 = normalizeDegree(degree1);
  const normalized2 = normalizeDegree(degree2);
  
  let distance = Math.abs(normalized1 - normalized2);
  if (distance > 180) {
    distance = 360 - distance;
  }
  
  return distance;
};

/**
 * Determines if two planets are in a specific aspect
 * @param degree1 - The degree of the first planet
 * @param degree2 - The degree of the second planet
 * @param aspectAngle - The angle of the aspect (e.g., 0 for conjunction, 180 for opposition)
 * @param orb - The maximum allowable orb (deviation from exact aspect)
 * @returns Whether the planets are in the specified aspect
 */
export const isInAspect = (
  degree1: number,
  degree2: number,
  aspectAngle: number,
  orb: number = 5
): boolean => {
  const distance = angularDistance(degree1, degree2);
  const aspectDistance = angularDistance(distance, aspectAngle);
  return aspectDistance <= orb;
};

/**
 * Calculates the aspect strength based on the orb
 * @param degree1 - The degree of the first planet
 * @param degree2 - The degree of the second planet
 * @param aspectAngle - The angle of the aspect
 * @param maxOrb - The maximum allowable orb
 * @returns The strength of the aspect as a percentage (0-100%)
 */
export const aspectStrength = (
  degree1: number,
  degree2: number,
  aspectAngle: number,
  maxOrb: number = 5
): number => {
  const distance = angularDistance(degree1, degree2);
  const aspectDistance = angularDistance(distance, aspectAngle);
  
  if (aspectDistance > maxOrb) {
    return 0;
  }
  
  return 100 * (1 - aspectDistance / maxOrb);
};

/**
 * Converts a longitude value to a zodiac sign and degree
 * @param longitude - The longitude in decimal degrees
 * @returns An object containing the zodiac sign index (0-11) and degree within the sign
 */
export const longitudeToZodiacPosition = (
  longitude: number
): { signIndex: number; degree: number } => {
  const normalizedLongitude = normalizeDegree(longitude);
  const signIndex = Math.floor(normalizedLongitude / 30);
  const degree = normalizedLongitude % 30;
  
  return { signIndex, degree };
};

/**
 * Converts a longitude value to a nakshatra and pada
 * @param longitude - The longitude in decimal degrees
 * @returns An object containing the nakshatra index (0-26) and pada (1-4)
 */
export const longitudeToNakshatra = (
  longitude: number
): { nakshatraIndex: number; pada: number } => {
  const normalizedLongitude = normalizeDegree(longitude);
  const nakshatraLength = 360 / 27; // Each nakshatra is 13°20'
  const padaLength = nakshatraLength / 4; // Each pada is 3°20'
  
  const nakshatraIndex = Math.floor(normalizedLongitude / nakshatraLength);
  const degreeInNakshatra = normalizedLongitude % nakshatraLength;
  const pada = Math.floor(degreeInNakshatra / padaLength) + 1;
  
  return { nakshatraIndex, pada };
};

/**
 * Calculates the Julian Day Number for a given date
 * @param year - The year
 * @param month - The month (1-12)
 * @param day - The day of the month
 * @returns The Julian Day Number
 */
export const calculateJulianDay = (year: number, month: number, day: number): number => {
  // Adjust month and year for January and February
  if (month <= 2) {
    month += 12;
    year -= 1;
  }
  
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  return Math.floor(365.25 * (year + 4716)) + 
         Math.floor(30.6001 * (month + 1)) + 
         day + b - 1524.5;
};

/**
 * Calculates the sidereal time at Greenwich for a given Julian Day
 * @param jd - The Julian Day
 * @returns The sidereal time in decimal hours
 */
export const calculateSiderealTime = (jd: number): number => {
  const t = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
  
  // Greenwich Mean Sidereal Time in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
             0.000387933 * t * t - t * t * t / 38710000;
  
  // Normalize to range [0, 360)
  gmst = normalizeDegree(gmst);
  
  // Convert to hours
  return gmst / 15;
};

/**
 * Calculates the local sidereal time for a given location and time
 * @param jd - The Julian Day
 * @param longitude - The longitude in decimal degrees (positive for East, negative for West)
 * @returns The local sidereal time in decimal hours
 */
export const calculateLocalSiderealTime = (jd: number, longitude: number): number => {
  const gmst = calculateSiderealTime(jd);
  const lst = gmst + longitude / 15; // Convert longitude to hours
  
  // Normalize to range [0, 24)
  return lst % 24;
};

/**
 * Calculates the house cusps for a given time and location using the Placidus house system
 * This is a simplified implementation and should be replaced with a more accurate algorithm
 * @param jd - The Julian Day
 * @param latitude - The latitude in decimal degrees
 * @param longitude - The longitude in decimal degrees
 * @returns An array of 12 house cusps in degrees
 */
export const calculateHouseCusps = (
  jd: number,
  latitude: number,
  longitude: number
): number[] => {
  // This is a placeholder implementation
  // In a real application, we would use a proper astronomical library
  // or implement the full Placidus house system algorithm
  
  const lst = calculateLocalSiderealTime(jd, longitude);
  const ascendant = (lst * 15) % 360; // Simplified calculation
  
  // Generate house cusps at 30-degree intervals (Equal House system)
  const houseCusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    houseCusps.push(normalizeDegree(ascendant + i * 30));
  }
  
  return houseCusps;
};

/**
 * Determines the house number for a given longitude in a birth chart
 * @param longitude - The longitude in decimal degrees
 * @param houseCusps - The array of house cusps
 * @returns The house number (1-12)
 */
export const determineHouse = (longitude: number, houseCusps: number[]): number => {
  const normalizedLongitude = normalizeDegree(longitude);
  
  for (let i = 0; i < 12; i++) {
    const cusp = houseCusps[i];
    const nextCusp = houseCusps[(i + 1) % 12];
    
    if (nextCusp > cusp) {
      // Normal case
      if (normalizedLongitude >= cusp && normalizedLongitude < nextCusp) {
        return i + 1;
      }
    } else {
      // Crossing 0° Aries
      if (normalizedLongitude >= cusp || normalizedLongitude < nextCusp) {
        return i + 1;
      }
    }
  }
  
  // Default to the first house if something goes wrong
  return 1;
};
