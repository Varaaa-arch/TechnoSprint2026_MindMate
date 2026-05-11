"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

/* ─── static data ─── */
const DEFAULT_SESSIONS = [
  { id: 1, title: "Navigating Work Stress",       time: "2 hours ago"  },
  { id: 2, title: "Mindful Morning Check-in",     time: "Yesterday"    },
  { id: 3, title: "Overcoming Procrastination",   time: "Mar 12, 2024" },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "bot",
    text: "Hi Alex, it's good to see you again. How are you feeling after our last conversation about managing those workplace deadlines?",
  },
  {
    id: 2,
    role: "user",
    text: "I'm feeling a bit better, but I'm still struggling with a sense of overwhelm in the mornings. It feels like as soon as I wake up, my mind starts racing with everything I have to do.",
  },
  {
    id: 3,
    role: "bot",
    text: `That morning rush of thoughts can be really draining. It sounds like your "survival brain" is kicking in a bit early. Would you like to try a quick 2-minute grounding exercise, or should we talk more about what those specific morning thoughts look like?`,
    suggestions: [
      {
        icon: "🧘",
        title: "Grounding Exercise",
        desc: "A quick 5-4-3-2-1 technique to settle your mind.",
      },
      {
        icon: "🔍",
        title: "Explore the Thoughts",
        desc: "Identify the root causes of morning anxiety.",
      },
    ],
  },
];

const BOT_RESPONSES = [
  "Terima kasih sudah berbagi. Saya di sini untuk mendengarkan. Ceritakan lebih lanjut tentang apa yang kamu rasakan.",
  "Itu terdengar cukup berat. Wajar sekali merasa seperti itu. Apa yang biasanya membantu kamu merasa lebih tenang?",
  "Saya mengerti. Perasaan itu valid. Mari kita coba eksplorasi bersama apa yang bisa membantu situasimu.",
  "Kamu sudah melakukan hal yang luar biasa dengan mau berbicara tentang ini. Langkah kecil itu penting.",
];

