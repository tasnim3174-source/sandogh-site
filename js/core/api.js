/* ============================================================
   صندوق اتحاد - API و ارتباط با سرور
   نسخه: 2.0
   ============================================================ */

// ===== توابع ورود و خروج =====
function logUserLogin(user, name) {
    var device = navigator.userAgent.includes('Mobile') ? '📱 موبایل' : '💻 کامپیوتر';
    var browser = navigator.userAgent.includes('Chrome') ? 'کروم' : navigator.userAgent.includes('Safari') ? 'سافاری' : navigator.userAgent.includes('Firefox') ? 'فایرفاکس' : 'مرورگر';
    fetch(ADMIN_URL + '?action=logLogin&user=' + encodeURIComponent(user) + '&name=' + encodeURIComponent(name) + '&device=' + encodeURIComponent(device) + '&browser=' + encodeURIComponent(browser)).catch(function(){});
}

function startKeepAlive() {
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    keepAliveInterval = setInterval(function() {
        fetch(ADMIN_URL + '?action=ping', { method: 'GET', cache: 'no-cache' }).catch(function() {});
    }, 30000);
}

function stopKeepAlive() {
    if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
    }
}

function doLogout() {
    if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
        currentUser = null;
        if (autoUpdateInterval) { clearInterval(autoUpdateInterval); autoUpdateInterval = null; }
        stopKeepAlive();
        updateFloatingButtons();
        location.reload();
    }
}

function handleLogoutFromNav() {
    doLogout();
}

// ===== توابع امتیازدهی =====
function awardDailyLogin(user) {
    if (!user || !user.memberId) return;
    var today = new Date().toISOString().split('T')[0];
    fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(user.memberId) + '&reason=' + encodeURIComponent('ورود روزانه') + '&points=1&uniqueKey=daily_' + today + '_' + user.memberId)
        .then(function(r) { return r.json(); })
        .then(function(d) { console.log('📥 ورود روزانه:', JSON.stringify(d)); })
        .catch(function() {});
}

function awardBirthday(user, data) {
    if (!user || !user.memberId || !data || !data.members) return;
    var member = null;
    for (var i = 0; i < data.members.length; i++) {
        if (data.members[i].id === user.memberId) { member = data.members[i]; break; }
    }
    if (!member) return;

    if (!member.birthDateShamsi) return;
    var bs = String(member.birthDateShamsi).replace(/[\s\-\/]/g, '');
    if (bs.length !== 8) return;
    var bm = bs.substring(4, 6);
    var bd = bs.substring(6, 8);
    var t = getPersianToday();

    if (bm + bd === t.month + t.day) {
        fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(user.memberId) + '&reason=' + encodeURIComponent('🎂 تولدت مبارک!') + '&points=5&uniqueKey=birthday_' + t.year + '_' + user.memberId)
            .then(function(r) { return r.json(); })
            .then(function(d) {
                if (d.ok) alert('🎂 تولدت مبارک! ۵ امتیاز هدیه گرفتی!');
            })
            .catch(function() {});
    }
}

function awardMonthlyPoints(user, data) {
    if (!user || !user.memberId || !data || !data.members) return;
    var member = null;
    for (var i = 0; i < data.members.length; i++) {
        if (data.members[i].id === user.memberId) { member = data.members[i]; break; }
    }
    if (!member) return;

    var t = getPersianToday();
    var monthKey = t.year + '_' + t.month;

    if (member.monthlySalary > 0) {
        fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(user.memberId) + '&reason=' + encodeURIComponent('پرداخت مقرری ماهانه') + '&points=1&uniqueKey=salary_' + monthKey + '_' + user.memberId)
            .then(function(r) { return r.json(); })
            .catch(function() {});
    }

    if (member.installmentAmount > 0 && member.paidInstallments > 0) {
        fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(user.memberId) + '&reason=' + encodeURIComponent('پرداخت اقساط ماهانه') + '&points=1&uniqueKey=installment_' + monthKey + '_' + user.memberId)
            .then(function(r) { return r.json(); })
            .catch(function() {});
    }

    if (member.balance > member.currentMonthBalance) {
        fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(user.memberId) + '&reason=' + encodeURIComponent('افزایش موجودی') + '&points=1&uniqueKey=balance_' + monthKey + '_' + user.memberId)
            .then(function(r) { return r.json(); })
            .catch(function() {});
    }

    if (member.overdueInstallments === 0 && member.installmentAmount > 0) {
        fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(user.memberId) + '&reason=' + encodeURIComponent('بدون قسط معوقه') + '&points=1&uniqueKey=nooverdue_' + monthKey + '_' + user.memberId)
            .then(function(r) { return r.json(); })
            .catch(function() {});
    }
}

