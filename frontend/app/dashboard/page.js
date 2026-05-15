"use client";

import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const moodData = [
    { day: "Sen", value: 65 },
    { day: "Sel", value: 78 },
    { day: "Rab", value: 62 },
    { day: "Kam", value: 85 },
    { day: "Jum", value: 70 },
    { day: "Sab", value: 88 },
    { day: "Min", value: 92 },
  ];

  const lineChartData = {
    labels: moodData.map(d => d.day),
    datasets: [
      {
        label: "Mood Score",
        data: moodData.map(d => d.value),
        fill: true,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(99, 102, 241)",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: "#1e1e1e",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "rgba(0, 0, 0, 0.03)" },
        ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' },
      },
    },
  };

  const doughnutData = {
    labels: ["Senang", "Tenang", "Biasa", "Sedih"],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: [
          "#818cf8", // indigo-400
          "#34d399", // emerald-400
          "#94a3b8", // slate-400
          "#f87171", // red-400
        ],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "75%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 25,
          font: { size: 11, weight: '600' },
          color: '#64748b'
        },
      },
    },
  };

  const insights = [
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Ketentangan Emosi",
      description: "Anda cenderung merasa lebih tenang di sore hari setelah aktivitas ringan.",
      color: "bg-indigo-50/50 border-indigo-100"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Pemicu Energi",
      description: "Interaksi sosial pagi hari memberikan dorongan mood yang signifikan.",
      color: "bg-emerald-50/50 border-emerald-100"
    }
  ];

  const weeklyStats = [
    { label: "Rata-rata Mood", value: "8.2", change: "+0.5", positive: true, unit: "/10" },
    { label: "Produktivitas", value: "86", change: "+12%", positive: true, unit: "%" },
    { label: "Tingkat Stres", value: "Rendah", change: "-5%", positive: true, unit: "" },
    { label: "Kualitas Tidur", value: "Baik", change: "+8%", positive: true, unit: "" },
  ];

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Live Insights
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-none">Wawasan Kesehatan Mental</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Analisis cerdas berdasarkan pola interaksi harian Anda untuk membantu mencapai keseimbangan emosional.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm">
              Unduh Laporan
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
              Bagikan Progres
            </button>
          </div>
        </header>

        {/* Weekly Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {weeklyStats.map((stat, index) => (
            <div key={index} className="group bg-white rounded-[32px] p-7 border border-slate-100 hover:border-indigo-100 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                  <span className="text-sm font-bold text-slate-400">{stat.unit}</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  {stat.positive ? "↑" : "↓"} {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mood Chart */}
          <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Tren Mood Mingguan</h2>
                <p className="text-sm font-medium text-slate-400">Analisis fluktuasi emosional selama 7 hari terakhir.</p>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button className="px-4 py-1.5 bg-white text-indigo-600 text-xs font-bold rounded-xl shadow-sm transition-all">Minggu</button>
                <button className="px-4 py-1.5 text-slate-400 text-xs font-bold rounded-xl hover:text-slate-600 transition-all">Bulan</button>
              </div>
            </div>

            <div className="h-80 w-full">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>          {/* Mood Distribution */}
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-full mb-10">
              <h2 className="text-2xl font-black text-slate-900 mb-1 text-center">Komposisi Mood</h2>
              <p className="text-sm font-medium text-slate-400 text-center">Distribusi perasaan dominan Anda.</p>
            </div>
            
            <div className="relative flex-1 flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-[240px] aspect-square">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              {/* Center text for Doughnut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-14">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">75%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Positif</span>
              </div>
            </div>

            <div className="w-full mt-4 p-6 bg-slate-50 border border-slate-100 rounded-[32px]">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Wawasan Cepat</span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Anda menunjukkan peningkatan <span className="text-indigo-600 font-bold">15%</span> dalam mood positif dibandingkan minggu lalu.
              </p>
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
             <h2 className="text-2xl font-black text-slate-900 px-2">Wawasan Mendalam</h2>
             <div className="grid gap-4">
                {insights.map((insight, index) => (
                  <div key={index} className={`p-6 rounded-[32px] border border-slate-100 ${insight.color} flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300 cursor-default`}>
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-50">{insight.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{insight.title}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-6">Rekomendasi Minggu Ini</h2>
              <div className="space-y-4">
                {[
                  { 
                    icon: (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    ), 
                    title: "Meditasi Pagi", 
                    time: "10 mnt", 
                    color: "bg-white/10" 
                  },
                  { 
                    icon: (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5H19V11H13V5ZM13 13H19V19H13V13ZM5 5H11V11H5V5ZM5 13H11V19H5V13Z" />
                      </svg>
                    ), 
                    title: "Jalan Santai", 
                    time: "20 mnt", 
                    color: "bg-white/10" 
                  },
                  { 
                    icon: (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    ), 
                    title: "Journaling", 
                    time: "05 mnt", 
                    color: "bg-white/10" 
                  },
                ].map((item, i) => (
                  <div key={i} className={`${item.color} backdrop-blur-md rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all`}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center">{item.icon}</span>
                      <span className="text-sm font-bold">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 group-hover:text-white transition-colors">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="relative z-10 mt-8 w-full py-4 bg-white text-indigo-900 rounded-2xl text-sm font-black hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-950/20">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}