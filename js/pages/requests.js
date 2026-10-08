/* ============================================================
   صندوق اتحاد - درخواست‌ها
   نسخه: 2.0
   ============================================================ */

function renderRequestsContent() {
    const FUND_PHONE = '09138944709';
    const requests = [
        { code: '1', title: 'نوبت دهی وام خانوادگی', desc: 'درخواست نوبت برای دریافت وام خانوادگی' },
        { code: '2', title: 'دریافت وام جدید', desc: 'درخواست دریافت وام جدید' },
        { code: '4', title: 'مسدود نمودن حساب', desc: 'درخواست مسدودسازی حساب کاربری' },
        { code: '5', title: 'رفع مسدودی حساب', desc: 'درخواست رفع مسدودی حساب' },
        { code: '10', title: 'حذف حساب', desc: 'درخواست حذف کامل حساب' },
        { code: '13', title: 'ارسال کل موجودی و بدهی خانواده من', desc: 'دریافت گزارش کامل مالی خانواده' },
        { code: '14', title: 'غیرفعالسازی کلیه سرویس‌های پیامکی', desc: 'غیرفعال کردن تمام پیامک‌ها' },
        { code: '15', title: 'فعالسازی کلیه سرویس‌های پیامکی', desc: 'فعال کردن تمام پیامک‌ها' },
        { code: '18', title: 'فعالسازی فقط پیامک صورتحساب', desc: 'فعال کردن فقط پیامک صورتحساب' },
        { code: '19', title: 'غیرفعالسازی پیامک صورتحساب', desc: 'غیرفعال کردن پیامک صورتحساب' },
        { code: '20', title: 'تغییر شماره همراه', desc: 'ثبت شماره همراه جدید' },
        { code: '22', title: 'ارسال صورتحساب به جانشین', desc: 'ارسال صورتحساب به شماره جانشین' },
        { code: '23', title: 'لغو ارسال صورتحساب به جانشین', desc: 'لغو ارسال صورتحساب به جانشین' },
        { code: '44', title: 'ارسال ۵ تراکنش آخر', desc: 'دریافت ۵ تراکنش آخر حساب' }
    ];

    return `
        <div class="info-box"><i class="fas fa-file-signature"></i> درخواست‌های پیامکی</div>
        <div class="dashboard-section" style="border-right-color:var(--gold-color);background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(217,119,6,0.06));">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
                <i class="fas fa-info-circle" style="font-size:1.5rem;color:var(--gold-color);"></i>
                <div>
                    <div style="font-weight:bold;color:var(--text-primary);font-size:0.95rem;">📱 تمام درخواست‌ها به صورت پیامکی اعمال می‌گردد</div>
                    <div style="color:var(--text-secondary);font-size:0.8rem;">شماره صندوق: <strong style="color:var(--gold-color);">${FUND_PHONE}</strong></div>
                    <div style="color:var(--text-muted);font-size:0.6rem;margin-top:2px;">${requests.length} نوع درخواست مختلف</div>
                </div>
            </div>
            <div style="max-height:400px;overflow-y:auto;padding-right:4px;">
                ${requests.map(req => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg-secondary);border-radius:8px;margin-bottom:4px;border-right:4px solid var(--orange-color);transition:all 0.3s ease;">
                        <div style="flex:1;min-width:100px;">
                            <div style="font-weight:bold;font-size:0.8rem;color:var(--text-primary);">${req.title}</div>
                            <div style="font-size:0.6rem;color:var(--text-secondary);">${req.desc}</div>
                            <div style="font-size:0.45rem;color:var(--text-muted);margin-top:2px;">کد: ${req.code}</div>
                        </div>
                        <button class="btn-small orange-btn" onclick="sendSmsRequest('${req.code}','${req.title}')" style="font-size:0.6rem;padding:6px 14px;min-height:32px;flex-shrink:0;">ارسال</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function sendSmsRequest(code, title) {
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) { alert('❌ اطلاعات کاربر یافت نشد'); return; }
    const FUND_PHONE = '09138944709';
    const message = `درخواست ${code} - ${title}\nشماره حساب: ${member.accountNumber}\nنام: ${member.firstName}`;
    window.location.href = `sms:${FUND_PHONE}?body=${encodeURIComponent(message)}`;
    alert(`✅ درخواست "${title}" برای ارسال به شماره ${FUND_PHONE} آماده شد.`);
}