function awardQuizPoints(score, totalQuestions) {
    if (!currentUser || !currentUser.memberId) return;
    var memberId = currentUser.memberId;
    var today = new Date().toISOString().split('T')[0];

    fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(memberId) + '&reason=' + encodeURIComponent('شرکت در بازی سوالات') + '&points=1&uniqueKey=quiz_play_' + today + '_' + memberId)
        .then(function(r) { return r.json(); })
        .catch(function() {});

    if (score > 0) {
        fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(memberId) + '&reason=' + encodeURIComponent('پاسخ صحیح سوالات (' + score + ' سوال)') + '&points=' + score + '&uniqueKey=quiz_correct_' + today + '_' + memberId)
            .then(function(r) { return r.json(); })
            .catch(function() {});
    }
}

function awardCompetitionPoints(quizId, score) {
    if (!currentUser || !currentUser.memberId) return;
    var memberId = currentUser.memberId;
    var today = new Date().toISOString().split('T')[0];

    fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(memberId) + '&reason=' + encodeURIComponent('شرکت در مسابقه') + '&points=1&uniqueKey=comp_participate_' + quizId + '_' + memberId)
        .then(function(r) { return r.json(); }).catch(function() {});

    if (score > 0) {
        fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(memberId) + '&reason=' + encodeURIComponent('پاسخ صحیح مسابقه (' + score + ' سوال)') + '&points=' + score + '&uniqueKey=comp_correct_' + quizId + '_' + memberId)
            .then(function(r) { return r.json(); }).catch(function() {});
    }
}

function mfAddPoints(n) {
    try {
        if (!currentUser || !currentUser.memberId) return;
        fetch(ADMIN_URL + '?action=addPoints&user=' + encodeURIComponent(currentUser.memberId) +
              '&name=' + encodeURIComponent(currentUser.name || currentUser.firstName || '') +
              '&reason=' + encodeURIComponent('تکمیل فعالیت مالی') + '&points=' + encodeURIComponent(n) +
              '&uniqueKey=' + encodeURIComponent('mf_' + Date.now() + '_' + currentUser.memberId))
          .then(function(){ return loadClubFromAdmin(); }).catch(function(){});
    } catch (e) { }
}

function syncPointsToServer(userId, userName, points) {
    try {
        fetch(ADMIN_URL + '?action=updatePoints&user=' + encodeURIComponent(userId) +
              '&name=' + encodeURIComponent(userName) +
              '&points=' + encodeURIComponent(points) +
              '&type=set')
            .catch(function(){});
    } catch(e) {}
}

// ===== توابع باشگاه =====
async function loadClubFromAdmin() {
    if (!currentUser || !currentUser.memberId) return;
    try {
        const d = (window.__scriptServicesCache && window.__scriptServicesCache.loaded)
            ? {history: window.__scriptServicesCache.points || []}
            : await fetch(SHOP_URL + '?action=getPointsHistory&user=' + encodeURIComponent(currentUser.memberId)).then(function(r){return r.json();});
        if (d && Array.isArray(d.history)) {
            coinHistory = d.history.map(function(x){ return {
                date: x.date || x.createdAt || '',
                amount: Number(x.points) || 0,
                reason: x.reason || '',
                detail: x.detail || x.description || ''
            }; });
            userCoins = coinHistory.reduce(function(sum, x){ return sum + (Number(x.amount) || 0); }, 0);
            localStorage.setItem('sandogh_coins_' + currentUser.memberId, String(userCoins));
            localStorage.setItem('sandogh_coinHistory_' + currentUser.memberId, JSON.stringify(coinHistory));
        }
    } catch(e) { console.warn('خطا در دریافت امتیازات از پنل مدیریت', e); }
    try {
        const d2 = (window.__scriptServicesCache && window.__scriptServicesCache.loaded)
            ? {products: window.__scriptServicesCache.products || []}
            : await fetch(SHOP_URL + '?action=getShopProducts').then(function(r){return r.json();});
        if (d2 && Array.isArray(d2.products)) window.SHOP_PRODUCTS = d2.products;
    } catch(e) { console.warn('خطا در دریافت فروشگاه از پنل مدیریت', e); }
}

