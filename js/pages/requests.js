/* ============================================================
   صندوق اتحاد - درخواست‌ها
   نسخه: 4.0 - با ۳ بخش (پیامکی + تاریخچه + سیستمی)
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
        
        <!-- ۳ تب -->
        <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">
            <button onclick="showRequestsTab('sms')" id="reqTabSms" style="flex:1;min-width:100px;padding:10px 6px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.8rem;">📱 درخواست‌های پیامکی</button>
            <button onclick="showRequestsTab('history')" id="reqTabHistory" style="flex:1;min-width:100px;padding:10px 6px;border-radius:10px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.8rem;">📜 تاریخچه درخواست‌ها</button>
            <button onclick="showRequestsTab('system')" id="reqTabSystem" style="flex:1;min-width:100px;padding:10px 6px;border-radius:10px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.8rem;">⚙️ درخواست‌های سیستمی</button>
        </div>
        
        <!-- بخش ۱: پیامکی -->
        <div id="reqSmsPanel">
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
        
        <!-- بخش ۳: سیستمی -->
        <div id="reqSystemPanel" style="display:none;">
            <div class="dashboard-section" style="border-right-color:#3b82f6;background:linear-gradient(135deg,rgba(59,130,246,0.05),rgba(37,99,235,0.05));">
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px;">
                    <i class="fas fa-cogs" style="font-size:1.8rem;color:#3b82f6;"></i>
                    <div>
                        <div style="font-weight:bold;color:var(--text-primary);font-size:0.95rem;">⚙️ درخواست‌های سیستمی</div>
                        <div style="color:var(--text-secondary);font-size:0.8rem;">درخواست‌های خودکار با ثبت در سرور</div>
                    </div>
                </div>
                
                <div id="systemRequestsList">
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
                    
                    <!-- امضای درخواست وام -->
                    <div style="background:var(--bg-secondary);border-radius:12px;padding:14px;margin-bottom:10px;border-right:4px solid #8b5cf6;opacity:0.6;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                            <i class="fas fa-signature" style="font-size:1.5rem;color:#8b5cf6;"></i>
                            <div style="flex:1;">
                                <div style="font-weight:800;color:var(--text-primary);font-size:0.9rem;">✍️ امضای درخواست وام</div>
                                <div style="font-size:0.7rem;color:var(--text-secondary);">🚧 به‌زودی</div>
                            </div>
                        </div>
                        <button disabled style="width:100%;padding:10px;border:none;border-radius:10px;background:#666;color:#fff;font-weight:800;cursor:not-allowed;font-family:tahoma;font-size:0.85rem;">
                            🚧 در حال ساخت
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showRequestsTab(tab) {
    var smsPanel = document.getElementById('reqSmsPanel');
    var historyPanel = document.getElementById('reqHistoryPanel');
    var systemPanel = document.getElementById('reqSystemPanel');
    var smsBtn = document.getElementById('reqTabSms');
    var historyBtn = document.getElementById('reqTabHistory');
    var systemBtn = document.getElementById('reqTabSystem');
    
    if (smsPanel) smsPanel.style.display = 'none';
    if (historyPanel) historyPanel.style.display = 'none';
    if (systemPanel) systemPanel.style.display = 'none';
    
    var inactiveStyle = 'flex:1;min-width:100px;padding:10px 6px;border-radius:10px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.8rem;';
    var activeStyle = 'flex:1;min-width:100px;padding:10px 6px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.8rem;';
    
    if (smsBtn) smsBtn.style.cssText = inactiveStyle;
    if (historyBtn) historyBtn.style.cssText = inactiveStyle;
    if (systemBtn) systemBtn.style.cssText = inactiveStyle;
    
    if (tab === 'sms') {
        if (smsPanel) smsPanel.style.display = 'block';
        if (smsBtn) smsBtn.style.cssText = activeStyle;
    } else if (tab === 'history') {
        if (historyPanel) historyPanel.style.display = 'block';
        if (historyBtn) historyBtn.style.cssText = activeStyle;
        loadMyRequests();
    } else if (tab === 'system') {
        if (systemPanel) systemPanel.style.display = 'block';
        if (systemBtn) systemBtn.style.cssText = activeStyle;
    }
}

async function sendSmsRequest(code, title) {
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) { alert('❌ اطلاعات کاربر یافت نشد'); return; }
    
    const FUND_PHONE = '09138944709';
    const message = `درخواست ${code} - ${title}\nشماره حساب: ${member.accountNumber}\nنام: ${member.firstName}`;
    
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
    
    window.location.href = `sms:${FUND_PHONE}?body=${encodeURIComponent(message)}`;
}

async function loadMyRequests() {
    var list = document.getElementById('myRequestsList');
    if (!list) return;
    
    list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">در حال بارگذاری...</div>';
    
    try {
        var uid = currentUser.username || currentUser.accountNumber || currentUser.memberId;
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
        
        var res = await fetch(url, { cache: 'no-cache' });
        var data = await res.json();
        
        if (!data.ok) {
            throw new Error(data.error || 'خطا در ثبت');
        }
        
        console.log('✅ درخواست وام در سرور ثبت شد');
        
        try {
            var eitaaUrl = ADMIN_URL + '?action=sendLoanRequestToShora'
                + '&key=' + encodeURIComponent('admin12345')
                + '&name=' + encodeURIComponent(member.firstName || '')
                + '&user=' + encodeURIComponent(uid)
                + '&accountNumber=' + encodeURIComponent(member.accountNumber || '')
                + '&phone=' + encodeURIComponent(member.phone1 || member.phone || '')
                + '&message=' + encodeURIComponent(messageText);
            
            fetch(eitaaUrl, { cache: 'no-cache' }).catch(function(e) {
                console.log('⚠️ خطا در ارسال به ایتا:', e);
            });
        } catch(e) {
            console.log('⚠️ خطا در ایتا:', e);
        }
        
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
// در معرض عموم
// ============================================================
window.showRequestsTab = showRequestsTab;
window.sendSmsRequest = sendSmsRequest;
window.loadMyRequests = loadMyRequests;
window.openLoanRequestModal = openLoanRequestModal;
window.closeLoanRequestModal = closeLoanRequestModal;
window.sendLoanRequest = sendLoanRequest;
