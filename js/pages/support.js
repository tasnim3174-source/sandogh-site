/* ============================================================
   صندوق اتحاد - پشتیبانی
   نسخه: 2.0
   ============================================================ */

function renderSupportContent() {
    return `
        <div class="info-box"><i class="fas fa-headset"></i> پشتیبانی</div>

        <div class="dashboard-section" style="border-right-color:var(--success-color);">
            <h3><i class="fas fa-phone" style="color:var(--success-color);"></i> اطلاعات تماس</h3>
            <div class="support-grid">
                ${SUPPORT_INFO.phone ? `
                    <div class="support-card">
                        <div class="support-icon" style="background:var(--success-color);"><i class="fas fa-phone"></i></div>
                        <div>
                            <div class="support-label">تلفن حسابداری</div>
                            <div class="support-value">${esc(SUPPORT_INFO.phone)}</div>
                            <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
                                <button class="btn-small success-btn" onclick="copyText('${esc(SUPPORT_INFO.phone)}',this)" style="font-size:0.55rem;padding:4px 10px;min-height:26px;">کپی</button>
                                <a href="tel:${esc(SUPPORT_INFO.phone)}" class="btn-small success-btn" style="font-size:0.55rem;padding:4px 10px;min-height:26px;text-decoration:none;">تماس</a>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="dashboard-section" style="border-right-color:var(--blue-color);">
            <h3><i class="fas fa-university" style="color:var(--blue-color);"></i> اطلاعات حساب صندوق</h3>
            <div class="support-grid">
                ${SUPPORT_INFO.accountNumber ? `
                    <div class="support-card">
                        <div class="support-icon" style="background:#4299e1;"><i class="fas fa-university"></i></div>
                        <div>
                            <div class="support-label">شماره حساب</div>
                            <div class="support-value" style="direction:ltr;text-align:left;">${esc(SUPPORT_INFO.accountNumber)}</div>
                            <button class="btn-small info-btn" onclick="copyText('${esc(SUPPORT_INFO.accountNumber)}',this)" style="font-size:0.55rem;padding:4px 10px;min-height:26px;">کپی</button>
                        </div>
                    </div>
                ` : ''}
                ${SUPPORT_INFO.cardNumber ? `
                    <div class="support-card">
                        <div class="support-icon" style="background:#9f7aea;"><i class="fas fa-credit-card"></i></div>
                        <div>
                            <div class="support-label">شماره کارت</div>
                            <div class="support-value" style="direction:ltr;text-align:left;">${esc(SUPPORT_INFO.cardNumber)}</div>
                            <button class="btn-small info-btn" onclick="copyText('${esc(SUPPORT_INFO.cardNumber)}',this)" style="font-size:0.55rem;padding:4px 10px;min-height:26px;">کپی</button>
                        </div>
                    </div>
                ` : ''}
                ${SUPPORT_INFO.shebaNumber ? `
                    <div class="support-card">
                        <div class="support-icon" style="background:#ed8936;"><i class="fas fa-file-invoice"></i></div>
                        <div>
                            <div class="support-label">شماره شبا</div>
                            <div class="support-value" style="direction:ltr;text-align:left;font-size:0.6rem;">${esc(SUPPORT_INFO.shebaNumber)}</div>
                            <button class="btn-small info-btn" onclick="copyText('${esc(SUPPORT_INFO.shebaNumber)}',this)" style="font-size:0.55rem;padding:4px 10px;min-height:26px;">کپی</button>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="dashboard-section" style="border-right-color:var(--purple-color);">
            <h3><i class="fas fa-globe" style="color:var(--purple-color);"></i> وب‌سایت و شبکه‌های اجتماعی</h3>
            <div class="support-grid">
                ${SUPPORT_INFO.websiteAddress ? `
                    <div class="support-card">
                        <div class="support-icon" style="background:#38b2ac;"><i class="fas fa-globe"></i></div>
                        <div>
                            <div class="support-label">وب‌سایت صندوق</div>
                            <div class="support-value" style="font-size:0.7rem;">${esc(SUPPORT_INFO.websiteAddress)}</div>
                            <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
                                <button class="btn-small info-btn" onclick="copyText('${esc(SUPPORT_INFO.websiteAddress)}',this)" style="font-size:0.55rem;padding:4px 10px;min-height:26px;">کپی</button>
                                <a href="${esc(SUPPORT_INFO.websiteAddress)}" target="_blank" class="btn-small info-btn" style="font-size:0.55rem;padding:4px 10px;min-height:26px;text-decoration:none;">بازدید</a>
                            </div>
                        </div>
                    </div>
                ` : ''}
                ${SUPPORT_INFO.itaaAddress ? `
                    <div class="support-card">
                        <div class="support-icon" style="background:#7c3aed;"><i class="fas fa-comment-dots"></i></div>
                        <div>
                            <div class="support-label">ایتا</div>
                            <div class="support-value">${esc(SUPPORT_INFO.itaaAddress)}</div>
                            <button class="btn-small info-btn" onclick="copyText('${esc(SUPPORT_INFO.itaaAddress)}',this)" style="font-size:0.55rem;padding:4px 10px;min-height:26px;">کپی</button>
                            <a href="https://eitaa.com/${esc(SUPPORT_INFO.itaaAddress.replace('@',''))}" target="_blank" class="btn-small info-btn" style="font-size:0.55rem;padding:4px 10px;min-height:26px;text-decoration:none;">بازدید</a>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}
