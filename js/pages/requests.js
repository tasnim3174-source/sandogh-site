/* ============================================================
   صندوق اتحاد - درخواست‌ها
   نسخه: 3.0 - با ثبت در سرور + تاریخچه
   ============================================================ */

function renderRequestsContent() {
    const FUND_PHONE = '09138944709';
    const requests = [
        { code: '1', title: 'نوبت دهی وام خانوادگی', desc: 'درخواست نوبت برای دریافت وام خانوادگی' },
        { code: '2', title: 'دریافت وام جدید', desc: 'درخواست دریافت وام جدید' },
        { code: '4', title: 'مسدود نمودن حساب', desc: 'درخواست مسدودسازی حساب کاربری' },
        { code: '5', title: 'رفع مسدودی حساب', desc: 'درخواست رفع مسدودی حساب' },
        { code: '10', title: 'حذف حساب', desc: 'درخواست حذف کامل حساب' },
        { code: '13', title: 'ارسال کل موجودی و بدهی خانواده من', desc: 'دریافت گزارش کامل مالی خانواده' },
        { code: '14', title: 'غیرفعالسازی کلیه سرویس‌های پیامکی', desc: 'غیرفعال کردن تمام پیامک‌ها' },
        { code: '15', title: 'فعالسازی کلیه سرویس‌های پیامکی', desc: 'فعال کردن تمام پیامک‌ها' },
        { code: '18', title: 'فعالسازی فقط پیامک صورتحساب', desc: 'فعال کردن فقط پیامک صورتحساب' },
        { code: '19', title: 'غیرفعالسازی پیامک صورتحساب', desc: 'غیرفعال کردن پیامک صورتحساب' },
        { code: '20', title: 'تغییر شماره همراه', desc: 'ثبت شماره همراه جدید' },
        { code: '22', title: 'ارسال صورتحساب به جانشین', desc: 'ارسال صورتحساب به شماره جانشین' },
        { code: '23', title: 'لغو ارسال صورتحساب به جانشین', desc: 'لغو ارسال صورتحساب به جانشین' },
        { code: '44', title: 'ارسال ۵ تراکنش آخر', desc: 'دریافت ۵ تراکنش آخر حساب' }
    ];

    return `
        <div class="info-box"><i class="fas fa-file-signature"></i> درخواست‌های پیامکی</div>
        
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
            <button onclick="showRequestsTab('new')" id="reqTabNew" style="flex:1;min-width:120px;padding:10px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-weight:700;cursor:pointer;font-family:tahoma;">📝 درخواست جدید</button>
            <button onclick="showRequestsTab('history')" id="reqTabHistory" style="flex:1;min-width:120px;padding:10px;border-radius:10px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-weight:700;cursor:pointer;font-family:tahoma;">📋 تاریخچه درخواست‌ها</button>
        </div>
        
        <div id="reqNewPanel">
            <div class="dashboard-section" style="border-right-color:var(--gold-color);background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(217,119,6,0.06));">
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
                    <i class="fas fa-info-circle" style="font-size:1.5rem;color:var(--gold-color);"></i>
                    <div>
                        <div style="font-weight:bold;color:var(--text-primary);font-size:0.95rem;">📱 درخواست‌ها به صورت پیامکی و سیستمی ثبت می‌شوند</div>
                        <div style="color:var(--text-secondary);font-size:0.8rem;">شماره صندوق: <strong style="color:var(--gold-color);">${FUND_PHONE}</strong></div>
                        <div style="color:var(--text-muted);font-size:0.6rem;margin-top:2px;">${requests.length} نوع درخواست مختلف</div>
                    </div>
                </div>
                <div style="max-height:400px;overflow-y:auto;padding-right:4px;">
                    ${requests.map(req => `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg-secondary);border-radius:8px;margin-bottom:4px;border-right:4px solid var(--orange-color);">
                            <div style="flex:1;min-width:100px;">
                                <div style="font-weight:bold;font-size:0.8rem;color:var(--text-primary);">${req.title}</div>
                                <div style="font-size:0.6rem;color:var(--text-secondary);">${req.desc}</div>
                                <div style="font-size:0.45rem;color:var(--text-muted);margin-top:2px;">کد: ${req.code}</div>
                            </div>
                            <button class="btn-small orange-btn" onclick="sendSmsRequest('${req.code}','${req.title}')" style="font-size:0.6rem;padding:6px 14px;min-height:32px;flex-shrink:0;">ارسال</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div id="reqHistoryPanel" style="display:none;">
            <div class="dashboard-section" style="border-right-color:var(--gold-color);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                    <div style="font-weight:bold;color:var(--text-primary);font-size:0.95rem;">📋 تاریخچه درخواست‌های من</div>
                    <button onclick="loadMyRequests()" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);cursor:pointer;font-size:0.75rem;">🔄 به‌روزرسانی</button>
                </div>
                <div id="myRequestsList">
                    <div style="text-align:center;padding:20px;color:var(--text-secondary);">در حال بارگذاری...</div>
                </div>
            </div>
        </div>
    `;
}

function showRequestsTab(tab) {
    var newPanel = document.getElementById('reqNewPanel');
    var historyPanel = document.getElementById('reqHistoryPanel');
    var newBtn = document.getElementById('reqTabNew');
    var historyBtn = document.getElementById('reqTabHistory');
    
    if (tab === 'new') {
        newPanel.style.display = 'block';
        historyPanel.style.display = 'none';
        newBtn.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
        newBtn.style.color = '#fff';
        newBtn.style.border = 'none';
        historyBtn.style.background = 'var(--card-bg)';
        historyBtn.style.color = 'var(--text-primary)';
        historyBtn.style.border = '1px solid var(--border-color)';
    } else {
        newPanel.style.display = 'none';
        historyPanel.style.display = 'block';
        historyBtn.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
        historyBtn.style.color = '#fff';
        historyBtn.style.border = 'none';
        newBtn.style.background = 'var(--card-bg)';
        newBtn.style.color = 'var(--text-primary)';
        newBtn.style.border = '1px solid var(--border-color)';
        loadMyRequests();
    }
}

async function sendSmsRequest(code, title) {
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) { alert('❌ اطلاعات کاربر یافت نشد'); return; }
    
    const FUND_PHONE = '09138944709';
    const message = `درخواست ${code} - ${title}\nشماره حساب: ${member.accountNumber}\nنام: ${member.firstName}`;
    
    // ۱. ثبت در سرور (بدون انتظار طولانی)
    try {
        var url = ADMIN_URL + '?action=submitMemberRequest'
            + '&user=' + encodeURIComponent(member.id || member.accountNumber)
            + '&name=' + encodeURIComponent(member.firstName || '')
            + '&accountNumber=' + encodeURIComponent(member.accountNumber || '')
            + '&phone=' + encodeURIComponent(member.phone1 || member.phone || '')
            + '&code=' + encodeURIComponent(code)
            + '&title=' + encodeURIComponent(title)
            + '&type=general';
        
        fetch(url, { cache: 'no-cache' })
            .then(function(r) { return r.json(); })
            .then(function(d) {
                if (d.ok) console.log('✅ درخواست در سرور ثبت شد');
                else console.log('⚠️ خطا در ثبت:', d.error);
            })
            .catch(function(e) { console.log('⚠️ خطا:', e); });
    } catch(e) {
        console.log('⚠️ خطا در ثبت سرور:', e);
    }
    
    // ۲. باز کردن اپ پیامک
    window.location.href = `sms:${FUND_PHONE}?body=${encodeURIComponent(message)}`;
}

async function loadMyRequests() {
    var list = document.getElementById('myRequestsList');
    if (!list) return;
    
    list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">در حال بارگذاری...</div>';
    
    try {
var uid = currentUser.username || currentUser.accountNumber || currentUser.memberId;var uid = currentUser.username || currentUser.accountNumber || currentUser.memberId;
        var url = ADMIN_URL + '?action=getMyMemberRequests&user=' + encodeURIComponent(uid);
        var res = await fetch(url, { cache: 'no-cache' });
        var data = await res.json();
        
        var requests = (data && data.requests) || [];
        
        if (requests.length === 0) {
            list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-secondary);">📭 هنوز درخواستی ثبت نکرده‌اید</div>';
            return;
        }
        
        var html = '';
        requests.forEach(function(r) {
            var date = formatDate(r.timestamp);
            var statusIcon = r.status === 'pending' ? '⏳' : (r.status === 'resolved' ? '✅' : '❌');
            var statusText = r.status === 'pending' ? 'در انتظار پاسخ' : (r.status === 'resolved' ? 'پاسخ داده شده' : 'رد شده');
            var statusColor = r.status === 'pending' ? '#f59e0b' : (r.status === 'resolved' ? '#10b981' : '#ef4444');
            
            html += '<div style="background:var(--bg-secondary);border-radius:10px;padding:12px;margin-bottom:8px;border-right:3px solid ' + statusColor + ';">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">';
            html += '<div style="font-weight:700;color:var(--text-primary);font-size:0.85rem;">' + escapeHtml(r.title || '') + '</div>';
            html += '<div style="font-size:0.7rem;color:' + statusColor + ';font-weight:700;">' + statusIcon + ' ' + statusText + '</div>';
            html += '</div>';
            html += '<div style="font-size:0.7rem;color:var(--text-secondary);">کد: ' + escapeHtml(r.code || '') + ' | 📅 ' + date + '</div>';
            
            if (r.reply && r.reply.trim()) {
                html += '<div style="margin-top:8px;padding:8px 10px;background:rgba(16,185,129,0.08);border-radius:8px;border-right:3px solid #10b981;">';
                html += '<div style="font-size:0.7rem;color:#10b981;font-weight:700;margin-bottom:4px;">✅ پاسخ شورا:</div>';
                html += '<div style="font-size:0.75rem;color:var(--text-primary);line-height:1.7;">' + escapeHtml(r.reply) + '</div>';
                html += '</div>';
            }
            
            html += '</div>';
        });
        
        list.innerHTML = html;
        
    } catch(e) {
        console.error('خطا:', e);
        list.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;">❌ خطا در بارگذاری</div>';
    }
}

function formatDate(isoStr) {
    if (!isoStr) return '-';
    try {
        var d = new Date(isoStr);
        return d.toLocaleDateString('fa-IR') + ' ' + d.toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit'});
    } catch(e) { return '-'; }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(c) {
        return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c];
    }).replace(/\n/g, '<br>');
}

window.showRequestsTab = showRequestsTab;
window.sendSmsRequest = sendSmsRequest;
window.loadMyRequests = loadMyRequests;
