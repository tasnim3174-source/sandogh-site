/* ============================================================
   صندوق اتحاد - ورود و Remember Me
   نسخه: 2.0
   ============================================================ */

// ============================================================
// ذخیره و بارگذاری Remember Me
// ============================================================
function saveRememberMe(username, password) {
    try {
        if (document.getElementById('rememberMe') && document.getElementById('rememberMe').checked) {
            localStorage.setItem('sandogh_remember_username', username);
            localStorage.setItem('sandogh_remember_password', password);
            localStorage.setItem('sandogh_remember_checked', 'true');
        } else {
            localStorage.removeItem('sandogh_remember_username');
            localStorage.removeItem('sandogh_remember_password');
            localStorage.setItem('sandogh_remember_checked', 'false');
        }
    } catch (e) {}
}

function forceEnglishKeyboard() {
    var u = document.getElementById('loginUsername');
    var pw = document.getElementById('loginPassword');
    [u, pw].forEach(function(el){
        if(el){
            el.setAttribute('lang', 'en');
            el.setAttribute('inputmode', 'text');
            el.style.direction = 'ltr';
        }
    });
}
document.addEventListener('DOMContentLoaded', forceEnglishKeyboard);

function loadRememberMe() {
    try {
        const username = localStorage.getItem('sandogh_remember_username') || '';
        const password = localStorage.getItem('sandogh_remember_password') || '';
        const checked = localStorage.getItem('sandogh_remember_checked') === 'true';
        if (username && password && checked) {
            var u = document.getElementById('loginUsername');
            var p = document.getElementById('loginPassword');
            var r = document.getElementById('rememberMe');
            if (u) u.value = username;
            if (p) p.value = password;
            if (r) r.checked = true;
            return true;
        }
        return false;
    } catch (e) { return false; }
}

// ============================================================
// مخفی کردن نوار پایین (تابع کمکی)
// ============================================================
function hideBottomNav() {
    var mainNav = document.getElementById('mainBottomNav');
    if (mainNav) mainNav.style.display = 'none';
}

function showBottomNav() {
    var mainNav = document.getElementById('mainBottomNav');
    if (mainNav) mainNav.style.display = 'flex';
}

// ============================================================
// تابع ورود اصلی
// ============================================================
async function handleLogin() {
    // ✅ مخفی کردن نوار پایین هنگام لاگین
    hideBottomNav();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!username || !password) {
        alert('⚠️ لطفاً نام کاربری و رمز عبور را وارد کنید');
        return;
    }

    loginDataReady = false;
    loginResult = null;

    document.getElementById('loginPage').style.display = 'none';
    showLoaderAnimation();

    try {
        // مرحله ۱: بررسی سریع از cache لوکال
        let cachedUsers = loadUsersFromCache();
        let user = null;

        if (cachedUsers && cachedUsers.length > 0) {
            user = cachedUsers.find(u =>
                (u.username === username || u.accountNumber === username) &&
                u.password === password
            );
        }

        // مرحله ۲: اگر در cache نبود، از سرور بگیر
        let data;
        if (!user) {
            data = await loadMainDataWithCache(false);
            user = data.users.find(u =>
                (u.username === username || u.accountNumber === username) &&
                u.password === password
            );

            if (data.users && data.users.length > 0) {
                const enrichedUsers = data.users.map(u => {
                    const member = data.members ? data.members.find(m =>
                        String(m.accountNumber) === String(u.username) ||
                        String(m.accountNumber) === String(u.accountNumber)
                    ) : null;

                    return {
                        accountNumber: u.accountNumber,
                        username: u.username,
                        password: u.password,
                        firstName: u.firstName || (member ? member.firstName : ''),
                        phone: u.phone || (member ? member.phone1 : ''),
                        phone1: member ? member.phone1 : (u.phone1 || ''),
                        phone2: member ? member.phone2 : (u.phone2 || ''),
                        heh1: u.heh1 || (member ? member.heh1 : ''),
                        isCouncil: u.isCouncil,
                        familyCount: u.familyCount || 1
                    };
                });
                saveUsersToCache(enrichedUsers);
            }
        } else {
            data = await loadMainDataWithCache(false);
        }

        if (user) {
            loginResult = {
                success: true,
                user: user,
                data: data,
                username: username,
                password: password
            };

            logUserLogin(username, user.name || user.firstName || username);

            Promise.resolve(awardDailyLogin(user)).catch(function() {});
            Promise.resolve(awardBirthday(user, data)).catch(function() {});
            Promise.resolve(awardMonthlyPoints(user, data)).catch(function() {});

        } else {
            loginResult = {
                success: false,
                error: 'نام کاربری یا رمز عبور اشتباه است'
            };
        }
    } catch (error) {
        loginResult = {
            success: false,
            error: 'خطا در اتصال: ' + error.message
        };
    }
    loginDataReady = true;
}

// ============================================================
// راه‌اندازی Enter برای ورود
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');

    if (usernameInput && passwordInput) {
        usernameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.value.trim() && passwordInput.value.trim()) handleLogin();
                else if (this.value.trim()) passwordInput.focus();
            }
        });
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (usernameInput.value.trim() && this.value.trim()) handleLogin();
            }
        });
    }

    // ✅ اطمینان از مخفی بودن نوار پایین در صفحه لاگین
    hideBottomNav();
});
