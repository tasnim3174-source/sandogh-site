/* ============================================================
   صندوق اتحاد - نوار پایین
   نسخه: 2.1 (با دکمه نصب برنامه)
   ============================================================ */

// ============================================================
// ساخت نوار پایین
// ============================================================
(function() {
    if (!document.getElementById('bottomNav')) {
        var navHtml = '<div class="bottom-nav" id="bottomNav" style="display:flex !important; position:fixed !important; bottom:0 !important; left:0 !important; right:0 !important; z-index:99999 !important; background:#1a1a2e; padding:8px 0; border-top:2px solid #ffc94d; visibility:visible !important; opacity:1 !important;">';
        navHtml += '<button class="bottom-nav-btn" onclick="goToMenu()"><i class="fas fa-home"></i><span>خانه</span></button>';
        navHtml += '<button class="bottom-nav-btn" onclick="handleLogoutFromNav()"><i class="fas fa-sign-out-alt"></i><span>خروج</span></button>';
        navHtml += '<button class="bottom-nav-center" onclick="showBottomNavModal()"><i class="fas fa-chart-pie"></i></button>';
        navHtml += '<button class="bottom-nav-btn" onclick="openSettings()"><i class="fas fa-sliders-h"></i><span>تنظیمات</span></button>';
        navHtml += '<button class="bottom-nav-btn" onclick="goToInstallPage()"><i class="fas fa-download"></i><span>نصب برنامه</span></button>';
        navHtml += '</div>';
        document.body.insertAdjacentHTML('beforeend', navHtml);
    }
})();

// ============================================================
// رفتن به صفحه نصب برنامه
// ============================================================
function goToInstallPage() {
    // باز کردن صفحه نصب در همین پنجره
    window.location.href = 'install.html';
}
