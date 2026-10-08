/* ============================================================
   صندوق اتحاد - اطلاعات شخصی
   نسخه: 2.0
   ============================================================ */

function renderProfileContent() {
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) return '<div style="text-align:center;padding:30px;">خطا</div>';

    const ui = users.find(u => u.memberId === member.id);
    const actualPassword = ui ? ui.password || '---' : '---';
    const membershipDuration = calculateMembershipDuration(member.datMiladi);
    const visitInfo = getVisitInfo();

    return `
        <div class="info-box"><i class="fas fa-user-circle"></i> اطلاعات شخصی شما</div>
        <div class="dashboard-section" style="background:#ffffff;border:1px solid rgba(102,126,234,0.2);">
            <div style="display:flex;align-items:center;justify-content:center;gap:15px;flex-wrap:wrap;text-align:center;">
                <div style="flex:1;min-width:150px;">
                    <div style="font-size:1.2rem;font-weight:bold;color:var(--text-primary);">${esc(member.firstName)}</div>
                    <div style="font-size:0.85rem;color:var(--text-secondary);">${esc(member.accountNumber)}</div>
                    <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;justify-content:center;">
                        <span class="account-status-badge ${member.active !== false ? 'active' : 'inactive'}">${member.active !== false ? 'فعال' : 'غیرفعال'}</span>
                        <span style="font-size:0.7rem;background:${memberScores[member.id]?.tier === 'gold' ? '#FFD700' : memberScores[member.id]?.tier === 'silver' ? '#C0C0C0' : '#6B7280'};color:#fff;padding:2px 12px;border-radius:12px;">${memberScores[member.id]?.tierName || 'عادی'}</span>
                    </div>
                </div>
                <div style="display:flex;gap:14px;flex-wrap:wrap;text-align:center;">
                    <div><div style="font-size:0.6rem;color:var(--text-secondary);">مدت عضویت</div><div style="font-weight:bold;font-size:0.95rem;">${membershipDuration}</div></div>
                    <div><div style="font-size:0.6rem;color:var(--text-secondary);">تعداد ورود</div><div style="font-weight:bold;font-size:0.95rem;">${visitInfo.count || 0}</div></div>
                </div>
            </div>
        </div>

        <div class="dashboard-section">
            <h3><i class="fas fa-user"></i> اطلاعات کامل</h3>
            <div class="last-tx-grid">
                <div class="last-tx-item"><div class="last-tx-label">نام</div><div class="last-tx-value">${esc(member.firstName)}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">شماره حساب</div><div class="last-tx-value">${esc(member.accountNumber)}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">تلفن ۱</div><div class="last-tx-value">${esc(member.phone1 || '---')}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">تلفن ۲</div><div class="last-tx-value">${esc(member.phone2 || '---')}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">تاریخ تولد</div><div class="last-tx-value">${esc(member.birthDateShamsi || '---')}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">کد خانوار</div><div class="last-tx-value">${esc(member.heh1 || '---')}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">نقش خانوار</div><div class="last-tx-value">${member.heh2 === '01' ? 'سرپرست خانوار' : (member.heh2 === '02' ? 'همسر' : 'فرزند')}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">تاریخ عضویت</div><div class="last-tx-value">${esc(member.openDate || '---')}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">مدت عضویت</div><div class="last-tx-value" style="color:var(--gradient-start);">${membershipDuration}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">نام کاربری</div><div class="last-tx-value">${esc(currentUser.username)}</div></div>
                <div class="last-tx-item"><div class="last-tx-label">رمز عبور</div><div class="password-field"><span class="value" id="profilePwd" data-password="${esc(actualPassword)}" data-visible="false">••••••••</span><button onclick="toggleProfilePwd()" style="background:rgba(102,126,234,0.1);border:none;color:var(--gradient-start);padding:4px 10px;border-radius:6px;cursor:pointer;font-size:0.65rem;touch-action:manipulation;min-height:28px;"><i id="profilePwdIcon" class="fas fa-eye"></i></button></div></div>
                <div class="last-tx-item"><div class="last-tx-label">نقش</div><div class="last-tx-value">${currentUser.role === 'admin' ? 'مدیر' : (member.isCouncil ? 'عضو شورا' : 'عضو')}</div></div>
            </div>
        </div>

        <div class="dashboard-section" style="border-right-color:var(--blue-color);">
            <h3><i class="fas fa-history" style="color:var(--blue-color);"></i> تاریخچه ورود شما</h3>
            <div class="visit-history" style="width:100%;">
                <div class="visit-item">
                    <i class="fas fa-clock"></i>
                    <span>آخرین ورود:</span>
                    <span class="visit-value">${esc(visitInfo.lastVisit || '---')}</span>
                </div>
                <div class="visit-item">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>تعداد دفعات ورود:</span>
                    <span class="visit-value">${visitInfo.count || 0} بار</span>
                </div>
                ${visitInfo.history && visitInfo.history.length > 0 ? `
                    <div style="margin-top:6px;border-top:1px solid var(--border-color);padding-top:6px;">
                        <div style="font-size:0.55rem;color:var(--text-secondary);margin-bottom:4px;">۱۰ ورود اخیر:</div>
                        ${visitInfo.history.slice(-5).reverse().map(h => `
                            <div style="font-size:0.5rem;color:var(--text-secondary);padding:2px 4px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;">
                                <span>${esc(h.date)}</span>
                                <span style="color:var(--text-muted);">#${h.count}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function toggleProfilePwd() {
    const el = document.getElementById('profilePwd');
    const icon = document.getElementById('profilePwdIcon');
    if (!el) return;
    const visible = el.getAttribute('data-visible') === 'true';
    if (visible) {
        el.textContent = '••••••••';
        el.setAttribute('data-visible', 'false');
        if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
    } else {
        el.textContent = el.getAttribute('data-password') || '---';
        el.setAttribute('data-visible', 'true');
        if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
    }
}
