"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";
import Link from "next/link";
import { useToast } from "../components/Toast";
import api from "../../lib/api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/* ─── Mood options ─── */
const MOODS = [
  { id: "senang",    label: "Senang",     sub: "Bersemangat & Positif", emoji: "😊", color: "#FCD34D", bg: "#FFFBEB" },
  { id: "tenang",    label: "Tenang",     sub: "Damai & Seimbang",      emoji: "😌", color: "#93C5FD", bg: "#EFF6FF" },
  { id: "biasa",     label: "Biasa saja", sub: "Netral & Stabil",       emoji: "😐", color: "#D1D5DB", bg: "#F9FAFB" },
  { id: "stres",     label: "Stres",      sub: "Lelah & Tertekan",      emoji: "😟", color: "#FCA5A5", bg: "#FFF1F2" },
  { id: "sedih",     label: "Sedih",      sub: "Murung & Sepi",         emoji: "😢", color: "#C4B5FD", bg: "#F5F3FF" },
];

const MOOD_SCORE = { senang: 5, tenang: 4, biasa: 3, stres: 2, sedih: 1 };

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

/* ─── helpers ─── */
function getWeekScores(history) {
  const today = new Date();
  return DAYS.map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const entry = history.find((h) => h.date === key);
    return entry ? MOOD_SCORE[entry.mood] ?? 3 : null;
  });
}

export default function MoodPage() {
  const [selected, setSelected]   = useState(null);
  const [note, setNote]           = useState("");
  const [saved, setSaved]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [history, setHistory]     = useState([]);
  const [stats, setStats]         = useState(null);
  const { toast, showToast }      = useToast();

  /* load history + stats dari API */
  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.getMoodHistory(30),
      api.getMoodStats(),
    ]).then(([h, s]) => {
      if (!active) return;
      if (h.status === "fulfilled") {
        const data = h.value;
        const list = Array.isArray(data) ? data : (data.history ?? data.entries ?? []);
        setHistory(list.map((e) => ({
          date: e.entry_date ?? e.date ?? e.created_at?.split("T")[0] ?? "",
          mood: e.mood,
          note: e.note ?? "",
        })));
      }
      if (s.status === "fulfilled") setStats(s.value);
    });
    return () => { active = false; };
  }, []);

  const handleSave = async () => {
    if (!selected || saving) return;
    const today = new Date().toISOString().split("T")[0];
    setSaving(true);
    try {
      await api.saveMood({ mood: selected, note, entry_date: today });
      const entry = { date: today, mood: selected, note };
      setHistory((prev) => [entry, ...prev.filter((h) => h.date !== today)]);
      // refresh stats
      api.getMoodStats().then((s) => setStats(s)).catch(() => {});
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setNote("");
      setSelected(null);
    } catch {
      showToast("Gagal menyimpan mood. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  /* chart data */
  const weekScores = getWeekScores(history);
  const chartData = {
    labels: DAYS,
    datasets: [
      {
        label: "Mood",
        data: weekScores,
        fill: true,
        tension: 0.4,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.12)",
        pointBackgroundColor: weekScores.map((v) =>
          v === null ? "transparent" : "#6366f1"
        ),
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: weekScores.map((v) => (v === null ? 0 : 5)),
        spanGaps: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      callbacks: {
        label: (ctx) => {
          const labels = ["", "Sedih", "Stres", "Biasa", "Tenang", "Senang"];
          return " " + (labels[ctx.raw] ?? ctx.raw);
        },
      },
    }},
    scales: {
      y: {
        min: 1, max: 5,
        ticks: {
          stepSize: 1,
          callback: (v) => ["", "😢", "😟", "😐", "😌", "😊"][v] ?? v,
          font: { size: 14 },
        },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 }, color: "#9CA3AF" },
      },
    },
  };

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[#f5f5fb] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Bagaimana perasaanmu hari ini?
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Luangkan waktu sejenak untuk mengenali emosimu. Kesadaran adalah langkah
            pertama menuju kesejahteraan.
          </p>
        </div>

        {/* ── Mood Cards ── */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`flex flex-col items-center py-5 px-2 rounded-2xl border-2 transition-all
                ${selected === m.id
                  ? "border-indigo-500 shadow-lg scale-105"
                  : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md"
                }`}
              style={selected === m.id ? { background: m.bg } : {}}
            >
              {/* Emoji circle */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-3"
                style={{ background: m.bg, border: `2px solid ${m.color}` }}
              >
                {m.emoji}
              </div>
              <p className="text-sm font-bold text-gray-900">{m.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 text-center leading-tight">{m.sub}</p>
            </button>
          ))}
        </div>

        {/* ── Refleksi Harian ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h2 className="text-base font-bold text-gray-900">Refleksi Harian <span className="text-gray-400 font-normal">(Opsional)</span></h2>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Apa yang membuatmu merasa seperti ini hari ini?"
            rows={5}
            className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={!selected || saving}
              className="flex items-center gap-2 px-7 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-md"
            >
              {saved ? "Tersimpan ✓" : saving ? "Menyimpan..." : "Simpan Mood"}
              {!saved && !saving && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Tips + Statistik ── */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {/* Tips */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-700 mb-1">Tips MindMate AI</p>
              <p className="text-xs text-indigo-600 leading-relaxed">
                Menulis jurnal selama 5 menit terbukti dapat menurunkan tingkat stres hingga 30%.
              </p>
            </div>
          </div>

          {/* Statistik dari API */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-indigo-700 mb-2">Statistik Kamu</p>
              {stats ? (
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-lg font-black text-indigo-700">{stats.streak_days}</p>
                    <p className="text-[10px] text-indigo-500">Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-indigo-700">{stats.positive_percent}%</p>
                    <p className="text-[10px] text-indigo-500">Positif</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-indigo-700">{stats.total_entries}</p>
                    <p className="text-[10px] text-indigo-500">Total</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-indigo-600">Mulai catat moodmu hari ini!</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Chart Mood Mingguan ── */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-1">Tren Mood 7 Hari Terakhir</h2>
            <p className="text-xs text-gray-400 mb-5">Visualisasi perubahan suasana hatimu minggu ini</p>
            <div style={{ height: 220 }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* ── Riwayat Mood ── */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Riwayat Mood</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {history.slice(0, 10).map((h, i) => {
                const m = MOODS.find((x) => x.id === h.mood);
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: m?.bg ?? "#f3f4f6" }}
                    >
                      {m?.emoji ?? "😐"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">{m?.label ?? h.mood}</p>
                        <p className="text-[10px] text-gray-400">{h.date}</p>
                      </div>
                      {h.note && <p className="text-xs text-gray-500 mt-0.5 truncate">{h.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-[#f5f5fb] mt-4">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <p className="text-indigo-600 font-bold text-sm">MindMate AI</p>
            <p className="text-gray-400 text-xs">© 2024 MindMate AI. Your emotional wellbeing partner.</p>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <Link href="#" className="hover:text-indigo-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-indigo-600">Terms of Service</Link>
            <Link href="#" className="hover:text-indigo-600">Help Center</Link>
          </div>
        </div>
      </footer>
      {toast}
    </div>
    </AuthGuard>
  );
}
