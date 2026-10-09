/* ============================================================
   صندوق اتحاد - منوی اصلی
   نسخه: 2.2 - با Lazy Loading + حالت انتظار برای members
   ============================================================ */

// ============================================================
// انتخاب آیتم منو با Lazy Loading
// ============================================================
async function selectMenuItem(tab) {
    if (window.LazyLoader && LazyLoader.SECTION_DEPS[tab] && !LazyLoader.isLoaded(tab)) {
        try {
            await LazyLoader.ensureSectionLoaded(tab);
        } catch (err) {
            alert('❌ خطا در بارگذاری: ' + err.message);
            return;
        }
    }
    if (typeof window.renderPage === 'function') {
        window.renderPage(tab);
    } else {
        renderPage(tab);
    }
}

// ============================================================
// باز کردن سرویس اسکریپتی
// ============================================================
async function openScriptService(tabName) {
    if (window.LazyLoader && LazyLoader.SECTION_DEPS[tabName] && !LazyLoader.isLoaded(tabName)) {
        try {
            await LazyLoader.ensureSectionLoaded(tabName);
        } catch (err) {
            alert('❌ خطا در بارگذاری: ' + err.message);
            return;
        }
    }

    switch (tabName) {
        case 'club':
            if (typeof renderClubContent === 'function') {
                if (typeof window.renderPage === 'function') window.renderPage('club');
                else renderPage('club');
            } else {
                alert('⚠️ بخش باشگاه مشتریان هنوز آماده نیست');
            }
            break;
        case 'quizzes':
            if (typeof openQuizzes === 'function') openQuizzes();
            else if (typeof renderQuizzesContent === 'function') {
                if (typeof window.renderPage === 'function') window.renderPage('quizzes');
                else renderPage('quizzes');
            } else alert('⚠️ بخش مسابقات هنوز آماده نیست');
            break;
        case 'dailyReward':
            if (typeof openDailyReward === 'function') openDailyReward();
            else alert('⚠️ بخش پاداش روزانه هنوز آماده نیست');
            break;
        case 'emailForm':
            if (typeof openEmailForm === 'function') openEmailForm();
            else alert('⚠️ فرم ایمیل هنوز آماده نیست');
            break;
        case 'messaging':
            if (typeof openMessaging === 'function') openMessaging();
            else alert('⚠️ پیام‌رسان هنوز آماده نیست');
            break;
        case 'survey':
            if (typeof openSurvey === 'function') openSurvey();
            else alert('⚠️ نظرسنجی هنوز آماده نیست');
            break;
        default:
            if (typeof window.renderPage === 'function') window.renderPage(tabName);
            else renderPage(tabName);
    }
}

// ============================================================
// توابع باز کردن بخش‌های ویژه (با Lazy Loading)
// ============================================================
async function openToddlerGames() {
    if (window.LazyLoader && !LazyLoader.isLoaded('toddler')) {
        try { await LazyLoader.ensureSectionLoaded('toddler'); }
        catch (err) { alert('❌ ' + err.message); return; }
    }
    if (typeof openToddlerGamesHandler === 'function') openToddlerGamesHandler();
    else if (typeof renderToddlerPage === 'function') renderToddlerPage(document.getElementById('contentArea'));
    else alert('⚠️ بخش رشد خردسالان هنوز آماده نیست');
}

async function openLadySection() {
    if (window.LazyLoader && !LazyLoader.isLoaded('ladySection')) {
        try { await LazyLoader.ensureSectionLoaded('ladySection'); }
        catch (err) { alert('❌ ' + err.message); return; }
    }
    if (typeof openLadySectionHandler === 'function') openLadySectionHandler();
    else if (typeof renderLadySection === 'function') renderLadySection(document.getElementById('contentArea'));
    else alert('⚠️ بخش بانوان هنوز آماده نیست');
}

async function openTeenPiggy() {
    if (window.LazyLoader && !LazyLoader.isLoaded('teenPiggy')) {
        try { await LazyLoader.ensureSectionLoaded('teenPiggy'); }
        catch (err) { alert('❌ ' + err.message); return; }
    }
    if (typeof openTeenPiggyHandler === 'function') openTeenPiggyHandler();
    else if (typeof renderTeenPiggyPage === 'function') renderTeenPiggyPage(document.getElementById('contentArea'));
    else alert('⚠️ بخش قلک نوجوانان هنوز آماده نیست');
}

