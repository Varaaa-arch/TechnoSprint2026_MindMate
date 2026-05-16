"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useToast } from "../components/Toast";
import api from "../../lib/api";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

const MOOD_COLOR = {
  senang: "#818cf8", tenang: "#34d399", biasa: "#94a3b8",
  sedih: "#f87171", stres: "#fb923c", cemas: "#facc15", marah: "#ef4444",
};

function StatCard({ label, value, unit, change, positive }) {
  return (
    <div className="group bg-white rounded-[32px] p-7 border border-slate-100 hover:border-indigo-100 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
      <div className="relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{value ?? "—"}</span>
          {unit && <span className="text-sm font-bold text-slate-400">{unit}</span>}
        </div>
        {change != null && (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            {positive ? "↑" : "↓"} {change}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [weekly, setWeekly]   = useState(null);
  const [insights, setInsights] = useState(null);
  const [recs, setRecs]       = useState(null);
  const [stats, setStats]     = useState(null);
  const [daily, setDaily]     = useState(null);
  const [loading, setLoading] = useState(true);

  const { toast, showToast } = useToast();

  useEffect(() => {
    Promise.allSettled([
      api.getWeeklyReport(),
      api.getInsights(),
      api.getRecommendations(),
      api.getMoodStats(),
      api.getDailySummary(),
    ]).then(([w, i, r, s, d]) => {
      if (w.status === "fulfilled") setWeekly(w.value);
      else showToast("Gagal memuat data tren mingguan.");
      if (i.status === "fulfilled") setInsights(i.value);
      if (r.status === "fulfilled") setRecs(r.value);
      if (s.status === "fulfilled") setStats(s.value);
      if (d.status === "fulfilled") setDaily(d.value);
      if ([w, i, r, s, d].every((x) => x.status === "rejected"))
        showToast("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
      setLoading(false);
    });
  }, []);

  /* ── Chart data ── */
  const trendLabels = weekly?.mood_trend?.map((d) => d.day) ?? ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];
  const trendScores = weekly?.mood_trend?.map((d) => d.score ?? 0) ?? [0,0,0,0,0,0,0];

  const lineData = {
    labels: trendLabels,
    datasets: [{
      label: "Mood Score",
      data: trendScores,
      fill: true,
      borderColor: "rgb(99,102,241)",
      backgroundColor: "rgba(99,102,241,0.1)",
      tension: 0.4,
      pointBackgroundColor: "white",
      pointBorderColor: "rgb(99,102,241)",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false, backgroundColor: "#1e1e1e", padding: 12, cornerRadius: 8 } },
    scales: {
      y: { beginAtZero: true, max: 5, grid: { color: "rgba(0,0,0,0.03)" }, ticks: { font: { size: 10, weight: "600" }, color: "#94a3b8" } },
      x: { grid: { display: false }, ticks: { font: { size: 10, weight: "600" }, color: "#94a3b8" } },
    },
  };

  /* Doughnut dari mood history — pakai dominant_mood + positive_percent dari stats */
  const positivePercent = stats?.positive_percent ?? 0;
  const dominantMood    = stats?.dominant_mood ?? null;

  const doughnutData = {
    labels: ["Positif", "Lainnya"],
    datasets: [{
      data: [positivePercent, Math.max(0, 100 - positivePercent)],
      backgroundColor: ["#818cf8", "#e2e8f0"],
      borderWidth: 0,
      hoverOffset: 10,
    }],
  };

  const doughnutOptions = {
    cutout: "75%",
    plugins: { legend: { display: false } },
  };

  /* ── Stat cards ── */
  const avgScore = weekly?.average_mood_score;
  const streak   = stats?.streak_days;

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Navbar />

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Live Insights
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-none">Wawasan Kesehatan Mental</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Analisis berdasarkan pola mood dan percakapan harian kamu.
            </p>
          </div>
        </header>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <StatCard label="Rata-rata Mood" value={avgScore?.toFixed(1) ?? "—"} unit="/5" />
              <StatCard label="Mood Positif"   value={`${positivePercent}%`} />
              <StatCard label="Streak"         value={streak ?? 0} unit=" hari" />
              <StatCard label="Total Entri"    value={stats?.total_entries ?? 0} />
            </div>

            {/* Daily AI Summary Card */}
            {daily?.summary_text && (
              <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl" />
                <div className="relative z-10 flex items-start gap-5">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Ringkasan Harian AI</p>
                      {daily.generated_by === "openai" && (
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold">GPT-4o-mini</span>
                      )}
                    </div>
                    <p className="text-base font-medium leading-relaxed">{daily.summary_text}</p>
                    {daily.highlights?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {daily.highlights.map((h, i) => (
                          <span key={i} className="px-3 py-1 bg-white/15 rounded-full text-xs font-medium">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Line Chart */}
              <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
                <div className="mb-10">
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Tren Mood Mingguan</h2>
                  <p className="text-sm font-medium text-slate-400">{weekly?.summary ?? "7 hari terakhir"}</p>
                </div>
                <div className="h-80 w-full">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>

              {/* Doughnut */}
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col items-center">
                <div className="w-full mb-10 text-center">
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Komposisi Mood</h2>
                  <p className="text-sm font-medium text-slate-400">Distribusi perasaan dominan kamu.</p>
                </div>
                <div className="relative w-full max-w-[220px] aspect-square">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black text-slate-900">{positivePercent}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Positif</span>
                  </div>
                </div>
                {dominantMood && (
                  <div className="w-full mt-6 p-5 bg-slate-50 border border-slate-100 rounded-[28px]">
                    <p className="text-xs font-bold text-slate-500 mb-1">Mood Dominan</p>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: MOOD_COLOR[dominantMood] ?? "#818cf8" }} />
                      <span className="text-sm font-bold text-slate-900 capitalize">{dominantMood}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Insights + Recommendations */}
            <div className="mt-8 grid lg:grid-cols-2 gap-8">
              {/* Insights */}
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 px-2">Wawasan Mendalam</h2>
                {insights?.highlights?.length ? (
                  <div className="grid gap-4">
                    {insights.highlights.map((text, i) => (
                      <div key={i} className="p-6 rounded-[32px] border border-indigo-100 bg-indigo-50/50 flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-50 shrink-0">
                          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 px-2">Mulai catat mood harian untuk mendapatkan insight personal.</p>
                )}
              </div>

              {/* Recommendations */}
              <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-6">Rekomendasi Minggu Ini</h2>
                  <div className="space-y-4">
                    {(recs?.recommendations ?? []).slice(0, 3).map((item) => (
                      <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-start gap-3 hover:bg-white/20 transition-all">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className="text-sm font-bold">{item.title}</p>
                            {item.duration_minutes && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 shrink-0">
                                {item.duration_minutes} mnt
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-indigo-300 leading-relaxed">{item.description}</p>
                          {item.reason && (
                            <p className="text-[10px] text-indigo-400 mt-1.5 italic">{item.reason}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {!recs?.recommendations?.length && (
                      <p className="text-sm text-indigo-300">Catat mood atau mulai chat untuk mendapat rekomendasi.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    {toast}
    </AuthGuard>
  );
}
