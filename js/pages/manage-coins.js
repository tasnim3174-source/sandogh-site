/* ============================================================
   صندوق اتحاد - مدیریت امتیازها
   نسخه: 2.0
   ============================================================ */

function renderManageCoinsContent() {
    if (!hasCouncilOrAdminAccess()) {
        return `
            <div class="info-box"><i class="fas fa-lock"></i> دسترسی محدود</div>
            <div class="dashboard-section" style="text-align:center;padding:30px;">
                <i class="fas fa-lock" style="font-size:2.4rem;color:#e53e3e;margin-bottom:12px;"></i>
                <p style="color:var(--text-secondary);font-size:0.9rem;">فقط اعضای شورا و مدیر دسترسی دارند</p>
            </div>
        `;
    }

    const goldCount = members.filter(m => (memberScores[m.id]?.score || 0) >= 80).length;
    const silverCount = members.filter(m => (memberScores[m.id]?.score || 0) >= 50 && (memberScores[m.id]?.score || 0) < 80).length;

    let rankHtml = `
        <div class="dashboard-section" style="border-right-color:var(--gold-color);background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(217,119,6,0.06));">
            <h3><i class="fas fa-chart-bar" style="color:var(--gold-color);"></i> رتبه‌بندی اعضا</h3>
            <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);">
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-star" style="color:#FFD700;"></i></div><div class="stat-value gold">${fmtNum(goldCount)}</div><div class="stat-label">طلایی</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-star" style="color:#C0C0C0;"></i></div><div class="stat-value" style="color:#C0C0C0;">${fmtNum(silverCount)}</div><div class="stat-label">نقره‌ای</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-star" style="color:#6B7280;"></i></div><div class="stat-value" style="color:#6B7280;">${fmtNum(members.length - goldCount - silverCount)}</div><div class="stat-label">سیاه</div></div>
            </div>
        </div>
        <div class="dashboard-section">
            <h3><i class="fas fa-coins" style="color:var(--gold-color);"></i> امتیازات اعضا</h3>
            <div style="overflow-x:auto;">
                <table class="access-table" style="min-width:400px;font-size:0.55rem;">
                    <thead><tr><th>رتبه</th><th>نام</th><th style="color:#fff;">امتیاز</th><th>سکه</th></tr></thead>
                    <tbody>
                        ${[...members].sort((a, b) => (memberScores[b.id]?.score || 0) - (memberScores[a.id]?.score || 0)).map((m, idx) => {
                            const sd = memberScores[m.id];
                            const coins = getMemberCoins(m.id);
                            return `
                                <tr>
                                    <td style="font-weight:bold;font-size:0.55rem;">${idx + 1}</td>
                                    <td style="font-size:0.5rem;">${esc(m.firstName)}</td>
                                    <td style="color:var(--gold-color);font-size:0.55rem;font-weight:bold;">${sd?.score || 0}</td>
                                    <td style="font-size:0.5rem;">${fmtNum(coins)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return `
        <div class="info-box" style="background:linear-gradient(135deg,#f59e0b15,#d9770615);border-right-color:#f59e0b;">
            <i class="fas fa-coins" style="color:#f59e0b;"></i> مدیریت امتیازها
        </div>
        ${rankHtml}
    `;
}