async function buyProduct(shenaseh, name, price) {
    if (userCoins < price) { alert('امتیاز کافی ندارید!'); return; }
    if (!confirm('خرید ' + name + ' به قیمت ' + price + ' امتیاز؟')) return;
    try {
        const url = SHOP_URL + '?action=resolvePurchase&user=' + encodeURIComponent(currentUser.memberId) +
            '&name=' + encodeURIComponent(currentUser.firstName || currentUser.username || '') +
            '&productId=' + encodeURIComponent(shenaseh) + '&product=' + encodeURIComponent(name) +
            '&price=' + encodeURIComponent(price);
        const r = await fetch(url);
        const d = await r.json();
        if (d && d.ok === false) { alert('❌ ' + (d.error || 'خرید انجام نشد')); return; }
        userCoins -= price;
        coinHistory.push({date:new Date().toLocaleString('fa-IR'), amount:-Number(price), reason:'خرید از فروشگاه', detail:'محصول: '+name});
        userPurchases.push({orderCode:(d && (d.orderCode || d.id)) || ('ORD-' + Date.now().toString().slice(-6)), productId:shenaseh, productName:name, price:Number(price), date:new Date().toLocaleString('fa-IR'), delivered:false});
        saveCoins();
        alert('✅ خرید موفق!');
        await loadClubFromAdmin();
        renderPage('club');
    } catch(e) {
        alert('❌ ارتباط با پنل مدیریت برقرار نشد');
    }
}

// ===== توابع سکه =====
function saveCoins() {
    if (!currentUser || !currentUser.memberId) return;
    localStorage.setItem('sandogh_coins_' + currentUser.memberId, userCoins);
    localStorage.setItem('sandogh_coinHistory_' + currentUser.memberId, JSON.stringify(coinHistory));
    localStorage.setItem('sandogh_purchases_' + currentUser.memberId, JSON.stringify(userPurchases));
}

function addCoins(amount, reason, detail) {
    userCoins += amount;
    coinHistory.push({ date: new Date().toLocaleString('fa-IR'), amount, reason, detail: detail || '' });
    saveCoins();
}

function deductCoins(amount, reason, detail) {
    userCoins -= amount;
    coinHistory.push({ date: new Date().toLocaleString('fa-IR'), amount: -amount, reason, detail: detail || '' });
    saveCoins();
}

function loadCoins() {
    if (!currentUser || !currentUser.memberId) return;
    try {
        const saved = localStorage.getItem('sandogh_coins_' + currentUser.memberId);
        userCoins = saved ? parseInt(saved) : 0;
        const savedHistory = localStorage.getItem('sandogh_coinHistory_' + currentUser.memberId);
        coinHistory = savedHistory ? JSON.parse(savedHistory) : [];
        const savedPurchases = localStorage.getItem('sandogh_purchases_' + currentUser.memberId);
        userPurchases = savedPurchases ? JSON.parse(savedPurchases) : [];
    } catch (e) { userCoins = 0; coinHistory = []; userPurchases = []; }
}

// ===== توابع اعلان‌ها =====
function loadNotifications() {
    if (!currentUser || !currentUser.memberId) return;
    try {
        const saved = localStorage.getItem('sandogh_notifications_' + currentUser.memberId);
        notifications = saved ? JSON.parse(saved) : [];
    } catch (e) { notifications = []; }
}

function saveNotifications() {
    if (!currentUser || !currentUser.memberId) return;
    localStorage.setItem('sandogh_notifications_' + currentUser.memberId, JSON.stringify(notifications));
    updateNotifBadge();
}

function addNotification(type, title, message, category) {
    notifications.unshift({
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        type, title, message, timestamp: Date.now(), read: false, category: category || 'system'
    });
    saveNotifications();
    showToast({ type, title, message });
}

function updateNotifBadge() {
    const count = notifications.filter(n => !n.read).length;
    const badges = document.querySelectorAll('.menu-badge');
    badges.forEach(b => {
        b.textContent = count > 99 ? '99+' : count;
        b.classList.toggle('show', count > 0);
    });
}

function markAllRead() {
    notifications.forEach(n => n.read = true);
    saveNotifications();
    renderNotificationList();
}

