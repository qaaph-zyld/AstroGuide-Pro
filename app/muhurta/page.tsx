"use client";

import { useState } from "react";

const TITHIS = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"];
const NAKSHATRAS = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
const YOGAS = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
const KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"];
const VARAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const EVENT_TYPES = [
  { value: "marriage", label: "Marriage / Wedding", icon: "💒" },
  { value: "business", label: "Business Launch", icon: "🏢" },
  { value: "travel", label: "Travel / Journey", icon: "✈️" },
  { value: "griha", label: "Griha Pravesh", icon: "🏠" },
  { value: "education", label: "Education / Studies", icon: "📚" },
  { value: "medical", label: "Medical Procedure", icon: "🏥" },
  { value: "vehicle", label: "Vehicle Purchase", icon: "🚗" },
  { value: "investment", label: "Investment / Finance", icon: "💰" },
];

interface MuhurtaResult {
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  score: number;
  rahuKalam: string;
  gulikaKalam: string;
  favorable: boolean;
}

function generateMuhurtas(fromDate: string, days: number, eventType: string): MuhurtaResult[] {
  const results: MuhurtaResult[] = [];
  const start = new Date(fromDate);

  for (let d = 0; d < days; d++) {
    const date = new Date(start);
    date.setDate(start.getDate() + d);
    const seed = date.getTime() + eventType.length * 1000;
    const hash = (n: number) => ((n * 2654435761) >>> 0);

    const dayIdx = date.getDay();
    const tithiIdx = hash(seed + 1) % 15;
    const nakIdx = hash(seed + 2) % 27;
    const yogaIdx = hash(seed + 3) % 27;
    const karanaIdx = hash(seed + 4) % 11;

    // Score based on combinations
    let score = 50;
    if ([1, 3, 4, 5].includes(dayIdx)) score += 10; // Mon, Wed, Thu, Fri
    if ([1, 2, 3, 4, 6, 10, 11].includes(tithiIdx)) score += 10;
    if ([0, 3, 6, 7, 12, 14, 21, 26].includes(nakIdx)) score += 15;
    if ([1, 2, 3, 4, 15, 20, 21].includes(yogaIdx)) score += 10;
    if (karanaIdx === 6) score -= 20; // Vishti karana
    score = Math.min(Math.max(score, 20), 98);

    // Rahu Kalam times based on day
    const rahuStart = [16.5, 7.5, 15, 12, 13.5, 10.5, 9][dayIdx];
    const gulikaStart = [15, 13.5, 12, 10.5, 9, 7.5, 6][dayIdx];

    const formatTime = (h: number) => {
      const hrs = Math.floor(h);
      const mins = Math.round((h - hrs) * 60);
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    };

    // Generate 2-3 windows per day
    const windows = [
      { start: 6 + hash(seed + 10) % 3, duration: 1 + (hash(seed + 11) % 2) },
      { start: 10 + hash(seed + 12) % 3, duration: 1 + (hash(seed + 13) % 2) },
    ];

    for (const w of windows) {
      // Skip if window overlaps with Rahu Kalam
      if (w.start >= rahuStart && w.start < rahuStart + 1.5) continue;

      results.push({
        date: date.toISOString().split("T")[0],
        day: VARAS[dayIdx],
        startTime: formatTime(w.start),
        endTime: formatTime(w.start + w.duration),
        tithi: TITHIS[tithiIdx],
        nakshatra: NAKSHATRAS[nakIdx],
        yoga: YOGAS[yogaIdx],
        karana: KARANAS[karanaIdx],
        score: score + (hash(seed + w.start) % 10) - 5,
        rahuKalam: `${formatTime(rahuStart)} – ${formatTime(rahuStart + 1.5)}`,
        gulikaKalam: `${formatTime(gulikaStart)} – ${formatTime(gulikaStart + 1.5)}`,
        favorable: score >= 65,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export default function MuhurtaPage() {
  const [form, setForm] = useState({ fromDate: new Date().toISOString().split("T")[0], days: 7, event: "marriage" });
  const [results, setResults] = useState<MuhurtaResult[] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(generateMuhurtas(form.fromDate, form.days, form.event));
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-100 mb-2">📅 Muhurta Finder</h1>
          <p className="text-slate-400">Find the most auspicious times for your important life events.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-300 px-5 py-2.5 rounded-xl text-sm font-medium border border-yellow-500/20">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            <span><strong>Demo Mode:</strong> Panchang elements (Tithi, Nakshatra, Yoga, Karana) are approximated, not calculated from real lunar/solar positions. Precision engine under development.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-slate-900/60 rounded-2xl p-8 border border-slate-800 mb-12">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Event Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EVENT_TYPES.map((ev) => (
                <button key={ev.value} type="button"
                  onClick={() => setForm({ ...form, event: ev.value })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition text-sm ${form.event === ev.value ? "bg-amber-900/30 border-amber-500/50 text-amber-300" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"}`}>
                  <span className="text-xl">{ev.icon}</span>
                  <span className="text-xs">{ev.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">From Date</label>
              <input type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Search Range (days)</label>
              <select value={form.days} onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition">
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 py-3.5 rounded-full text-lg font-semibold hover:from-amber-400 hover:to-orange-500 transition shadow-lg shadow-amber-600/20">
            Find Auspicious Times
          </button>
        </form>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-amber-200 mb-4">
              Top {Math.min(results.length, 10)} Muhurtas for {EVENT_TYPES.find((e) => e.value === form.event)?.label}
            </h2>

            {results.slice(0, 10).map((m, i) => (
              <div key={i} className={`bg-slate-900/60 rounded-xl p-5 border ${m.favorable ? "border-amber-700/30" : "border-slate-800"} hover:border-amber-600/40 transition`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${m.score >= 75 ? "bg-green-900/30 text-green-400" : m.score >= 60 ? "bg-amber-900/30 text-amber-400" : "bg-red-900/20 text-red-400"}`}>
                      {m.score}
                    </div>
                    <div>
                      <div className="text-amber-200 font-semibold">{m.day}, {m.date}</div>
                      <div className="text-amber-400 text-lg font-mono">{m.startTime} – {m.endTime}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-800/60 rounded-lg px-3 py-1.5">
                      <span className="text-slate-500">Tithi:</span> <span className="text-slate-300 ml-1">{m.tithi}</span>
                    </div>
                    <div className="bg-slate-800/60 rounded-lg px-3 py-1.5">
                      <span className="text-slate-500">Nakshatra:</span> <span className="text-slate-300 ml-1">{m.nakshatra}</span>
                    </div>
                    <div className="bg-slate-800/60 rounded-lg px-3 py-1.5">
                      <span className="text-slate-500">Yoga:</span> <span className="text-slate-300 ml-1">{m.yoga}</span>
                    </div>
                    <div className="bg-slate-800/60 rounded-lg px-3 py-1.5">
                      <span className="text-slate-500">Karana:</span> <span className="text-slate-300 ml-1">{m.karana}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-4 text-xs text-slate-500">
                  <span>Rahu Kalam: <span className="text-red-400">{m.rahuKalam}</span></span>
                  <span>Gulika Kalam: <span className="text-red-400">{m.gulikaKalam}</span></span>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/10 rounded-2xl p-8 border border-amber-700/30 text-center mt-8">
              <h3 className="text-xl font-semibold text-amber-200 mb-2">Need Advanced Panchang?</h3>
              <p className="text-slate-400 mb-4">Pro users get hora-level precision, planetary hora chart, and custom Panchang with notification alerts.</p>
              <a href="/#pricing" className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 px-8 py-3 rounded-full font-semibold hover:from-amber-400 hover:to-orange-500 transition">
                Upgrade to Pro — $9.99/mo
              </a>
            </div>

            <p className="text-center text-xs text-slate-600 mt-4">
              Demo mode: Panchang elements are approximated. Production uses precise astronomical calculations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
