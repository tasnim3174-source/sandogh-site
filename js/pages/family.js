/* ============================================================
   صندوق اتحاد - خانواده من
   نسخه: 2.0
   ============================================================ */

function renderFamilyContent() {
    if (!isHeadOfHousehold()) {
        return `
            <div class="info-box"><i class="fas fa-users"></i> خانواده من</div>
            <div class="dashboard-section" style="text-align:center;padding:30px;">
                <i class="fas fa-lock" style="font-size:2.4rem;color:#e53e3e;margin-bottom:12px;"></i>
                <p style="color:var(--text-secondary);font-size:0.9rem;">فقط سرپرست خانوار دسترسی دارد</p>
            </div>
        `;
    }

    const familyMembers = getFamilyMembers();
    const totalBalance = familyMembers.reduce((sum, m) => sum + (m.balance || 0), 0);
    const totalDebt = familyMembers.reduce((sum, m) => sum + (m.loanBalance || 0), 0);
    const totalOverdue = familyMembers.reduce((sum, m) => sum + Math.abs(m.overdueInstallments || 0), 0);

    return `
        <div class="info-box"><i class="fas fa-users"></i> خانواده من</div>
        <div class="dashboard-section">
            <h3><i class="fas fa-chart-bar" style="color:#ec4899;"></i> خلاصه خانواده</h3>
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-wallet" style="color:var(--success-color);"></i></div><div class="stat-value green">${fmtNum(totalBalance)}</div><div class="stat-label">جمع موجودی</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-hand-holding-usd" style="color:var(--danger-color);"></i></div><div class="stat-value red">${fmtNum(totalDebt)}</div><div class="stat-label">جمع بدهی</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-exclamation-triangle" style="color:var(--gold-color);"></i></div><div class="stat-value gold">${fmtNum(totalOverdue)}</div><div class="stat-label">جمع اقساط معوقه</div></div>
                <div class="stat-card"><div class="stat-icon"><i class="fas fa-users" style="color:var(--blue-color);"></i></div><div class="stat-value blue">${familyMembers.length}</div><div class="stat-label">تعداد اعضا</div></div>
            </div>
        </div>
        <div class="dashboard-section">
            <h3><i class="fas fa-user-friends" style="color:#ec4899;"></i> اعضای خانواده</h3>
            <div class="family-member-list">
                ${familyMembers.length === 0 ? '<p style="color:var(--text-secondary);padding:8px;font-size:0.75rem;">عضو دیگری ثبت نشده</p>' :
                familyMembers.map(m => {
                    const role = getFamilyRole(m.heh2);
                    return `<div class="family-member-chip" onclick="showFamilyMember('${String(m.id)}',this)"><i class="fas ${role ? role.icon : 'fa-user'}"></i> ${esc(m.firstName)}</div>`;
                }).join('')}
            </div>
            <div id="familyMemberDetails"><p style="color:var(--text-secondary);text-align:center;padding:10px;font-size:0.75rem;">روی نام عضو کلیک کنید</p></div>
        </div>
    `;
}

