/* ============================================================
   صندوق اتحاد - نمایش رمز عبور
   نسخه: 3.0 - با محدودیت تلاش + لاگ + تاریخچه + بدون پیش‌فرض
   ============================================================ */

// ============================================================
// متغیرهای محدودیت تلاش
// ============================================================
var __spAttempts = 0;
var __spLockedUntil = 0;
var __spLockDuration = 60000;   // ۱ دقیقه
var __spMaxAttempts = 3;

// ============================================================
// باز کردن مودال نمایش رمز
// ============================================================
function openShowPasswordModal() {
    var old = document.getElementById('showPasswordModal');
    if (old) old.remove();

    if (typeof members === 'undefined' || !currentUser || !currentUser.memberId) {
        alert('⚠️ اطلاعات کاربر یافت نشد');
        return;
    }

    var member = members.find(function(m) { return m.id === currentUser.memberId; });
    if (!member) { alert('⚠️ اطلاعات عضو یافت نشد'); return; }

    var modal = document.createElement('div');
    modal.id = 'showPasswordModal';
    modal.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;margin:0;backdrop-filter:blur(8px);box-sizing:border-box;`;

    modal.innerHTML = 
        '<div style="background:#fff;border-radius:24px;padding:28px 24px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);position:relative;z-index:1000000;margin:auto;box-sizing:border-box;direction:rtl;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #e0e7ff;">' +
                '<h2 style="font-size:1.15rem;color:#1a1a2e;display:flex;align-items:center;gap:8px;margin:0;">👁️ نمایش رمز عبور</h2>' +
                '<button onclick="closeShowPasswordModal()" style="background:#ef4444;color:#fff;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">✕</button>' +
            '</div>' +
            
            '<div style="padding:12px 16px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;line-height:1.9;background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.08));border-right:3px solid #10b981;">' +
                '<b style="color:#10b981;">🔒 تأیید هویت:</b><br>' +
                'برای مشاهده رمز، اطلاعات زیر را وارد کنید:<br>' +
                '• شماره موبایل ثبت‌شده<br>' +
                '• تعداد اعضای صندوق در خانواده (شامل خودتان)' +
            '</div>' +
            
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">📱 شماره موبایل</label>' +
                '<input type="tel" id="spPhone" placeholder="مثلاً: 09123456789" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;background:#fff;color:#1a1a2e;font-family:inherit;box-sizing:border-box;outline:none;direction:ltr;text-align:center;">' +
            '</div>' +
            
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">👥 تعداد اعضای صندوق در خانواده</label>' +
                '<input type="number" id="spFamilyCount" placeholder="شامل خودتان" min="1" max="20" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;background:#fff;color:#1a1a2e;font-family:inherit;box-sizing:border-box;outline:none;text-align:center;">' +
            '</div>' +
            
            '<div id="spResult" style="display:none;margin-bottom:16px;"></div>' +
            '<div id="spStatus" style="display:none;padding:10px 14px;border-radius:10px;margin-bottom:14px;font-size:0.8rem;text-align:center;line-height:1.7;"></div>' +
            '<div id="spHistory" style="display:none;margin-bottom:14px;padding:10px 12px;background:#f8fafc;border-radius:10px;font-size:0.7rem;color:#666;line-height:1.7;border:1px dashed #e0e7ff;"></div>' +
            
            '<div style="display:flex;gap:10px;">' +
                '<button onclick="closeShowPasswordModal()" style="flex:1;padding:13px;border:2px solid #e0e7ff;background:#f8fafc;color:#1a1a2e;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">انصراف</button>' +
                '<button id="spVerifyBtn" onclick="verifyAndShowPassword()" style="flex:2;padding:13px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">✅ تأیید و نمایش رمز</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);
    
    // ✅ چک کن اگه کاربر قفل بود، پیام نشون بده
    if (Date.now() < __spLockedUntil) {
        var remaining = Math.ceil((__spLockedUntil - Date.now()) / 1000);
        showSPStatus('⛔ به دلیل تلاش‌های ناموفق، لطفاً ' + remaining + ' ثانیه صبر کنید', 'error');
    }
    
    setTimeout(function() {
        var inp = document.getElementById('spPhone');
        if (inp) inp.focus();
    }, 100);
}

// ============================================================
// بستن مودال
// ============================================================
function closeShowPasswordModal() {
    var modal = document.getElementById('showPasswordModal');
    if (modal) modal.remove();
}

// ============================================================
// تأیید هویت و نمایش رمز
// ============================================================
function verifyAndShowPassword() {
    // ✅ چک قفل
    if (Date.now() < __spLockedUntil) {
        var remaining = Math.ceil((__spLockedUntil - Date.now()) / 1000);
        showSPStatus('⛔ لطفاً ' + remaining + ' ثانیه صبر کنید', 'error');
        return;
    }
    
    var phone = document.getElementById('spPhone').value.trim();
    var familyCountRaw = document.getElementById('spFamilyCount').value.trim();
    var resultBox = document.getElementById('spResult');
    var member = members.find(function(m) { return m.id === currentUser.memberId; });

    if (!member) { showSPStatus('❌ اطلاعات عضو یافت نشد', 'error'); return; }
    if (!phone) { showSPStatus('⚠️ لطفاً شماره موبایل را وارد کنید', 'warning'); return; }
    if (!familyCountRaw) { showSPStatus('⚠️ لطفاً تعداد اعضای خانواده را وارد کنید', 'warning'); return; }
    
    var familyCount = parseInt(familyCountRaw);
    if (!familyCount || familyCount < 1) { showSPStatus('⚠️ تعداد اعضای خانواده نامعتبر است', 'warning'); return; }

    // ✅ تبدیل اعداد فارسی به انگلیسی
    var normalizedPhone = phone.replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });
    var phone1 = String(member.phone1 || '').replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });
    var phone2 = String(member.phone2 || '').replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });

    // ✅ چک شماره موبایل
    if (normalizedPhone !== phone1 && normalizedPhone !== phone2) {
        __spAttempts++;
        
        if (__spAttempts >= __spMaxAttempts) {
            __spLockedUntil = Date.now() + __spLockDuration;
            __spAttempts = 0;
            
            // لاگ تلاش ناموفق
            logPasswordAttempt(false);
            
            showSPStatus('⛔ ۳ تلاش ناموفق. لطفاً ۱ دقیقه صبر کنید.', 'error');
            
            // غیرفعال کردن دکمه
            var btn = document.getElementById('spVerifyBtn');
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.innerHTML = '⛔ قفل شده';
            }
            return;
        }
        
        showSPStatus('❌ شماره موبایل مطابقت ندارد (' + (__spMaxAttempts - __spAttempts) + ' تلاش باقی‌مانده)', 'error');
        return;
    }

    // ✅ چک تعداد اعضای خانواده
    var realFamilyCount = 1;
    if (member.heh1) {
        realFamilyCount = members.filter(function(m) { return m.heh1 === member.heh1; }).length;
        if (realFamilyCount === 0) realFamilyCount = 1;
    }
    
    if (familyCount !== realFamilyCount) {
        __spAttempts++;
        
        if (__spAttempts >= __spMaxAttempts) {
            __spLockedUntil = Date.now() + __spLockDuration;
            __spAttempts = 0;
            
            logPasswordAttempt(false);
            
            showSPStatus('⛔ ۳ تلاش ناموفق. لطفاً ۱ دقیقه صبر کنید.', 'error');
            
            var btn2 = document.getElementById('spVerifyBtn');
            if (btn2) {
                btn2.disabled = true;
                btn2.style.opacity = '0.5';
                btn2.innerHTML = '⛔ قفل شده';
            }
            return;
        }
        
        showSPStatus('❌ تعداد اعضای خانواده مطابقت ندارد (' + (__spMaxAttempts - __spAttempts) + ' تلاش باقی‌مانده)', 'error');
        return;
    }

    // ✅ هویت تأیید شد
    showSPStatus('✅ هویت شما تأیید شد', 'success');
    
    // ریست تلاش‌ها
    __spAttempts = 0;
    
    // نمایش رمز
    resultBox.style.display = 'block';
    resultBox.innerHTML = 
        '<div style="background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.05));border:2px solid #10b981;border-radius:14px;padding:16px;text-align:center;">' +
            '<div style="font-size:2.5rem;margin-bottom:8px;">🔑</div>' +
            '<div style="font-size:0.85rem;color:#888;margin-bottom:8px;">نام کاربری:</div>' +
            '<div style="font-size:1rem;color:#1a1a2e;font-weight:bold;font-family:monospace;direction:ltr;margin-bottom:12px;">' + currentUser.username + '</div>' +
            '<div style="font-size:0.85rem;color:#888;margin-bottom:8px;">رمز عبور:</div>' +
            '<div style="font-size:1.2rem;color:#10b981;font-weight:bold;font-family:monospace;direction:ltr;background:rgba(16,185,129,0.1);padding:8px 16px;border-radius:8px;display:inline-block;">' + (currentUser.password || '---') + '</div>' +
        '</div>';

    // غیرفعال کردن دکمه
    var verifyBtn = document.getElementById('spVerifyBtn');
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '✅ تأیید شد';
        verifyBtn.style.opacity = '0.6';
    }
    
    // ✅ لاگ تلاش موفق
    logPasswordAttempt(true);
    
    // ✅ نمایش تاریخچه
    showSPHistory();
}

// ============================================================
// لاگ تلاش‌ها (ذخیره در localStorage)
// ============================================================
function logPasswordAttempt(success) {
    try {
        var log = JSON.parse(localStorage.getItem('password_view_log') || '[]');
        log.push({
            username: currentUser.username,
            memberId: currentUser.memberId,
            success: success,
            timestamp: Date.now(),
            userAgent: navigator.userAgent.substring(0, 100)
        });
        // فقط ۵۰ تا آخر
        if (log.length > 50) log = log.slice(-50);
        localStorage.setItem('password_view_log', JSON.stringify(log));
        
        console.log('🔐 لاگ نمایش رمز:', success ? '✅ موفق' : '❌ ناموفق', 'برای', currentUser.username);
    } catch(e) {
        console.warn('⚠️ خطا در لاگ:', e.message);
    }
}

// ============================================================
// نمایش تاریخچه نمایش رمز
// ============================================================
function showSPHistory() {
    try {
        var log = JSON.parse(localStorage.getItem('password_view_log') || '[]');
        
        // آخرین نمایش‌های موفق برای همین کاربر
        var userViews = log.filter(function(entry) {
            return entry.username === currentUser.username && entry.success === true;
        });
        
        var hist = document.getElementById('spHistory');
        if (!hist) return;
        
        if (userViews.length > 0) {
            // آخرین نمایش (قبل از الان)
            var lastView = userViews[userViews.length - 2] || userViews[userViews.length - 1];
            var date = new Date(lastView.timestamp).toLocaleString('fa-IR');
            var count = userViews.length;
            
            hist.style.display = 'block';
            hist.innerHTML = 
                '📅 <b>آخرین نمایش رمز:</b> ' + date + '<br>' +
                '🔢 <b>تعداد کل نمایش‌ها:</b> ' + count + ' بار';
        } else {
            hist.style.display = 'block';
            hist.innerHTML = '📅 <b>اولین نمایش رمز شما</b>';
        }
    } catch(e) {
        console.warn('⚠️ خطا در تاریخچه:', e.message);
    }
}

// ============================================================
// نمایش پیام وضعیت
// ============================================================
function showSPStatus(message, type) {
    var box = document.getElementById('spStatus');
    if (!box) return;
    box.style.display = 'block';
    var colors = {
        warning: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
        error: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
        success: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' }
    };
    var c = colors[type] || colors.warning;
    box.style.background = c.bg;
    box.style.color = c.color;
    box.textContent = message;
}

// ============================================================
// ریست قفل (برای تست یا ادمین)
// ============================================================
function resetPasswordLock() {
    __spAttempts = 0;
    __spLockedUntil = 0;
    try {
        localStorage.removeItem('password_view_log');
    } catch(e) {}
    console.log('✅ قفل و لاگ ریست شد');
}

// در معرض عموم
window.openShowPasswordModal = openShowPasswordModal;
window.closeShowPasswordModal = closeShowPasswordModal;
window.verifyAndShowPassword = verifyAndShowPassword;
window.resetPasswordLock = resetPasswordLock;
