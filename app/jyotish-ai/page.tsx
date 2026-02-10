"use client";

import { useState } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

const SAMPLE_QA: Record<string, { answer: string; citations: string[] }> = {
  "venus 7th house": {
    answer: "Venus in the 7th house is considered one of the most favorable placements for marriage and partnerships. According to BPHS, Venus as the natural significator of love and beauty placed in the house of marriage brings:\n\n• **Attractive spouse** — The native tends to attract a beautiful and charming partner\n• **Harmonious relationships** — Natural ability to maintain balance in partnerships\n• **Artistic inclinations** — Often indicates involvement in arts, music, or fashion\n• **Diplomatic nature** — Skilled in negotiation and compromise\n\nHowever, if Venus is afflicted by malefics (Saturn, Rahu, or Mars), it can indicate delays in marriage or challenges in maintaining harmony. Venus in its own sign (Taurus/Libra) in the 7th house gives Malavya Yoga, one of the Pancha Mahapurusha Yogas.",
    citations: ["BPHS Ch. 24 — Effects of Planets in Houses", "Phaladeepika Ch. 7 — Marriage & Partnerships"]
  },
  "vimshottari dasha": {
    answer: "The Vimshottari Dasha system is the most widely used planetary period system in Vedic astrology. It spans a total cycle of 120 years, divided among the 9 planets:\n\n| Planet | Period | Years |\n|--------|--------|-------|\n| Sun (Surya) | Ketu → Sun | 6 years |\n| Moon (Chandra) | Sun → Moon | 10 years |\n| Mars (Mangal) | Moon → Mars | 7 years |\n| Rahu | Mars → Rahu | 18 years |\n| Jupiter (Guru) | Rahu → Jupiter | 16 years |\n| Saturn (Shani) | Jupiter → Saturn | 19 years |\n| Mercury (Budha) | Saturn → Mercury | 17 years |\n| Ketu | Mercury → Ketu | 7 years |\n| Venus (Shukra) | Ketu → Venus | 20 years |\n\nThe starting dasha is determined by the Moon's Nakshatra at birth. Each Mahadasha is further divided into Antardashas (sub-periods) proportional to the main periods.",
    citations: ["BPHS Ch. 46 — Dasha Effects", "Uttara Kalamrita — Dasha Calculations"]
  },
  "raja yoga": {
    answer: "Raja Yoga in Vedic astrology indicates power, authority, and success. It forms when lords of Kendra (1, 4, 7, 10) and Trikona (1, 5, 9) houses combine through:\n\n• **Conjunction** — Kendra and Trikona lords placed together\n• **Mutual aspect** — They aspect each other from their respective houses\n• **Exchange** — Parivartana (sign exchange) between Kendra and Trikona lords\n\n**Key Raja Yogas:**\n1. **Dharma-Karmadhipati Yoga** — 9th and 10th lord conjunction (strongest)\n2. **Lakshmi Yoga** — 1st and 9th lord connection\n3. **Gajakesari Yoga** — Jupiter in Kendra from Moon\n4. **Pancha Mahapurusha** — Mercury, Venus, Mars, Jupiter, or Saturn in own/exalted sign in Kendra\n\nFor a Raja Yoga to fully manifest, the participating planets should be strong (in own sign, exalted, or in good Shadbala) and free from malefic afflictions.",
    citations: ["BPHS Ch. 41 — Combinations for Kingship", "Jataka Parijata Ch. 15 — Royal Yogas"]
  },
  "default": {
    answer: "This is a demo of the Jyotish AI Assistant. In the full Pro version, this feature uses a RAG (Retrieval-Augmented Generation) pipeline powered by:\n\n• **Ollama** — Local LLM for privacy-first AI responses\n• **ChromaDB** — Vector store for classical text embeddings\n• **LlamaIndex** — RAG orchestration with page-level citations\n\nThe knowledge base includes classical texts like Brihat Parashara Hora Shastra, Phaladeepika, Uttara Kalamrita, and Jataka Parijata.\n\nTry asking about:\n- \"Venus in 7th house\"\n- \"Vimshottari Dasha system\"\n- \"Raja Yoga combinations\"",
    citations: ["Powered by Jyotish Holocron RAG Engine"]
  }
};

