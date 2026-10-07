// ============================================================
// 🔑 توابع تغییر رمز و فراموشی رمز — فایل جداگانه
// ============================================================

function openChangePasswordModal() {
    var old = document.getElementById('changePasswordModal');
    if (old) old.remove();
    
    var modal = document.createElement('div');
    modal.id = 'changePasswordModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;margin:0;box-sizing:border-box;';
    
    modal.innerHTML = 
        '<div style="background:#fff;border-radius:24px;padding:28px 24px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);margin:auto;box-sizing:border-box;direction:rtl;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #e0e7ff;">' +
                '<h2 style="font-size:1.15rem;color:#1a1a2e;margin:0;">🔑 تغییر رمز عبور</h2>' +
                '<button onclick="closeChangePasswordModal()" style="background:#ef4444;color:#fff;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;">✕</button>' +
            '</div>' +
            '<div style="padding:12px 16px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;line-height:1.9;background:rgba(102,126,234,0.08);border-right:3px solid #667eea;">' +
                '<b style="color:#667eea;">💡 راهنما:</b><br>' +
                '• رمز جدید باید حداقل ۴ کاراکتر باشد<br>' +
                '• از ترکیب حروف و اعداد استفاده کنید' +
            '</div>' +
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">🔒 رمز عبور فعلی</label>' +
                '<input type="password" id="cpOldPassword" placeholder="رمز فعلی" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;box-sizing:border-box;outline:none;">' +
            '</div>' +
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">🔑 رمز عبور جدید</label>' +
                '<input type="password" id="cpNewPassword" placeholder="رمز جدید (حداقل ۴ کاراکتر)" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;box-sizing:border-box;outline:none;">' +
            '</div>' +
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">✅ تکرار رمز جدید</label>' +
                '<input type="password" id="cpConfirmPassword" placeholder="رمز جدید دوباره" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;box-sizing:border-box;outline:none;">' +
            '</div>' +
            '<div id="cpStatus" style="display:none;padding:10px 14px;border-radius:10px;margin-bottom:14px;font-size:0.8rem;text-align:center;line-height:1.7;"></div>' +
            '<div style="display:flex;gap:10px;">' +
                '<button onclick="closeChangePasswordModal()" style="flex:1;padding:13px;border:2px solid #e0e7ff;background:#f8fafc;color:#1a1a2e;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">انصراف</button>' +
                '<button id="cpSubmitBtn" onclick="submitChangePassword()" style="flex:2;padding:13px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">💾 ذخیره</button>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
    setTimeout(function() {
        var inp = document.getElementById('cpOldPassword');
        if (inp) inp.focus();
    }, 100);
}

function closeChangePasswordModal() {
    var modal = document.getElementById('changePasswordModal');
    if (modal) modal.remove();
}

