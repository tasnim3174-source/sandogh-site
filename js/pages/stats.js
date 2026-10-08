/* ============================================================
   صندوق اتحاد - اطلاعات و آمار
   نسخه: 2.0
   ============================================================ */

function renderInfoStatsContent() {
    if (!hasCouncilOrAdminAccess()) {
        return `
            <div class="info-box"><i class="fas fa-lock"></i> دسترسی محدود</div>
            <div class="dashboard-section" style="text-align:center;padding:30px;">
                <i class="fas fa-lock" style="font-size:2.4rem;color:#e53e3e;margin-bottom:12px;"></i>
                <p style="color:var(--text-secondary);font-size:0.9rem;">فقط اعضای شورا و مدیر دسترسی دارند</p>
            </div>
        `;
    }

    const totalMembers = members.length;
    const totalTransactions = transactions.length;
    const totalBalanceSum = members.reduce((sum, m) => sum + (m.balance || 0), 0);
    const totalLoanSum = members.reduce((sum, m) => sum + (m.loanBalance || 0), 0);
    const totalSavings = members.reduce((sum, m) => sum + (m.savingsStatus || 0), 0);
    const totalOverdue = members.reduce((sum, m) => sum + Math.abs(m.overdueInstallments || 0), 0);
    const membersWithLoan = members.filter(m => (m.loanBalance > 0) || (m.loanReceivedAmount > 0) || (m.totalInstallments > 0)).length;

    const t = getTodayShamsi();
    const birthdays = [];
    members.forEach(m => {
        if (!m.birthDateShamsi) return;
        let dateStr = String(m.birthDateShamsi).trim();
        let year, month, day;

        if (/^\d{8}$/.test(dateStr)) {
            year = dateStr.substring(0, 4);
            month = dateStr.substring(4, 6);
            day = dateStr.substring(6, 8);
        } else {
            dateStr = dateStr.replace(/[-.]/g, '/');
            const parts = dateStr.split('/');
            if (parts.length !== 3) return;
            year = parts[0];
            month = parts[1];
            day = parts[2];
        }

        if (+month === t.m) {
            birthdays.push({ member: m, day: +day, fullDate: `${year}/${month}/${day}` });
        }
    });
    birthdays.sort((a, b) => a.day - b.day);
    const overdueMembers = members.filter(m => m.overdueInstallments < 0);

    return `
        <div class="info-box"><i class="fas fa-chart-pie"></i> اطلاعات و آمار</div>
        <div class="dashboard-section" style="border-right-color:var(--gold-color);background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(217,119,6,0.06));">
            <h3><i class="fas fa-chart-bar" style="color:var(--gold-color);"></i> آمار کلی</h3>
            <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);">
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-users" style="color:var(--gradient-start);"></i></div><div class="stat-value">${fmtNum(totalMembers)}</div><div class="stat-label">کل اعضا</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-file-invoice" style="color:var(--gold-color);"></i></div><div class="stat-value gold">${fmtNum(totalTransactions)}</div><div class="stat-label">تراکنش‌ها</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-wallet" style="color:var(--success-color);"></i></div><div class="stat-value green">${fmtNum(totalBalanceSum)}</div><div class="stat-label">جمع موجودی</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-hand-holding-usd" style="color:var(--danger-color);"></i></div><div class="stat-value red">${fmtNum(totalLoanSum)}</div><div class="stat-label">جمع وام</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-piggy-bank" style="color:var(--purple-color);"></i></div><div class="stat-value purple">${fmtNum(totalSavings)}</div><div class="stat-label">جمع پس‌انداز</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-users" style="color:var(--blue-color);"></i></div><div class="stat-value blue">${fmtNum(membersWithLoan)}</div><div class="stat-label">دارای وام</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-hourglass-half" style="color:var(--gold-color);"></i></div><div class="stat-value gold">${fmtNum(totalOverdue)}</div><div class="stat-label">جمع معوقه</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-calendar" style="color:var(--teal-color);"></i></div><div class="stat-value teal">${birthdays.length}</div><div class="stat-label">تولد این ماه</div></div>
            </div>
        </div>
        <div class="dashboard-section" style="border-right-color:#14b8a6;">
            <h3><i class="fas fa-birthday-cake" style="color:#14b8a6;"></i> تولدهای این ماه (${birthdays.length} نفر)</h3>
            ${birthdays.length === 0 ? '<p style="color:var(--text-secondary);padding:10px;font-size:0.75rem;">تولدی ثبت نشده</p>' :
                birthdays.map(b => {
                    const isToday = (b.day === t.d);
                    return `<div style="padding:8px 10px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;gap:8px;">
                        <span style="font-size:1rem;">🎂</span>
                        <span style="font-size:0.75rem;font-weight:700;color:var(--text-primary);">${esc(b.member.firstName)}</span>
                        <span style="font-size:0.65rem;color:var(--text-secondary);">روز ${b.day} ماه</span>
                        ${isToday ? '<span style="background:var(--gold-color);color:#fff;padding:2px 8px;border-radius:99px;font-size:0.6rem;font-weight:800;margin-right:auto;">امروز 🎉</span>' : ''}
                    </div>`;
                }).join('')}
        </div>
        <div class="dashboard-section" style="border-right-color:#f97316;">
            <h3><i class="fas fa-hand-holding-usd" style="color:#f97316;"></i> معوقه‌ها (${overdueMembers.length} نفر)</h3>
            ${overdueMembers.length === 0 ? '<p style="color:var(--text-secondary);padding:10px;font-size:0.75rem;">معوقه‌ای نیست</p>' :
                overdueMembers.map(m => `<div style="padding:6px 10px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;"><span style="font-size:0.7rem;">${esc(m.firstName)}</span><span style="font-size:0.6rem;color:var(--danger-color);">${Math.abs(m.overdueInstallments)} قسط</span></div>`).join('')}
        </div>
    `;
}
