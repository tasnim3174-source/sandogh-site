/* ============================================================
   صندوق اتحاد - افکت‌های فصلی خودکار
   نسخه: 1.0
   ============================================================ */

(function() {
    // ============================================================
    // ۱. تشخیص فصل بر اساس تاریخ شمسی
    // ============================================================
        function getCurrentSeason() {
        var now = new Date();
        
        // محاسبه دقیق تاریخ شمسی با استفاده از Intl
        var persianDate = new Intl.DateTimeFormat('en-US-u-ca-persian', { 
            year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'Asia/Tehran'
        }).formatToParts(now);
        
        var month = 0;
        persianDate.forEach(function(part) {
            if (part.type === 'month') month = parseInt(part.value, 10);
        });
        
        console.log('📅 ماه شمسی فعلی:', month);
        
        if (month >= 1 && month <= 3) return 'spring';
        if (month >= 4 && month <= 6) return 'summer';
        if (month >= 7 && month <= 9) return 'autumn';
        if (month >= 10 && month <= 12) return 'winter';
        
        return 'summer';
    }
    // ============================================================
    // ۲. تعیین افکت پیش‌فرض بر اساس فصل
    // ============================================================
    function getDefaultEffectForSeason(season) {
        switch (season) {
            case 'autumn':
                return 'leaves'; // برگ‌های پاییزی
            case 'winter':
                return 'snow';   // برف
            case 'spring':
                return 'rain';   // باران بهاری
            case 'summer':
                return 'stars';  // ستاره‌های تابستانی
            default:
                return 'stars';
        }
    }

    // ============================================================
    // ۳. بررسی اینکه آیا کاربر تنظیمات دستی انجام داده است؟
    // ============================================================
    function hasUserManualSettings() {
        try {
            // اگر کاربر تنظیمات خودش را ذخیره کرده باشد، از آن استفاده می‌کنیم
            var saved = localStorage.getItem('sandogh_effects_settings');
            if (saved) {
                var parsed = JSON.parse(saved);
                // اگر یکی از افکت‌ها فعال بود، یعنی کاربر تنظیمات خودش را دارد
                if (parsed.rain || parsed.snow || parsed.stars || parsed.leaves) {
                    return true;
                }
            }
        } catch(e) {}
        return false;
    }

    // ============================================================
    // ۴. اعمال افکت پیش‌فرض فصلی
    // ============================================================
    function applySeasonalEffect() {
        // اگر کاربر تنظیمات دستی دارد، کاری نکن
        if (hasUserManualSettings()) {
            console.log('🎨 کاربر تنظیمات دستی دارد، افکت فصلی اعمال نمی‌شود.');
            return;
        }

        var season = getCurrentSeason();
        var defaultEffect = getDefaultEffectForSeason(season);
        
        console.log('🍂 فصل فعلی:', season, '| افکت پیش‌فرض:', defaultEffect);

        // ساخت تنظیمات پیش‌فرض
        var settings = {
            rain: defaultEffect === 'rain',
            snow: defaultEffect === 'snow',
            stars: defaultEffect === 'stars',
            leaves: defaultEffect === 'leaves'
        };

        try {
            localStorage.setItem('sandogh_effects_settings', JSON.stringify(settings));
        } catch(e) {}

        // اعمال افکت‌ها
        if (typeof window.applyEffects === 'function') {
            window.EFFECTS = settings;
            window.applyEffects();
        }
        
        if (typeof window.updateEffectButtons === 'function') {
            window.updateEffectButtons();
        }
    }

    // ============================================================
    // ۵. اجرای خودکار بعد از بارگذاری صفحه
    // ============================================================
    window.addEventListener('load', function() {
        // کمی صبر می‌کنیم تا بقیه اسکریپت‌ها لود شوند
        setTimeout(applySeasonalEffect, 1500);
    });

    // در معرض عموم قرار می‌دهیم
    window.getCurrentSeason = getCurrentSeason;
    window.applySeasonalEffect = applySeasonalEffect;

})();
