"use client";

import { useState } from "react";

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const RASHIS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const RASHI_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const PLANET_SYMBOLS = ["☉", "☽", "♂", "☿", "♃", "♀", "♄", "☊", "☋"];

interface ChartData {
  planets: { name: string; symbol: string; rashi: string; rashiIdx: number; degree: string; nakshatra: string; pada: number; retrograde: boolean }[];
  ascendant: { rashi: string; rashiIdx: number; degree: string };
  moonSign: string;
  sunSign: string;
}

function generateChart(date: string, time: string, lat: number, lng: number): ChartData {
  // Deterministic pseudo-calculation based on inputs (demo — real app uses Swiss Ephemeris API)
  const seed = new Date(`${date}T${time}`).getTime() + lat * 1000 + lng * 500;
  const hash = (n: number) => ((n * 2654435761) >>> 0) % 360;

  const ascDeg = hash(seed) % 360;
  const ascRashiIdx = Math.floor(ascDeg / 30) % 12;

  const planets = PLANETS.map((name, i) => {
    const deg = hash(seed + i * 7919 + 31) % 360;
    const rashiIdx = Math.floor(deg / 30) % 12;
    const inRashiDeg = deg % 30;
    const nakIdx = Math.floor(deg / (360 / 27)) % 27;
    const pada = Math.floor((deg % (360 / 27)) / (360 / 108)) + 1;
    return {
      name,
      symbol: PLANET_SYMBOLS[i],
      rashi: RASHIS[rashiIdx],
      rashiIdx,
      degree: `${inRashiDeg.toFixed(1)}°`,
      nakshatra: NAKSHATRAS[nakIdx],
      pada: Math.min(pada, 4),
      retrograde: i >= 2 && i <= 6 && hash(seed + i * 113) % 5 === 0,
    };
  });

  return {
    planets,
    ascendant: { rashi: RASHIS[ascRashiIdx], rashiIdx: ascRashiIdx, degree: `${(ascDeg % 30).toFixed(1)}°` },
    moonSign: planets[1].rashi,
    sunSign: planets[0].rashi,
  };
}