async function submitChangePassword() {
    var oldPass = document.getElementById('cpOldPassword').value;
    var newPass = document.getElementById('cpNewPassword').value;
    var confirmPass = document.getElementById('cpConfirmPassword').value;
    var submitBtn = document.getElementById('cpSubmitBtn');
    var statusBox = document.getElementById('cpStatus');
    
    function showStatus(msg, type) {
        statusBox.style.display = 'block';
        var colors = {
            info: { bg: 'rgba(102,126,234,0.12)', color: '#667eea' },
            warning: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
            error: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
            success: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' }
        };
        var c = colors[type] || colors.info;
        statusBox.style.background = c.bg;
        statusBox.style.color = c.color;
        statusBox.textContent = msg;
    }
    
    if (!oldPass || !newPass || !confirmPass) { showStatus('⚠️ همه فیلدها را پر کنید', 'warning'); return; }
    if (newPass.length < 4) { showStatus('⚠️ رمز جدید حداقل ۴ کاراکتر', 'warning'); return; }
    if (newPass !== confirmPass) { showStatus('❌ تکرار رمز مطابقت ندارد', 'error'); return; }
    if (newPass === oldPass) { showStatus('⚠️ رمز جدید متفاوت باشد', 'warning'); return; }
    
    if (typeof currentUser !== 'undefined' && currentUser && currentUser.password && currentUser.password !== oldPass) {
        showStatus('❌ رمز فعلی اشتباه است', 'error');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ ذخیره...';
    showStatus('⏳ در حال ارسال...', 'info');
    
    try {
        var username = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.username : '';
        var url = ADMIN_URL + '?action=changePassword&username=' + encodeURIComponent(username) + '&oldPassword=' + encodeURIComponent(oldPass) + '&newPassword=' + encodeURIComponent(newPass);
        var response = await fetch(url);
        var data = await response.json();
        
        if (data.ok) {
            if (currentUser) currentUser.password = newPass;
            if (typeof users !== 'undefined' && users) {
                var u = users.find(function(x) { return x.username === username; });
                if (u) u.password = newPass;
            }
            try { localStorage.removeItem('sandogh_users_cache'); } catch(e) {}
            showStatus('✅ رمز با موفقیت تغییر کرد!', 'success');
            setTimeout(function() {
                closeChangePasswordModal();
                alert('✅ رمز عبور شما تغییر کرد!');
            }, 1500);
        } else {
            showStatus('❌ ' + (data.error || 'خطا'), 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '💾 ذخیره';
        }
    } catch (e) {
        showStatus('❌ خطا: ' + e.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '💾 ذخیره';
    }
}

// ============================================================
// 👁️ نمایش رمز
// ============================================================
function openShowPasswordModal() {
    var old = document.getElementById('showPasswordModal');
    if (old) old.remove();
    
    if (typeof members === 'undefined' || !currentUser || !currentUser.memberId) {
        alert('⚠️ اطلاعات کاربر یافت نشد');
        return;
    }
    
    var modal = document.createElement('div');
    modal.id = 'showPasswordModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;margin:0;box-sizing:border-box;';
    
    modal.innerHTML = 
        '<div style="background:#fff;border-radius:24px;padding:28px 24px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);margin:auto;box-sizing:border-box;direction:rtl;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #e0e7ff;">' +
                '<h2 style="font-size:1.15rem;color:#1a1a2e;margin:0;">👁️ نمایش رمز عبور</h2>' +
                '<button onclick="closeShowPasswordModal()" style="background:#ef4444;color:#fff;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;">✕</button>' +
            '</div>' +
            '<div style="padding:12px 16px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;line-height:1.9;background:rgba(16,185,129,0.08);border-right:3px solid #10b981;">' +
                '<b style="color:#10b981;">🔒 تأیید هویت:</b><br>' +
                '• شماره موبایل ثبت‌شده<br>' +
                '• تعداد اعضای صندوق در خانواده (شامل خودتان)' +
            '</div>' +
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">📱 شماره موبایل</label>' +
                '<input type="tel" id="spPhone" placeholder="09123456789" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;box-sizing:border-box;outline:none;direction:ltr;text-align:center;">' +
            '</div>' +
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">👥 تعداد اعضای خانواده</label>' +
                '<input type="number" id="spFamilyCount" placeholder="شامل خودتان" min="1" max="20" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;box-sizing:border-box;outline:none;text-align:center;">' +
            '</div>' +
            '<div id="spResult" style="display:none;margin-bottom:16px;"></div>' +
            '<div id="spStatus" style="display:none;padding:10px 14px;border-radius:10px;margin-bottom:14px;font-size:0.8rem;text-align:center;line-height:1.7;"></div>' +
            '<div style="display:flex;gap:10px;">' +
                '<button onclick="closeShowPasswordModal()" style="flex:1;padding:13px;border:2px solid #e0e7ff;background:#f8fafc;color:#1a1a2e;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">انصراف</button>' +
                '<button id="spVerifyBtn" onclick="verifyAndShowPassword()" style="flex:2;padding:13px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">✅ تأیید</button>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
}

function closeShowPasswordModal() {
    var modal = document.getElementById('showPasswordModal');
    if (modal) modal.remove();
}

function verifyAndShowPassword() {
    var phone = document.getElementById('spPhone').value.trim();
    var familyCount = parseInt(document.getElementById('spFamilyCount').value);
    var resultBox = document.getElementById('spResult');
    var statusBox = document.getElementById('spStatus');
    var member = members.find(function(m) { return m.id === currentUser.memberId; });
    
    function showStatus(msg, type) {
        statusBox.style.display = 'block';
        var colors = {
            warning: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
            error: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
            success: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' }
        };
        var c = colors[type] || colors.warning;
        statusBox.style.background = c.bg;
        statusBox.style.color = c.color;
        statusBox.textContent = msg;
    }
    
    if (!phone) { showStatus('⚠️ شماره موبایل وارد کنید', 'warning'); return; }
    if (!familyCount || familyCount < 1) { showStatus('⚠️ تعداد اعضا وارد کنید', 'warning'); return; }
    
    var normalizedPhone = phone.replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });
    var phone1 = String(member.phone1 || '').replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });
    var phone2 = String(member.phone2 || '').replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });
    
    if (normalizedPhone !== phone1 && normalizedPhone !== phone2) {
        showStatus('❌ شماره مطابقت ندارد', 'error');
        return;
    }
    
    var realFamilyCount = 1;
    if (member.heh1) {
        realFamilyCount = members.filter(function(m) { return m.heh1 === member.heh1; }).length;
        if (realFamilyCount === 0) realFamilyCount = 1;
    }
    if (familyCount !== realFamilyCount) {
        showStatus('❌ تعداد اعضا مطابقت ندارد (عدد: ' + realFamilyCount + ')', 'error');
        return;
    }
    
    showStatus('✅ هویت تأیید شد', 'success');
    resultBox.style.display = 'block';
    resultBox.innerHTML = 
        '<div style="background:rgba(16,185,129,0.1);border:2px solid #10b981;border-radius:14px;padding:16px;text-align:center;">' +
            '<div style="font-size:2.5rem;margin-bottom:8px;">🔑</div>' +
            '<div style="font-size:0.85rem;color:#888;margin-bottom:8px;">نام کاربری:</div>' +
            '<div style="font-size:1rem;color:#1a1a2e;font-weight:bold;font-family:monospace;direction:ltr;margin-bottom:12px;">' + currentUser.username + '</div>' +
            '<div style="font-size:0.85rem;color:#888;margin-bottom:8px;">رمز عبور:</div>' +
            '<div style="font-size:1.2rem;color:#10b981;font-weight:bold;font-family:monospace;direction:ltr;background:rgba(16,185,129,0.15);padding:8px 16px;border-radius:8px;display:inline-block;">' + (currentUser.password || '---') + '</div>' +
        '</div>';
    
    document.getElementById('spVerifyBtn').disabled = true;
    document.getElementById('spVerifyBtn').innerHTML = '✅ تأیید شد';
}

