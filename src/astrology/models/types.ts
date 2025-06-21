/**
 * Core types and interfaces for astrological calculations in AstroGuide Pro
 */

/**
 * Represents celestial bodies in Vedic astrology
 */
export enum CelestialBody {
  SUN = 'Sun',
  MOON = 'Moon',
  MERCURY = 'Mercury',
  VENUS = 'Venus',
  MARS = 'Mars',
  JUPITER = 'Jupiter',
  SATURN = 'Saturn',
  URANUS = 'Uranus',
  NEPTUNE = 'Neptune',
  PLUTO = 'Pluto',
  RAHU = 'Rahu', // North Node
  KETU = 'Ketu' // South Node
}

/**
 * Represents the 12 zodiac signs in Vedic astrology
 */
export enum ZodiacSign {
  ARIES = 'Aries',
  TAURUS = 'Taurus',
  GEMINI = 'Gemini',
  CANCER = 'Cancer',
  LEO = 'Leo',
  VIRGO = 'Virgo',
  LIBRA = 'Libra',
  SCORPIO = 'Scorpio',
  SAGITTARIUS = 'Sagittarius',
  CAPRICORN = 'Capricorn',
  AQUARIUS = 'Aquarius',
  PISCES = 'Pisces',
}

/**
 * Represents the 12 houses in a birth chart
 */
export enum House {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
  SIXTH = 6,
  SEVENTH = 7,
  EIGHTH = 8,
  NINTH = 9,
  TENTH = 10,
  ELEVENTH = 11,
  TWELFTH = 12,
}

/**
 * Represents the 27 Nakshatras (lunar mansions) in Vedic astrology
 */
export enum Nakshatra {
  ASHWINI = 'Ashwini',
  BHARANI = 'Bharani',
  KRITTIKA = 'Krittika',
  ROHINI = 'Rohini',
  MRIGASHIRA = 'Mrigashira',
  ARDRA = 'Ardra',
  PUNARVASU = 'Punarvasu',
  PUSHYA = 'Pushya',
  ASHLESHA = 'Ashlesha',
  MAGHA = 'Magha',
  PURVA_PHALGUNI = 'Purva Phalguni',
  UTTARA_PHALGUNI = 'Uttara Phalguni',
  HASTA = 'Hasta',
  CHITRA = 'Chitra',
  SWATI = 'Swati',
  VISHAKHA = 'Vishakha',
  ANURADHA = 'Anuradha',
  JYESHTHA = 'Jyeshtha',
  MULA = 'Mula',
  PURVA_ASHADHA = 'Purva Ashadha',
  UTTARA_ASHADHA = 'Uttara Ashadha',
  SHRAVANA = 'Shravana',
  DHANISHTA = 'Dhanishta',
  SHATABHISHA = 'Shatabhisha',
  PURVA_BHADRAPADA = 'Purva Bhadrapada',
  UTTARA_BHADRAPADA = 'Uttara Bhadrapada',
  REVATI = 'Revati',
}

/**
 * Represents the planetary aspects in Vedic astrology
 */
export enum Aspect {
  CONJUNCTION = 'Conjunction', // 0°
  OPPOSITION = 'Opposition',   // 180°
  TRINE = 'Trine',             // 120°
  SQUARE = 'Square'            // 90°
}

/**
 * Represents the birth data required for chart calculations
 */
export interface BirthData {
  date: string; // ISO date string format (YYYY-MM-DD)
  time: string; // Time string format (HH:MM or HH:MM:SS)
  latitude: number;
  longitude: number;
  timezone: string;
  location: string;
  name?: string;
  gender?: 'male' | 'female' | 'other';
}

/**
 * Represents a planet's position in a birth chart
 */
export interface PlanetPosition {
  planet: CelestialBody;
  sign: ZodiacSign;
  house: House;
  degree: number;
  nakshatra: Nakshatra;
  nakshatraPada: number;
  isRetrograde: boolean;
  longitude?: number; // Absolute longitude in degrees (0-360)
}

/**
 * Represents a house in a birth chart
 */
export interface HouseInfo {
  house: House;
  sign: ZodiacSign;
  degree: number;
  planets: CelestialBody[];
  longitude?: number; // Absolute longitude of house cusp in degrees (0-360)
}

/**
 * Represents an aspect between two planets
 */
export interface PlanetaryAspect {
  planet1: CelestialBody;
  planet2: CelestialBody;
  aspect: Aspect;
  orb: number; // Deviation from exact aspect in degrees
  strength: number; // 0-100% strength of the aspect
}

/**
 * Represents a complete birth chart
 */
export interface BirthChart {
  id?: string;
  birthData: BirthData;
  timestamp?: string; // ISO timestamp of when the chart was calculated
  ascendant: {
    sign: ZodiacSign;
    degree: number;
    nakshatra: Nakshatra;
    nakshatraPada: number;
    longitude?: number; // Absolute longitude in degrees (0-360)
  };
  planetPositions: PlanetPosition[];
  houses: HouseInfo[];
  aspects: PlanetaryAspect[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a Dasha period in Vedic astrology
 */
export interface DashaPeriod {
  planet: CelestialBody;
  startDate: Date;
  endDate: Date;
  subPeriods?: DashaPeriod[];
}

/**
 * Represents a complete Dasha system for a birth chart
 */
export interface DashaSystem {
  mainDasha: DashaPeriod[];
  birthChart: BirthChart;
}

/**
 * Represents a transit chart for a specific date
 */
export interface TransitChart {
  date: Date;
  planetPositions: PlanetPosition[];
  aspects: PlanetaryAspect[]; // Aspects between transit planets and birth chart planets
}

/**
 * Represents a compatibility analysis between two birth charts
 */
export interface CompatibilityAnalysis {
  chart1: BirthChart;
  chart2: BirthChart;
  overallScore: number; // 0-100% compatibility
  detailedScores: {
    category: string;
    score: number;
    description: string;
  }[];
  aspects: PlanetaryAspect[]; // Aspects between planets in both charts
}
