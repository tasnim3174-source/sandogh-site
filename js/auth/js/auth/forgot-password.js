/* ============================================================
   صندوق اتحاد - فراموشی رمز عبور
   نسخه: 2.0
   ============================================================ */

async function loadAllUsersFromServer() {
    if (forgotAllUsers && forgotAllUsers.length > 0) return forgotAllUsers;
    try {
        var response = await fetch(ADMIN_URL + '?action=getAllUsers');
        var data = await response.json();
        if (!data.ok || !data.users) throw new Error(data.error || 'خطا');
        forgotAllUsers = data.users;
        return forgotAllUsers;
    } catch (e) { throw e; }
}

async function openForgotPasswordModal() {
    var old = document.getElementById('forgotPasswordModal');
    if (old) old.remove();

    forgotUser = null;
    forgotStep = 1;

    var loading = document.createElement('div');
    loading.id = 'forgotLoading';
    loading.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;margin:0;';
    loading.innerHTML = 
        '<div style="background:#fff;border-radius:24px;padding:40px 30px;text-align:center;max-width:340px;">' +
            '<div style="width:60px;height:60px;margin:0 auto 20px;border:4px solid rgba(102,126,234,0.2);border-top:4px solid #667eea;border-radius:50%;animation:spin 1s linear infinite;"></div>' +
            '<div style="color:#1a1a2e;font-size:0.95rem;font-weight:bold;">در حال دریافت اطلاعات...</div>' +
            '<style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>' +
        '</div>';
    document.body.appendChild(loading);

    try {
        await loadAllUsersFromServer();
        loading.remove();
    } catch (e) {
        loading.remove();
        alert('❌ خطا در دریافت اطلاعات از سرور\n\n' + (e.message || ''));
        return;
    }

    var modal = document.createElement('div');
    modal.id = 'forgotPasswordModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;margin:0;backdrop-filter:blur(8px);box-sizing:border-box;';

    modal.innerHTML = 
        '<div style="background:#fff;border-radius:24px;padding:28px 24px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);position:relative;z-index:1000000;margin:auto;box-sizing:border-box;direction:rtl;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #e0e7ff;">' +
                '<h2 style="font-size:1.15rem;color:#1a1a2e;display:flex;align-items:center;gap:8px;margin:0;">🔑 بازیابی رمز عبور</h2>' +
                '<button onclick="closeForgotPasswordModal()" style="background:#ef4444;color:#fff;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">✕</button>' +
            '</div>' +
            
            '<div style="display:flex;justify-content:center;align-items:center;gap:8px;margin-bottom:24px;">' +
                '<div class="password-step-dot active" data-step="1" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;">1</div>' +
                '<div style="width:30px;height:2px;background:#e0e7ff;"></div>' +
                '<div class="password-step-dot" data-step="2" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;background:#f8fafc;color:#8888aa;border:2px solid #e0e7ff;">2</div>' +
                '<div style="width:30px;height:2px;background:#e0e7ff;"></div>' +
                '<div class="password-step-dot" data-step="3" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;background:#f8fafc;color:#8888aa;border:2px solid #e0e7ff;">3</div>' +
            '</div>' +
            
            '<div id="forgotStep1">' +
                '<div style="padding:12px 16px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;line-height:1.9;background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(217,119,6,0.08));border-right:3px solid #f59e0b;">' +
                    '<b style="color:#f59e0b;">📌 مرحله ۱ از ۳</b><br>لطفاً شماره حساب خود را وارد کنید.' +
                '</div>' +
                '<div style="margin-bottom:16px;">' +
                    '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">🔢 شماره حساب</label>' +
                    '<input type="text" id="forgotAccountNum" placeholder="مثلاً: 123456" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;background:#fff;color:#1a1a2e;font-family:inherit;box-sizing:border-box;outline:none;direction:ltr;text-align:center;">' +
                '</div>' +
                '<button onclick="forgotGoToStep2()" style="width:100%;padding:13px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">مرحله بعد ←</button>' +
            '</div>' +
            
            '<div id="forgotStep2" style="display:none;">' +
                '<div style="padding:12px 16px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;line-height:1.9;background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(217,119,6,0.08));border-right:3px solid #f59e0b;">' +
                    '<b style="color:#f59e0b;">📌 مرحله ۲ از ۳</b><br>شماره موبایل ثبت‌شده را <b>کامل</b> وارد کنید.<br><span style="color:#667eea;">مثال: 09123456789</span>' +
                '</div>' +
                '<div style="margin-bottom:16px;">' +
                    '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">📱 شماره موبایل</label>' +
                    '<input type="tel" id="forgotPhone" placeholder="09123456789" maxlength="11" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;background:#fff;color:#1a1a2e;font-family:inherit;box-sizing:border-box;outline:none;direction:ltr;text-align:center;">' +
                '</div>' +
                '<div style="display:flex;gap:10px;">' +
                    '<button onclick="forgotGoToStep(1)" style="flex:1;padding:13px;border:2px solid #e0e7ff;background:#f8fafc;color:#1a1a2e;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">→ قبلی</button>' +
                    '<button onclick="forgotGoToStep3()" style="flex:2;padding:13px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">مرحله بعد ←</button>' +
                '</div>' +
            '</div>' +
            
            '<div id="forgotStep3" style="display:none;">' +
                '<div style="padding:12px 16px;border-radius:12px;margin-bottom:18px;font-size:0.75rem;color:#4a4a6a;line-height:1.9;background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(217,119,6,0.08));border-right:3px solid #f59e0b;">' +
                    '<b style="color:#f59e0b;">📌 مرحله ۳ از ۳</b><br>تعداد اعضای صندوق در خانواده را وارد کنید.<br><span style="color:#ef4444;font-weight:bold;">⚠️ شامل خودتان</span>' +
                '</div>' +
                '<div style="margin-bottom:16px;">' +
                    '<label style="display:block;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;font-weight:bold;">👥 تعداد اعضای صندوق در خانواده</label>' +
                    '<input type="number" id="forgotFamilyCount" placeholder="مثلاً: 4" min="1" max="20" style="width:100%;padding:14px 16px;border:2px solid #e0e7ff;border-radius:12px;font-size:0.95rem;background:#fff;color:#1a1a2e;font-family:inherit;box-sizing:border-box;outline:none;text-align:center;">' +
                '</div>' +
                '<div id="forgotStatus" style="display:none;padding:10px 14px;border-radius:10px;margin-bottom:14px;font-size:0.8rem;text-align:center;line-height:1.7;"></div>' +
                '<div style="display:flex;gap:10px;">' +
                    '<button onclick="forgotGoToStep(2)" style="flex:1;padding:13px;border:2px solid #e0e7ff;background:#f8fafc;color:#1a1a2e;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">→ قبلی</button>' +
                    '<button id="forgotVerifyBtn" onclick="forgotVerify()" style="flex:2;padding:13px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">✅ تأیید هویت</button>' +
                '</div>' +
            '</div>' +
            
            '<div id="forgotResult" style="display:none;">' +
                '<div style="text-align:center;padding:20px 0;">' +
                    '<div style="width:80px;height:80px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:2.5rem;color:#fff;">✓</div>' +
                    '<h3 style="color:#10b981;margin-bottom:8px;">هویت شما تأیید شد! ✅</h3>' +
                '</div>' +
                '<div style="background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.05));border:2px solid #10b981;border-radius:16px;padding:20px;margin-bottom:16px;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#fff;border-radius:10px;margin-bottom:8px;border-right:4px solid #667eea;">' +
                        '<span style="color:#888;font-size:0.8rem;">👤 نام کاربری:</span>' +
                        '<span id="resultUsername" style="color:#1a1a2e;font-weight:bold;font-family:monospace;direction:ltr;">---</span>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#fff;border-radius:10px;border-right:4px solid #f59e0b;">' +
                        '<span style="color:#888;font-size:0.8rem;">🔑 رمز عبور:</span>' +
                        '<span id="resultPassword" style="color:#10b981;font-weight:bold;font-size:1.1rem;font-family:monospace;direction:ltr;">---</span>' +
                    '</div>' +
                '</div>' +
                '<div style="background:rgba(245,158,11,0.08);border:1px dashed #f59e0b;border-radius:12px;padding:12px 16px;margin-bottom:16px;font-size:0.75rem;color:#4a4a6a;line-height:1.9;">' +
                    '<b style="color:#f59e0b;">💡 نکته:</b> لطفاً این اطلاعات را در جای امنی ذخیره کنید.' +
                '</div>' +
                '<button onclick="closeForgotPasswordModal()" style="width:100%;padding:13px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:bold;">✅ متوجه شدم</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);
    setTimeout(function() {
        var inp = document.getElementById('forgotAccountNum');
        if (inp) inp.focus();
    }, 100);
}

