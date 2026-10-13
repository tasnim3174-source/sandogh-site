/* ============================================================
   صندوق اتحاد - انتخاب کاربر از خانواده
   ============================================================ */

function renderFamilySelectContent() {
    // کاربر فعلی
    var currentMember = members.find(function(m) {
        return String(m.accountNumber) === String(currentUser.accountNumber) ||
               String(m.id) === String(currentUser.memberId);
    });
    
    if (!currentMember) {
        return '<div style="text-align:center;padding:30px;color:#fff;">خطا در یافتن کاربر</div>';
    }
    
    // کد خانوار
    var familyCode = currentMember.heh1;
    
    // همه اعضای خانواده
    var familyMembers = members.filter(function(m) {
        return String(m.heh1) === String(familyCode);
    });
    
    // مرتب‌سازی بر اساس نقش (سرپرست اول)
    familyMembers.sort(function(a, b) {
        return (parseInt(a.heh2) || 99) - (parseInt(b.heh2) || 99);
    });
    
    // HTML کارت‌ها
    var cardsHtml = familyMembers.map(function(m) {
        var role = getFamilyRole(m.heh2);
        var roleLabel = role ? role.label : 'عضو';
        var isCurrent = String(m.id) === String(currentMember.id);
        
        return `
            <div onclick="selectFamilyUser('${m.id}')" style="
                background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
                border: 2px solid ${isCurrent ? '#ffc94d' : 'rgba(255,255,255,0.15)'};
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 14px;
                position: relative;
            " onmouseover="this.style.transform='translateY(-3px)'; this.style.borderColor='#ffc94d';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='${isCurrent ? '#ffc94d' : 'rgba(255,255,255,0.15)'}';">
                <div style="
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ffc94d, #d97706);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    color: #1a1a2e;
                    flex-shrink: 0;
                ">
                    <i class="fas ${role && role.icon ? role.icon : 'fa-user'}"></i>
                </div>
                <div style="flex: 1; min-width: 0; text-align: right;">
                    <div style="font-size: 1.05rem; font-weight: 900; color: #fff; margin-bottom: 4px;">
                        ${esc(m.firstName || '---')}
                        ${isCurrent ? '<span style="font-size:0.7rem;background:#10b981;color:#fff;padding:2px 8px;border-radius:8px;margin-right:6px;">شما</span>' : ''}
                    </div>
                    <div style="font-size: 0.8rem; color: #9ca3af;">
                        <i class="fas fa-hashtag"></i> ${esc(m.accountNumber || '---')}
                        <span style="margin: 0 6px;">|</span>
                        ${esc(roleLabel)}
                    </div>
                </div>
                <div style="
                    color: #ffc94d;
                    font-size: 1.3rem;
                    flex-shrink: 0;
                ">
                    <i class="fas fa-arrow-left"></i>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div style="
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            z-index: 9999999;
            overflow-y: auto;
            padding: 24px 16px;
            direction: rtl;
        ">
            <div style="max-width: 500px; margin: 0 auto;">
                <!-- هدر -->
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #ffc94d, #d97706);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 16px;
                        font-size: 2.5rem;
                        color: #1a1a2e;
                        box-shadow: 0 8px 30px rgba(255, 201, 77, 0.5);
                    ">
                        👨‍👩‍👧‍👦
                    </div>
                    <h2 style="
                        color: #ffc94d;
                        font-size: 1.3rem;
                        font-weight: 900;
                        margin-bottom: 8px;
                    ">با کدام کاربر از خانواده‌ات</h2>
                    <h2 style="
                        color: #ffc94d;
                        font-size: 1.3rem;
                        font-weight: 900;
                        margin-bottom: 16px;
                    ">می‌خوای وارد برنامه بشی؟</h2>
                    <p style="
                        color: #9ca3af;
                        font-size: 0.9rem;
                        line-height: 1.7;
                    ">از بین اعضای خانواده‌ات انتخاب کن</p>
                </div>
                
                <!-- کارت‌های اعضا -->
                <div style="margin-top: 20px;">
                    ${cardsHtml}
                </div>
                
                <!-- دکمه خروج -->
                <div style="text-align: center; margin-top: 24px;">
                    <button onclick="handleLogoutFromNav()" style="
                        background: rgba(239, 68, 68, 0.15);
                        color: #ef4444;
                        border: 2px solid rgba(239, 68, 68, 0.3);
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-size: 0.9rem;
                        font-weight: 800;
                        cursor: pointer;
                        font-family: inherit;
                    ">
                        <i class="fas fa-sign-out-alt"></i>
                        خروج از حساب
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================================
// انتخاب کاربر
// ============================================================
function selectFamilyUser(memberId) {
    var selectedMember = members.find(function(m) {
        return String(m.id) === String(memberId);
    });
    
    if (!selectedMember) {
        alert('❌ کاربر پیدا نشد');
        return;
    }
    
    console.log('👤 کاربر انتخاب‌شده:', selectedMember.firstName);
    
    // پیدا کردن username مربوط به این member
    var userLogin = users.find(function(u) {
        return String(u.memberId) === String(memberId) ||
               String(u.accountNumber) === String(selectedMember.accountNumber);
    });
    
    if (userLogin) {
        currentUser = userLogin;
        console.log('✅ currentUser آپدیت شد:', userLogin.username);
    }
    
    // آپدیت memberId
    currentUser.memberId = selectedMember.id;
    
    // ذخیره در localStorage
    try {
        localStorage.setItem('selectedMemberId', String(selectedMember.id));
    } catch(e) {}
    
    // حذف صفحه انتخاب
    var screen = document.getElementById('familySelectScreen');
    if (screen) screen.remove();
    
    // رفتن به منو
    showMenuAfterSelect();
}

// ============================================================
// رفتن به منو بعد از انتخاب
// ============================================================
function showMenuAfterSelect() {
    var appContainer = document.getElementById('appContainer');
    if (appContainer) {
        appContainer.innerHTML = '<div class="app-page"><div id="contentArea"></div></div>';
    }
    
    if (typeof renderPage === 'function') {
        renderPage('menu');
    }
    
    // نمایش نوار پایین
    var mainNav = document.getElementById('mainBottomNav');
    if (mainNav) mainNav.style.display = 'flex';
    
    var directNav = document.getElementById('bottomNavDirect');
    if (directNav) directNav.style.display = 'block';
    
    console.log('✅ وارد منو شد با کاربر:', currentUser.memberId);
}

// ============================================================
// نمایش صفحه انتخاب
// ============================================================
function showFamilySelectScreen() {
    // حذف قبلی
    var old = document.getElementById('familySelectScreen');
    if (old) old.remove();
    
    // ساخت جدید
    var screen = document.createElement('div');
    screen.id = 'familySelectScreen';
    screen.innerHTML = renderFamilySelectContent();
    document.body.appendChild(screen);
    
    console.log('✅ صفحه انتخاب کاربر نمایش داده شد');
}