export default function ChatPage() {
  const [messages, setMessages]     = useState(INITIAL_MESSAGES);
  const [input, setInput]           = useState("");
  const [thinking, setThinking]     = useState(false);
  const [activeSession, setActive]  = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [msgCounter, setMsgCounter] = useState(INITIAL_MESSAGES.length + 1);
  const [sessions, setSessions]     = useState(DEFAULT_SESSIONS);
  const bottomRef                   = useRef(null);

  /* ── Sync sessions dengan localStorage ── */
  const saveSessions = (updated) => {
    setSessions(updated);
    try { localStorage.setItem("mindmate_sessions", JSON.stringify(updated)); } catch { /* ignore */ }
  };

  /* ── Load dari localStorage setelah mount ── */
  useEffect(() => {
    let active = true;
    const load = () => {
      try {
        const saved = localStorage.getItem("mindmate_sessions");
        if (saved && active) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setSessions(parsed);
        }
      } catch { /* ignore */ }
    };
    load();
    return () => { active = false; };
  }, []);

  /* auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const nextId = msgCounter;
    setMsgCounter((c) => c + 2);
    const userMsg = { id: nextId, role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const reply = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      setMessages((prev) => [...prev, { id: nextId + 1, role: "bot", text: reply }]);
      setThinking(false);
    }, 1800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  /* delete a session */
  const handleDeleteSession = (e, id) => {
    e.stopPropagation(); // jangan trigger setActive
    setDeleteConfirm(id);
  };

  const confirmDelete = (id) => {
    const updated = sessions.filter((s) => s.id !== id);
    saveSessions(updated);
    if (activeSession === id) {
      setActive(updated.length > 0 ? updated[0].id : null);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex flex-col">
      <Navbar />

      {/* ── 3-column layout ── */}
      <div className="flex flex-1 max-w-[1200px] w-full mx-auto px-4 py-5 gap-4" style={{height:"calc(100vh - 65px)"}}>

        {/* ══ LEFT SIDEBAR ══ */}
        <aside className="w-60 flex-shrink-0 flex flex-col gap-3">
          {/* New Session button */}
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-2xl shadow-md transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </button>

          {/* Recent sessions */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1 mb-2">Recent Sessions</p>
            <div className="space-y-1">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-2 rounded-2xl transition-colors ${
                    activeSession === s.id ? "bg-indigo-600" : "hover:bg-white"
                  }`}
                >
                  {/* Session info — clickable */}
                  <button
                    onClick={() => setActive(s.id)}
                    className="flex-1 text-left px-4 py-3 min-w-0"
                  >
                    <p className={`text-sm font-semibold leading-tight truncate ${
                      activeSession === s.id ? "text-white" : "text-gray-800"
                    }`}>
                      {s.title}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      activeSession === s.id ? "text-indigo-200" : "text-gray-400"
                    }`}>
                      {s.time}
                    </p>
                  </button>

                  {/* Delete button — selalu terlihat */}
                  <button
                    onClick={(e) => handleDeleteSession(e, s.id)}
                    title="Hapus sesi"
                    className={`flex-shrink-0 mr-2 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      activeSession === s.id
                        ? "bg-white/20 hover:bg-white/40 text-white"
                        : "bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-700"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Empty state */}
              {sessions.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-gray-400">Belum ada sesi.</p>
                  <p className="text-xs text-gray-400">Mulai sesi baru di atas.</p>
                </div>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Pro Insights banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Pro Insights</p>
              <p className="text-[10px] text-gray-500">Deep patterns unlocked</p>
            </div>
          </div>
        </aside>

        {/* ══ CHAT AREA ══ */}
        <main className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm overflow-hidden min-w-0">

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === "bot" ? (
                  /* ── Bot message ── */
                  <div className="flex items-start gap-3">
                    {/* Bot avatar */}
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 mb-1">MindMate AI</p>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                        <p className="text-sm text-gray-800 leading-relaxed">{msg.text}</p>
                      </div>

                      {/* Suggestion chips */}
                      {msg.suggestions && (
                        <div className="flex gap-3 mt-3 flex-wrap">
                          {msg.suggestions.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => sendMessage(s.title)}
                              className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left shadow-sm"
                            >
                              <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 text-base">
                                {s.icon}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-800">{s.title}</p>
                                <p className="text-[10px] text-gray-400 leading-tight">{s.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ── User message ── */
                  <div className="flex justify-end">
                    <div className="max-w-[70%]">
                      <p className="text-xs text-gray-400 text-right mb-1">You</p>
                      <div className="bg-indigo-600 rounded-2xl rounded-tr-sm px-4 py-3">
                        <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking indicator */}
            {thinking && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:"0ms"}}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:"150ms"}}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:"300ms"}}></span>
                </div>
                <span className="text-xs">MindMate is thinking...</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input bar ── */}
          <div className="border-t border-gray-100 px-4 py-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5">
              {/* Emoji */}
              <button type="button" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Text input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />

              {/* Mic */}
              <button type="button" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              {/* Send */}
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>

            {/* Disclaimer */}
            <p className="text-center text-[10px] text-gray-400 mt-2 leading-tight">
              MindMate provides emotional support but is not a replacement for professional therapy. In crisis, please contact local emergency services.
            </p>
          </div>
        </main>

        {/* ══ RIGHT PANEL ══ */}
        <aside className="w-56 flex-shrink-0 flex flex-col gap-4">

          {/* Current Vibe */}
          <div className="bg-white rounded-3xl shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">Current Vibe</p>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base font-bold text-indigo-600 mb-1">Calmly Anxious</p>
              <p className="text-[10px] text-gray-400 leading-snug">Your mood has been steady but slightly elevated today.</p>
            </div>
          </div>

          {/* Daily Goal */}
          <div className="bg-white rounded-3xl shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">Daily Goal</p>
            <div className="space-y-2.5">
              {/* Completed */}
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-800">Morning Check-in</p>
              </div>
              {/* Pending */}
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                <p className="text-xs text-gray-400">Evening Reflection</p>
              </div>
            </div>
          </div>

          {/* Featured Exercise */}
          <div className="rounded-3xl overflow-hidden shadow-sm relative" style={{minHeight:120}}>
            {/* Forest background */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-800 to-green-950">
              {/* Simulated forest silhouette */}
              <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-around px-2">
                {[28,40,32,48,36,44,30,38].map((h,i) => (
                  <div key={i} className="bg-green-900/80 rounded-t-full" style={{width:14, height:h}}></div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="relative z-10 p-4 flex flex-col justify-end h-full" style={{minHeight:120}}>
              <p className="text-[9px] text-green-300 font-semibold uppercase tracking-wider mb-0.5">Featured Exercise</p>
              <p className="text-sm font-bold text-white">Forest Breathing</p>
            </div>
          </div>
        </aside>

      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-[#f0f2f8]">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© 2024 MindMate AI. Your emotional wellbeing partner.</p>
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">Help Center</a>
          </div>
        </div>
      </footer>

      {/* ── MODAL KONFIRMASI HAPUS ── */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          {/* Dialog */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm z-10">
            {/* Icon */}
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Hapus Sesi?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Sesi{" "}
              <span className="font-semibold text-gray-700">
                &ldquo;{sessions.find((s) => s.id === deleteConfirm)?.title}&rdquo;
              </span>{" "}
              akan dihapus permanen dan tidak bisa dikembalikan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors shadow-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