// ============================================================
// 🔑 فراموشی رمز
// ============================================================
var forgotUser = null;
var forgotStep = 1;
var forgotAllUsers = null;

async function loadAllUsersFromServer() {
    if (forgotAllUsers && forgotAllUsers.length > 0) return forgotAllUsers;
    var response = await fetch(ADMIN_URL + '?action=getAllUsers');
    var data = await response.json();
    if (!data.ok || !data.users) throw new Error(data.error || 'خطا');
    forgotAllUsers = data.users;
    return forgotAllUsers;
}

async function openForgotPasswordModal() {
    var old = document.getElementById('forgotPasswordModal');
    if (old) old.remove();
    forgotUser = null;
    forgotStep = 1;
    
    var loading = document.createElement('div');
    loading.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;';
    loading.innerHTML = '<div style="background:#fff;border-radius:24px;padding:40px 30px;text-align:center;max-width:340px;">' +
        '<div style="width:60px;height:60px;margin:0 auto 20px;border:4px solid rgba(102,126,234,0.2);border-top:4px solid #667eea;border-radius:50%;animation:spin 1s linear infinite;"></div>' +
        '<div style="color:#1a1a2e;font-size:0.95rem;font-weight:bold;">در حال دریافت اطلاعات...</div>' +
        '<style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style></div>';
    document.body.appendChild(loading);
    
    try {
        await loadAllUsersFromServer();
        loading.remove();
    } catch (e) {
        loading.remove();
        alert('❌ خطا در دریافت اطلاعات');
        return;
    }
    
    var modal = document.createElement('div');
    modal.id = 'forgotPasswordModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;margin:0;box-sizing:border-box;';
    
    modal.innerHTML = 
        '<div style="background:#fff;border-radius:24px;padding:28px 24px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);margin:auto;box-sizing:border-box;direction:rtl;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #e0e7ff;">' +
                '<h2 style="font-size:1.15rem;color:#1a1a2e;margin:0;">🔑 بازیابی رمز عبور</h2>' +
                '<button onclick="closeForgotPasswordModal()" style="background:#ef4444;color:#fff;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;">✕</button>' +
            '</div>' +
            '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:24px;">' +
                '<div class="pwd-step active" data-step="1" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;background:#667eea;color:#fff;">1</div>' +
                '<div style="width:30px;height:2px;background:#e0e7ff;align-self:center;"></div>' +
                '<div class="pwd-step" data-step="2" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;background:#f8fafc;color:#8888aa;border:2px solid #e0e7ff;">2</div>' +
                '<div style="width:30px;height:2px;background:#e0e7ff;align-self:center;"></div>' +
                '<div class="pwd-step" data-step="3" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;background:#f8fafc;color:#8888aa;border:2px solid #e0e7ff;">3</div>' +
            '</div>' +
            '<div id="fpStep1">' +
                '<div style="padding:12px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;background:rgba(245,158,11,0.08);border-right:3px solid #f59e0b;"><b style="color:#f59e0b;">📌 مرحله ۱ از ۳</b><br>شماره حساب را وارد کنید.</div>' +
                '<div style="margin-bottom:16px;"><label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">🔢 شماره حساب</label>' +
                '<input type="text" id="fpAccount" placeholder="123456" style="width:100%;padding:14px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;box-sizing:border-box;direction:ltr;text-align:center;outline:none;"></div>' +
                '<button onclick="fpGoToStep2()" style="width:100%;padding:13px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">مرحله بعد ←</button>' +
            '</div>' +
            '<div id="fpStep2" style="display:none;">' +
                '<div style="padding:12px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;background:rgba(245,158,11,0.08);border-right:3px solid #f59e0b;"><b style="color:#f59e0b;">📌 مرحله ۲ از ۳</b><br>شماره موبایل ثبت‌شده را کامل وارد کنید.</div>' +
                '<div style="margin-bottom:16px;"><label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">📱 شماره موبایل</label>' +
                '<input type="tel" id="fpPhone" placeholder="09123456789" maxlength="11" style="width:100%;padding:14px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;box-sizing:border-box;direction:ltr;text-align:center;outline:none;"></div>' +
                '<div style="display:flex;gap:10px;">' +
                    '<button onclick="fpGoToStep(1)" style="flex:1;padding:13px;border:2px solid #e0e7ff;background:#f8fafc;color:#1a1a2e;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">→ قبلی</button>' +
                    '<button onclick="fpGoToStep3()" style="flex:2;padding:13px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">مرحله بعد ←</button>' +
                '</div>' +
            '</div>' +
            '<div id="fpStep3" style="display:none;">' +
                '<div style="padding:12px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;background:rgba(245,158,11,0.08);border-right:3px solid #f59e0b;"><b style="color:#f59e0b;">📌 مرحله ۳ از ۳</b><br>تعداد اعضای صندوق در خانواده (شامل خودتان).</div>' +
                '<div style="margin-bottom:16px;"><label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">👥 تعداد اعضای خانواده</label>' +
                '<input type="number" id="fpFamilyCount" placeholder="4" min="1" max="20" style="width:100%;padding:14px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;box-sizing:border-box;text-align:center;outline:none;"></div>' +
                '<div id="fpStatus" style="display:none;padding:10px;border-radius:10px;margin-bottom:14px;font-size:0.8rem;text-align:center;"></div>' +
                '<div style="display:flex;gap:10px;">' +
                    '<button onclick="fpGoToStep(2)" style="flex:1;padding:13px;border:2px solid #e0e7ff;background:#f8fafc;color:#1a1a2e;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">→ قبلی</button>' +
                    '<button onclick="fpVerify()" style="flex:2;padding:13px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">✅ تأیید</button>' +
                '</div>' +
            '</div>' +
            '<div id="fpResult" style="display:none;">' +
                '<div style="text-align:center;padding:20px 0;">' +
                    '<div style="width:80px;height:80px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:2.5rem;color:#fff;">✓</div>' +
                    '<h3 style="color:#10b981;margin-bottom:8px;">هویت تأیید شد! ✅</h3>' +
                '</div>' +
                '<div style="background:rgba(16,185,129,0.08);border:2px solid #10b981;border-radius:16px;padding:20px;margin-bottom:16px;">' +
                    '<div style="display:flex;justify-content:space-between;padding:10px;background:#fff;border-radius:10px;margin-bottom:8px;border-right:4px solid #667eea;"><span style="color:#888;font-size:0.8rem;">👤 نام کاربری:</span><span id="fpResultUser" style="color:#1a1a2e;font-weight:bold;font-family:monospace;direction:ltr;"></span></div>' +
                    '<div style="display:flex;justify-content:space-between;padding:10px;background:#fff;border-radius:10px;border-right:4px solid #f59e0b;"><span style="color:#888;font-size:0.8rem;">🔑 رمز:</span><span id="fpResultPass" style="color:#10b981;font-weight:bold;font-size:1.1rem;font-family:monospace;direction:ltr;"></span></div>' +
                '</div>' +
                '<button onclick="closeForgotPasswordModal()" style="width:100%;padding:13px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">✅ متوجه شدم</button>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
}

