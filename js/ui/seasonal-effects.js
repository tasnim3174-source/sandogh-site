/* ============================================================
   صندوق اتحاد - افکت‌های فصلی خودکار
   نسخه: 2.0 (اجباری کردن افکت فصلی)
   ============================================================ */

(function() {
    // ============================================================
    // ۱. تشخیص فصل بر اساس تاریخ شمسی (با استفاده از زمان تهران)
    // ============================================================
    function getCurrentSeason() {
        var now = new Date();
        
        var parts = new Intl.DateTimeFormat('en-US-u-ca-persian', { 
            year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'Asia/Tehran'
        }).formatToParts(now);
        
        var month = 0;
        parts.forEach(function(p) {
            if (p.type === 'month') month = parseInt(p.value, 10);
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
            case 'autumn':  return 'leaves';
            case 'winter':  return 'snow';
            case 'spring':  return 'rain';
            case 'summer':  return 'stars';
            default:        return 'stars';
        }
    }

    // ============================================================
    // ۳. اعمال افکت پیش‌فرض فصلی (اجباری)
    // ============================================================
    function applySeasonalEffect() {
        var season = getCurrentSeason();
        var defaultEffect = getDefaultEffectForSeason(season);
        
        console.log('🍂 فصل:', season, '| افکت پیش‌فرض:', defaultEffect);

        // ساخت تنظیمات جدید (فقط افکت فصل فعال)
        var settings = {
            rain: defaultEffect === 'rain',
            snow: defaultEffect === 'snow',
            stars: defaultEffect === 'stars',
            leaves: defaultEffect === 'leaves'
        };

        // ذخیره در حافظه
        try {
            localStorage.setItem('sandogh_effects_settings', JSON.stringify(settings));
        } catch(e) {}

        // اعمال افکت‌ها
        if (window.EFFECTS) {
            window.EFFECTS = settings;
        } else {
            window.EFFECTS = settings;
        }
        
        if (typeof window.applyEffects === 'function') {
            window.applyEffects();
        }
        
        if (typeof window.updateEffectButtons === 'function') {
            window.updateEffectButtons();
        }

        // اگر تابع applyEffects موجود نبود، خودمان افکت را اجرا می‌کنیم
        if (typeof window.applyEffects !== 'function') {
            if (defaultEffect === 'leaves' && typeof window.startAutumnLeaves === 'function') {
                window.startAutumnLeaves();
            }
            if (defaultEffect === 'snow' && typeof window.startSnow === 'function') {
                window.startSnow();
            }
            if (defaultEffect === 'rain' && typeof window.startRain === 'function') {
                window.startRain();
            }
            if (defaultEffect === 'stars' && typeof window.startStars === 'function') {
                window.startStars();
            }
        }
    }

    // ============================================================
    // ۴. اجرای خودکار بعد از بارگذاری صفحه
    // ============================================================
    window.addEventListener('load', function() {
        setTimeout(applySeasonalEffect, 1000);
    });

    // اجرای فوری اگر صفحه قبلاً لود شده
    if (document.readyState === 'complete') {
        setTimeout(applySeasonalEffect, 500);
    }

    // در معرض عموم
    window.getCurrentSeason = getCurrentSeason;
    window.applySeasonalEffect = applySeasonalEffect;

})();