function showFamilyMember(memberId, chip) {
    document.querySelectorAll('.family-member-chip').forEach(c => c.classList.remove('active'));
    if (chip) chip.classList.add('active');

    const member = members.find(m => String(m.id) === String(memberId));
    if (!member) {
        document.getElementById('familyMemberDetails').innerHTML =
            '<p style="color:#e53e3e;text-align:center;padding:10px;font-size:0.75rem;">عضو یافت نشد</p>';
        return;
    }

    const role = getFamilyRole(member.heh2);
    const sd = memberScores[member.id];
    const mTxns = (transactionsByMember.get(String(member.id)) || []).sort((a, b) => parseInt(b._transactionId) - parseInt(a._transactionId));

    let latestTx = null;
    let maxId = 0;
    mTxns.forEach(tx => {
        const id = parseInt(tx._transactionId) || 0;
        if (id > maxId) {
            maxId = id;
            latestTx = tx;
        }
    });

    const personalInfoHtml = `
        <div class="family-personal-info">
            <div class="info-item"><span>📱 تلفن</span><span class="info-value">${esc(member.phone1 || '---')}</span></div>
            <div class="info-item"><span>📱 تلفن ۲</span><span class="info-value">${esc(member.phone2 || '---')}</span></div>
            <div class="info-item"><span>🎂 تاریخ تولد</span><span class="info-value">${esc(member.birthDateShamsi || '---')}</span></div>
            <div class="info-item"><span>📅 تاریخ عضویت</span><span class="info-value">${esc(member.openDate || '---')}</span></div>
            <div class="info-item"><span>👤 نقش</span><span class="info-value">${role ? role.label : '---'}</span></div>
            <div class="info-item"><span>🏷️ کد خانوار</span><span class="info-value">${esc(member.heh1 || '---')}</span></div>
        </div>
    `;

    const services = [
        { name: 'صورتحساب', key: 'smsActive' },
        { name: 'جلسات شورا', key: 'smsKod' },
        { name: 'عمومی', key: 'smsOmomi' },
        { name: 'سرپرستان', key: 'smsSarparast' },
        { name: 'معوقات', key: 'smsMoavaghe' },
        { name: 'مسابقات', key: 'smsMosabegheh' },
        { name: 'خبرنامه', key: 'smsKhabarnameh' },
        { name: 'تولد', key: 'smsTavalod' },
        { name: 'مناسبت‌ها', key: 'smsMonasebat' }
    ];

    let smsHtml = '';
    if (latestTx) {
        smsHtml = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:6px;">';
        services.forEach(s => {
            const isActive = latestTx[s.key] === true;
            smsHtml += `
                <div style="background:${isActive ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.05)'};padding:4px 6px;border-radius:6px;border-right:2px solid ${isActive ? 'var(--success-color)' : 'var(--danger-color)'};text-align:center;">
                    <span style="font-size:0.4rem;color:var(--text-secondary);display:block;">${s.name}</span>
                    <span style="font-size:0.5rem;font-weight:bold;color:${isActive ? 'var(--success-color)' : 'var(--danger-color)'};">${isActive ? 'فعال' : 'غیرفعال'}</span>
                </div>
            `;
        });
        smsHtml += '</div>';
    }

    const loanInfoHtml = `
        <div style="margin-top:8px;">
            <h4 style="font-size:0.7rem;color:var(--text-primary);"><i class="fas fa-hand-holding-usd" style="color:var(--danger-color);"></i> اطلاعات وام و بدهی</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                <div style="background:var(--bg-secondary);padding:4px 8px;border-radius:4px;border:1px solid var(--border-color);"><div style="font-size:0.45rem;color:var(--text-secondary);">مانده وام</div><div style="font-size:0.65rem;font-weight:bold;color:var(--danger-color);">${fmtNum(member.loanBalance || 0)}</div></div>
                <div style="background:var(--bg-secondary);padding:4px 8px;border-radius:4px;border:1px solid var(--border-color);"><div style="font-size:0.45rem;color:var(--text-secondary);">تعداد اقساط</div><div style="font-size:0.65rem;font-weight:bold;color:var(--text-primary);">${member.totalInstallments || 0}</div></div>
                <div style="background:var(--bg-secondary);padding:4px 8px;border-radius:4px;border:1px solid var(--border-color);"><div style="font-size:0.45rem;color:var(--text-secondary);">قسط پرداخت شده</div><div style="font-size:0.65rem;font-weight:bold;color:var(--success-color);">${member.paidInstallments || 0}</div></div>
                <div style="background:var(--bg-secondary);padding:4px 8px;border-radius:4px;border:1px solid var(--border-color);"><div style="font-size:0.45rem;color:var(--text-secondary);">اقساط معوقه</div><div style="font-size:0.65rem;font-weight:bold;color:var(--danger-color);">${Math.abs(member.overdueInstallments || 0)}</div></div>
            </div>
        </div>
    `;

    const installmentDates = generateInstallmentDates(member.loanReceiveDate, member.totalInstallments || 0);
    let installmentHtml = '';
    if (installmentDates.length > 0) {
        const paidCount = member.paidInstallments || 0;
        const overdueCount = Math.abs(member.overdueInstallments || 0);
        installmentHtml = `
            <div style="margin-top:8px;">
                <h4 style="font-size:0.7rem;color:var(--text-primary);"><i class="fas fa-calendar-check" style="color:var(--gold-color);"></i> برنامه اقساط</h4>
                <div class="installment-table-wrapper" style="max-height:120px;overflow-y:auto;">
                    <table>
                        <thead><tr><th>شماره</th><th>تاریخ سررسید</th><th>وضعیت</th></tr></thead>
                        <tbody>
                            ${installmentDates.map((inst, idx) => {
                                const index = idx + 1;
                                let statusClass = 'pending', statusText = 'در انتظار';
                                if (index <= paidCount) { statusClass = 'paid'; statusText = '✅ پرداخت شده'; }
                                else if (index <= paidCount + overdueCount) { statusClass = 'overdue'; statusText = '⚠️ معوقه'; }
                                return `<tr class="${statusClass}"><td>${index}</td><td>${inst.date}</td><td><span class="installment-status-badge ${statusClass}">${statusText}</span></td></tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    const html = `
        <div class="family-card">
            <div class="family-card-header" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                <div class="family-card-avatar" style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--gradient-start),var(--gradient-end));display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.2rem;"><i class="fas ${role ? role.icon : 'fa-user'}"></i></div>
                <div style="flex:1;">
                    <div class="family-card-name" style="font-weight:bold;font-size:0.9rem;color:var(--text-primary);">${esc(member.firstName)} ${role ? `<span style="background:var(--success-color);color:#fff;padding:2px 8px;border-radius:6px;font-size:0.5rem;">${role.label}</span>` : ''}</div>
                    <div style="font-size:0.65rem;color:var(--text-secondary);">شماره حساب: ${esc(member.accountNumber)}</div>
                    <div style="margin-top:4px;"><span style="background:${sd?.tier === 'gold' ? '#FFD700' : sd?.tier === 'silver' ? '#C0C0C0' : '#6B7280'};color:#fff;padding:2px 10px;border-radius:12px;font-size:0.5rem;">${sd?.tierName || 'عادی'}</span></div>
                </div>
            </div>
            ${personalInfoHtml}
            <div class="family-card-stats">
                <div class="family-card-stat"><div class="family-card-stat-label">موجودی</div><div class="family-card-stat-value">${fmtNum(member.balance || 0)}</div></div>
                <div class="family-card-stat"><div class="family-card-stat-label">بدهی</div><div class="family-card-stat-value">${fmtNum(member.loanBalance || 0)}</div></div>
                <div class="family-card-stat"><div class="family-card-stat-label">اقساط معوقه</div><div class="family-card-stat-value">${Math.abs(member.overdueInstallments || 0)}</div></div>
                <div class="family-card-stat"><div class="family-card-stat-label">وضعیت</div><div class="family-card-stat-value"><span class="account-status-badge ${member.active !== false ? 'active' : 'inactive'}">${member.active !== false ? 'فعال' : 'غیرفعال'}</span></div></div>
            </div>
            ${loanInfoHtml}
            ${installmentHtml}
            <div style="margin-top:8px;">
                <h4 style="font-size:0.7rem;color:var(--text-primary);"><i class="fas fa-file-invoice"></i> تراکنش‌ها (${mTxns.length})</h4>
                <div id="familyTx_${member.id}"></div>
            </div>
        </div>
    `;

    document.getElementById('familyMemberDetails').innerHTML = html;

    setTimeout(() => {
        const container = document.getElementById('familyTx_' + member.id);
        if (container) renderExcelTransactions(mTxns, 'familyTx_' + member.id);
    }, 100);
}