function SouthIndianChart({ chart }: { chart: ChartData }) {
  // South Indian style: 4x4 grid, fixed rashi positions
  // Positions (row, col) for each rashi (0=Aries through 11=Pisces)
  const positions: [number, number][] = [
    [0, 1], // Aries
    [0, 0], // Taurus
    [1, 0], // Gemini
    [2, 0], // Cancer
    [3, 0], // Leo
    [3, 1], // Virgo
    [3, 2], // Libra
    [3, 3], // Scorpio
    [2, 3], // Sagittarius
    [1, 3], // Capricorn
    [0, 3], // Aquarius
    [0, 2], // Pisces
  ];

  const grid: string[][][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => []));

  chart.planets.forEach((p) => {
    const [r, c] = positions[p.rashiIdx];
    grid[r][c].push(`${p.symbol}${p.retrograde ? "ᴿ" : ""}`);
  });

  // Mark ascendant
  const ascPos = positions[chart.ascendant.rashiIdx];

  return (
    <div className="grid grid-cols-4 w-full max-w-md mx-auto border border-amber-700/30 bg-slate-900/80 rounded-xl overflow-hidden">
      {grid.map((row, ri) =>
        row.map((cell, ci) => {
          const rashiIdx = positions.findIndex(([r, c]) => r === ri && c === ci);
          const isCenter = (ri === 1 || ri === 2) && (ci === 1 || ci === 2);
          const isAsc = ri === ascPos[0] && ci === ascPos[1];

          if (isCenter) {
            if (ri === 1 && ci === 1) {
              return (
                <div key={`${ri}-${ci}`} className="col-span-1 aspect-square flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-slate-900 border-r border-b border-amber-700/10">
                  <span className="text-amber-400 text-xs font-bold">RASHI</span>
                </div>
              );
            }
            if (ri === 1 && ci === 2) {
              return (
                <div key={`${ri}-${ci}`} className="col-span-1 aspect-square flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-slate-900 border-b border-amber-700/10">
                  <span className="text-amber-400 text-xs font-bold">CHART</span>
                </div>
              );
            }
            return (
              <div key={`${ri}-${ci}`} className="col-span-1 aspect-square flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-slate-900 border-r border-amber-700/10" />
            );
          }

          return (
            <div
              key={`${ri}-${ci}`}
              className={`aspect-square flex flex-col items-center justify-center p-1 border border-amber-700/10 relative ${isAsc ? "bg-amber-900/20" : "bg-slate-900/60"}`}
            >
              {isAsc && <div className="absolute top-0.5 left-1 text-[8px] text-amber-500 font-bold">ASC</div>}
              {rashiIdx >= 0 && (
                <div className="text-[9px] text-slate-600 absolute top-0.5 right-1">{RASHI_SYMBOLS[rashiIdx]}</div>
              )}
              <div className="text-sm text-amber-200 font-mono leading-tight text-center">
                {cell.length > 0 ? cell.join(" ") : ""}
              </div>
              {rashiIdx >= 0 && (
                <div className="text-[8px] text-slate-600 mt-0.5">{RASHIS[rashiIdx].slice(0, 3)}</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default function BirthChartPage() {
  const [form, setForm] = useState({ date: "1990-01-15", time: "06:30", place: "Mumbai, India", lat: 19.076, lng: 72.8777 });
  const [chart, setChart] = useState<ChartData | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = generateChart(form.date, form.time, form.lat, form.lng);
    setChart(result);
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-100 mb-2">🪐 Birth Chart Calculator</h1>
          <p className="text-slate-400">Enter your birth details to generate a South Indian style Kundli chart.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-300 px-5 py-2.5 rounded-xl text-sm font-medium border border-yellow-500/20">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            <span><strong>Demo Mode:</strong> Planetary positions are approximated using a hash function, not real astronomical calculations. Swiss Ephemeris backend is under development.</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-slate-900/60 rounded-2xl p-8 border border-slate-800 mb-12">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Date of Birth</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Time of Birth</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Place of Birth</label>
            <input type="text" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition placeholder-slate-600" placeholder="City, Country" />
          </div>
          <div className="grid grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Latitude</label>
              <input type="number" step="0.001" value={form.lat} onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Longitude</label>
              <input type="number" step="0.001" value={form.lng} onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
            </div>
          </div>
          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 py-3.5 rounded-full text-lg font-semibold hover:from-amber-400 hover:to-orange-500 transition shadow-lg shadow-amber-600/20">
            Generate Birth Chart
          </button>
        </form>

        {/* Results */}
        {chart && (
          <div className="space-y-10">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Chart visual */}
              <div>
                <h2 className="text-xl font-semibold text-amber-200 mb-4 text-center">Rashi Chart (South Indian)</h2>
                <SouthIndianChart chart={chart} />
                <div className="mt-4 text-center text-sm text-slate-500">
                  Ascendant: <span className="text-amber-400">{chart.ascendant.rashi} {chart.ascendant.degree}</span>
                </div>
              </div>

              {/* Planet table */}
              <div>
                <h2 className="text-xl font-semibold text-amber-200 mb-4">Planetary Positions</h2>
                <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="py-2.5 px-3 text-left">Planet</th>
                        <th className="py-2.5 px-3 text-left">Rashi</th>
                        <th className="py-2.5 px-3 text-left">Degree</th>
                        <th className="py-2.5 px-3 text-left">Nakshatra</th>
                        <th className="py-2.5 px-3 text-center">Pada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chart.planets.map((p) => (
                        <tr key={p.name} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="py-2 px-3 text-amber-300 font-medium">
                            {p.symbol} {p.name} {p.retrograde && <span className="text-red-400 text-xs">(R)</span>}
                          </td>
                          <td className="py-2 px-3 text-slate-300">{p.rashi}</td>
                          <td className="py-2 px-3 text-slate-400 font-mono">{p.degree}</td>
                          <td className="py-2 px-3 text-slate-400">{p.nakshatra}</td>
                          <td className="py-2 px-3 text-center text-slate-400">{p.pada}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-center">
                    <div className="text-xs text-slate-500 mb-1">Moon Sign (Rashi)</div>
                    <div className="text-lg font-semibold text-amber-300">{chart.moonSign}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-center">
                    <div className="text-xs text-slate-500 mb-1">Sun Sign</div>
                    <div className="text-lg font-semibold text-amber-300">{chart.sunSign}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro upsell */}
            <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/10 rounded-2xl p-8 border border-amber-700/30 text-center">
              <h3 className="text-xl font-semibold text-amber-200 mb-2">Unlock Full Analysis</h3>
              <p className="text-slate-400 mb-4">Get Navamsha chart, Vimshottari Dasha, yoga identification, and AI-powered chart interpretation with AstroGuide Pro.</p>
              <a href="/#pricing" className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 px-8 py-3 rounded-full font-semibold hover:from-amber-400 hover:to-orange-500 transition">
                Upgrade to Pro — $9.99/mo
              </a>
            </div>

            <p className="text-center text-xs text-slate-600">
              Demo mode: positions are approximated. Production version uses Swiss Ephemeris for arc-second precision.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
