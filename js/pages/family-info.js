/* ============================================================
   صندوق اتحاد - اطلاعات کلی خانواده
   نسخه: 2.0
   ============================================================ */

function renderFamilyInfoContent() {
    if (!isHeadOfHousehold()) {
        return `
            <div class="info-box"><i class="fas fa-users-cog"></i> اطلاعات کلی خانواده</div>
            <div class="dashboard-section" style="text-align:center;padding:30px;">
                <i class="fas fa-lock" style="font-size:2.4rem;color:#e53e3e;margin-bottom:12px;"></i>
                <p style="color:var(--text-secondary);font-size:0.9rem;">فقط سرپرست خانوار دسترسی دارد</p>
            </div>
        `;
    }

    const currentMember = members.find(m => m.id === currentUser.memberId);
    const familyMembers = getFamilyMembers();
    const allFamily = [currentMember, ...familyMembers].filter(m => m !== undefined);

    const totalBalance = allFamily.reduce((sum, m) => sum + (m.balance || 0), 0);
    const totalDebt = allFamily.reduce((sum, m) => sum + (m.loanBalance || 0), 0);
    const totalSavings = allFamily.reduce((sum, m) => sum + (m.savingsStatus || 0), 0);
    const totalOverdue = allFamily.reduce((sum, m) => sum + Math.abs(m.overdueInstallments || 0), 0);

    let tableHtml = `
        <div class="family-info-table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ردیف</th>
                        <th>نام</th>
                        <th>شماره حساب</th>
                        <th>موجودی</th>
                        <th>بدهی</th>
                        <th>معوقه</th>
                        <th>پس‌انداز</th>
                        <th>نقش</th>
                        <th>تلفن</th>
                    </tr>
                </thead>
                <tbody>
    `;

    allFamily.forEach((m, idx) => {
        const savingsClass = m.savingsStatus >= 0 ? 'positive' : 'negative';
        const overdueClass = m.overdueInstallments >= 0 ? 'positive' : 'negative';
        const role = getFamilyRole(m.heh2);
        tableHtml += `
            <tr>
                <td>${idx + 1}</td>
                <td style="font-weight:bold;">${esc(m.firstName)}${m.id === currentMember.id ? ' ★' : ''}</td>
                <td>${esc(m.accountNumber)}</td>
                <td class="positive">${fmtNum(m.balance || 0)}</td>
                <td class="negative">${fmtNum(m.loanBalance || 0)}</td>
                <td class="${overdueClass}">${Math.abs(m.overdueInstallments || 0)}</td>
                <td class="${savingsClass}">${fmtNum(m.savingsStatus || 0)}</td>
                <td>${role ? role.label : '---'}</td>
                <td>${esc(m.phone1 || '---')}</td>
            </tr>
        `;
    });

    tableHtml += `
                </tbody>
            </table>
        </div>
    `;

    return `
        <div class="info-box"><i class="fas fa-users-cog"></i> اطلاعات کلی خانواده</div>
        <div class="dashboard-section" style="border-right-color:var(--success-color);">
            <h3><i class="fas fa-chart-pie" style="color:var(--success-color);"></i> خلاصه مالی</h3>
            <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);">
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-wallet" style="color:var(--success-color);"></i></div><div class="stat-value green">${fmtNum(totalBalance)}</div><div class="stat-label">جمع موجودی</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-hand-holding-usd" style="color:var(--danger-color);"></i></div><div class="stat-value red">${fmtNum(totalDebt)}</div><div class="stat-label">جمع بدهی</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-piggy-bank" style="color:var(--purple-color);"></i></div><div class="stat-value purple">${fmtNum(totalSavings)}</div><div class="stat-label">جمع پس‌انداز</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-exclamation-triangle" style="color:var(--gold-color);"></i></div><div class="stat-value gold">${fmtNum(totalOverdue)}</div><div class="stat-label">جمع معوقه</div></div>
            </div>
        </div>
        <div class="dashboard-section">
            <h3><i class="fas fa-table" style="color:var(--gradient-start);"></i> اطلاعات کامل اعضا</h3>
            ${tableHtml}
            <div style="margin-top:8px;font-size:0.6rem;color:var(--text-secondary);display:flex;gap:12px;flex-wrap:wrap;">
                <span class="positive">★ شما</span> 
                <span class="positive">✅ مثبت</span> 
                <span class="negative">❌ منفی</span>
            </div>
        </div>
    `;
}
