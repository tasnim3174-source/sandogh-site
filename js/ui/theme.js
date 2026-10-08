/* ============================================================
   صندوق اتحاد - تم و رنگ
   نسخه: 2.0
   ============================================================ */

// ============================================================
// تنظیمات تم
// ============================================================
function setTheme(theme) {
    localStorage.setItem('sandogh_theme', theme);
    const hour = new Date().getHours();
    if (theme === 'auto') {
        const isDark = (hour < 6 || hour >= 20);
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    document.querySelectorAll('.theme-option').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.theme-option[onclick="setTheme('${theme}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

const COLOR_THEMES = {
    blue:   { start: '#667eea', end: '#764ba2', gold: '#f59e0b', success: '#10b981', danger: '#ef4444' },
    orange: { start: '#f97316', end: '#ea580c', gold: '#f59e0b', success: '#10b981', danger: '#ef4444' },
    gold:   { start: '#f59e0b', end: '#d97706', gold: '#fbbf24', success: '#10b981', danger: '#ef4444' },
    green:  { start: '#10b981', end: '#059669', gold: '#f59e0b', success: '#22c55e', danger: '#ef4444' },
    pink:   { start: '#ec4899', end: '#db2777', gold: '#f59e0b', success: '#10b981', danger: '#ef4444' },
    purple: { start: '#8b5cf6', end: '#7c3aed', gold: '#f59e0b', success: '#10b981', danger: '#ef4444' },
    teal:   { start: '#14b8a6', end: '#0d9488', gold: '#f59e0b', success: '#10b981', danger: '#ef4444' },
    red:    { start: '#ef4444', end: '#dc2626', gold: '#f59e0b', success: '#10b981', danger: '#f87171' },
    cyan:   { start: '#06b6d4', end: '#0891b2', gold: '#f59e0b', success: '#10b981', danger: '#ef4444' },
    lime:   { start: '#84cc16', end: '#65a30d', gold: '#f59e0b', success: '#a3e635', danger: '#ef4444' },
    indigo: { start: '#6366f1', end: '#4f46e5', gold: '#f59e0b', success: '#10b981', danger: '#ef4444' },
    slate:  { start: '#64748b', end: '#475569', gold: '#f59e0b', success: '#10b981', danger: '#ef4444' }
};

function setColorTheme(name, btn) {
    const theme = COLOR_THEMES[name];
    if (!theme) return;
    const r = document.documentElement;
    r.style.setProperty('--gradient-start', theme.start);
    r.style.setProperty('--gradient-end', theme.end);
    r.style.setProperty('--gold-color', theme.gold);
    r.style.setProperty('--success-color', theme.success);
    r.style.setProperty('--danger-color', theme.danger);
    r.style.setProperty('--gradient-start-light', theme.start + '33');
    r.style.setProperty('--gradient-end-light', theme.end + '33');
    try { localStorage.setItem('sandogh_color_theme', name); } catch (e) { }
    document.querySelectorAll('.color-theme-btn').forEach(function (b) {
        b.classList.remove('active');
    });
    if (btn) {
        btn.classList.add('active');
    }
}

function loadSavedColorTheme() {
    let saved = 'blue';
    try { saved = localStorage.getItem('sandogh_color_theme') || 'blue'; } catch (e) { }
    if (COLOR_THEMES[saved]) {
        setColorTheme(saved, null);
        setTimeout(function () {
            document.querySelectorAll('.color-theme-btn').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-color') === saved);
            });
        }, 100);
    }
}

// ============================================================
// رنگ پویای ساعت بر اساس زمان روز
// ============================================================
(function() {
    'use strict';
    
    function updateClockColor() {
        var hour = new Date().getHours();
        var color, bg, border;
        
        if (hour >= 5 && hour < 12) {
            color = '#10b981';
            bg = 'rgba(16, 185, 129, 0.15)';
            border = 'rgba(16, 185, 129, 0.4)';
        } else if (hour >= 12 && hour < 17) {
            color = '#38bdf8';
            bg = 'rgba(56, 189, 248, 0.15)';
            border = 'rgba(56, 189, 248, 0.4)';
        } else if (hour >= 17 && hour < 20) {
            color = '#f97316';
            bg = 'rgba(249, 115, 22, 0.15)';
            border = 'rgba(249, 115, 22, 0.4)';
        } else {
            color = '#f472b6';
            bg = 'rgba(244, 114, 182, 0.15)';
            border = 'rgba(244, 114, 182, 0.4)';
        }
        
        var clock = document.querySelector('.hdr .daterow .clock');
        if (clock) {
            clock.style.setProperty('color', color, 'important');
            clock.style.setProperty('-webkit-text-fill-color', color, 'important');
            clock.style.setProperty('background', bg, 'important');
            clock.style.setProperty('border', '1px solid ' + border, 'important');
        }
        
        var hello = document.querySelector('.hdr .hello');
        if (hello) {
            hello.style.setProperty('color', color, 'important');
            hello.style.setProperty('-webkit-text-fill-color', color, 'important');
            hello.style.setProperty('background', bg, 'important');
            hello.style.setProperty('border', '1px solid ' + border, 'important');
        }
    }
    
    setTimeout(updateClockColor, 500);
    setTimeout(updateClockColor, 1500);
    setTimeout(updateClockColor, 3000);
    
    if (window._clockColorInterval) clearInterval(window._clockColorInterval);
    window._clockColorInterval = setInterval(updateClockColor, 60000);
    setInterval(updateClockColor, 2000);
})();

// ============================================================
// راه‌اندازی اولیه
// ============================================================
setTheme('auto');
loadSavedColorTheme();
