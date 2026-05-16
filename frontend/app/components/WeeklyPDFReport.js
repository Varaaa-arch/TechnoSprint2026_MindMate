"use client";

const MOOD_LABEL = {
  senang: "Senang", tenang: "Tenang", biasa: "Biasa",
  stres: "Stres", sedih: "Sedih", cemas: "Cemas", marah: "Marah",
};

const MOOD_BAR_COLOR = {
  senang: "#818cf8", tenang: "#34d399", biasa: "#94a3b8",
  sedih: "#c4b5fd", stres: "#fb923c", cemas: "#facc15", marah: "#f87171",
};

export function printWeeklyReport({ weekly, stats, insights, daily }) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const trendRows = (weekly?.mood_trend ?? []).map((d) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-weight:600;color:#475569">${d.day}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9">
        ${d.score != null
          ? `<div style="display:flex;align-items:center;gap:8px">
               <div style="height:8px;width:${d.score * 20}%;background:#6366f1;border-radius:99px;min-width:4px"></div>
               <span style="font-weight:700;color:#1e293b">${d.score}/5</span>
             </div>`
          : '<span style="color:#cbd5e1">Tidak ada data</span>'
        }
      </td>
    </tr>
  `).join("");

  const highlightItems = (insights?.highlights ?? []).map((h) =>
    `<li style="margin-bottom:6px;color:#475569">${h}</li>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Mood Mingguan — MindMate</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: #fff; padding: 40px; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
    h1 { font-size: 24px; font-weight: 900; color: #1e293b; }
    h2 { font-size: 14px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
    .badge { display: inline-block; padding: 4px 12px; background: #eef2ff; color: #4f46e5; border-radius: 99px; font-size: 11px; font-weight: 700; margin-top: 6px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 20px; }
    .stat-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
    .stat-value { font-size: 28px; font-weight: 900; color: #1e293b; }
    .stat-unit { font-size: 13px; color: #94a3b8; font-weight: 600; }
    .section { margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 10px 12px; background: #f8fafc; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
    .summary-box { background: #eef2ff; border-left: 4px solid #6366f1; border-radius: 8px; padding: 16px 20px; margin-bottom: 28px; }
    .summary-text { font-size: 14px; line-height: 1.7; color: #374151; }
    ul { padding-left: 20px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Laporan Mood Mingguan</h1>
      <div class="badge">MindMate AI</div>
    </div>
    <div style="text-align:right;font-size:13px;color:#64748b">
      <div style="font-weight:700">${today}</div>
      <div>7 hari terakhir</div>
    </div>
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Rata-rata Mood</div>
      <div class="stat-value">${weekly?.average_mood_score?.toFixed(1) ?? "—"}<span class="stat-unit">/5</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Mood Positif</div>
      <div class="stat-value">${stats?.positive_percent ?? 0}<span class="stat-unit">%</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Streak</div>
      <div class="stat-value">${stats?.streak_days ?? 0}<span class="stat-unit"> hari</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Entri</div>
      <div class="stat-value">${stats?.total_entries ?? 0}</div>
    </div>
  </div>

  ${daily?.summary_text ? `
  <div class="section">
    <h2>Ringkasan Harian AI</h2>
    <div class="summary-box">
      <div class="summary-text">${daily.summary_text}</div>
    </div>
  </div>` : ""}

  <div class="section">
    <h2>Tren Mood 7 Hari</h2>
    <table>
      <thead><tr><th>Hari</th><th>Skor Mood</th></tr></thead>
      <tbody>${trendRows}</tbody>
    </table>
  </div>

  ${highlightItems ? `
  <div class="section">
    <h2>Insight Personal</h2>
    <ul>${highlightItems}</ul>
  </div>` : ""}

  <div class="footer">
    <span>MindMate AI — Pendampingan Kesehatan Mental</span>
    <span>Laporan ini bukan pengganti konsultasi profesional</span>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 300);
}
