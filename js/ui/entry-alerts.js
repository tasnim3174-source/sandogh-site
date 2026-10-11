/* ============================================================
   صندوق اتحاد - هشدارها و امتیازهای ورود
   نسخه: 2.0 - محلی (بدون API)
   ============================================================ */

window.__entryAlertsState = {
    shown: false,
    running: false
};

/* ────────────────────────────────────────────────────────────
   تابع دریافت تاریخ شمسی
   ──────────────────────────────────────────────────────────── */
function getTodayShamsiStr() {
    if (typeof getTodayShamsi === 'function') {
        try {
            var t = getTodayShamsi();
            if (t && t.y && t.m && t.d) {
                return t.y + '/' + String(t.m).padStart(2, '0') + '/' + String(t.d).padStart(2, '0');
            }
        } catch(e) {}
    }
    
    try {
        var now = new Date();
        var faDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(now);
        
        var parts = faDate.replace(/[۰-۹]/g, function(d) {
            return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
        }).split('/');
        
        if (parts.length === 3) {
            return parts[0] + '/' + parts[1] + '/' + parts[2];
        }
        return faDate;
    } catch(e) {
        var d = new Date();
        return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    }
}

/* ────────────────────────────────────────────────────────────
   تابع اصلی
   ──────────────────────────────────────────────────────────── */
async function runEntryAlerts() {
    if (window.__entryAlertsState.running) return;
    if (window.__entryAlertsState.shown) return;
    
    if (typeof currentUser === 'undefined' || !currentUser) return;
    
    window.__entryAlertsState.running = true;
    
    var today = getTodayShamsiStr();
    var userCode = currentUser.username || currentUser.id || currentUser.accountNumber;
    var storageKey = 'entry_alerts_' + userCode + '_' + today;
    
    var alreadyShown = false;
    try { alreadyShown = localStorage.getItem(storageKey) === '1'; } catch(e) {}
    
    if (alreadyShown) {
        console.log('✅ هشدارهای امروز قبلاً نشون داده شده');
        window.__entryAlertsState.shown = true;
        window.__entryAlertsState.running = false;
        return;
    }
    
    console.log('🚀 شروع هشدارهای ورود...');
    
    await new Promise(function(r) { setTimeout(r, 2000); });
    
    try {
        var member = null;
        if (typeof members !== 'undefined' && members && currentUser) {
            member = members.find(function(m) {
                return String(m.id) === String(currentUser.memberId) ||
                       String(m.accountNumber) === String(currentUser.accountNumber) ||
                       String(m.accountNumber) === String(currentUser.username);
            });
        }
        
        if (!member) {
            console.warn('⚠️ member پیدا نشد');
            window.__entryAlertsState.running = false;
            return;
        }
        
        console.log('👤 member پیدا شد:', member.firstName);
        
        await showLocalAlerts(member);
        await awardLocalPoints(member);
        
        try { localStorage.setItem(storageKey, '1'); } catch(e) {}
        
        window.__entryAlertsState.shown = true;
    } catch(e) {
        console.error('❌ خطا:', e);
    } finally {
        window.__entryAlertsState.running = false;
    }
}

/* ────────────────────────────────────────────────────────────
   ۱. نمایش هشدارها
   ──────────────────────────────────────────────────────────── */
async function showLocalAlerts(member) {
    var alerts = [];
    
    // هشدار ۱: حساب غیرفعال
    if (member.active === false) {
        alerts.push({
            icon: '🚫',
            title: 'حساب غیرفعال',
            message: 'حساب شما غیرفعال است. لطفاً با <b>شورای صندوق</b> تماس بگیرید.',
            borderColor: '#ef4444'
        });
    }
    
    // هشدار ۲: قسط معوقه
    var overdue = Number(member.overdueInstallments || 0);
    if (overdue > 0) {
        alerts.push({
            icon: '⚠️',
            title: 'قسط معوقه',
            message: 'شما <b>' + overdue + ' قسط معوقه</b> دارید. لطفاً هرچه سریع‌تر پرداخت کنید.',
            borderColor: '#ef4444'
        });
    }
    
    // هشدار ۳: موجودی کم
    var balance = Number(member.balance || 0);
    var LOW_BALANCE = 35338016;
    if (balance < LOW_BALANCE) {
        var diff = LOW_BALANCE - balance;
        alerts.push({
            icon: '💰',
            title: 'کسری موجودی',
            message: 'موجودی حساب شما کمتر از حد نصاب است.<br>کسری: <b>' + Number(diff).toLocaleString('fa-IR') + ' ریال</b><br>لطفاً شارژ کنید.',
            borderColor: '#f59e0b'
        });
    }
    
    // هشدار ۴: عدم ثبت نحوه ارسال صورتحساب
    var hasStatementPref = true;
    try {
        if (typeof statementEmails !== 'undefined' && statementEmails && Array.isArray(statementEmails)) {
            hasStatementPref = false;
            for (var i = 0; i < statementEmails.length; i++) {
                if (String(statementEmails[i].user) === String(member.id)) {
                    var s = statementEmails[i];
                    if (s.wantEmail || s.wantSms || s.wantIta || s.wantSite) {
                        hasStatementPref = true;
                    }
                    break;
                }
            }
        }
    } catch(e) {}
    
    if (!hasStatementPref) {
        alerts.push({
            icon: '📬',
            title: 'ثبت نحوه ارسال صورتحساب',
            message: 'شما هنوز نحوه دریافت صورتحساب را ثبت نکرده‌اید.<br>لطفاً به بخش <b>ثبت نحوه ارسال صورتحساب</b> در منو بروید.',
            borderColor: '#3b82f6'
        });
    }
    
    if (alerts.length === 0) {
        console.log('📭 هیچ هشداری نیست');
        return;
    }
    
    console.log('🔔 ' + alerts.length + ' هشدار');
    
    for (var j = 0; j < alerts.length; j++) {
        var a = alerts[j];
        await new Promise(function(r) {
            setTimeout(r, j === 0 ? 500 : 3500);
        });
        
        if (typeof showSimpleToast === 'function') {
            showSimpleToast(a.icon, a.title, a.message, a.borderColor);
        }
    }
    
    await new Promise(function(r) { setTimeout(r, 1500); });
}