function closeForgotPasswordModal() {
    var modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.remove();
}

function forgotGoToStep(step) {
    forgotStep = step;
    document.getElementById('forgotStep1').style.display = 'none';
    document.getElementById('forgotStep2').style.display = 'none';
    document.getElementById('forgotStep3').style.display = 'none';
    document.getElementById('forgotResult').style.display = 'none';
    document.getElementById('forgotStep' + step).style.display = 'block';

    var colorsActive = 'background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;';
    var colorsDone = 'background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;';
    var colorsNormal = 'background:#f8fafc;color:#8888aa;border:2px solid #e0e7ff;';

    document.querySelectorAll('.password-step-dot').forEach(function(dot) {
        var s = parseInt(dot.getAttribute('data-step'));
        dot.classList.remove('active', 'done');
        var base = 'width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;';
        if (s < step) { dot.classList.add('done'); dot.style.cssText = base + colorsDone; }
        else if (s === step) { dot.classList.add('active'); dot.style.cssText = base + colorsActive; }
        else { dot.style.cssText = base + colorsNormal; }
    });

    setTimeout(function() {
        var el;
        if (step === 1) el = document.getElementById('forgotAccountNum');
        if (step === 2) el = document.getElementById('forgotPhone');
        if (step === 3) el = document.getElementById('forgotFamilyCount');
        if (el) el.focus();
    }, 100);
}

