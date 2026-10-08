/* ============================================================
   صندوق اتحاد - دسترسی‌های شورا
   نسخه: 2.0
   ============================================================ */

function renderAccessContent() {
    if (!hasCouncilOrAdminAccess()) {
        return `
            <div class="info-box"><i class="fas fa-lock"></i> دسترسی محدود</div>
            <div class="dashboard-section" style="text-align:center;padding:30px;">
                <i class="fas fa-lock" style="font-size:2.4rem;color:#e53e3e;margin-bottom:12px;"></i>
                <p style="color:var(--text-secondary);font-size:0.9rem;">فقط اعضای شورا و مدیر دسترسی دارند</p>
            </div>
        `;
    }

    const stats = {
        council: members.filter(m => m.isCouncil === true).length,
        head: members.filter(m => m.heh2 && String(m.heh2).trim() === '01').length,
        overdue: members.filter(m => m.overdueInstallments < 0).length,
        inactive: members.filter(m => m.active === false).length,
        total: members.length
    };

    const councilMembers = members.filter(m => m.isCouncil === true);
    const overdueMembersList = members.filter(m => Math.abs(m.overdueInstallments || 0) > 0);

    const councilHtml = `
        <div class="dashboard-section" style="border-right-color:var(--gold-color);">
            <h3><i class="fas fa-crown" style="color:var(--gold-color);"></i> اعضای شورا (${councilMembers.length} نفر)</h3>
            ${councilMembers.length === 0 ? '<p style="color:var(--text-secondary);padding:10px;font-size:0.75rem;">عضو شورایی ثبت نشده</p>' : `
            <div class="excel-table-wrapper" style="max-height:none;">
                <table class="excel-table" style="min-width:300px;">
                    <thead><tr><th>نام</th><th>شماره حساب</th><th>تلفن</th></tr></thead>
                    <tbody>
                        ${councilMembers.map((m) => `
                            <tr><td style="font-weight:bold;">${esc(m.firstName)}</td><td>${esc(m.accountNumber)}</td><td>${esc(m.phone1 || '---')}</td></tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`}
        </div>
    `;

    const overdueHtml = `
        <div class="dashboard-section" style="border-right-color:var(--danger-color);">
            <h3><i class="fas fa-exclamation-triangle" style="color:var(--danger-color);"></i> افراد دارای قسط معوقه (${overdueMembersList.length} نفر)</h3>
            ${overdueMembersList.length === 0 ? '<p style="color:var(--text-secondary);padding:10px;font-size:0.75rem;">معوقه‌ای نیست</p>' : `
            <div class="excel-table-wrapper" style="max-height:none;">
                <table class="excel-table" style="min-width:300px;">
                    <thead><tr><th>نام</th><th>شماره حساب</th><th style="color:#fff;">تعداد معوقه</th></tr></thead>
                    <tbody>
                        ${overdueMembersList.map((m) => `
                            <tr><td style="font-weight:bold;">${esc(m.firstName)}</td><td>${esc(m.accountNumber)}</td><td style="color:var(--danger-color);font-weight:bold;">${Math.abs(m.overdueInstallments || 0)}</td></tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`}
        </div>
    `;

    let tableHtml = `
        <div class="access-table-wrapper">
            <table class="access-table">
                <thead>
                    <tr>
                        <th style="min-width:60px;">نام</th>
                        <th>شماره حساب</th>
                        <th>تلفن</th>
                        <th style="color:#fff;">اقساط معوقه</th>
                        <th>وضعیت</th>
                        <th>نقش</th>
                    </tr>
                </thead>
                <tbody>
    `;

    members.forEach(m => {
        const role = getFamilyRole(m.heh2);
        const overdueCount = Math.abs(m.overdueInstallments || 0);
        const overdueClass = overdueCount > 0 ? 'overdue-badge' : 'overdue-badge zero';
        tableHtml += `
            <tr>
                <td style="font-weight:bold;font-size:0.55rem;color:var(--text-primary);">${esc(m.firstName)}</td>
                <td style="font-size:0.5rem;">${esc(m.accountNumber)}</td>
                <td style="font-size:0.45rem;">${esc(m.phone1 || '---')}</td>
                <td class="${overdueClass}" style="font-size:0.55rem;">${overdueCount}</td>
                <td><span class="account-status-badge ${m.active !== false ? 'active' : 'inactive'}" style="font-size:0.45rem;padding:2px 8px;">${m.active !== false ? 'فعال' : 'غیرفعال'}</span></td>
                <td style="font-size:0.45rem;">${role ? role.label : '---'}</td>
            </tr>
        `;
    });

    tableHtml += `</tbody></table></div>`;

    return `
        <div class="info-box"><i class="fas fa-key"></i> دسترسی‌های شورا</div>
        <div class="stats-boxes">
            <div class="stat-box" style="border-right:4px solid var(--purple-color);"><div style="font-size:1.2rem;font-weight:bold;">${fmtNum(stats.council)}</div><div style="font-size:0.55rem;color:var(--text-secondary);">شورا</div></div>
            <div class="stat-box" style="border-right:4px solid var(--gold-color);"><div style="font-size:1.2rem;font-weight:bold;">${fmtNum(stats.head)}</div><div style="font-size:0.55rem;color:var(--text-secondary);">سرپرستان</div></div>
            <div class="stat-box" style="border-right:4px solid var(--danger-color);"><div style="font-size:1.2rem;font-weight:bold;">${fmtNum(stats.overdue)}</div><div style="font-size:0.55rem;color:var(--text-secondary);">معوقه</div></div>
            <div class="stat-box" style="border-right:4px solid var(--danger-color);"><div style="font-size:1.2rem;font-weight:bold;">${fmtNum(stats.inactive)}</div><div style="font-size:0.55rem;color:var(--text-secondary);">غیرفعال</div></div>
            <div class="stat-box" style="border-right:4px solid var(--teal-color);"><div style="font-size:1.2rem;font-weight:bold;">${fmtNum(stats.total)}</div><div style="font-size:0.55rem;color:var(--text-secondary);">کل اعضا</div></div>
        </div>
        ${councilHtml}
        ${overdueHtml}
        <div class="dashboard-section">
            <h3><i class="fas fa-table" style="color:var(--gradient-start);"></i> اطلاعات کامل اعضا</h3>
            ${tableHtml}
        </div>
    `;
}