function closeForgotPasswordModal() {
    var modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.remove();
}

function fpGoToStep(step) {
    forgotStep = step;
    document.getElementById('fpStep1').style.display = 'none';
    document.getElementById('fpStep2').style.display = 'none';
    document.getElementById('fpStep3').style.display = 'none';
    document.getElementById('fpResult').style.display = 'none';
    document.getElementById('fpStep' + step).style.display = 'block';
    
    document.querySelectorAll('.pwd-step').forEach(function(dot) {
        var s = parseInt(dot.getAttribute('data-step'));
        dot.style.background = '#f8fafc';
        dot.style.color = '#8888aa';
        dot.style.border = '2px solid #e0e7ff';
        if (s < step) {
            dot.style.background = '#10b981';
            dot.style.color = '#fff';
            dot.style.border = 'none';
        } else if (s === step) {
            dot.style.background = '#667eea';
            dot.style.color = '#fff';
            dot.style.border = 'none';
        }
    });
}

function fpGoToStep2() {
    var acc = document.getElementById('fpAccount').value.trim();
    if (!acc) { alert('⚠️ شماره حساب را وارد کنید'); return; }
    var users = forgotAllUsers || [];
    var user = users.find(function(u) {
        return String(u.accountNumber) === acc || String(u.username) === acc;
    });
    if (!user) { alert('❌ کاربری با این شماره حساب یافت نشد'); return; }
    forgotUser = user;
    fpGoToStep(2);
}