function filterNotif(filter, btn) {
    document.querySelectorAll('.notification-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderNotificationList(filter);
}

function deleteNotification(id) {
    notifications = notifications.filter(n => n.id !== id);
    saveNotifications();
    renderNotificationList();
}

function checkAutoNotifications(member) {
    const jalaliMonth = new Date().getMonth() + 1;
    if (member.birthDateShamsi) {
        const parts = member.birthDateShamsi.split('/');
        if (parts.length === 3) {
            const bMonth = parseInt(parts[1]);
            const bDay = parseInt(parts[2]);
            if (bMonth === jalaliMonth && bDay === new Date().getDate()) {
                const already = notifications.find(n => n.category === 'system' && n.title.includes('تولد') && n.timestamp > (Date.now() - 86400000));
                if (!already) {
                    addCoins(5, 'تولد مبارک', 'سال ' + new Date().getFullYear());
                    addNotification('success', 'تولدتان مبارک!', member.firstName + ' عزیز، تولدتان مبارک!', 'system');
                }
            }
        }
    }
    if (member.overdueInstallments < -1) {
        const already = notifications.find(n => n.category === 'financial' && n.title.includes('اقساط معوقه') && n.timestamp > (Date.now() - 86400000));
        if (!already) {
            addNotification('critical', 'اقساط معوقه', 'شما ' + Math.abs(member.overdueInstallments) + ' قسط معوقه دارید.', 'financial');
        }
    }
}

// ===== توابع بازی =====
function loadGameScores() {
    try {
        const saved = localStorage.getItem('sandogh_game_scores');
        gameScores = saved ? JSON.parse(saved) : {};
    } catch (e) { gameScores = {}; }
}

function saveGameScores() { localStorage.setItem('sandogh_game_scores', JSON.stringify(gameScores)); }

// ===== توابع بازدید =====
function updateVisitInfo() {
    const memberId = currentUser?.memberId;
    if (!memberId) return;
    const VISIT_KEY = 'sandogh_visit_' + memberId;
    const LAST_VISIT_KEY = 'sandogh_lastVisit_' + memberId;
    const VISIT_HISTORY_KEY = 'sandogh_visit_history_' + memberId;
    let count = parseInt(localStorage.getItem(VISIT_KEY)) || 0;
    count++;
    localStorage.setItem(VISIT_KEY, String(count));
    const now = new Date();
    const visitDate = now.toLocaleDateString('fa-IR') + ' - ' + now.toLocaleTimeString('fa-IR');
    localStorage.setItem(LAST_VISIT_KEY, visitDate);
    let history = [];
    try {
        const saved = localStorage.getItem(VISIT_HISTORY_KEY);
        if (saved) history = JSON.parse(saved);
    } catch (e) {}
    history.push({ date: visitDate, count: count });
    if (history.length > 10) history = history.slice(-10);
    localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(history));
    lastVisitInfo = { count, lastVisit: visitDate, history };
}

function getVisitInfo() {
    const memberId = currentUser?.memberId;
    if (!memberId) return { count: 0, lastVisit: '---', history: [] };
    const VISIT_KEY = 'sandogh_visit_' + memberId;
    const LAST_VISIT_KEY = 'sandogh_lastVisit_' + memberId;
    const VISIT_HISTORY_KEY = 'sandogh_visit_history_' + memberId;
    let count = parseInt(localStorage.getItem(VISIT_KEY)) || 0;
    let lastVisit = localStorage.getItem(LAST_VISIT_KEY) || '---';
    let history = [];
    try {
        const saved = localStorage.getItem(VISIT_HISTORY_KEY);
        if (saved) history = JSON.parse(saved);
    } catch (e) {}
    return { count, lastVisit, history };
}

// ===== توابع نگهداری =====
async function checkMaintenance() {
    try {
        if (window.location.search.includes('admin')) return true;
        var r = await fetch(ADMIN_URL + '?action=status');
        var s = await r.json();
        if (s.enabled === false) { showMaintenancePage(); return false; }
        return true;
    } catch (e) { return true; }
}

function showMaintenancePage() {
    var html = '<div id="maintenancePage" style="position:fixed;inset:0;background:linear-gradient(135deg,#0f0f23,#1a1a2e);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;font-family:tahoma;z-index:99999">';
    html += '<div style="font-size:5rem">⚙️</div>';
    html += '<div style="margin-top:20px;font-size:1.5rem;font-weight:900;color:#ffd700">در حال به‌روزرسانی...</div>';
    html += '<div style="margin-top:12px;text-align:center;color:rgba(255,255,255,.6);line-height:2">صندوق پس‌انداز موقتاً در دسترس نیست.<br>لطفاً دقایقی دیگر مراجعه فرمایید. 🙏</div>';
    html += '</div>';
    document.body.innerHTML = html;
}

// ===== توابع دانلود =====
function downloadApp() {
    showToast({ type: 'success', title: 'شروع دانلود', message: 'دانلود اپلیکیشن اندروید آغاز شد...' });
    const link = document.createElement('a');
    link.href = APK_DOWNLOAD_URL;
    link.download = 'sandogh-union.apk';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
