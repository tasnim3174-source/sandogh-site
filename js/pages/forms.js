/* ============================================================
   صندوق اتحاد - فرم‌های آنلاین
   نسخه: 1.0
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
// 🆕 توابع باز کردن فرم‌ها
// ============================================================

function openAccountOpeningForm() {
    alert('📝 فرم درخواست افتتاح حساب به‌زودی اضافه می‌شود.');
}

function openDepositWithdrawForm() {
    alert('💰 فرم واریز / برداشت به‌زودی اضافه می‌شود.');
}
