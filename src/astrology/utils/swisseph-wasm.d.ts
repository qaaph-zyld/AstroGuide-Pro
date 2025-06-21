declare module 'swisseph-wasm' {
  export function init(): Promise<void>;
  export function julday(year: number, month: number, day: number, hour: number): number;
  export function calc(jd: number, planet: number): Promise<{ longitude: number }>;
  export function houses(jd: number, lat: number, lon: number): Promise<{ ascendant: number, houses: number[] }>;
  
  // Swiss Ephemeris constants
  export const SUN: number;
  export const MOON: number;
  export const MERCURY: number;
  export const VENUS: number;
  export const MARS: number;
  export const JUPITER: number;
  export const SATURN: number;
  export const URANUS: number;
  export const NEPTUNE: number;
  export const PLUTO: number;
  export const MEAN_NODE: number;
}
