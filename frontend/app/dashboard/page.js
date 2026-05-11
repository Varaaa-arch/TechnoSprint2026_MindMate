"use client";

import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const moodData = [
    { day: "Sen", value: 70 },
    { day: "Sel", value: 85 },
    { day: "Rab", value: 60 },
    { day: "Kam", value: 90 },
    { day: "Jum", value: 75 },
    { day: "Sab", value: 80 },
    { day: "Min", value: 95 },
  ];

  const insights = [
    {
      icon: "🌟",
      title: "Pola Tidur Baik",
      description: "Anda tidur rata-rata 7.5 jam per malam minggu ini. Pertahankan!",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: "⚡",
      title: "Aktivitas Fisik",
      description: "Olahraga 3x minggu ini meningkatkan mood Anda sebesar 25%.",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: "🎯",
      title: "Manajemen Stres",
      description: "Meditasi pagi membantu mengurangi tingkat kecemasan Anda.",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: "💬",
      title: "Interaksi Sosial",
      description: "Berbicara dengan teman meningkatkan mood positif Anda.",
      color: "bg-yellow-50 border-yellow-200"
    }
  ];

  const weeklyStats = [
    { label: "Mood Rata-rata", value: "8.2/10", change: "+0.5", positive: true },
    { label: "Hari Produktif", value: "6/7", change: "+1", positive: true },
    { label: "Tingkat Stres", value: "Rendah", change: "-15%", positive: true },
    { label: "Kualitas Tidur", value: "Baik", change: "+10%", positive: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Insights</h1>
          <p className="text-gray-600">
            Analisis mendalam tentang kesehatan mental Anda berdasarkan data yang telah dikumpulkan.
          </p>
        </div>

        {/* Weekly Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {weeklyStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className={`text-sm font-semibold ${stat.positive ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
                {stat.positive ? "↑" : "↓"} {stat.change}
                <span className="text-gray-500 font-normal">dari minggu lalu</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mood Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Tren Mood Mingguan</h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>7 Hari Terakhir</option>
                <option>30 Hari Terakhir</option>
                <option>3 Bulan Terakhir</option>
              </select>
            </div>

            <div className="flex items-end justify-between h-64 gap-4">
              {moodData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: "100%" }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all hover:from-indigo-700 hover:to-purple-600"
                      style={{ height: `${data.value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{data.day}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-indigo-600 to-purple-500 rounded"></div>
                <span className="text-sm text-gray-600">Mood Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Distribusi Mood</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">😊 Senang</span>
                  <span className="text-sm font-bold text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">😌 Tenang</span>
                  <span className="text-sm font-bold text-gray-900">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">😐 Biasa</span>
                  <span className="text-sm font-bold text-gray-900">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-400 h-2 rounded-full" style={{ width: "15%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">😔 Sedih</span>
                  <span className="text-sm font-bold text-gray-900">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-indigo-50 rounded-xl">
              <p className="text-sm text-indigo-900">
                <span className="font-semibold">Insight:</span> Mood positif Anda meningkat 15% bulan ini! 
                Terus pertahankan kebiasaan baik Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Wawasan Personal</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`${insight.color} border-2 rounded-2xl p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{insight.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{insight.title}</h3>
                    <p className="text-gray-700">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Rekomendasi untuk Anda</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-2xl mb-2">🧘‍♀️</div>
              <h3 className="font-semibold mb-1">Meditasi Pagi</h3>
              <p className="text-sm text-purple-100">Mulai hari dengan 10 menit meditasi untuk mengurangi stres.</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-2xl mb-2">🚶‍♂️</div>
              <h3 className="font-semibold mb-1">Jalan Sore</h3>
              <p className="text-sm text-purple-100">30 menit jalan kaki dapat meningkatkan mood Anda.</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold mb-1">Journaling</h3>
              <p className="text-sm text-purple-100">Tulis perasaan Anda setiap malam untuk refleksi diri.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}