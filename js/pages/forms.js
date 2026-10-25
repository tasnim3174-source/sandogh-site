/* ============================================================
   صندوق اتحاد - فرم‌های آنلاین
   نسخه: 2.1 (شامل فرم امضای وام و escapeHtml)
   ============================================================ */

// 🆕 تابع escapeHtml
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(c) {
        return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c];
    }).replace(/\n/g, '<br>');
}

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
// 🆕 توابع باز کردن فرم‌ها
// ============================================================

function openAccountOpeningForm() {
    alert('📝 فرم درخواست افتتاح حساب به‌زودی اضافه می‌شود.');
}

function openDepositWithdrawForm() {
    alert('💰 فرم واریز / برداشت به‌زودی اضافه می‌شود.');
}

// ============================================================
// ✍️ فرم امضای الکترونیکی وام (Canvas)
// ============================================================

async function openLoanSignModal() {
    var old = document.getElementById('loanSignModal');
    if (old) old.remove();

    var member = members.find(m => m.id === currentUser.memberId) || {};
    var memberName = member.firstName || currentUser.firstName || 'نامشخص';
    var accountNum = member.accountNumber || currentUser.accountNumber || 'نامشخص';
    var phone = member.phone1 || member.phone || 'نامشخص';

    var isCouncil = false;
    if (currentUser) {
        if (currentUser.isCouncil === true || currentUser.role === 'council' || currentUser.role === 'admin') isCouncil = true;
    }
    if (member) {
        if (member.isCouncil === true || member.isHead === true) isCouncil = true;
    }

    var modalHtml = `
        <div id="loanSignModal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:10px;backdrop-filter:blur(6px);">
            <div style="background:#1a1a2e;border:2px solid rgba(139,92,246,0.5);border-radius:20px;padding:15px;max-width:650px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.7);">
                
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#fff;">✍️</div>
                        <div style="font-weight:900;color:#fff;font-size:1.1rem;">فرم قرارداد وام</div>
                    </div>
                    <button onclick="closeLoanSignModal()" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;color:#fff;cursor:pointer;font-size:1rem;font-family:tahoma;">✕</button>
                </div>
                
                <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;font-size:0.85rem;line-height:1.8;text-align:justify;color:#d1d5db;margin-bottom:16px;direction:rtl;">
                    <div style="text-align:center;font-weight:900;color:#f59e0b;margin-bottom:12px;font-size:1rem;">به نام خدا</div>
                    شورای محترم صندوق اتحاد<br><br>
                    اینجانب <b style="color:#10b981;">${escapeHtml(memberName)}</b> با شماره تلفن <b style="color:#10b981;">${escapeHtml(phone)}</b> و شماره حساب <b style="color:#10b981;">${escapeHtml(accountNum)}</b> و کد ملی 
                    <input type="text" id="signNationalId" placeholder="کد ملی" style="width:120px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;">
                    
                    مبلغ وام یا قرض 
                    <input type="text" id="signLoanAmount" placeholder="مبلغ" style="width:100px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;"> ریال
                    با بازپرداخت 
                    <input type="text" id="signInstallments" placeholder="تعداد" style="width:60px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;"> قسط
                    و هر قسط به مبلغ 
                    <input type="text" id="signInstallmentAmount" placeholder="مبلغ قسط" style="width:100px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;"> ریال
                    در تاریخ 
                    <input type="text" id="signDate" placeholder="تاریخ" value="${new Date().toLocaleDateString('fa-IR')}" style="width:100px;padding:4px;border-radius:6px;border:1px solid #8b5cf6;background:#16213e;color:#fff;text-align:center;font-family:tahoma;font-size:0.85rem;">
                    از این صندوق دریافت نمودم.
                    <br><br>
                    و موظف هستم این مبلغ را به طور کامل طی اقساط تعیین شده بصورت ماهانه پرداخت نمایم...
                </div>

                <div style="background:#fff;border-radius:12px;overflow:hidden;margin-bottom:10px;position:relative;">
                    <canvas id="signatureCanvas" style="width:100%;height:150px;touch-action:none;cursor:crosshair;display:block;"></canvas>
                    <div id="signPlaceholder" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ccc;font-size:1.2rem;pointer-events:none;font-family:tahoma;user-select:none;">✍️ اینجا امضا کنید</div>
                </div>

                <div style="display:flex;gap:10px;margin-bottom:10px;">
                    <button onclick="clearSignature()" style="flex:1;padding:10px;border:none;border-radius:8px;background:rgba(239,68,68,0.1);color:#fca5a5;font-weight:700;cursor:pointer;font-family:tahoma;">🗑️ پاک کردن امضا</button>
                </div>

                <div style="display:flex;gap:10px;">
                    <button onclick="submitSignedLoan(event)" style="flex:2;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-weight:900;cursor:pointer;font-family:tahoma;font-size:0.95rem;box-shadow:0 4px 15px rgba(16,185,129,0.4);">
                        ✅ ثبت و امضا
                    </button>
                    
                    ${isCouncil ? `
                    <button onclick="approveLoanSignature(event)" style="flex:1;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-weight:900;cursor:pointer;font-family:tahoma;font-size:0.9rem;box-shadow:0 4px 15px rgba(245,158,11,0.4);">
                        👑 تایید نهایی
                    </button>
                    ` : ''}
                    
                    <button onclick="closeLoanSignModal()" style="flex:1;padding:14px;border:1px solid rgba(255,255,255,0.2);border-radius:12px;background:rgba(255,255,255,0.05);color:#fff;font-weight:700;cursor:pointer;font-family:tahoma;font-size:0.9rem;">
                        ❌ لغو
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    setTimeout(initSignatureCanvas, 100);
}

function closeLoanSignModal() {
    var modal = document.getElementById('loanSignModal');
    if (modal) modal.remove();
}

var sigCanvas, sigCtx, sigDrawing = false;

function initSignatureCanvas() {
    sigCanvas = document.getElementById('signatureCanvas');
    if (!sigCanvas) return;
    
    sigCanvas.width = sigCanvas.offsetWidth;
    sigCanvas.height = sigCanvas.offsetHeight;
    sigCtx = sigCanvas.getContext('2d');
    sigCtx.strokeStyle = '#000';
    sigCtx.lineWidth = 3;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';

    function getPos(e) {
        var rect = sigCanvas.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function startDrawing(e) {
        e.preventDefault();
        sigDrawing = true;
        var pos = getPos(e);
        sigCtx.beginPath();
        sigCtx.moveTo(pos.x, pos.y);
        document.getElementById('signPlaceholder').style.display = 'none';
    }
    function draw(e) {
        if (!sigDrawing) return;
        e.preventDefault();
        var pos = getPos(e);
        sigCtx.lineTo(pos.x, pos.y);
        sigCtx.stroke();
    }
    function stopDrawing(e) {
        if (!sigDrawing) return;
        e.preventDefault();
        sigDrawing = false;
    }

    sigCanvas.addEventListener('mousedown', startDrawing);
    sigCanvas.addEventListener('mousemove', draw);
    sigCanvas.addEventListener('mouseup', stopDrawing);
    sigCanvas.addEventListener('mouseleave', stopDrawing);
    
    sigCanvas.addEventListener('touchstart', startDrawing, {passive: false});
    sigCanvas.addEventListener('touchmove', draw, {passive: false});
    sigCanvas.addEventListener('touchend', stopDrawing);
}

function clearSignature() {
    if (!sigCtx) return;
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    document.getElementById('signPlaceholder').style.display = 'block';
}

async function submitSignedLoan(e) {
    if (!sigCanvas) return;
    
    var blank = document.createElement('canvas');
    blank.width = sigCanvas.width;
    blank.height = sigCanvas.height;
    if (sigCanvas.toDataURL() === blank.toDataURL()) {
        alert('⚠️ لطفاً ابتدا در کادر سفید امضا کنید.');
        return;
    }

    var nationalId = document.getElementById('signNationalId').value.trim();
    var loanAmount = document.getElementById('signLoanAmount').value.trim();
    var installments = document.getElementById('signInstallments').value.trim();
    var installmentAmount = document.getElementById('signInstallmentAmount').value.trim();
    var signDate = document.getElementById('signDate').value.trim();

    if (!nationalId || !loanAmount || !installments) {
        alert('⚠️ لطفاً کد ملی، مبلغ وام و تعداد اقساط را وارد کنید.');
        return;
    }

    var btn = e.target;
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ در حال ثبت...';

    try {
        var member = members.find(m => m.id === currentUser.memberId) || {};
        var imgData = sigCanvas.toDataURL('image/png');
        
        var url = ADMIN_URL + '?action=saveSignedLoan'
            + '&user=' + encodeURIComponent(member.id || member.accountNumber || currentUser.username)
            + '&name=' + encodeURIComponent(member.firstName || currentUser.firstName || '')
            + '&accountNumber=' + encodeURIComponent(member.accountNumber || '')
            + '&phone=' + encodeURIComponent(member.phone1 || member.phone || '')
            + '&nationalId=' + encodeURIComponent(nationalId)
            + '&loanAmount=' + encodeURIComponent(loanAmount)
            + '&installments=' + encodeURIComponent(installments)
            + '&installmentAmount=' + encodeURIComponent(installmentAmount)
            + '&signDate=' + encodeURIComponent(signDate)
            + '&signature=' + encodeURIComponent(imgData);

        var res = await fetch(url, { cache: 'no-cache', mode: 'no-cors' });
        
        alert('✅ قرارداد با موفقیت امضا و ثبت شد!\n\nلطفاً منتظر تایید نهایی شورا باشید.');
        closeLoanSignModal();

    } catch(err) {
        alert('❌ خطای شبکه: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function approveLoanSignature(e) {
    if (!confirm('آیا مطمئنید که می‌خواهید این قرارداد را تایید نهایی کنید؟')) return;

    var btn = e.target;
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ در حال تایید...';

    try {
        var member = members.find(m => m.id === currentUser.memberId) || {};
        var url = ADMIN_URL + '?action=approveSignedLoan'
            + '&key=admin12345'
            + '&user=' + encodeURIComponent(member.id || member.accountNumber || currentUser.username);

        var res = await fetch(url, { cache: 'no-cache', mode: 'no-cors' });

        alert('✅ قرارداد با موفقیت تایید نهایی شد.');
        closeLoanSignModal();

    } catch(err) {
        alert('❌ خطای شبکه: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

window.openLoanSignModal = openLoanSignModal;
window.closeLoanSignModal = closeLoanSignModal;
window.clearSignature = clearSignature;
window.submitSignedLoan = submitSignedLoan;
window.approveLoanSignature = approveLoanSignature;