function fpGoToStep3() {
    var phone = document.getElementById('fpPhone').value.trim();
    if (!phone) { alert('⚠️ شماره موبایل را وارد کنید'); return; }
    
    var norm = phone.replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });
    var phones = [];
    ['phone', 'phone1', 'phone2'].forEach(function(k) {
        if (forgotUser[k]) {
            var p = String(forgotUser[k]).trim().replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });
            if (p) phones.push(p);
        }
    });
    phones = phones.filter(function(v, i, a) { return a.indexOf(v) === i; });
    
    if (phones.length === 0) { alert('❌ شماره موبایلی ثبت نشده'); return; }
    if (!phones.some(function(p) { return p === norm; })) {
        alert('❌ شماره موبایل مطابقت ندارد\n\nشماره‌های ثبت‌شده: ' + phones.join(' یا '));
        return;
    }
    fpGoToStep(3);
}

function fpVerify() {
    var familyCount = parseInt(document.getElementById('fpFamilyCount').value);
    var statusBox = document.getElementById('fpStatus');
    
    function showStatus(msg, type) {
        statusBox.style.display = 'block';
        var colors = {
            warning: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
            error: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' }
        };
        var c = colors[type] || colors.warning;
        statusBox.style.background = c.bg;
        statusBox.style.color = c.color;
        statusBox.textContent = msg;
    }
    
    if (!familyCount || familyCount < 1) { showStatus('⚠️ تعداد اعضا را وارد کنید', 'warning'); return; }
    
    var allUsers = forgotAllUsers || [];
    var realCount = 1;
    if (forgotUser.heh1) {
        realCount = allUsers.filter(function(u) { return String(u.heh1) === String(forgotUser.heh1); }).length;
        if (realCount === 0) realCount = 1;
    } else if (forgotUser.familyCount) {
        realCount = forgotUser.familyCount;
    }
    
    if (familyCount !== realCount) {
        showStatus('❌ تعداد مطابقت ندارد (عدد صحیح: ' + realCount + ')', 'error');
        return;
    }
    
    document.getElementById('fpStep3').style.display = 'none';
    document.getElementById('fpResult').style.display = 'block';
    document.getElementById('fpResultUser').textContent = forgotUser.username;
    document.getElementById('fpResultPass').textContent = forgotUser.password;
    
    document.querySelectorAll('.pwd-step').forEach(function(dot) {
        dot.style.background = '#10b981';
        dot.style.color = '#fff';
        dot.style.border = 'none';
    });
}


