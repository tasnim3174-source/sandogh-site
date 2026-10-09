/* ============================================================
   صندوق اتحاد - ورود و Remember Me
   نسخه: 3.1 - login-users.json + شروع لود داده‌های سنگین
   ============================================================ */

// ============================================================
// آدرس فایل کاربران (سبک - فقط اطلاعات ورود)
// ============================================================
var LOGIN_USERS_URL = 'https://raw.githubusercontent.com/tasnim3174-source/sandogh-site/main/login-users.json';

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
// ✅ خواندن سبک login-users.json از GitHub
// ============================================================
async function fetchLoginUsers() {
    console.log('📥 خواندن login-users.json از GitHub...');
    var t0 = Date.now();
    
    var response = await fetch(LOGIN_USERS_URL, { cache: 'no-cache' });
    
    if (!response.ok) {
        throw new Error('خطا در خواندن اطلاعات ورود (HTTP ' + response.status + ')');
    }
    
    var users = await response.json();
    
    if (!Array.isArray(users)) {
        throw new Error('اطلاعات ورود نامعتبر است');
    }
    
    console.log('✅ ' + users.length + ' کاربر در ' + (Date.now() - t0) + 'ms');
    return users;
}

// ============================================================
// ✅ شروع لود داده‌های سنگین در پس‌زمینه (بدون await)
// ============================================================
function startBackgroundDataLoad() {
    if (typeof loadMainDataWithCache !== 'function') {
        console.warn('⚠️ loadMainDataWithCache موجود نیست - پس‌زمینه لود نمی‌شه');
        window.__bgProcessing = false;
        return;
    }
    
    console.log('⏳ شروع لود داده‌های سنگین در پس‌زمینه...');
    var t0 = Date.now();
    window.__bgProcessing = true;
    window.__dataReady = false;
    
    loadMainDataWithCache(false).then(function(fullData) {
        console.log('✅ داده‌های سنگین لود شد در ' + (Date.now() - t0) + 'ms');
        
        // ذخیره در متغیرهای سراسری
        if (fullData.members && fullData.members.length > 0) {
            window.__fullMembers = fullData.members;
        }
        if (fullData.transactions && fullData.transactions.length > 0) {
            window.__fullTransactions = fullData.transactions;
        }
        if (fullData.users && fullData.users.length > 0) {
            window.__fullUsers = fullData.users;
        }
        
        window.__dataReady = true;
        window.__bgProcessing = false;
        console.log('🎉 همه داده‌ها آماده است');
    }).catch(function(err) {
        console.error('❌ خطا در لود داده‌های سنگین:', err);
        window.__bgProcessing = false;
    });
}

// ============================================================
// تابع ورود اصلی (نسخه سبک + شروع پس‌زمینه)
// ============================================================
async function handleLogin() {
    hideBottomNav();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!username || !password) {
        alert('⚠️ لطفاً نام کاربری و رمز عبور را وارد کنید');
        return;
    }

    loginDataReady = false;
    loginResult = null;
    window.__bgProcessing = true;

    document.getElementById('loginPage').style.display = 'none';
    showLoaderAnimation();

    // ✅ همین الان شروع کن به لود داده‌های سنگین در پس‌زمینه
    startBackgroundDataLoad();

    try {
        var user = null;
        var usersList = null;

        // ============================================================
        // ✅ مرحله ۱: از cache لوکال (سریع‌ترین راه)
        // ============================================================
        var cachedUsers = loadUsersFromCache();
        
        if (cachedUsers && cachedUsers.length > 0) {
            user = cachedUsers.find(function(u) {
                return (u.username === username || u.accountNumber === username) && 
                       u.password === password;
            });
            
            if (user) {
                console.log('⚡ کاربر از cache پیدا شد');
                usersList = cachedUsers;
            }
        }

        // ============================================================
        // ✅ مرحله ۲: از login-users.json (سبک)
        // ============================================================
        if (!user) {
            var loginUsers = await fetchLoginUsers();
            
            user = loginUsers.find(function(u) {
                return (u.username === username || u.accountNumber === username) && 
                       u.password === password;
            });
            
            if (user) {
                usersList = loginUsers;
                saveUsersToCache(loginUsers);
            }
        }

        // ============================================================
        // نتیجه
        // ============================================================
        if (user) {
            loginResult = {
                success: true,
                user: user,
                data: { 
                    members: [],
                    transactions: [],
                    users: usersList || []
                },
                username: username,
                password: password
            };

            // ⚠️ این‌ها رو به تعویق بنداز
            setTimeout(function() {
                try {
                    if (typeof logUserLogin === 'function') {
                        logUserLogin(username, user.name || user.firstName || username);
                    }
                } catch(e) {}
            }, 3000);

            setTimeout(function() {
                try {
                    if (typeof awardDailyLogin === 'function') 
                        Promise.resolve(awardDailyLogin(user)).catch(function() {});
                } catch(e) {}
            }, 4000);

        } else {
            loginResult = {
                success: false,
                error: 'نام کاربری یا رمز عبور اشتباه است'
            };
        }
    } catch (error) {
        console.error('خطای ورود:', error);
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

    hideBottomNav();
});
