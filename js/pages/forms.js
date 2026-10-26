/* ============================================================
   صندوق اتحاد - فرم‌های آنلاین
   نسخه: 3.0 (شامل فرم واریز/برداشت با تمام فیلدها)
   ============================================================ */

function renderFormsContent() {
    return `
        <div class="info-box" style="background:linear-gradient(135deg,rgba(139,92,246,0.1),rgba(124,58,237,0.05));border:1px solid rgba(139,92,246,0.3);">
            <i class="fas fa-file-alt" style="color:#8b5cf6;"></i> 
            فرم‌های آنلاین صندوق اتحاد
        </div>
        
        <div class="dashboard-section" style="border-right-color:#8b5cf6;background:linear-gradient(135deg,rgba(139,92,246,0.05),rgba(124,58,237,0.02));">
            <h3 style="color:#8b5cf6;font-size:1.1rem;margin-bottom:15px;">
                <i class="fas fa-list"></i> لیست فرم‌ها
            </h3>
            <p style="color:var(--text-secondary);font-size:0.85rem;line-height:1.8;margin-bottom:20px;">
                برای تکمیل هر فرم، روی دکمه مربوطه کلیک کنید.
            </p>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                
                <!-- فرم امضای وام -->
                <div onclick="openLoanSignModal()" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.3);border-radius:16px;padding:16px;cursor:pointer;transition:all 0.3s;text-align:center;" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 20px rgba(16,185,129,0.2)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
                    <div style="width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:1.5rem;color:#fff;">
                        <i class="fas fa-file-signature"></i>
                    </div>
                    <div style="font-weight:800;color:var(--text-primary);font-size:0.95rem;margin-bottom:4px;">فرم امضای وام</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);">ثبت و امضای الکترونیکی قرارداد</div>
                </div>

                <!-- فرم درخواست افتتاح حساب -->
                <div onclick="openAccountOpeningForm()" style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3);border-radius:16px;padding:16px;cursor:pointer;transition:all 0.3s;text-align:center;" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 20px rgba(59,130,246,0.2)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
                    <div style="width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#3b82f6,#2563eb);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:1.5rem;color:#fff;">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <div style="font-weight:800;color:var(--text-primary);font-size:0.95rem;margin-bottom:4px;">درخواست افتتاح حساب</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);">ثبت درخواست ایجاد حساب جدید</div>
                </div>

                <!-- فرم واریز / برداشت -->
                <div onclick="openDepositWithdrawForm()" style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:16px;padding:16px;cursor:pointer;transition:all 0.3s;text-align:center;" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 20px rgba(245,158,11,0.2)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
                    <div style="width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:1.5rem;color:#fff;">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div style="font-weight:800;color:var(--text-primary);font-size:0.95rem;margin-bottom:4px;">فرم واریز / برداشت</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);">ثبت درخواست واریز یا برداشت وجه</div>
                </div>

                <!-- 🆕 جای فرم‌های بعدی -->
                <div style="background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.1);border-radius:16px;padding:16px;text-align:center;opacity:0.5;">
                    <div style="width:50px;height:50px;border-radius:14px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:1.5rem;color:#9ca3af;">
                        <i class="fas fa-plus"></i>
                    </div>
                    <div style="font-weight:800;color:var(--text-secondary);font-size:0.95rem;margin-bottom:4px;">فرم‌های بعدی</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">به‌زودی...</div>
                </div>

            </div>
        </div>
    `;
}

// ============================================================
// 🆕 فرم درخواست افتتاح حساب
// ============================================================
function openAccountOpeningForm() {
    alert('📝 فرم درخواست افتتاح حساب به‌زودی اضافه می‌شود.');
}

