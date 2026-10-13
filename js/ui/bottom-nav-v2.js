/* ============================================================
   صندوق اتحاد - نوار پایین (نسخه 2)
   ============================================================ */

(function() {
    // حذف همه نوارهای قدیمی
    document.querySelectorAll('.bottom-nav').forEach(function(n) { n.remove(); });
    
    var navHtml = '<div class="bottom-nav" id="bottomNav">';
    navHtml += '<button class="bottom-nav-btn" onclick="goToMenu()"><i class="fas fa-home"></i><span>خانه</span></button>';
    navHtml += '<button class="bottom-nav-btn" onclick="handleLogoutFromNav()"><i class="fas fa-sign-out-alt"></i><span>خروج</span></button>';
    navHtml += '<button class="bottom-nav-center" onclick="showBottomNavModal()"><i class="fas fa-chart-pie"></i></button>';
    navHtml += '<button class="bottom-nav-btn" onclick="openSettings()"><i class="fas fa-sliders-h"></i><span>تنظیمات</span></button>';
    navHtml += '<button class="bottom-nav-btn" onclick="goToInstallPage()"><i class="fas fa-download"></i><span>نصب برنامه</span></button>';
    navHtml += '</div>';
    
    document.body.insertAdjacentHTML('beforeend', navHtml);
})();

function goToInstallPage() {
    window.location.href = 'install.html';
}