function findAnswer(query: string): { answer: string; citations: string[] } {
  const q = query.toLowerCase();
  if (q.includes("venus") && q.includes("7")) return SAMPLE_QA["venus 7th house"];
  if (q.includes("vimshottari") || q.includes("dasha")) return SAMPLE_QA["vimshottari dasha"];
  if (q.includes("raja") && q.includes("yoga")) return SAMPLE_QA["raja yoga"];
  if (q.includes("yoga") && !q.includes("raja")) return SAMPLE_QA["raja yoga"];
  return SAMPLE_QA["default"];
}

export default function JyotishAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I am the Jyotish AI Assistant, trained on classical Vedic astrology texts. Ask me anything about planetary placements, yogas, dashas, or chart interpretation.\n\n*This is a demo. Pro subscribers get access to the full RAG-powered engine with comprehensive text citations.*",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (query?: string) => {
    const text = query || input.trim();
    if (!text) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const { answer, citations } = findAnswer(text);
      const aiMsg: Message = { role: "assistant", content: answer, citations };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const suggestions = [
    "What does Venus in the 7th house signify?",
    "Explain the Vimshottari Dasha system",
    "What are Raja Yoga combinations?",
  ];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-100 mb-2">🧠 Jyotish AI Assistant</h1>
          <p className="text-slate-400">Ask questions about Vedic astrology — answers grounded in classical texts.</p>
          <div className="inline-flex items-center gap-2 mt-3 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-medium border border-amber-500/20">
            Demo Mode — 3 sample topics available
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.role === "user" ? "bg-amber-600/20 border border-amber-600/30 rounded-2xl rounded-br-md" : "bg-slate-800/60 border border-slate-700 rounded-2xl rounded-bl-md"} p-4`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-600 rounded-md flex items-center justify-center text-[8px] text-slate-950 font-bold">J</div>
                      <span className="text-xs text-amber-400 font-medium">Jyotish AI</span>
                    </div>
                  )}
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{msg.content}</div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <div className="text-[10px] text-slate-500 mb-1">SOURCES</div>
                      {msg.citations.map((c, ci) => (
                        <div key={ci} className="text-xs text-amber-500/70 flex items-center gap-1">
                          <span>📖</span> {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl rounded-bl-md p-4">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4">
              <div className="text-xs text-slate-500 mb-2">Try asking:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => handleSend(s)}
                    className="text-xs bg-slate-800 text-amber-300 px-3 py-1.5 rounded-full border border-slate-700 hover:border-amber-600/40 transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-800">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Vedic astrology..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition placeholder-slate-600 text-sm"
              />
              <button type="submit" disabled={isTyping || !input.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 px-6 py-3 rounded-xl font-semibold hover:from-amber-400 hover:to-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Pro upsell */}
        <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/10 rounded-2xl p-8 border border-amber-700/30 text-center mt-8">
          <h3 className="text-xl font-semibold text-amber-200 mb-2">Unlock Full Jyotish AI</h3>
          <p className="text-slate-400 mb-1">Pro subscribers get access to the complete RAG engine with:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 my-4">
            <span className="flex items-center gap-1"><span className="text-amber-500">✓</span> Full BPHS coverage</span>
            <span className="flex items-center gap-1"><span className="text-amber-500">✓</span> Page-level citations</span>
            <span className="flex items-center gap-1"><span className="text-amber-500">✓</span> Chart-specific Q&A</span>
            <span className="flex items-center gap-1"><span className="text-amber-500">✓</span> Unlimited questions</span>
          </div>
          <Link href="/#pricing" className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 px-8 py-3 rounded-full font-semibold hover:from-amber-400 hover:to-orange-500 transition">
            Upgrade to Pro — $9.99/mo
          </Link>
        </div>
      </div>
    </div>
  );
}
