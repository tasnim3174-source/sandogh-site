/* ============================================================
   صندوق اتحاد - سامانه پیامکی
   نسخه: 2.0
   ============================================================ */

function renderSmsContent() {
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) return '<div style="text-align:center;padding:30px;">خطا</div>';
    const memberTxns = (transactionsByMember.get(String(member.id)) || []).sort((a, b) => parseInt(b._transactionId) - parseInt(a._transactionId));

    let latestTx = null;
    let maxId = 0;
    memberTxns.forEach(tx => {
        const id = parseInt(tx._transactionId) || 0;
        if (id > maxId) {
            maxId = id;
            latestTx = tx;
        }
    });

    const services = [
        { name: 'صورتحساب', key: 'smsActive', icon: 'fa-file-invoice-dollar', color: '#48bb78' },
        { name: 'جلسات شورا', key: 'smsKod', icon: 'fa-users-cog', color: '#9f7aea' },
        { name: 'عمومی', key: 'smsOmomi', icon: 'fa-broadcast-tower', color: '#4299e1' },
        { name: 'سرپرستان', key: 'smsSarparast', icon: 'fa-user-shield', color: '#ed8936' },
        { name: 'معوقات', key: 'smsMoavaghe', icon: 'fa-exclamation-triangle', color: '#e53e3e' },
        { name: 'مسابقات', key: 'smsMosabegheh', icon: 'fa-trophy', color: '#ecc94b' },
        { name: 'خبرنامه', key: 'smsKhabarnameh', icon: 'fa-newspaper', color: '#38b2ac' },
        { name: 'تولد', key: 'smsTavalod', icon: 'fa-birthday-cake', color: '#ed64a6' },
        { name: 'مناسبت‌ها', key: 'smsMonasebat', icon: 'fa-star-and-crescent', color: 'var(--gradient-start)' }
    ];

    let html = `
        <div class="info-box" style="background:linear-gradient(135deg,#14b8a615,#0d948815);border-right-color:#14b8a6;">
            <i class="fas fa-sms" style="color:#14b8a6;"></i> سامانه‌های پیامکی
            <span style="font-size:0.6rem;color:var(--text-secondary);margin-right:8px;">| آخرین ID: ${maxId || '---'}</span>
        </div>
        <div class="dashboard-section">
            <h3><i class="fas fa-list-check" style="color:var(--blue-color);"></i> وضعیت سرویس‌های پیامکی</h3>
            <div class="support-grid" style="grid-template-columns:repeat(3,1fr);">
    `;

    services.forEach(s => {
        let isActive = false;
        if (latestTx) {
            if (s.key === 'smsActive') isActive = latestTx.smsActive === true;
            else if (s.key === 'smsOmomi') isActive = latestTx.smsOmomi === true;
            else if (s.key === 'smsKod') isActive = latestTx.smsKod === true;
            else if (s.key === 'smsSarparast') isActive = latestTx.smsSarparast === true;
            else if (s.key === 'smsMoavaghe') isActive = latestTx.smsMoavaghe === true;
            else if (s.key === 'smsMosabegheh') isActive = latestTx.smsMosabegheh === true;
            else if (s.key === 'smsKhabarnameh') isActive = latestTx.smsKhabarnameh === true;
            else if (s.key === 'smsTavalod') isActive = latestTx.smsTavalod === true;
            else if (s.key === 'smsMonasebat') isActive = latestTx.smsMonasebat === true;
        }
        const statusText = isActive ? 'فعال' : 'غیرفعال';
        const statusColor = isActive ? 'var(--success-color)' : 'var(--danger-color)';
        html += `
            <div class="support-card">
                <div class="support-icon" style="background:${s.color}"><i class="fas ${s.icon}"></i></div>
                <div>
                    <div class="support-label">${s.name}</div>
                    <div class="support-value" style="color:${statusColor};font-size:0.6rem;">${statusText}</div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
            <div style="margin-top:8px;background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(217,119,6,0.08));padding:10px;border-radius:10px;border:1px solid rgba(245,158,11,0.1);">
                <p style="font-size:0.65rem;color:var(--text-secondary);">💡 جهت فعال/غیرفعال‌سازی با حسابداری تماس بگیرید.</p>
                <p style="font-size:0.55rem;color:var(--text-muted);margin-top:4px;">📌 آخرین ID تراکنش: ${maxId || '---'}</p>
            </div>
        </div>
    `;
    return html;
}