// ============================================================
// ⚡ ورود سریع: دریافت لیست سبک کاربران از GitHub
// ============================================================
const LOGIN_USERS_URL = 'https://raw.githubusercontent.com/tasnim3174-source/sandogh-site/main/login-users.json';
const LOGIN_USERS_CACHE_KEY = 'sandogh_login_users_v1';
const LOGIN_USERS_CACHE_TIME_KEY = 'sandogh_login_users_v1_time';
const LOGIN_USERS_CACHE_TTL = 10 * 60 * 1000;

function normalizeLoginText(v) {
    return String(v == null ? '' : v).trim();
}

async function loadFastLoginUsers(forceRefresh) {
    if (!forceRefresh) {
        try {
            const cached = localStorage.getItem(LOGIN_USERS_CACHE_KEY);
            const cachedTime = parseInt(localStorage.getItem(LOGIN_USERS_CACHE_TIME_KEY) || '0');
            if (cached && cachedTime && Date.now() - cachedTime < LOGIN_USERS_CACHE_TTL) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length) return parsed;
            }
        } catch (e) {}
    }

    const response = await fetch(LOGIN_USERS_URL + '?v=' + Date.now(), {cache: 'no-store'});
    if (!response.ok) throw new Error('لیست ورود در دسترس نیست');
    const raw = await response.json();
    const list = Array.isArray(raw) ? raw : (Array.isArray(raw.users) ? raw.users : []);
    if (!list.length) throw new Error('لیست کاربران خالی است');

    try {
        localStorage.setItem(LOGIN_USERS_CACHE_KEY, JSON.stringify(list));
        localStorage.setItem(LOGIN_USERS_CACHE_TIME_KEY, String(Date.now()));
    } catch (e) {}

    return list;
}

async function findFastLoginUser(username, password) {
    const list = await loadFastLoginUsers(false);
    const u = normalizeLoginText(username);
    const pw = normalizeLoginText(password);
    return list.find(function(user) {
        return (normalizeLoginText(user.username) === u ||
                normalizeLoginText(user.accountNumber) === u) &&
               normalizeLoginText(user.password) === pw;
    }) || null;
}

window.loadFastLoginUsers = loadFastLoginUsers;
window.findFastLoginUser = findFastLoginUser;

console.log('✅ توابع رمز بارگذاری شدند');