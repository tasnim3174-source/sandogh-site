/* ============================================================
   صندوق اتحاد - هشدارها و امتیازهای ورود
   نسخه: 1.0
   ============================================================ */

window.__entryAlertsState = {
    shown: false,
    running: false
};

/* ────────────────────────────────────────────────────────────
   تابع اصلی: با ورود کاربر صدا زده می‌شه
   ──────────────────────────────────────────────────────────── */
async function runEntryAlerts() {
    if (window.__entryAlertsState.running) return;
    if (window.__entryAlertsState.shown) return;
    
    if (typeof currentUser === 'undefined' || !currentUser) return;
    
    window.__entryAlertsState.running = true;
    
    // یه بار در روز فقط
    var today = new Date().toLocaleDateString('fa-IR');
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
    
    // صبر کوتاه تا همه چیز لود بشه
    await new Promise(function(r) { setTimeout(r, 2500); });
    
    try {
        // ۱. هشدارها
        await showEntryAlerts();
        
        // ۲. امتیازهای روزانه
        await awardDailyPoints();
        
        // ذخیره که امروز نشون داده شده
        try { localStorage.setItem(storageKey, '1'); } catch(e) {}
        
        window.__entryAlertsState.shown = true;
    } catch(e) {
        console.error('❌ خطا در هشدارهای ورود:', e);
    } finally {
        window.__entryAlertsState.running = false;
    }
}

/* ────────────────────────────────────────────────────────────
   ۱. نمایش هشدارها
   ──────────────────────────────────────────────────────────── */
async function showEntryAlerts() {
    var userCode = currentUser.username || currentUser.id || currentUser.accountNumber;
    if (!userCode) return;
    
    try {
        var url = ADMIN_URL + '?action=getUserAlerts&user=' + encodeURIComponent(userCode);
        var res = await fetch(url, { cache: 'no-cache' });
        var data = await res.json();
        
        if (!data || !data.ok || !data.alerts || data.alerts.length === 0) {
            console.log('📭 هیچ هشداری نیست');
            return;
        }
        
        console.log('🔔 ' + data.alerts.length + ' هشدار پیدا شد');
        
        // هر هشدار رو با تأخیر نشون بده
        for (var i = 0; i < data.alerts.length; i++) {
            var alert = data.alerts[i];
            
            await new Promise(function(r) { 
                setTimeout(r, i === 0 ? 500 : 3500); 
            });
            
            if (typeof showSimpleToast === 'function') {
                showSimpleToast(
                    alert.icon || '⚠️',
                    alert.title || 'هشدار',
                    alert.message || '',
                    alert.borderColor || '#ffd700'
                );
            }
        }
        
        // صبر کن تا هشدارها دیده بشن
        await new Promise(function(r) { setTimeout(r, 2000); });
        
    } catch(e) {
        console.error('❌ خطا در getUserAlerts:', e);
    }
}

/* ────────────────────────────────────────────────────────────
   ۲. امتیازهای روزانه
   ──────────────────────────────────────────────────────────── */