// ============================================================
// 🆕 فرم واریز / برداشت (کامل)
// ============================================================
function openDepositWithdrawForm() {
    var old = document.getElementById('depositWithdrawModal');
    if (old) old.remove();

    var member = members.find(m => String(m.id) === String(currentUser.memberId)) || {};
    
    var modalHtml = `
        <div id="depositWithdrawModal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:15px;backdrop-filter:blur(6px);">
            <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid rgba(245,158,11,0.5);border-radius:20px;padding:20px;max-width:550px;width:100%;max-height70vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.7);">
                
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:12px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:#1a1a2e;">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div>
                            <div style="font-weight:900;color:#ffc94d;font-size:1.1rem;">فرم واریز / برداشت</div>
                            <div style="font-size:0.7rem;color:#9ca3af;">ثبت تراکنش جدید</div>
                        </div>
                    </div>
                    <button onclick="closeDepositWithdrawModal()" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;color:#fff;cursor:pointer;font-size:1rem;font-family:tahoma;">✕</button>
                </div>
                
                <!-- نوع تراکنش -->
                <div style="margin-bottom:6px;">
                    <label style="display:block;color:#d1d5db;font-size:0.8rem;margin-bottom:6px;font-weight:700;">نوع تراکنش:</label>
                    <div style="display:flex;gap:8px;">
                        <button type="button" id="btnTypeDeposit" onclick="setTxType('deposit')" style="flex:1;padding:12px;border-radius:10px;border:2px solid #10b981;background:rgba(16,185,129,0.15);color:#10b981;font-weight:900;cursor:pointer;font-family:inherit;font-size:0.9rem;">
                            <i class="fas fa-arrow-down"></i> واریز
                        </button>
                        <button type="button" id="btnTypeWithdraw" onclick="setTxType('withdraw')" style="flex:1;padding:12px;border-radius:10px;border:2px solid rgba(255,255,255,0.2);background:transparent;color:#9ca3af;font-weight:900;cursor:pointer;font-family:inherit;font-size:0.9rem;">
                            <i class="fas fa-arrow-up"></i> برداشت
                        </button>
                    </div>
                    <input type="hidden" id="txType" value="deposit">
                </div>
                
                <!-- تاریخ -->
                <div style="margin-bottom:6px;">
                    <label style="display:block;color:#d1d5db;font-size:0.8rem;margin-bottom:6px;font-weight:700;">تاریخ واریز / برداشت:</label>
                    <input type="text" id="txDate" value="${new Date().toLocaleDateString('fa-IR')}" placeholder="مثلاً 1405/08/24" style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;font-family:inherit;font-size:0.9rem;text-align:center;">
                </div>
                
                <!-- مبلغ -->
                <div style="margin-bottom:6px;">
                    <label style="display:block;color:#d1d5db;font-size:0.8rem;margin-bottom:6px;font-weight:700;">مبلغ واریز / برداشت (ریال):</label>
                    <input type="number" id="txAmount" placeholder="مثلاً 5000000" style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;font-family:inherit;font-size:0.9rem;text-align:center;">
                </div>
                
                <!-- روش واریز -->
                <div style="margin-bottom:6px;">
                    <label style="display:block;color:#d1d5db;font-size:0.8rem;margin-bottom:6px;font-weight:700;">روش تراکنش:</label>
                    <select id="txMethod" style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:#16213e;color:#fff;font-family:inherit;font-size:0.9rem;">
                        <option value="پایا">پایا</option>
                        <option value="ساتنا">ساتنا</option>
                        <option value="کارت به کارت">کارت به کارت</option>
                        <option value="انتقال">انتقال</option>
                        <option value="پل">پل</option>
                        <option value="نقدی">نقدی</option>
                        <option value="سایر">سایر</option>
                    </select>
                </div>
                
                <!-- مبلغ مقرری -->
                <div style="margin-bottom:6px;">
                    <label style="display:block;color:#d1d5db;font-size:0.8rem;margin-bottom:6px;font-weight:700;">مبلغ مقرری برای هر فرد (ریال):</label>
                    <input type="number" id="txSalary" placeholder="مثلاً 900000" style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;font-family:inherit;font-size:0.9rem;text-align:center;">
                </div>
                
                <!-- تعداد قسط -->
                <div style="margin-bottom:6px;">
                    <label style="display:block;color:#d1d5db;font-size:0.8rem;margin-bottom:6px;font-weight:700;">تعداد قسط برای هر فرد:</label>
                    <input type="number" id="txInstallments" placeholder="مثلاً 2" style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;font-family:inherit;font-size:0.9rem;text-align:center;">
                </div>
                
                <!-- توضیحات -->
                <div style="margin-bottom:16px;">
                    <label style="display:block;color:#d1d5db;font-size:0.8rem;margin-bottom:6px;font-weight:700;">توضیحات (اختیاری):</label>
                    <textarea id="txDesc" rows="3" placeholder="مثلاً: واریز از طریق کارت به کارت..." style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;font-family:inherit;font-size:0.9rem;resize:vertical;"></textarea>
                </div>
                
                <!-- دکمه‌ها -->
                <div style="display:flex;gap:10px;">
                    <button onclick="submitDepositWithdraw(event)" style="flex:2;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-weight:900;cursor:pointer;font-family:inherit;font-size:0.95rem;box-shadow:0 4px 15px rgba(16,185,129,0.4);">
                        <i class="fas fa-paper-plane"></i> ثبت و ارسال به شورا
                    </button>
                    <button onclick="closeDepositWithdrawModal()" style="flex:1;padding:14px;border:1px solid rgba(255,255,255,0.2);border-radius:12px;background:rgba(255,255,255,0.05);color:#fff;font-weight:700;cursor:pointer;font-family:inherit;font-size:0.9rem;">
                        ❌ لغو
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeDepositWithdrawModal() {
    var modal = document.getElementById('depositWithdrawModal');
    if (modal) modal.remove();
}

function setTxType(type) {
    var input = document.getElementById('txType');
    var btnDeposit = document.getElementById('btnTypeDeposit');
    var btnWithdraw = document.getElementById('btnTypeWithdraw');
    if (!input || !btnDeposit || !btnWithdraw) return;
    
    input.value = type;
    if (type === 'deposit') {
        btnDeposit.style.borderColor = '#10b981';
        btnDeposit.style.background = 'rgba(16,185,129,0.15)';
        btnDeposit.style.color = '#10b981';
        btnWithdraw.style.borderColor = 'rgba(255,255,255,0.2)';
        btnWithdraw.style.background = 'transparent';
        btnWithdraw.style.color = '#9ca3af';
    } else {
        btnWithdraw.style.borderColor = '#ef4444';
        btnWithdraw.style.background = 'rgba(239,68,68,0.15)';
        btnWithdraw.style.color = '#ef4444';
        btnDeposit.style.borderColor = 'rgba(255,255,255,0.2)';
        btnDeposit.style.background = 'transparent';
        btnDeposit.style.color = '#9ca3af';
    }
}

async function submitDepositWithdraw(e) {
    var btn = e.target;
    var originalText = btn.innerHTML;
    
    var type = document.getElementById('txType').value;
    var date = document.getElementById('txDate').value.trim();
    var amount = document.getElementById('txAmount').value.trim();
    var method = document.getElementById('txMethod').value;
    var salary = document.getElementById('txSalary').value.trim();
    var installments = document.getElementById('txInstallments').value.trim();
    var desc = document.getElementById('txDesc').value.trim();
    
    if (!date || !amount) {
        alert('⚠️ لطفاً تاریخ و مبلغ را وارد کنید.');
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '⏳ در حال ارسال...';
    
    var member = members.find(m => String(m.id) === String(currentUser.memberId)) || {};
    
    try {
        var url = ADMIN_URL + '?action=submitDepositWithdraw'
            + '&user=' + encodeURIComponent(member.id || member.accountNumber || currentUser.username)
            + '&name=' + encodeURIComponent(member.firstName || currentUser.firstName || '')
            + '&accountNumber=' + encodeURIComponent(member.accountNumber || '')
            + '&type=' + encodeURIComponent(type)
            + '&date=' + encodeURIComponent(date)
            + '&amount=' + encodeURIComponent(amount)
            + '&method=' + encodeURIComponent(method)
            + '&salary=' + encodeURIComponent(salary)
            + '&installments=' + encodeURIComponent(installments)
            + '&description=' + encodeURIComponent(desc);
        
        var res = await fetch(url, { cache: 'no-cache', mode: 'no-cors' });
        
        // ذخیره در حافظه محلی
        var localKey = 'sandogh_deposit_withdraw_' + (member.id || member.accountNumber);
        var localData = [];
        try {
            localData = JSON.parse(localStorage.getItem(localKey) || '[]');
        } catch(e) {}
        
        localData.unshift({
            type: type,
            date: date,
            amount: amount,
            method: method,
            salary: salary,
            installments: installments,
            description: desc,
            timestamp: new Date().toISOString()
        });
        try {
            localStorage.setItem(localKey, JSON.stringify(localData));
        } catch(e) {}
        
        alert('✅ فرم شما با موفقیت ثبت و برای شورا ارسال شد.');
        closeDepositWithdrawModal();
        
    } catch(err) {
        alert('❌ خطا در ثبت: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ============================================================
// 🆕 در معرض عموم قرار دادن توابع
// ============================================================
window.openAccountOpeningForm = openAccountOpeningForm;
window.openDepositWithdrawForm = openDepositWithdrawForm;
window.closeDepositWithdrawModal = closeDepositWithdrawModal;
window.setTxType = setTxType;
window.submitDepositWithdraw = submitDepositWithdraw;
