/* ============================================================
   صندوق اتحاد - منوی اصلی
   نسخه: 2.0
   ============================================================ */

function renderMenuPage(content) {
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) { content.innerHTML = '<div style="text-align:center;padding:30px;">خطا</div>'; return; }

    const sd = memberScores[member.id];
    const greeting = getGreeting();

    const famScores = computeFamilyScores();
    const myRank = famScores.findIndex(f => f.code === member.heh1) + 1;
    const totalFam = famScores.length;

    const t = getTodayShamsi();
    const tn = shamsiDayNum(t.y, t.m, t.d);

    let isUserBirthday = false;
    let birthDay = 0;
    let birthMonth = 0;

    if (member.birthDateShamsi) {
        const bd = String(member.birthDateShamsi).trim();
        let bYear = 0, bMonth = 0, bDay = 0;

        if (bd.includes('/')) {
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

    if (isUserBirthday) {
        const birthdayKey = `bday_shown_${member.id}_${t.y}_${t.m}`;
        if (!localStorage.getItem(birthdayKey)) {
            setTimeout(() => showBirthdayWish(member, birthDay, t.m), 800);
            localStorage.setItem(birthdayKey, '1');
        }
    }

    const isCouncil = hasCouncilOrAdminAccess();
    const isHead = isHeadOfHousehold();

    const publicItems = [
        { tab: 'profile', label: 'اطلاعات شخصی شما', icon: 'fa-user-circle', color: '#8b5cf6' },
        { tab: 'dashboard', label: 'صورتحساب', icon: 'fa-chart-line', color: '#667eea' },
        { tab: 'requests', label: 'درخواست‌ها', icon: 'fa-file-signature', color: '#f97316' },
        { tab: 'sms', label: 'سامانه‌های پیامکی', icon: 'fa-sms', color: '#14b8a6' },
        { tab: 'support', label: 'پشتیبانی', icon: 'fa-headset', color: '#84cc16' },
    ];

    const specialBoxItems = [
        { tab: 'myFund', label: 'صندوق من', icon: 'fa-gem', color: '#06b6d4', onclick: "selectMenuItem('myFund')" },
        { tab: 'utilities', label: 'برنامه‌های کاربردی', icon: 'fa-toolbox', color: '#f97316', onclick: "selectMenuItem('utilities')" }
    ];

    const specialItems = [
        { tab: 'toddlerGrowth', label: '🧒 رشد ویژه خردسالان', icon: 'fa-baby', color: '#38bdf8' },
        { tab: 'teenPiggy', label: '🐷 قلک ویژه نوجوانان', icon: 'fa-child', color: '#ec4899' },
        { tab: 'ladySpecial', label: '👩 بانو ویژه بانوان', icon: 'fa-female', color: '#d946ef' },
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

    publicItems.forEach(item => {
        const blinkClass = item.tab === 'dashboard' ? ' blink-dashboard' : '';
        const clickHandler = item.onclick ? item.onclick : `selectMenuItem('${item.tab}')`;
        gridHtml += `<div class="grid-menu-item${blinkClass}" data-tab="${item.tab}" onclick="${clickHandler}"><div class="menu-icon" style="background:linear-gradient(135deg,${item.color},${item.color}dd);"><i class="fas ${item.icon}"></i></div><div class="menu-label">${item.label}</div><span class="menu-badge">0</span></div>`;
    });

    gridHtml += '<div class="script-services-divider"><i class="fas fa-cloud"></i> خدمات آنلاین و متصل به اسکریپت <span>☁️ اطلاعات این بخش فقط هنگام ورود به آن بارگذاری می‌شود</span></div>';
    const scriptServices = [
        { tab:'emailForm', label:'ثبت نحوه ارسال صورتحساب', icon:'fa-envelope', color:'#3b82f6' },
        { tab:'club', label:'امتیازات و فروشگاه', icon:'fa-star', color:'#f59e0b' },
        { tab:'dailyReward', label:'پاداش روزانه', icon:'fa-gift', color:'#ffd700' },
        { tab:'quizzes', label:'🏆 مسابقات', icon:'fa-trophy', color:'#ffd700' },
        { tab:'messaging', label:'📨 ارسال پیام', icon:'fa-paper-plane', color:'#8b5cf6' },
        { tab:'survey', label:'📊 نظرسنجی', icon:'fa-poll', color:'#ec4899' }
    ];
    scriptServices.forEach(item => {
        gridHtml += `<div class="grid-menu-item script-service-item" data-tab="${item.tab}" onclick="openScriptService('${item.tab}')"><div class="menu-icon" style="background:linear-gradient(135deg,${item.color},${item.color}dd);"><i class="fas ${item.icon}"></i></div><div class="menu-label">${item.label}</div><span class="script-load-dot">☁️</span></div>`;
    });

    gridHtml += '<div class="family-divider" style="color:#ef4444;border-top:2px solid #ef4444;border-bottom:2px solid #ef4444;background:#ffffff;"><i class="fas fa-crown"></i> بخش ویژه</div>';
    specialBoxItems.forEach(item => {
        gridHtml += `<div class="grid-menu-item" data-tab="${item.tab}" onclick="${item.onclick}">
            <div class="menu-icon" style="background:linear-gradient(135deg,${item.color},${item.color}dd);">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="menu-label">${item.label}</div>
        </div>`;
    });

    gridHtml += '<div class="family-divider" style="color:#ec4899;border-top:2px solid #ec4899;border-bottom:2px solid #ec4899;background:#ffffff;"><i class="fas fa-gem"></i> ویژه اعضا</div>';
    specialItems.forEach(item => {
        let clickHandler = '';
        let badgeHtml = '';

        if (item.tab === 'toddlerGrowth') {
            clickHandler = `openToddlerGames()`;
            badgeHtml = `<span style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:3px 10px;border-radius:10px;font-size:0.5rem;">✅ فعال</span>`;
        } else if (item.tab === 'ladySpecial') {
            clickHandler = `openLadySection()`;
            badgeHtml = `<span style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#d946ef,#a21caf);color:#fff;padding:3px 10px;border-radius:10px;font-size:0.5rem;">👩 فعال</span>`;
        } else if (item.tab === 'teenPiggy') {
            clickHandler = 'openTeenPiggy()';
            badgeHtml = '<span style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;padding:3px 10px;border-radius:10px;font-size:0.5rem;">🚀 جدید</span>';
        } else {
            clickHandler = "showComingSoon('" + item.label + "')";
            badgeHtml = '<span style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;padding:3px 10px;border-radius:10px;font-size:0.5rem;">بزودی 🚧</span>';
        }
        gridHtml += `<div class="grid-menu-item" data-tab="${item.tab}" onclick="${clickHandler}">
            <div class="menu-icon" style="background:linear-gradient(135deg,${item.color},${item.color}dd);">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="menu-label">${item.label}</div>
            ${badgeHtml}
        </div>`;
    });

    gridHtml += '<div class="family-divider" style="background:#ffffff;"><i class="fas fa-users"></i> بخش خانواده (فقط سرپرستان)</div>';
    familyItems.forEach(item => {
        const disabled = isHead ? '' : 'disabled';
        const lock = isHead ? '' : '<span class="lock-icon"><i class="fas fa-lock"></i></span>';
        const click = isHead ? `selectMenuItem('${item.tab}')` : `alert('🔒 فقط سرپرستان خانوار دسترسی دارند')`;
        gridHtml += `<div class="grid-menu-item family-item ${disabled}" data-tab="${item.tab}" onclick="${click}"><div class="menu-icon" style="background:linear-gradient(135deg,#10b981,#059669);"><i class="fas ${item.icon}"></i></div><div class="menu-label">${item.label}</div>${lock}</div>`;
    });

    gridHtml += '<div class="council-divider"><i class="fas fa-crown"></i> بخش ویژه شورا و مدیر</div>';
    councilItems.forEach(function(item) {
        var disabled = isCouncil ? '' : 'disabled';
        var lock = isCouncil ? '' : '<span class="lock-icon"><i class="fas fa-lock"></i></span>';
        var click;
        if (isCouncil) {
            click = (item.tab === 'adminPanel') ? 'openAdminPanel()' : "selectMenuItem('" + item.tab + "')";
        } else {
            click = "alert('🔒 فقط اعضای شورا و مدیر دسترسی دارند')";
        }
        gridHtml += '<div class="grid-menu-item council-item ' + disabled + '" data-tab="' + item.tab + '" onclick="' + click + '">' +
            '<div class="menu-icon" style="background:linear-gradient(135deg,' + item.color + ',' + item.color + 'dd);">' +
            '<i class="fas ' + item.icon + '"></i></div>' +
            '<div class="menu-label">' + item.label + '</div>' + lock + '</div>';
    });
    gridHtml += '</div>';

    let systemMessageHtml = '';

    content.innerHTML = `
        <div class="hdr" id="mainHeader">
            <div class="greet" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                <b>${esc(member.firstName)} عزیز، خوش آمدید 👋</b>
                <span style="display:inline-flex;align-items:center;gap:7px;">${bdayCakeHtml}</span>
            </div>
            <div class="daterow">
                <span>📅 ${new Date().toLocaleDateString('fa-IR')}</span>
                <span class="clock" id="liveClock">🕐 --:--:--</span>
                <span>${getPersianDayName()}</span>
                <span class="hello">${greeting}</span>
            </div>
            ${systemMessageHtml}
            ${gridHtml}
        </div>
    `;

    // انتقال هدر به body (خارج از contentArea)
    setTimeout(function() {
        var hdr = document.getElementById('mainHeader');
        var contentArea = document.getElementById('contentArea');
        
        if (hdr && contentArea) {
            if (hdr.parentElement === contentArea) {
                document.body.insertBefore(hdr, document.body.firstChild);
            }
            
            // ✅ اصلاح: پاک کردن contentArea و مخفی کردن کامل آن
            contentArea.innerHTML = '';
            contentArea.style.display = 'none';
            contentArea.style.height = '0';
            contentArea.style.minHeight = '0';
            contentArea.style.maxHeight = '0';
            contentArea.style.overflow = 'hidden';
            contentArea.style.padding = '0';
            contentArea.style.margin = '0';
            
            // ✅ مخفی کردن appContainer
            var appContainer = document.getElementById('appContainer');
            if (appContainer) {
                appContainer.style.minHeight = '0';
                appContainer.style.height = 'auto';
                appContainer.style.paddingBottom = '80px'; // برای نوار پایین
            }
            
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
            document.body.style.paddingBottom = '80px';
            document.body.style.marginBottom = '0';
            document.body.style.height = 'auto';
            document.body.style.minHeight = '0';
        }
    }, 100);

    // نمایش نوار پایین
    setTimeout(function() {
        var mainNav = document.getElementById('mainBottomNav');
        if (mainNav) {
            mainNav.style.display = 'flex';
        }
    }, 200);

    // ساعت زنده
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

    updateNotifBadge();
    updateFloatingButtons();
}
