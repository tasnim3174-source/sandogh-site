/* ============================================================
   صندوق اتحاد - تغییر رمز عبور
   نسخه: 2.0
   ============================================================ */

function openChangePasswordModal() {
    const old = document.getElementById('changePasswordModal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'changePasswordModal';
    modal.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;margin:0;backdrop-filter:blur(8px);box-sizing:border-box;`;

    modal.innerHTML = 
        '<div style="background:#fff;border-radius:24px;padding:28px 24px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);position:relative;z-index:1000000;margin:auto;box-sizing:border-box;direction:rtl;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #e0e7ff;">' +
                '<h2 style="font-size:1.15rem;color:#1a1a2e;display:flex;align-items:center;gap:8px;margin:0;">🔑 تغییر رمز عبور</h2>' +
                '<button onclick="closeChangePasswordModal()" style="background:#ef4444;color:#fff;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">✕</button>' +
            '</div>' +
            
            '<div style="padding:12px 16px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;line-height:1.9;background:linear-gradient(135deg,rgba(102,126,234,0.08),rgba(118,75,162,0.08));border-right:3px solid #667eea;">' +
                '<b style="color:#667eea;">💡 راهنما:</b><br>' +
                '• رمز جدید باید حداقل ۴ کاراکتر باشد<br>' +
                '• از ترکیب حروف و اعداد استفاده کنید<br>' +
                '• بعد از تغییر، رمز جدید بلافاصله اعمال می‌شود' +
            '</div>' +
            
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">🔒 رمز عبور فعلی</label>' +
                '<input type="password" id="cpOldPassword" placeholder="رمز فعلی خود را وارد کنید" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;background:#fff;color:#1a1a2e;font-family:inherit;box-sizing:border-box;outline:none;">' +
            '</div>' +
            
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">🔑 رمز عبور جدید</label>' +
                '<input type="password" id="cpNewPassword" placeholder="رمز جدید (حداقل ۴ کاراکتر)" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;background:#fff;color:#1a1a2e;font-family:inherit;box-sizing:border-box;outline:none;">' +
            '</div>' +
            
            '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">✅ تکرار رمز جدید</label>' +
                '<input type="password" id="cpConfirmPassword" placeholder="رمز جدید را دوباره وارد کنید" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;background:#fff;color:#1a1a2e;font-family:inherit;box-sizing:border-box;outline:none;">' +
            '</div>' +
            
            '<div id="cpStatus" style="display:none;padding:10px 14px;border-radius:10px;margin-bottom:14px;font-size:0.8rem;text-align:center;line-height:1.7;"></div>' +
            
            '<div style="display:flex;gap:10px;">' +
                '<button onclick="closeChangePasswordModal()" style="flex:1;padding:13px;border:2px solid #e0e7ff;background:#f8fafc;color:#1a1a2e;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">انصراف</button>' +
                '<button id="cpSubmitBtn" onclick="submitChangePassword()" style="flex:2;padding:13px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">💾 ذخیره رمز جدید</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);
    setTimeout(function() {
        const inp = document.getElementById('cpOldPassword');
        if (inp) inp.focus();
    }, 100);
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.remove();
}

async function submitChangePassword() {
    var oldPass = document.getElementById('cpOldPassword').value;
    var newPass = document.getElementById('cpNewPassword').value;
    var confirmPass = document.getElementById('cpConfirmPassword').value;
    var submitBtn = document.getElementById('cpSubmitBtn');

    if (!oldPass || !newPass || !confirmPass) { showCPStatus('⚠️ لطفاً همه فیلدها را پر کنید', 'warning'); return; }
    if (newPass.length < 4) { showCPStatus('⚠️ رمز جدید باید حداقل ۴ کاراکتر باشد', 'warning'); return; }
    if (newPass !== confirmPass) { showCPStatus('❌ رمز جدید و تکرار آن مطابقت ندارند', 'error'); return; }
    if (newPass === oldPass) { showCPStatus('⚠️ رمز جدید باید با رمز فعلی متفاوت باشد', 'warning'); return; }

    if (typeof currentUser !== 'undefined' && currentUser && currentUser.password && currentUser.password !== oldPass) {
        showCPStatus('❌ رمز فعلی اشتباه است', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ در حال ذخیره...';
    showCPStatus('⏳ در حال ارسال به سرور...', 'info');

    try {
        var username = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.username : '';
        if (!username) {
            showCPStatus('❌ اطلاعات کاربر یافت نشد', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '💾 ذخیره رمز جدید';
            return;
        }

        var url = ADMIN_URL + '?action=changePassword' +
                    '&username=' + encodeURIComponent(username) +
                    '&oldPassword=' + encodeURIComponent(oldPass) +
                    '&newPassword=' + encodeURIComponent(newPass);

        var response = await fetch(url);
        var data = await response.json();

        if (data.ok) {
            if (currentUser) currentUser.password = newPass;
            if (typeof users !== 'undefined' && users) {
                var u = users.find(function(x) { return x.username === username; });
                if (u) u.password = newPass;
            }
            try { localStorage.removeItem('sandogh_users_cache'); } catch(e) {}

            showCPStatus('✅ رمز عبور با موفقیت تغییر کرد!', 'success');
            setTimeout(function() {
                closeChangePasswordModal();
                alert('✅ رمز عبور شما با موفقیت تغییر کرد!');
            }, 1500);
        } else {
            showCPStatus('❌ ' + (data.error || 'خطا در تغییر رمز'), 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '💾 ذخیره رمز جدید';
        }
    } catch (e) {
        showCPStatus('❌ خطا در اتصال: ' + e.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '💾 ذخیره رمز جدید';
    }
}

function showCPStatus(message, type) {
    var box = document.getElementById('cpStatus');
    if (!box) return;
    box.style.display = 'block';
    var colors = {
        info: { bg: 'rgba(102,126,234,0.12)', color: '#667eea' },
        warning: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
        error: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
        success: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' }
    };
    var c = colors[type] || colors.info;
    box.style.background = c.bg;
    box.style.color = c.color;
    box.textContent = message;
}