// ============================================================
// رندر صفحه منو (با حالت انتظار برای members)
// ============================================================
function renderMenuPage(content) {
    // ============================================================
    // ⚠️ چک: اگه members هنوز لود نشده، حالت انتظار نشون بده
    // ============================================================
    if (!members || members.length === 0) {
        console.log('⏳ members خالیه، حالت انتظار...');
        
        content.style.display = 'block';
        content.innerHTML = 
            '<div style="display:flex;align-items:center;justify-content:center;min-height:70vh;flex-direction:column;gap:20px;padding:20px;">' +
                '<div style="width:64px;height:64px;border:5px solid rgba(102,126,234,0.2);border-top-color:#667eea;border-radius:50%;animation:spinMenu 1s linear infinite;"></div>' +
                '<p style="color:var(--text-secondary,#4a4a6a);font-size:1.05rem;font-weight:700;margin:0;">در حال آماده‌سازی منو...</p>' +
                '<p style="color:var(--text-muted,#8888aa);font-size:0.85rem;margin:0;">لطفاً چند لحظه صبر کنید</p>' +
                '<style>@keyframes spinMenu{to{transform:rotate(360deg)}}</style>' +
            '</div>';
        
        // هر ۵۰۰ میلی‌ثانیه چک کن که members پر شده یا نه
        if (window.__menuRetryInterval) {
            clearInterval(window.__menuRetryInterval);
        }
        
        window.__menuRetryInterval = setInterval(function() {
            if (members && members.length > 0) {
                clearInterval(window.__menuRetryInterval);
                window.__menuRetryInterval = null;
                console.log('✅ members آماده شد، منو دوباره ساخته می‌شه');
                renderMenuPage(content);
            }
        }, 500);
        
        // بعد از ۱۵ ثانیه، اگه هنوز لود نشد، پیام خطا بده
        setTimeout(function() {
            if (window.__menuRetryInterval) {
                clearInterval(window.__menuRetryInterval);
                window.__menuRetryInterval = null;
                content.innerHTML = 
                    '<div style="text-align:center;padding:40px 20px;">' +
                        '<p style="font-size:1.2rem;color:#ef4444;font-weight:700;">⚠️ خطا در بارگذاری اطلاعات</p>' +
                        '<p style="color:var(--text-secondary);font-size:0.9rem;margin-top:10px;">لطفاً صفحه را رفرش کنید</p>' +
                        '<button onclick="location.reload()" style="margin-top:16px;padding:10px 24px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:12px;font-size:0.9rem;font-weight:700;cursor:pointer;">🔄 رفرش</button>' +
                    '</div>';
            }
        }, 15000);
        
        return;
    }

    // ============================================================
    // حالا که members آماده است، منو رو بساز
    // ============================================================
    const member = members.find(function(m) { return m.id === currentUser.memberId; });
    if (!member) { 
        console.warn('⚠️ member پیدا نشد. memberId:', currentUser.memberId, '| members:', members.length);
        
        // اگه member پیدا نشد ولی members خالیه، شاید memberId اشتباهه
        content.style.display = 'block';
        content.innerHTML = 
            '<div style="text-align:center;padding:40px 20px;">' +
                '<p style="font-size:1.1rem;color:#ef4444;font-weight:700;">⚠️ خطا در پیدا کردن اطلاعات کاربر</p>' +
                '<p style="color:var(--text-secondary);font-size:0.85rem;margin-top:8px;">شناسه کاربر: ' + (currentUser.memberId || 'نامشخص') + '</p>' +
                '<button onclick="location.reload()" style="margin-top:16px;padding:10px 24px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:12px;font-size:0.9rem;font-weight:700;cursor:pointer;">🔄 تلاش مجدد</button>' +
            '</div>';
        return; 
    }

    const sd = memberScores[member.id] || {};
    const greeting = (typeof getGreeting === 'function') ? getGreeting() : 'خوش آمدید';

    const famScores = (typeof computeFamilyScores === 'function') ? computeFamilyScores() : [];
    const myRank = famScores.findIndex(function(f) { return f.code === member.heh1; }) + 1;
    const totalFam = famScores.length;

    const t = (typeof getTodayShamsi === 'function') ? getTodayShamsi() : { y: 1400, m: 1, d: 1 };
    const tn = (typeof shamsiDayNum === 'function') ? shamsiDayNum(t.y, t.m, t.d) : 0;

    let isUserBirthday = false;
    let birthDay = 0;
    let birthMonth = 0;

    if (member.birthDateShamsi) {
        const bd = String(member.birthDateShamsi).trim();
        let bYear = 0, bMonth = 0, bDay = 0;

        if (bd.indexOf('/') > -1) {
            const bb = bd.split('/');
            if (bb.length === 3) {
                bYear = +bb[0]; bMonth = +bb[1]; bDay = +bb[2];
            }
        } else if (bd.length === 8 && !isNaN(+bd)) {
            bYear = +bd.substring(0, 4);
            bMonth = +bd.substring(4, 6);
            bDay = +bd.substring(6, 8);
        }

        if (bMonth > 0 && bDay > 0) {
            birthDay = bDay;
            birthMonth = bMonth;
            if (bMonth === t.m) {
                isUserBirthday = true;
            }
        }
    }

    const bdayCakeHtml = isUserBirthday ? '<span class="bdaycake" title="🎉 تولدتان مبارک!">🎂</span>' : '';

    if (isUserBirthday && typeof showBirthdayWish === 'function') {
        const birthdayKey = 'bday_shown_' + member.id + '_' + t.y + '_' + t.m;
        if (!localStorage.getItem(birthdayKey)) {
            setTimeout(function() { showBirthdayWish(member, birthDay, t.m); }, 800);
            localStorage.setItem(birthdayKey, '1');
        }
    }

    const isCouncil = (typeof hasCouncilOrAdminAccess === 'function') ? hasCouncilOrAdminAccess() : false;
    const isHead = (typeof isHeadOfHousehold === 'function') ? isHeadOfHousehold() : false;

    const publicItems = [
        { tab: 'profile', label: 'اطلاعات شخصی شما', icon: 'fa-user-circle', color: '#8b5cf6' },
        { tab: 'dashboard', label: 'صورتحساب', icon: 'fa-chart-line', color: '#667eea' },
        { tab: 'requests', label: 'درخواست‌ها', icon: 'fa-file-signature', color: '#f97316' },
        { tab: 'sms', label: 'سامانه‌های پیامکی', icon: 'fa-sms', color: '#14b8a6' },
        { tab: 'support', label: 'پشتیبانی', icon: 'fa-headset', color: '#84cc16' }
    ];

    const specialBoxItems = [
        { tab: 'myFund', label: 'صندوق من', icon: 'fa-gem', color: '#06b6d4' },
        { tab: 'utilities', label: 'برنامه‌های کاربردی', icon: 'fa-toolbox', color: '#f97316' }
    ];

    const specialItems = [
        { tab: 'toddlerGrowth', label: '🧒 رشد ویژه خردسالان', icon: 'fa-baby', color: '#38bdf8' },
        { tab: 'teenPiggy', label: '🐷 قلک ویژه نوجوانان', icon: 'fa-child', color: '#ec4899' },
        { tab: 'ladySpecial', label: '👩 بانو ویژه بانوان', icon: 'fa-female', color: '#d946ef' }
    ];

    const familyItems = [
        { tab: 'family', label: 'خانواده من', icon: 'fa-users', color: '#10b981' },
        { tab: 'familyInfo', label: 'اطلاعات کلی خانواده', icon: 'fa-users-cog', color: '#10b981' }
    ];

    const councilItems = [
        { tab: 'access', label: 'دسترسی‌ها', icon: 'fa-key', color: '#f59e0b' },
        { tab: 'infoStats', label: 'اطلاعات و آمار', icon: 'fa-chart-pie', color: '#f59e0b' },
        { tab: 'manageCoins', label: 'مدیریت امتیازها', icon: 'fa-coins', color: '#f59e0b' },
        { tab: 'reports', label: 'گزارش‌گیری پیشرفته', icon: 'fa-file-alt', color: '#8b5cf6' },
        { tab: 'adminPanel', label: '🛠️ پنل مدیر سیستم', icon: 'fa-cog', color: '#ffd700' }
    ];

    let gridHtml = '<div class="grid-menu">';

    publicItems.forEach(function(item) {
        const blinkClass = item.tab === 'dashboard' ? ' blink-dashboard' : '';
        gridHtml += '<div class="grid-menu-item' + blinkClass + '" data-tab="' + item.tab + '" onclick="selectMenuItem(\'' + item.tab + '\')">' +
            '<div class="menu-icon" style="background:linear-gradient(135deg,' + item.color + ',' + item.color + 'dd);">' +
            '<i class="fas ' + item.icon + '"></i></div>' +
            '<div class="menu-label">' + item.label + '</div>' +
            '<span class="menu-badge">0</span></div>';
    });

    gridHtml += '<div class="script-services-divider"><i class="fas fa-cloud"></i> خدمات آنلاین و متصل به اسکریپت <span>☁️ اطلاعات این بخش فقط هنگام ورود به آن بارگذاری می‌شود</span></div>';

    const scriptServices = [
        { tab: 'emailForm', label: 'ثبت نحوه ارسال صورتحساب', icon: 'fa-envelope', color: '#3b82f6' },
        { tab: 'club', label: 'امتیازات و فروشگاه', icon: 'fa-star', color: '#f59e0b' },
        { tab: 'dailyReward', label: 'پاداش روزانه', icon: 'fa-gift', color: '#ffd700' },
        { tab: 'quizzes', label: '🏆 مسابقات', icon: 'fa-trophy', color: '#ffd700' },
        { tab: 'messaging', label: '📨 ارسال پیام', icon: 'fa-paper-plane', color: '#8b5cf6' },
        { tab: 'survey', label: '📊 نظرسنجی', icon: 'fa-poll', color: '#ec4899' }
    ];

    scriptServices.forEach(function(item) {
        gridHtml += '<div class="grid-menu-item script-service-item" data-tab="' + item.tab + '" onclick="openScriptService(\'' + item.tab + '\')">' +
            '<div class="menu-icon" style="background:linear-gradient(135deg,' + item.color + ',' + item.color + 'dd);">' +
            '<i class="fas ' + item.icon + '"></i></div>' +
            '<div class="menu-label">' + item.label + '</div>' +
            '<span class="script-load-dot">☁️</span></div>';
    });

    gridHtml += '<div class="family-divider" style="color:#ef4444;border-top:2px solid #ef4444;border-bottom:2px solid #ef4444;background:#ffffff;"><i class="fas fa-crown"></i> بخش ویژه</div>';

    specialBoxItems.forEach(function(item) {
        gridHtml += '<div class="grid-menu-item" data-tab="' + item.tab + '" onclick="selectMenuItem(\'' + item.tab + '\')">' +
            '<div class="menu-icon" style="background:linear-gradient(135deg,' + item.color + ',' + item.color + 'dd);">' +
            '<i class="fas ' + item.icon + '"></i></div>' +
            '<div class="menu-label">' + item.label + '</div></div>';
    });

    gridHtml += '<div class="family-divider" style="color:#ec4899;border-top:2px solid #ec4899;border-bottom:2px solid #ec4899;background:#ffffff;"><i class="fas fa-gem"></i> ویژه اعضا</div>';

    specialItems.forEach(function(item) {
        let clickHandler = '';
        let badgeHtml = '';

        if (item.tab === 'toddlerGrowth') {
            clickHandler = 'openToddlerGames()';
            badgeHtml = '<span style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:3px 10px;border-radius:10px;font-size:0.5rem;">✅ فعال</span>';
        } else if (item.tab === 'ladySpecial') {
            clickHandler = 'openLadySection()';
            badgeHtml = '<span style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#d946ef,#a21caf);color:#fff;padding:3px 10px;border-radius:10px;font-size:0.5rem;">👩 فعال</span>';
        } else if (item.tab === 'teenPiggy') {
            clickHandler = 'openTeenPiggy()';
            badgeHtml = '<span style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;padding:3px 10px;border-radius:10px;font-size:0.5rem;">🚀 جدید</span>';
        }

        gridHtml += '<div class="grid-menu-item" data-tab="' + item.tab + '" onclick="' + clickHandler + '">' +
            '<div class="menu-icon" style="background:linear-gradient(135deg,' + item.color + ',' + item.color + 'dd);">' +
            '<i class="fas ' + item.icon + '"></i></div>' +
            '<div class="menu-label">' + item.label + '</div>' +
            badgeHtml + '</div>';
    });

    gridHtml += '<div class="family-divider" style="background:#ffffff;"><i class="fas fa-users"></i> بخش خانواده (فقط سرپرستان)</div>';

    familyItems.forEach(function(item) {
        const disabled = isHead ? '' : 'disabled';
        const lock = isHead ? '' : '<span class="lock-icon"><i class="fas fa-lock"></i></span>';
        const click = isHead ? 'selectMenuItem(\'' + item.tab + '\')' : 'alert(\'🔒 فقط سرپرستان خانوار دسترسی دارند\')';
        gridHtml += '<div class="grid-menu-item family-item ' + disabled + '" data-tab="' + item.tab + '" onclick="' + click + '">' +
            '<div class="menu-icon" style="background:linear-gradient(135deg,#10b981,#059669);">' +
            '<i class="fas ' + item.icon + '"></i></div>' +
            '<div class="menu-label">' + item.label + '</div>' + lock + '</div>';
    });

    gridHtml += '<div class="council-divider"><i class="fas fa-crown"></i> بخش ویژه شورا و مدیر</div>';

    councilItems.forEach(function(item) {
        var disabled = isCouncil ? '' : 'disabled';
        var lock = isCouncil ? '' : '<span class="lock-icon"><i class="fas fa-lock"></i></span>';
        var click;
        if (isCouncil) {
            click = (item.tab === 'adminPanel') ? 'openAdminPanel()' : 'selectMenuItem(\'' + item.tab + '\')';
        } else {
            click = 'alert(\'🔒 فقط اعضای شورا و مدیر دسترسی دارند\')';
        }
        gridHtml += '<div class="grid-menu-item council-item ' + disabled + '" data-tab="' + item.tab + '" onclick="' + click + '">' +
            '<div class="menu-icon" style="background:linear-gradient(135deg,' + item.color + ',' + item.color + 'dd);">' +
            '<i class="fas ' + item.icon + '"></i></div>' +
            '<div class="menu-label">' + item.label + '</div>' + lock + '</div>';
    });

    gridHtml += '</div>';

    let systemMessageHtml = '';

    content.innerHTML =
        '<div class="hdr" id="mainHeader">' +
            '<div class="greet" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">' +
                '<b>' + ((typeof esc === 'function') ? esc(member.firstName) : member.firstName) + ' عزیز، خوش آمدید 👋</b>' +
                '<span style="display:inline-flex;align-items:center;gap:7px;">' + bdayCakeHtml + '</span>' +
            '</div>' +
            '<div class="daterow">' +
                '<span>📅 ' + new Date().toLocaleDateString('fa-IR') + '</span>' +
                '<span class="clock" id="liveClock">🕐 --:--:--</span>' +
                '<span>' + ((typeof getPersianDayName === 'function') ? getPersianDayName() : '') + '</span>' +
                '<span class="hello">' + greeting + '</span>' +
            '</div>' +
            systemMessageHtml +
            gridHtml +
        '</div>';

    setTimeout(function() {
        var hdr = document.getElementById('mainHeader');
        var contentArea = document.getElementById('contentArea');

        if (hdr && contentArea) {
            if (hdr.parentElement === contentArea) {
                document.body.insertBefore(hdr, document.body.firstChild);
            }

            contentArea.innerHTML = '';
            contentArea.style.display = 'none';

            hdr.style.position = 'fixed';
            hdr.style.top = '0';
            hdr.style.left = '0';
            hdr.style.right = '0';
            hdr.style.maxHeight = '70vh';
            hdr.style.overflowY = 'auto';
            hdr.style.padding = '8px 12px';
            hdr.style.zIndex = '99';
            hdr.style.background = 'linear-gradient(135deg, #1a1a2e, #2a2a4a)';
            hdr.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';

            document.body.style.paddingTop = hdr.offsetHeight + 'px';
            document.body.style.background = 'var(--bg-primary)';
            document.body.style.paddingBottom = '0';
            document.body.style.marginBottom = '0';
            contentArea.style.paddingTop = '0';
            contentArea.style.marginTop = '0';
            contentArea.style.background = 'var(--bg-primary)';
            contentArea.style.minHeight = '0';
        }
    }, 100);

    setInterval(function() {
        const clk = document.getElementById('liveClock');
        if (clk) {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            clk.textContent = '🕐 ' + h + ':' + m + ':' + s;
        }
    }, 1000);

    if (typeof updateNotifBadge === 'function') updateNotifBadge();
    if (typeof updateFloatingButtons === 'function') updateFloatingButtons();
}

// در معرض عموم
window.selectMenuItem = selectMenuItem;
window.openScriptService = openScriptService;
window.openToddlerGames = openToddlerGames;
window.openLadySection = openLadySection;
window.openTeenPiggy = openTeenPiggy;
window.renderMenuPage = renderMenuPage;