function forgotGoToStep2() {
    var accountNum = document.getElementById('forgotAccountNum').value.trim();
    if (!accountNum) { alert('⚠️ لطفاً شماره حساب خود را وارد کنید'); return; }
    var users = forgotAllUsers || [];
    var user = users.find(function(u) {
        return String(u.accountNumber) === accountNum || String(u.username) === accountNum;
    });
    if (!user) { alert('❌ کاربری با این شماره حساب یافت نشد'); return; }
    forgotUser = user;
    forgotGoToStep(2);
}

function forgotGoToStep3() {
    var phone = document.getElementById('forgotPhone').value.trim();
    if (!phone) { alert('⚠️ لطفاً شماره موبایل خود را وارد کنید'); return; }

    var normalizedPhone = phone.replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); });
    var userPhones = [];
    if (forgotUser.phone) { 
        var p = String(forgotUser.phone).trim().replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); }); 
        if (p) userPhones.push(p); 
    }
    if (forgotUser.phone1) { 
        var p1 = String(forgotUser.phone1).trim().replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); }); 
        if (p1) userPhones.push(p1); 
    }
    if (forgotUser.phone2) { 
        var p2 = String(forgotUser.phone2).trim().replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); }); 
        if (p2) userPhones.push(p2); 
    }
    userPhones = userPhones.filter(function(v, i, a) { return a.indexOf(v) === i; });

    if (userPhones.length === 0) { alert('❌ شماره موبایلی برای این کاربر ثبت نشده است'); return; }
    var matched = userPhones.some(function(p) { return p === normalizedPhone; });
    if (!matched) { alert('❌ شماره موبایل مطابقت ندارد\n\nشماره‌های ثبت‌شده: ' + userPhones.join(' یا ')); return; }
    forgotGoToStep(3);
}

function forgotVerify() {
    var familyCount = parseInt(document.getElementById('forgotFamilyCount').value);
    if (!familyCount || familyCount < 1) { showForgotStatus('⚠️ لطفاً تعداد اعضای خانواده را وارد کنید', 'warning'); return; }
    var allUsers = forgotAllUsers || [];
    var realFamilyCount = 1;
    if (forgotUser.heh1) {
        realFamilyCount = allUsers.filter(function(u) { return String(u.heh1) === String(forgotUser.heh1); }).length;
        if (realFamilyCount === 0) realFamilyCount = 1;
    } else if (forgotUser.familyCount) {
        realFamilyCount = forgotUser.familyCount;
    }
    if (familyCount !== realFamilyCount) {
        showForgotStatus('❌ تعداد اعضای خانواده مطابقت ندارد (عدد صحیح: ' + realFamilyCount + ')', 'error');
        return;
    }
    document.getElementById('forgotStep3').style.display = 'none';
    document.getElementById('forgotResult').style.display = 'block';
    document.getElementById('resultUsername').textContent = forgotUser.username;
    document.getElementById('resultPassword').textContent = forgotUser.password;

    document.querySelectorAll('.password-step-dot').forEach(function(dot) {
        dot.classList.remove('active');
        dot.classList.add('done');
        dot.style.cssText = 'width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;';
    });
}

function showForgotStatus(message, type) {
    var box = document.getElementById('forgotStatus');
    if (!box) return;
    box.style.display = 'block';
    var colors = {
        warning: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
        error: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' }
    };
    var c = colors[type] || colors.warning;
    box.style.background = c.bg;
    box.style.color = c.color;
    box.textContent = message;
}
