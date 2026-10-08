/* ============================================================
   صندوق اتحاد - هدر و ناوبری
   نسخه: 2.0
   ============================================================ */

// ============================================================
// ناوبری بین صفحات
// ============================================================
function goToMenu() {
    currentPage = 'menu';
    var hdr = document.getElementById('mainHeader');
    if (hdr) {
        hdr.style.display = '';
        hdr.style.visibility = 'visible';
        hdr.style.pointerEvents = 'auto';
        hdr.style.position = 'fixed';
        hdr.style.top = '0';
        hdr.style.left = '0';
        hdr.style.right = '0';
        hdr.style.zIndex = '99';
        document.body.style.paddingTop = hdr.offsetHeight + 'px';
    }
    renderPage('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof updateFloatingButtons === 'function') updateFloatingButtons();
}

function selectMenuItem(tab) {
    currentPage = tab;

    var hdr = document.getElementById('mainHeader');
    if (hdr) {
        hdr.style.display = 'none';
        hdr.style.visibility = 'hidden';
        hdr.style.pointerEvents = 'none';
    }
    document.body.style.paddingTop = '0px';

    renderPage(tab);
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (tab === 'club') loadClubFromAdmin().then(function(){ if (currentPage === 'club') renderPage('club'); });
    if (typeof updateFloatingButtons === 'function') updateFloatingButtons();
}

// ============================================================
// دکمه شناور منو
// ============================================================
function updateFloatingButtons() {
    const isLoggedIn = !!currentUser;

    var bottomNav = document.getElementById('bottomNav');
    if (bottomNav) bottomNav.style.display = isLoggedIn ? 'flex' : 'none';

    var btn = document.getElementById('floatingMainMenuBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'floatingMainMenuBtn';
        btn.className = 'floating-main-menu-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'بازگشت به منوی اصلی');
        btn.title = 'بازگشت به منوی اصلی';
        btn.innerHTML = '<i class="fas fa-home"></i>';
        btn.onclick = function() {
            if (typeof goToMenu === 'function') {
                goToMenu();
            } else {
                currentPage = 'menu';
                renderPage('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
        document.body.appendChild(btn);
    }

    if (isLoggedIn && currentPage !== 'menu') {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
}

// ============================================================
// ناوبری مقاوم برای موبایل
// ============================================================
document.addEventListener('click', function(e) {
    var item = e.target.closest ? e.target.closest('.grid-menu-item[data-tab]') : null;
    if (!item || item.classList.contains('disabled')) return;
    var tab = item.getAttribute('data-tab');
    if (!tab) return;

    var directTabs = {
        profile:1, dashboard:1, requests:1, sms:1, support:1,
        club:1, myFund:1, utilities:1, family:1, familyInfo:1,
        access:1, infoStats:1, manageCoins:1, reports:1
    };

    if (!directTabs[tab]) return;

    e.preventDefault();
    e.stopPropagation();
    if (typeof window.selectMenuItem === 'function') window.selectMenuItem(tab);
}, true);

// ============================================================
// بازگشت با دکمه Back
// ============================================================
window.history.pushState(null, null, window.location.href);
window.addEventListener('popstate', function(event) {
    window.history.pushState(null, null, window.location.href);
    const msg = document.createElement('div');
    msg.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--card-bg);color:var(--text-primary);padding:16px 24px;border-radius:14px;box-shadow:0 8px 40px var(--shadow-color);z-index:1000;font-weight:bold;font-size:0.85rem;text-align:center;border-right:4px solid var(--gold-color);max-width:90%;backdrop-filter:blur(10px);border:1px solid var(--glass-border);';
    msg.innerHTML = '🔒 برای بازگشت به منو از دکمه شناور 🏠 استفاده کنید';
    document.body.appendChild(msg);
    setTimeout(() => { msg.remove(); }, 3000);
});

// ============================================================
// دکمه بازگشت به بالا
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backToTopBtn');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backBtn.classList.add('show');
            else backBtn.classList.remove('show');
        });
    }

    function adjustContentPadding() {
        const header = document.querySelector('.hdr');
        const content = document.querySelector('.main-content') || document.querySelector('#main-content');
        if (header && content) {
            const headerHeight = header.offsetHeight;
            const position = window.getComputedStyle(header).position;
            if (position === 'fixed' || position === 'sticky') {
                content.style.paddingTop = (headerHeight + 20) + 'px';
            }
        }
    }
    adjustContentPadding();
    window.addEventListener('resize', adjustContentPadding);
    window.addEventListener('orientationchange', adjustContentPadding);
});
