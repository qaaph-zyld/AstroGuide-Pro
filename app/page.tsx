import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-amber-500/20">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
            Interactive Demo — Real Engine Coming Soon
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Vedic Astrology<br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">Powered by AI</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Explore birth charts, muhurta calculations, and AI-powered Jyotish insights.
            One platform for Vedic astrology — currently in demo with full precision coming soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/birth-chart" className="bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-400 hover:to-orange-500 transition shadow-lg shadow-amber-600/25">
              Calculate Birth Chart — Free
            </Link>
            <Link href="/#pricing" className="border border-amber-700/40 text-amber-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-amber-900/20 transition">
              View Pricing
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-3xl mx-auto">
            {[
              { value: "9", label: "Grahas (Planets)" },
              { value: "12", label: "Bhava (Houses)" },
              { value: "27", label: "Nakshatras" },
              { value: "∞", label: "Yogas Analyzed" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-amber-400">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-100">Three Powerful Tools, One Platform</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Everything a Vedic astrologer, practitioner, or enthusiast needs — unified and accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/birth-chart" className="group bg-slate-900/60 rounded-2xl p-8 border border-slate-800 hover:border-amber-600/40 hover:bg-slate-900 transition-all">
              <div className="text-4xl mb-4">🪐</div>
              <h3 className="text-xl font-semibold text-amber-200 mb-2 group-hover:text-amber-300 transition">Birth Chart Calculator</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Generate South Indian style Kundli charts. Planet positions, houses, and Nakshatra placements. Demo uses approximations — Swiss Ephemeris integration planned.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Rashi & Navamsha charts</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Vimshottari Dasha periods</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Planetary strengths & dignities</li>
              </ul>
              <div className="mt-6 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">Try Free →</div>
            </Link>

            <Link href="/muhurta" className="group bg-slate-900/60 rounded-2xl p-8 border border-slate-800 hover:border-amber-600/40 hover:bg-slate-900 transition-all">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-amber-200 mb-2 group-hover:text-amber-300 transition">Muhurta Finder</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Find the most auspicious times for important life events. Marriage, business, travel, griha pravesh, and more.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Panchang-based calculations</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Tithi, Nakshatra, Yoga, Karana</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Rahu Kalam & Gulika Kalam</li>
              </ul>
              <div className="mt-6 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">Find Muhurta →</div>
            </Link>

            <Link href="/jyotish-ai" className="group bg-slate-900/60 rounded-2xl p-8 border border-slate-800 hover:border-amber-600/40 hover:bg-slate-900 transition-all relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">PRO</div>
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-amber-200 mb-2 group-hover:text-amber-300 transition">Jyotish AI Assistant</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Ask questions about Vedic astrology and get AI-powered answers from classical texts. Grounded in Brihat Parashara Hora Shastra.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> RAG-powered answers</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Page citations from texts</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Chart interpretation guidance</li>
              </ul>
              <div className="mt-6 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">Ask Jyotish AI →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-slate-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-100">How It Works</h2>
            <p className="text-lg text-slate-400">From birth data to Jyotish insights — demo mode with full precision coming soon.</p>
          </div>
          <div className="space-y-10">
            {[
              { step: "01", title: "Enter Birth Data", desc: "Input date, time, and place of birth. Our geocoding engine resolves coordinates and timezone automatically.", icon: "📝" },
              { step: "02", title: "Get Your Kundli", desc: "View Rashi chart, planetary table, and Nakshatra details. Demo uses approximate positions — Swiss Ephemeris precision coming soon.", icon: "🪐" },
              { step: "03", title: "Unlock AI Insights", desc: "Upgrade to Pro and let our Jyotish AI analyze your chart. Get personalized readings, yoga identification, and dasha predictions.", icon: "✨" },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-xl font-bold text-slate-950">{item.step}</div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-200 mb-1">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-100">Simple Pricing</h2>
            <p className="text-lg text-slate-400">Start free. Upgrade when you need deeper insights.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                desc: "Essential Vedic astrology tools",
                features: ["Basic birth chart (Rashi)", "Planet positions table", "Nakshatra identification", "Muhurta finder (basic)", "Community support"],
                cta: "Start Free",
                href: "/birth-chart",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$9.99",
                period: "/month",
                desc: "Full Jyotish analysis suite",
                features: ["All Free features", "Navamsha & divisional charts", "Vimshottari Dasha calculator", "Yoga identification", "Jyotish AI Assistant", "Detailed chart reports (PDF)", "Advanced Muhurta with Panchang", "Priority support"],
                cta: "Start 7-Day Trial",
                href: "#contact",
                highlighted: true,
              },
              {
                name: "Practitioner",
                price: "$29",
                period: "/month",
                desc: "For professional astrologers",
                features: ["All Pro features", "Client management (50 charts)", "White-label PDF reports", "Compatibility analysis", "Annual prediction reports", "API access", "Dedicated support"],
                cta: "Contact Us",
                href: "#contact",
                highlighted: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 ${plan.highlighted ? "bg-gradient-to-b from-amber-600/20 to-orange-700/10 border-2 border-amber-500/40 shadow-2xl shadow-amber-600/10 scale-[1.03]" : "bg-slate-900/60 border border-slate-800"}`}>
                <h3 className="text-lg font-semibold text-amber-200">{plan.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-slate-500 ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400 mb-6">{plan.desc}</p>
                <Link href={plan.href} className={`block text-center py-3 rounded-full font-semibold transition text-sm ${plan.highlighted ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:from-amber-400 hover:to-orange-500" : "bg-slate-800 text-amber-200 hover:bg-slate-700"}`}>
                  {plan.cta}
                </Link>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm flex items-center gap-2 text-slate-400">
                      <svg className="w-4 h-4 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Trust */}
      <section className="py-20 px-6 bg-slate-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-amber-100 mb-10">Built on Classical Foundations</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📖", title: "BPHS-Grounded", desc: "Architecture based on Brihat Parashara Hora Shastra. Full classical calculations in active development." },
              { icon: "🔬", title: "Swiss Ephemeris (Planned)", desc: "Arc-second precision via Swiss Ephemeris backend is under development. Current demo uses approximations." },
              { icon: "🔒", title: "Browser-Based", desc: "All demo calculations run in your browser. No data is stored or sent to any server." },
            ].map((t) => (
              <div key={t.title} className="text-center">
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="text-lg font-semibold text-amber-200 mb-2">{t.title}</h3>
                <p className="text-sm text-slate-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-100">Start Your Jyotish Journey</h2>
          <p className="text-lg text-slate-400 mb-10">Get a free birth chart or contact us for practitioner accounts.</p>

          <form className="text-left space-y-5" name="astroguide-contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="astroguide-contact" />
            <p className="hidden"><label>Don&apos;t fill this out: <input name="bot-field" /></label></p>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder-slate-600" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder-slate-600" placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">I&apos;m interested in</label>
              <select name="interest" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition">
                <option value="">Select an option</option>
                <option value="pro-trial">Pro Trial (7 days free)</option>
                <option value="practitioner">Practitioner Account</option>
                <option value="api">API Access</option>
                <option value="custom">Custom Integration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
              <textarea name="message" rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none placeholder-slate-600" placeholder="Tell us about your needs..."></textarea>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 py-3.5 rounded-full text-lg font-semibold hover:from-amber-400 hover:to-orange-500 transition shadow-lg shadow-amber-600/20">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
