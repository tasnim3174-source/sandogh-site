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

        // ============================================================
    // ✅ تشخیص شورا و سرپرست با چند روش (fallback)
    // ============================================================
      // ============================================================
    // ✅ تشخیص شورا و سرپرست - نسخه قطعی
    // ============================================================
    var isCouncil = false;
    var isHead = false;

    // روش ۱: از member (قوی‌ترین منبع)
    if (member) {
        // شورا: چک کردن isCouncil با همه فرمت‌ها
        isCouncil = (member.isCouncil === true || 
                     member.isCouncil === 'true' || 
                     member.isCouncil === 1 ||
                     member.isCouncil === '1');
        
        // سرپرست: چک کردن heh2 با همه فرمت‌ها
        var h = String(member.heh2 || '').trim();
        // تبدیل "01" به "1"
        while (h.length > 1 && h.charAt(0) === '0') {
            h = h.substring(1);
        }
        isHead = (h === '1' || h === 'سرپرست' || h === 'بله' || h === 'آری' || 
                  h === 'سرپرست خانوار' || h === 'true' || h.indexOf('سرپرست') > -1);
    }

    // روش ۲: از currentUser
    if (!isCouncil && (currentUser.role === 'council' || currentUser.role === 'admin')) {
        isCouncil = true;
    }
    if (!isCouncil && currentUser.isCouncil === true) isCouncil = true;
    if (!isHead && currentUser.isHead === true) isHead = true;

    // روش ۳: از members (اگه لود شده)
    if (!isCouncil || !isHead) {
        if (members && members.length > 0) {
            var meInMembers = members.find(function(m) {
                return String(m.accountNumber) === String(currentUser.accountNumber) ||
                       String(m.accountNumber) === String(currentUser.username);
            });
            if (meInMembers) {
                if (!isCouncil && meInMembers.isCouncil === true) isCouncil = true;
                if (!isHead) {
                    var h2 = String(meInMembers.heh2 || '').trim();
                    while (h2.length > 1 && h2.charAt(0) === '0') {
                        h2 = h2.substring(1);
                    }
                    if (h2 === '1' || h2 === 'سرپرست' || h2 === 'بله' || h2 === 'آری' || 
                        h2 === 'سرپرست خانوار' || h2 === 'true' || h2.indexOf('سرپرست') > -1) {
                        isHead = true;
                    }
                }
            }
        }
    }

    // روش ۴: fallback به توابع قدیمی
    if (!isCouncil && typeof hasCouncilOrAdminAccess === 'function') {
        try { 
            var r1 = hasCouncilOrAdminAccess();
            isCouncil = (r1 === true || r1 === 'true' || r1 === 1);
        } catch(e) {}
    }
    if (!isHead && typeof isHeadOfHousehold === 'function') {
        try { 
            var r2 = isHeadOfHousehold();
            isHead = (r2 === true || r2 === 'true' || r2 === 1);
        } catch(e) {}
    }

    // 🎯 لاگ نهایی برای دیباگ
    console.log('🎯 تشخیص دسترسی نهایی:');
    console.log('   isCouncil:', isCouncil);
    console.log('   isHead:', isHead);
    console.log('   member.isCouncil:', member ? member.isCouncil : 'N/A');
    console.log('   member.heh2:', member ? member.heh2 : 'N/A');
    console.log('   member.heh2 پردازش شده:', member ? String(member.heh2 || '').replace(/^0+/, '') : 'N/A');