/* ────────────────────────────────────────────────────────────
   ۲. امتیازهای روزانه
   ──────────────────────────────────────────────────────────── */
async function awardLocalPoints(member) {
    var userId = member.id || member.accountNumber;
    var userName = member.firstName || '';
    var today = getTodayShamsiStr();
    
    var awards = [];
    
    // ورود روزانه: ۱
    awards.push({
        reason: 'ورود روزانه',
        points: 1,
        key: 'daily_login_' + today,
        icon: '📅'
    });
    
    // بدون قسط معوقه: ۵
    var overdue = Number(member.overdueInstallments || 0);
    if (overdue === 0) {
        awards.push({
            reason: 'بدون قسط معوقه',
            points: 5,
            key: 'no_overdue_' + today,
            icon: '✅'
        });
    }
    
    // موجودی مناسب: ۱۰
    var balance = Number(member.balance || 0);
    var LOW_BALANCE = 35338016;
    if (balance >= LOW_BALANCE) {
        awards.push({
            reason: 'پس‌انداز مناسب',
            points: 10,
            key: 'good_balance_' + today,
            icon: '💰'
        });
    }
    
    // تولد: ۲۰
    var isBirthday = false;
    if (member.birthDateShamsi) {
        try {
            var bd = String(member.birthDateShamsi).trim();
            var ts = (typeof getTodayShamsi === 'function') ? getTodayShamsi() : null;
            if (ts) {
                var bMonth = 0, bDay = 0;
                if (bd.indexOf('/') > -1) {
                    var parts = bd.split('/');
                    if (parts.length >= 3) {
                        bMonth = +parts[1];
                        bDay = +parts[2];
                    }
                } else if (bd.length === 8) {
                    bMonth = +bd.substring(4, 6);
                    bDay = +bd.substring(6, 8);
                }
                if (bMonth === ts.m && bDay === ts.d) {
                    isBirthday = true;
                }
            }
        } catch(e) {}
    }
    
    if (isBirthday) {
        awards.push({
            reason: '🎂 تولدتان مبارک!',
            points: 20,
            key: 'birthday_' + today,
            icon: '🎂'
        });
    }
    
    // تکمیل پروفایل: ۳
    var hasProfile = member.phone1 && member.heh1 && member.firstName;
    if (hasProfile) {
        awards.push({
            reason: 'تکمیل پروفایل',
            points: 3,
            key: 'profile_' + today,
            icon: '👤'
        });
    }
    
    // ارسال امتیازها به سرور (بدون انتظار)
    var earnedPoints = 0;
    
    for (var i = 0; i < awards.length; i++) {
        var a = awards[i];
        earnedPoints += a.points;
        
        (function(award) {
            var url = ADMIN_URL + '?action=addPoints'
                + '&user=' + encodeURIComponent(userId)
                + '&name=' + encodeURIComponent(userName)
                + '&reason=' + encodeURIComponent(award.reason)
                + '&points=' + award.points
                + '&uniqueKey=' + encodeURIComponent(award.key);
            
            fetch(url, { cache: 'no-cache' })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.ok) {
                        console.log('✅ ' + award.icon + ' ' + award.reason + ': +' + award.points);
                    } else if (data.already) {
                        console.log('⏭️ ' + award.reason + ': قبلاً ثبت شده');
                    }
                })
                .catch(function(e) { 
                    console.warn('⚠️ خطا در ' + award.reason, e);
                });
        })(a);
    }
    
    await new Promise(function(r) { setTimeout(r, 1000); });
    
    if (typeof showSimpleToast === 'function') {
        var msg = '🎉 تبریک! امروز <b>' + earnedPoints + ' امتیاز</b> گرفتی!<br><br>';
        msg += '🎁 برای دریافت جایزه، به بخش <b>امتیازات و فروشگاه</b> برو!';
        
        showSimpleToast('⭐', 'امتیازات روزانه', msg, '#ffd700');
    }
    
    console.log('💰 ' + earnedPoints + ' امتیاز امروز');
}

/* ────────────────────────────────────────────────────────────
   اجرای خودکار
   ──────────────────────────────────────────────────────────── */
(function autoRun() {
    var attempts = 0;
    var maxAttempts = 60;
    
    var timer = setInterval(function() {
        attempts++;
        
        var ready = (
            typeof currentUser !== 'undefined' && 
            currentUser && 
            typeof members !== 'undefined' && 
            members && 
            members.length > 0
        );
        
        if (ready) {
            clearInterval(timer);
            console.log('✅ شرایط آماده');
            setTimeout(runEntryAlerts, 1500);
        }
        
        if (attempts >= maxAttempts) {
            clearInterval(timer);
        }
    }, 1000);
})();

window.runEntryAlerts = runEntryAlerts;
window.showLocalAlerts = showLocalAlerts;
window.awardLocalPoints = awardLocalPoints;
window.getTodayShamsiStr = getTodayShamsiStr;