async function awardDailyPoints() {
    var member = null;
    if (typeof members !== 'undefined' && members && currentUser) {
        member = members.find(function(m) {
            return String(m.id) === String(currentUser.memberId) ||
                   String(m.accountNumber) === String(currentUser.accountNumber);
        });
    }
    
    if (!member) {
        console.log('⚠️ member پیدا نشد - امتیازها رد شد');
        return;
    }
    
    var userId = member.id || member.accountNumber;
    var userName = member.firstName || '';
    var today = new Date().toLocaleDateString('fa-IR');
    
    var awards = [];
    var totalPoints = 0;
    
    // ─── ۱. ورود روزانه: ۱ امتیاز ───
    awards.push({
        reason: 'ورود روزانه',
        points: 1,
        key: 'daily_login_' + today,
        icon: '📅'
    });
    
    // ─── ۲. بدون قسط معوقه: ۵ امتیاز ───
    var overdueCount = Number(member.overdueInstallments || 0);
    if (overdueCount === 0) {
        awards.push({
            reason: 'بدون قسط معوقه',
            points: 5,
            key: 'no_overdue_' + today,
            icon: '✅'
        });
    }
    
    // ─── ۳. موجودی بالا: ۱۰ امتیاز ───
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
    
    // ─── ۴. تولد: ۲۰ امتیاز ───
    var isBirthday = false;
    if (member.birthDateShamsi) {
        try {
            var bd = String(member.birthDateShamsi).trim();
            var today_sh = new Date();
            // اگه تابع getTodayShamsi وجود داره
            var ts = (typeof getTodayShamsi === 'function') ? getTodayShamsi() : null;
            if (ts) {
                var bMonth = 0;
                if (bd.indexOf('/') > -1) {
                    bMonth = +bd.split('/')[1];
                } else if (bd.length === 8) {
                    bMonth = +bd.substring(4, 6);
                }
                if (bMonth === ts.m) {
                    // چک کن روز تولد هم هست
                    var bDay = 0;
                    if (bd.indexOf('/') > -1) {
                        bDay = +bd.split('/')[2];
                    } else if (bd.length === 8) {
                        bDay = +bd.substring(6, 8);
                    }
                    if (bDay === ts.d) {
                        isBirthday = true;
                    }
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
    
    // ─── ۵. تکمیل پروفایل: ۳ امتیاز ───
    var hasProfile = member.phone1 && member.heh1 && member.firstName;
    if (hasProfile) {
        awards.push({
            reason: 'تکمیل پروفایل',
            points: 3,
            key: 'profile_' + today,
            icon: '👤'
        });
    }
    
    // ─── ارسال امتیازها به سرور ───
    var successCount = 0;
    var earnedPoints = 0;
    
    for (var i = 0; i < awards.length; i++) {
        var a = awards[i];
        try {
            var url = ADMIN_URL + '?action=addPoints'
                + '&user=' + encodeURIComponent(userId)
                + '&name=' + encodeURIComponent(userName)
                + '&reason=' + encodeURIComponent(a.reason)
                + '&points=' + a.points
                + '&uniqueKey=' + encodeURIComponent(a.key);
            
            var res = await fetch(url, { cache: 'no-cache' });
            var data = await res.json();
            
            if (data.ok) {
                successCount++;
                earnedPoints += a.points;
                console.log('✅ ' + a.icon + ' ' + a.reason + ': +' + a.points);
            } else if (data.already) {
                console.log('⏭️ ' + a.reason + ': قبلاً ثبت شده');
            }
        } catch(e) {
            console.error('❌ خطا در ' + a.reason + ':', e);
        }
    }
    
    // ─── گرفتن مجموع امتیاز ───
    var totalPoints = 0;
    try {
        var pres = await fetch(ADMIN_URL + '?action=getPoints', { cache: 'no-cache' });
        var pdata = await pres.json();
        if (pdata && pdata.points) {
            for (var j = 0; j < pdata.points.length; j++) {
                if (String(pdata.points[j].user) === String(userId)) {
                    totalPoints = Number(pdata.points[j].points || 0);
                    break;
                }
            }
        }
    } catch(e) {}
    
    // ─── نمایش پیام امتیاز ───
    await new Promise(function(r) { setTimeout(r, 1000); });
    
    if (earnedPoints > 0) {
        var msg = '🎉 تبریک! امروز <b>' + earnedPoints + ' امتیاز</b> گرفتی!<br><br>';
        msg += '📊 مجموع امتیازات: <b>' + totalPoints + '</b><br><br>';
        msg += '🎁 برای دریافت جایزه، به بخش <b>امتیازات و فروشگاه</b> برو!';
        
        if (typeof showSimpleToast === 'function') {
            showSimpleToast('🎉', 'امتیاز جدید!', msg, '#10b981');
        }
    } else {
        var msg2 = '📊 مجموع امتیازات شما: <b>' + totalPoints + '</b><br><br>';
        msg2 += '🎁 برای دریافت جایزه، به بخش <b>امتیازات و فروشگاه</b> برو!';
        
        if (typeof showSimpleToast === 'function') {
            showSimpleToast('⭐', 'امتیازات شما', msg2, '#ffd700');
        }
    }
}

/* ────────────────────────────────────────────────────────────
   اجرای خودکار با ورود کاربر
   ──────────────────────────────────────────────────────────── */
(function autoRun() {
    // هر ۱ ثانیه چک کن کاربر لاگین شده و منو آماده شده
    var attempts = 0;
    var maxAttempts = 60; // ۶۰ ثانیه
    
    var timer = setInterval(function() {
        attempts++;
        
        var ready = (
            typeof currentUser !== 'undefined' && 
            currentUser && 
            typeof members !== 'undefined' && 
            members && 
            members.length > 0 &&
            typeof renderMenuPage === 'function'
        );
        
        if (ready) {
            clearInterval(timer);
            console.log('✅ شرایط آماده - اجرای هشدارهای ورود');
            setTimeout(runEntryAlerts, 1500);
        }
        
        if (attempts >= maxAttempts) {
            clearInterval(timer);
        }
    }, 1000);
})();

// در معرض عموم
window.runEntryAlerts = runEntryAlerts;
window.showEntryAlerts = showEntryAlerts;
window.awardDailyPoints = awardDailyPoints;
