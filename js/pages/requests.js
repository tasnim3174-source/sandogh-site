/* ============================================================
   صندوق اتحاد - درخواست‌ها
   نسخه: 7.0 (نهایی - جداسازی تاریخچه هر کاربر + ذخیره محلی + ارسال به ایتا)
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
        <div class="info-box"><i class="fas fa-file-signature"></i> درخواست‌ها</div>
        
        <!-- ۲ تب -->
        <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">
            <button onclick="showRequestsTab('sms')" id="reqTabSms" style="flex:1;min-width:100px;padding:10px 6px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.8rem;">📱 درخواست‌ها</button>
            <button onclick="showRequestsTab('history')" id="reqTabHistory" style="flex:1;min-width:100px;padding:10px 6px;border-radius:10px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.8rem;">📜 تاریخچه درخواست‌ها</button>
        </div>
        
        <!-- بخش ۱: پیامکی + سیستمی -->
        <div id="reqSmsPanel">
            <div class="dashboard-section" style="border-right-color:var(--gold-color);background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(217,119,6,0.06));">
                
                <!-- کارت‌های سیستمی -->
                <div style="margin-bottom:16px;">
                    <div style="font-weight:900;color:var(--text-primary);font-size:0.95rem;margin-bottom:10px;display:flex;align-items:center;gap:8px;">
                        <i class="fas fa-cogs" style="color:#3b82f6;"></i>
                        درخواست‌های سیستمی
                    </div>

                    <!-- درخواست وام -->
                    <div style="background:var(--bg-secondary);border-radius:12px;padding:14px;margin-bottom:10px;border-right:4px solid #10b981;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                            <i class="fas fa-hand-holding-usd" style="font-size:1.5rem;color:#10b981;"></i>
                            <div style="flex:1;">
                                <div style="font-weight:800;color:var(--text-primary);font-size:0.9rem;">🏦 درخواست وام</div>
                                <div style="font-size:0.7rem;color:var(--text-secondary);">درخواست دریافت وام جدید</div>
                            </div>
                        </div>
                        <button onclick="openLoanRequestModal()" style="width:100%;padding:10px;border:none;border-radius:10px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-weight:800;cursor:pointer;font-family:tahoma;font-size:0.85rem;">
                            📝 ثبت درخواست وام
                        </button>
                    </div>

                    <!-- بستن حساب -->
                    <div style="background:var(--bg-secondary);border-radius:12px;padding:14px;margin-bottom:10px;border-right:4px solid #ef4444;opacity:0.6;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                            <i class="fas fa-user-slash" style="font-size:1.5rem;color:#ef4444;"></i>
                            <div style="flex:1;">
                                <div style="font-weight:800;color:var(--text-primary);font-size:0.9rem;">🚫 درخواست بستن حساب</div>
                                <div style="font-size:0.7rem;color:var(--text-secondary);">🚧 به‌زودی</div>
                            </div>
                        </div>
                        <button disabled style="width:100%;padding:10px;border:none;border-radius:10px;background:#666;color:#fff;font-weight:800;cursor:not-allowed;font-family:tahoma;font-size:0.85rem;">
                            🚧 در حال ساخت
                        </button>
                    </div>

                          <!-- هدر و لیست درخواست‌های پیامکی -->
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;padding-top:12px;border-top:1px solid var(--border-color);">
                    <i class="fas fa-info-circle" style="font-size:1.5rem;color:var(--gold-color);"></i>
                    <div>
                        <div style="font-weight:bold;color:var(--text-primary);font-size:0.95rem;">📱 درخواست‌های پیامکی</div>
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
        
        <!-- بخش ۲: تاریخچه -->
        <div id="reqHistoryPanel" style="display:none;">
            <div class="dashboard-section" style="border-right-color:var(--gold-color);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                    <div style="font-weight:bold;color:var(--text-primary);font-size:0.95rem;">📜 تاریخچه درخواست‌های من</div>
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
    var smsPanel = document.getElementById('reqSmsPanel');
    var historyPanel = document.getElementById('reqHistoryPanel');
    var smsBtn = document.getElementById('reqTabSms');
    var historyBtn = document.getElementById('reqTabHistory');
    
    if (smsPanel) smsPanel.style.display = 'none';
    if (historyPanel) historyPanel.style.display = 'none';
    
    var inactiveStyle = 'flex:1;min-width:100px;padding:10px 6px;border-radius:10px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.8rem;';
    var activeStyle = 'flex:1;min-width:100px;padding:10px 6px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.8rem;';
    
    if (smsBtn) smsBtn.style.cssText = inactiveStyle;
    if (historyBtn) historyBtn.style.cssText = inactiveStyle;
    
    if (tab === 'sms') {
        if (smsPanel) smsPanel.style.display = 'block';
        if (smsBtn) smsBtn.style.cssText = activeStyle;
    } else if (tab === 'history') {
        if (historyPanel) historyPanel.style.display = 'block';
        if (historyBtn) historyBtn.style.cssText = activeStyle;
        loadMyRequests();
    }
}

async function sendSmsRequest(code, title) {
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) { alert('❌ اطلاعات کاربر یافت نشد'); return; }
    
    const FUND_PHONE = '09138944709';
    const message = `درخواست ${code} - ${title}\nشماره حساب: ${member.accountNumber}\nنام: ${member.firstName}`;
    
    // ۱. ذخیره در حافظه محلی (تاریخچه) با کلید مخصوص هر کاربر
    var reqKey = 'sandogh_my_requests_' + currentUser.memberId;
    var localReqs = [];
    try {
        localReqs = JSON.parse(localStorage.getItem(reqKey) || '[]');
    } catch(e) {}
    
    localReqs.unshift({
        code: code,
        title: title,
        status: 'pending',
        timestamp: new Date().toISOString(),
        reply: 'در انتظار بررسی توسط شورا'
    });
    localStorage.setItem(reqKey, JSON.stringify(localReqs));
    
    // ۲. ارسال به سرور
    try {
        var url = ADMIN_URL + '?action=submitMemberRequest'
            + '&user=' + encodeURIComponent(member.id || member.accountNumber)
            + '&name=' + encodeURIComponent(member.firstName || '')
            + '&accountNumber=' + encodeURIComponent(member.accountNumber || '')
            + '&phone=' + encodeURIComponent(member.phone1 || member.phone || '')
            + '&code=' + encodeURIComponent(code)
            + '&title=' + encodeURIComponent(title)
            + '&type=general';
        
        fetch(url, { cache: 'no-cache', mode: 'no-cors' })
            .then(function() { console.log('✅ درخواست به سرور ارسال شد.'); })
            .catch(function(e) { console.log('⚠️ خطا در ارسال:', e); });
            
    } catch(e) {
        console.log('⚠️ خطا در ثبت سرور:', e);
    }
    
    // ۳. باز کردن پیامک
    window.location.href = `sms:${FUND_PHONE}?body=${encodeURIComponent(message)}`;
}

async function loadMyRequests() {
    var list = document.getElementById('myRequestsList');
    if (!list) return;
    
    list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">در حال بارگذاری...</div>';
    
    var html = '';
    
    // ۱. خواندن از حافظه با کلید مخصوص هر کاربر
    var reqKey = 'sandogh_my_requests_' + currentUser.memberId;
    var localReqs = [];
    try {
        localReqs = JSON.parse(localStorage.getItem(reqKey) || '[]');
    } catch(e) {}
    
    if (localReqs.length > 0) {
        localReqs.forEach(function(r) {
            var date = formatDate(r.timestamp);
            var statusColor = '#f59e0b'; // نارنجی
            html += '<div style="background:var(--bg-secondary);border-radius:10px;padding:12px;margin-bottom:8px;border-right:3px solid ' + statusColor + ';">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">';
            html += '<div style="font-weight:700;color:var(--text-primary);font-size:0.85rem;">' + escapeHtml(r.title || '') + '</div>';
            html += '<div style="font-size:0.7rem;color:' + statusColor + ';font-weight:700;">⏳ در انتظار پاسخ</div>';
            html += '</div>';
            html += '<div style="font-size:0.7rem;color:var(--text-secondary);">کد: ' + escapeHtml(r.code || '') + ' | 📅 ' + date + '</div>';
            html += '</div>';
        });
    }
    
    // ۲. تلاش برای دریافت از سرور
    try {
        var uid = currentUser.username || currentUser.accountNumber || currentUser.memberId;
        var url = ADMIN_URL + '?action=getMyMemberRequests&user=' + encodeURIComponent(uid);
        var res = await fetch(url, { cache: 'no-cache' });
        
        var text = await res.text();
        if (!text.trim().startsWith('<')) {
            var data = JSON.parse(text);
            if (data && data.requests && data.requests.length > 0) {
                data.requests.forEach(function(r) {
                    var date = formatDate(r.timestamp);
                    var statusColor = r.status === 'pending' ? '#f59e0b' : (r.status === 'resolved' ? '#10b981' : '#ef4444');
                    var statusIcon = r.status === 'pending' ? '⏳' : (r.status === 'resolved' ? '✅' : '❌');
                    var statusText = r.status === 'pending' ? 'در انتظار پاسخ' : (r.status === 'resolved' ? 'پاسخ داده شده' : 'رد شده');
                    
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
            }
        }
    } catch(e) {
        console.log("خطا در دریافت از سرور:", e);
    }
    
    // ۳. نمایش نهایی
    if (html) {
        list.innerHTML = html;
    } else {
        list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-secondary);">📭 هنوز درخواستی ثبت نکرده‌اید</div>';
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

// ============================================================
// 🏦 درخواست وام
// ============================================================

function openLoanRequestModal() {
    var member = members.find(m => m.id === currentUser.memberId);
    if (!member) { alert('❌ اطلاعات کاربر یافت نشد'); return; }
    
    var old = document.getElementById('loanRequestModal');
    if (old) old.remove();
    
    var loanBalance = Math.abs(member.loanBalance || 0);
    var hasDebt = loanBalance > 0;
    
    var modalHtml = `
        <div id="loanRequestModal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(6px);" onclick="if(event.target===this)closeLoanRequestModal()">
            <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid rgba(16,185,129,0.5);border-radius:20px;padding:20px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.7);" onclick="event.stopPropagation()">
                
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:#fff;">
                            🏦
                        </div>
                        <div>
                            <div style="font-weight:900;color:#10b981;font-size:1.1rem;">درخواست وام</div>
                            <div style="font-size:0.7rem;color:#9ca3af;">صندوق اتحاد</div>
                        </div>
                    </div>
                    <button onclick="closeLoanRequestModal()" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;color:#fff;cursor:pointer;font-size:1rem;font-family:tahoma;">✕</button>
                </div>
                
                ${hasDebt ? `
                <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:12px;margin-bottom:14px;">
                    <div style="display:flex;align-items:center;gap:8px;color:#ef4444;font-weight:800;font-size:0.85rem;margin-bottom:6px;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>شما بدهی فعال دارید</span>
                    </div>
                    <div style="color:#d1d5db;font-size:0.8rem;line-height:1.7;">
                        مانده بدهی فعلی شما: <b style="color:#ef4444;">${fmtNum(loanBalance)} ریال</b>
                        <br>
                        درخواست وام جدید فقط در صورت تسویه کامل بدهی امکان‌پذیر است.
                    </div>
                </div>
                ` : ''}
                
                <div style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:14px;margin-bottom:14px;">
                    <div style="font-size:0.75rem;color:#9ca3af;margin-bottom:8px;">📄 متن درخواست:</div>
                    <div style="color:#d1d5db;font-size:0.9rem;line-height:2;text-align:justify;">
                        اینجانب <b style="color:#10b981;">${escapeHtml(member.firstName || '')}</b> با توجه به اینکه بدهی من تمام شده درخواست وام را از آن صندوق دارم، لطفاً اقدام لازم را مبذول فرمایید.
                    </div>
                </div>
                
                <div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:12px;margin-bottom:14px;font-size:0.8rem;">
                    <div style="display:flex;justify-content:space-between;padding:4px 0;color:#9ca3af;">
                        <span>👤 نام:</span>
                        <b style="color:#fff;">${escapeHtml(member.firstName || '---')}</b>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:4px 0;color:#9ca3af;">
                        <span>🔢 شماره حساب:</span>
                        <b style="color:#fff;">${escapeHtml(member.accountNumber || '---')}</b>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:4px 0;color:#9ca3af;">
                        <span>📱 تلفن:</span>
                        <b style="color:#fff;">${escapeHtml(member.phone1 || member.phone || '---')}</b>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:4px 0;color:#9ca3af;">
                        <span>📅 تاریخ درخواست:</span>
                        <b style="color:#fff;">${new Date().toLocaleDateString('fa-IR')}</b>
                    </div>
                </div>
                
                <div style="display:flex;gap:10px;">
                    <button onclick="sendLoanRequest()" style="flex:2;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-weight:900;cursor:pointer;font-family:tahoma;font-size:0.95rem;box-shadow:0 4px 15px rgba(16,185,129,0.4);">
                        ✅ ارسال درخواست
                    </button>
                    <button onclick="closeLoanRequestModal()" style="flex:1;padding:14px;border:1px solid rgba(255,255,255,0.2);border-radius:12px;background:rgba(255,255,255,0.05);color:#fff;font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.9rem;">
                        ❌ لغو
                    </button>
                </div>
                
                <div style="margin-top:12px;text-align:center;font-size:0.7rem;color:#6b7280;line-height:1.7;">
                    💡 درخواست شما برای مدیر سیستم و شورای صندوق ارسال می‌شود
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeLoanRequestModal() {
    var modal = document.getElementById('loanRequestModal');
    if (modal) modal.remove();
}

async function sendLoanRequest() {
    var member = members.find(m => m.id === currentUser.memberId);
    if (!member) { alert('❌ اطلاعات کاربر یافت نشد'); return; }
    
    var btn = event.target;
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ در حال ارسال...';
    
    var messageText = 'اینجانب ' + (member.firstName || '') + 
                     ' با توجه به اینکه بدهی من تمام شده درخواست وام را از آن صندوق دارم، لطفاً اقدام لازم را مبذول فرمایید.';
    
    // ۱. ذخیره در حافظه محلی با کلید مخصوص هر کاربر
    var reqKey = 'sandogh_my_requests_' + currentUser.memberId;
    var localReqs = [];
    try {
        localReqs = JSON.parse(localStorage.getItem(reqKey) || '[]');
    } catch(e) {}
    localReqs.unshift({
        code: 'LOAN',
        title: 'درخواست وام جدید',
        status: 'pending',
        timestamp: new Date().toISOString(),
        reply: 'در انتظار بررسی توسط شورا'
    });
    localStorage.setItem(reqKey, JSON.stringify(localReqs));
    
    // ۲. ارسال به سرور
    try {
        var uid = currentUser.username || currentUser.accountNumber || currentUser.memberId;
        var url = ADMIN_URL + '?action=submitMemberRequest'
            + '&user=' + encodeURIComponent(uid)
            + '&name=' + encodeURIComponent(member.firstName || '')
            + '&accountNumber=' + encodeURIComponent(member.accountNumber || '')
            + '&phone=' + encodeURIComponent(member.phone1 || member.phone || '')
            + '&code=LOAN'
            + '&title=' + encodeURIComponent('درخواست وام جدید')
            + '&type=general'
            + '&description=' + encodeURIComponent(messageText);
        
        fetch(url, { cache: 'no-cache', mode: 'no-cors' })
            .then(function() { console.log('✅ درخواست وام ثبت شد'); });
        
        alert('✅ درخواست وام با موفقیت ثبت شد!\n\nبرای مدیر و شورای صندوق ارسال شد.');
        closeLoanRequestModal();
        
        setTimeout(function() {
            if (typeof showRequestsTab === 'function') {
                showRequestsTab('history');
            }
        }, 500);
        
    } catch(e) {
        console.error('خطا:', e);
        alert('❌ خطا در ثبت درخواست:\n\n' + e.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ============================================================
// ✍️ فرم امضای الکترونیکی وام (Canvas)
// ============================================================

async function openLoanSignModal() {
    var old = document.getElementById('loanSignModal');
    if (old) old.remove();

    var member = members.find(m => m.id === currentUser.memberId) || {};
    var memberName = member.firstName || currentUser.firstName || 'نامشخص';
    var accountNum = member.accountNumber || currentUser.accountNumber || 'نامشخص';
    var phone = member.phone1 || member.phone || 'نامشخص';

    var isCouncil = false;
    if (currentUser) {
        if (currentUser.isCouncil === true || currentUser.role === 'council' || currentUser.role === 'admin') isCouncil = true;
    }
    if (member) {
        if (member.isCouncil === true || member.isHead === true) isCouncil = true;
    }

    var modalHtml = `
        <div id="loanSignModal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:10px;backdrop-filter:blur(6px);">
            <div style="background:#1a1a2e;border:2px solid rgba(139,92,246,0.5);border-radius:20px;padding:15px;max-width:650px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.7);">
                
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#fff;">✍️</div>
                        <div style="font-weight:900;color:#fff;font-size:1.1rem;">فرم قرارداد وام</div>
                    </div>
                    <button onclick="closeLoanSignModal()" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;color:#fff;cursor:pointer;font-size:1rem;font-family:tahoma;">✕</button>
                </div>
                
                <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;font-size:0.85rem;line-height:1.8;text-align:justify;color:#d1d5db;margin-bottom:16px;direction:rtl;">
                    <div style="text-align:center;font-weight:900;color:#f59e0b;margin-bottom:12px;font-size:1rem;">به نام خدا</div>
                    شورای محترم صندوق اتحاد<br><br>
                    اینجانب <b style="color:#10b981;">${escapeHtml(memberName)}</b> با شماره تلفن <b style="color:#10b981;">${escapeHtml(phone)}</b> و شماره حساب <b style="color:#10b981;">${escapeHtml(accountNum)}</b> و کد ملی 
                    <input type="text" id="signNationalId" placeholder="کد ملی" style="width:120px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;">
                    
                    مبلغ وام یا قرض 
                    <input type="text" id="signLoanAmount" placeholder="مبلغ" style="width:100px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;"> ریال
                    با بازپرداخت 
                    <input type="text" id="signInstallments" placeholder="تعداد" style="width:60px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;"> قسط
                    و هر قسط به مبلغ 
                    <input type="text" id="signInstallmentAmount" placeholder="مبلغ قسط" style="width:100px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;"> ریال
                    در تاریخ 
                    <input type="text" id="signDate" placeholder="تاریخ" value="${new Date().toLocaleDateString('fa-IR')}" style="width:100px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;">
                    از این صندوق دریافت نمودم.
                    <br><br>
                    و موظف هستم این مبلغ را به طور کامل طی اقساط تعیین شده بصورت ماهانه پرداخت نمایم...
                </div>

                <div style="background:#fff;border-radius:12px;overflow:hidden;margin-bottom:10px;position:relative;">
                    <canvas id="signatureCanvas" style="width:100%;height:150px;touch-action:none;cursor:crosshair;display:block;"></canvas>
                    <div id="signPlaceholder" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ccc;font-size:1.2rem;pointer-events:none;font-family:tahoma;user-select:none;">✍️ اینجا امضا کنید</div>
                </div>

                <div style="display:flex;gap:10px;margin-bottom:10px;">
                    <button onclick="clearSignature()" style="flex:1;padding:10px;border:none;border-radius:8px;background:rgba(239,68,68,0.1);color:#fca5a5;font-weight:700;cursor:pointer;font-family:tahoma;">🗑️ پاک کردن امضا</button>
                </div>

                <div style="display:flex;gap:10px;">
                    <button onclick="submitSignedLoan(event)" style="flex:2;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-weight:900;cursor:pointer;font-family:tahoma;font-size:0.95rem;box-shadow:0 4px 15px rgba(16,185,129,0.4);">
                        ✅ ثبت و امضا
                    </button>
                    
                    ${isCouncil ? `
                    <button onclick="approveLoanSignature(event)" style="flex:1;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-weight:900;cursor:pointer;font-family:tahoma;font-size:0.9rem;box-shadow:0 4px 15px rgba(245,158,11,0.4);">
                        👑 تایید نهایی
                    </button>
                    ` : ''}
                    
                    <button onclick="closeLoanSignModal()" style="flex:1;padding:14px;border:1px solid rgba(255,255,255,0.2);border-radius:12px;background:rgba(255,255,255,0.05);color:#fff;font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.9rem;">
                        ❌ لغو
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    setTimeout(initSignatureCanvas, 100);
}

function closeLoanSignModal() {
    var modal = document.getElementById('loanSignModal');
    if (modal) modal.remove();
}

var sigCanvas, sigCtx, sigDrawing = false;

function initSignatureCanvas() {
    sigCanvas = document.getElementById('signatureCanvas');
    if (!sigCanvas) return;
    
    sigCanvas.width = sigCanvas.offsetWidth;
    sigCanvas.height = sigCanvas.offsetHeight;
    sigCtx = sigCanvas.getContext('2d');
    sigCtx.strokeStyle = '#000';
    sigCtx.lineWidth = 3;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';

    function getPos(e) {
        var rect = sigCanvas.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function startDrawing(e) {
        e.preventDefault();
        sigDrawing = true;
        var pos = getPos(e);
        sigCtx.beginPath();
        sigCtx.moveTo(pos.x, pos.y);
        document.getElementById('signPlaceholder').style.display = 'none';
    }
    function draw(e) {
        if (!sigDrawing) return;
        e.preventDefault();
        var pos = getPos(e);
        sigCtx.lineTo(pos.x, pos.y);
        sigCtx.stroke();
    }
    function stopDrawing(e) {
        if (!sigDrawing) return;
        e.preventDefault();
        sigDrawing = false;
    }

    sigCanvas.addEventListener('mousedown', startDrawing);
    sigCanvas.addEventListener('mousemove', draw);
    sigCanvas.addEventListener('mouseup', stopDrawing);
    sigCanvas.addEventListener('mouseleave', stopDrawing);
    
    sigCanvas.addEventListener('touchstart', startDrawing, {passive: false});
    sigCanvas.addEventListener('touchmove', draw, {passive: false});
    sigCanvas.addEventListener('touchend', stopDrawing);
}

function clearSignature() {
    if (!sigCtx) return;
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    document.getElementById('signPlaceholder').style.display = 'block';
}

async function submitSignedLoan(e) {
    if (!sigCanvas) return;
    
    var blank = document.createElement('canvas');
    blank.width = sigCanvas.width;
    blank.height = sigCanvas.height;
    if (sigCanvas.toDataURL() === blank.toDataURL()) {
        alert('⚠️ لطفاً ابتدا در کادر سفید امضا کنید.');
        return;
    }

    var nationalId = document.getElementById('signNationalId').value.trim();
    var loanAmount = document.getElementById('signLoanAmount').value.trim();
    var installments = document.getElementById('signInstallments').value.trim();
    var installmentAmount = document.getElementById('signInstallmentAmount').value.trim();
    var signDate = document.getElementById('signDate').value.trim();

    if (!nationalId || !loanAmount || !installments) {
        alert('⚠️ لطفاً کد ملی، مبلغ وام و تعداد اقساط را وارد کنید.');
        return;
    }

    var btn = e.target;
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ در حال ثبت...';

    try {
        var member = members.find(m => m.id === currentUser.memberId) || {};
        var imgData = sigCanvas.toDataURL('image/png');
        
        var url = ADMIN_URL + '?action=saveSignedLoan'
            + '&user=' + encodeURIComponent(member.id || member.accountNumber || currentUser.username)
            + '&name=' + encodeURIComponent(member.firstName || currentUser.firstName || '')
            + '&accountNumber=' + encodeURIComponent(member.accountNumber || '')
            + '&phone=' + encodeURIComponent(member.phone1 || member.phone || '')
            + '&nationalId=' + encodeURIComponent(nationalId)
            + '&loanAmount=' + encodeURIComponent(loanAmount)
            + '&installments=' + encodeURIComponent(installments)
            + '&installmentAmount=' + encodeURIComponent(installmentAmount)
            + '&signDate=' + encodeURIComponent(signDate)
            + '&signature=' + encodeURIComponent(imgData);

        var res = await fetch(url, { cache: 'no-cache', mode: 'no-cors' });
        
        alert('✅ قرارداد با موفقیت امضا و ثبت شد!\n\nلطفاً منتظر تایید نهایی شورا باشید.');
        closeLoanSignModal();

    } catch(err) {
        alert('❌ خطای شبکه: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function approveLoanSignature(e) {
    if (!confirm('آیا مطمئنید که می‌خواهید این قرارداد را تایید نهایی کنید؟')) return;

    var btn = e.target;
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ در حال تایید...';

    try {
        var member = members.find(m => m.id === currentUser.memberId) || {};
        var url = ADMIN_URL + '?action=approveSignedLoan'
            + '&key=admin12345'
            + '&user=' + encodeURIComponent(member.id || member.accountNumber || currentUser.username);

        var res = await fetch(url, { cache: 'no-cache', mode: 'no-cors' });

        alert('✅ قرارداد با موفقیت تایید نهایی شد.');
        closeLoanSignModal();

    } catch(err) {
        alert('❌ خطای شبکه: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

window.openLoanSignModal = openLoanSignModal;
window.closeLoanSignModal = closeLoanSignModal;
window.clearSignature = clearSignature;
window.submitSignedLoan = submitSignedLoan;
window.approveLoanSignature = approveLoanSignature;
