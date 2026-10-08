/* ============================================================
   صندوق اتحاد - باشگاه امتیازات و فروشگاه
   نسخه: 2.0
   ============================================================ */

function renderClubContent() {
    const products = window.SHOP_PRODUCTS || [];
    let tabContent = '';

    if (currentClubTab === 'shop') {
        tabContent = `
            <div class="club-section">
                <h3 style="font-size:0.9rem;margin-bottom:8px;display:flex;align-items:center;gap:6px;color:var(--text-primary);"><i class="fas fa-store" style="color:var(--gold-color);"></i> فروشگاه</h3>
                <div class="coin-display">
                    <i class="fas fa-coins"></i>
                    <div>
                        <div style="font-size:0.65rem;color:var(--text-secondary);">امتیازهای شما</div>
                        <div class="coin-amount">${fmtNum(userCoins)}</div>
                    </div>
                </div>
                <div class="shop-grid">
                    ${products.length === 0 ? '<p style="text-align:center;padding:12px;color:var(--text-secondary);font-size:0.75rem;">فروشگاه خالی است</p>' :
                    products.map(p => `
                        <div class="shop-card">
                            <div class="shop-card-title">${esc(p.name)}</div>
                            <div style="font-size:0.65rem;color:var(--text-secondary);margin-bottom:4px;">${esc(p.description || 'بدون توضیحات')}</div>
                            <div class="shop-card-price"><i class="fas fa-coins"></i> ${fmtNum(p.price)} امتیاز</div>
                            <button class="btn-small success-btn" onclick="buyProduct('${esc(p.shenaseh)}','${esc(p.name)}',${p.price})" ${p.stock <= 0 ? 'disabled' : ''} style="font-size:0.65rem;padding:6px 14px;min-height:32px;">خرید</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (currentClubTab === 'purchases') {
        tabContent = `
            <div class="club-section">
                <h3 style="font-size:0.9rem;margin-bottom:8px;display:flex;align-items:center;gap:6px;color:var(--text-primary);"><i class="fas fa-receipt" style="color:var(--gold-color);"></i> خریدهای شما</h3>
                ${userPurchases.length === 0 ? '<p style="text-align:center;padding:12px;color:var(--text-secondary);font-size:0.75rem;">هنوز خریدی نکرده‌اید</p>' :
                userPurchases.slice().reverse().map(p => `
                    <div class="coin-history-item">
                        <div>
                            <div style="font-weight:bold;font-size:0.8rem;color:var(--text-primary);">${esc(p.productName)}</div>
                            <div style="font-size:0.6rem;color:var(--text-secondary);">${p.date}</div>
                            <div style="font-size:0.55rem;color:var(--gradient-start);">${p.orderCode}</div>
                        </div>
                        <div style="font-weight:bold;color:var(--gold-color);font-size:0.8rem;">${fmtNum(p.price)} امتیاز</div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (currentClubTab === 'coins') {
        tabContent = `
            <div class="club-section">
                <h3 style="font-size:0.9rem;margin-bottom:8px;display:flex;align-items:center;gap:6px;color:var(--text-primary);"><i class="fas fa-coins" style="color:var(--gold-color);"></i> تاریخچه امتیازات</h3>
                <div class="coin-display">
                    <i class="fas fa-coins"></i>
                    <div>
                        <div style="font-size:0.65rem;color:var(--text-secondary);">امتیازهای شما</div>
                        <div class="coin-amount">${fmtNum(userCoins)}</div>
                    </div>
                </div>
                ${coinHistory.length === 0 ? '<p style="text-align:center;padding:12px;color:var(--text-secondary);font-size:0.75rem;">هنوز امتیازی دریافت نکرده‌اید</p>' :
                coinHistory.slice().reverse().map(item => {
                    const displayAmount = item.amount < 0 ? item.amount : '+' + item.amount;
                    const color = item.amount < 0 ? 'var(--danger-color)' : 'var(--success-color)';
                    return `
                        <div class="coin-history-item">
                            <div>
                                <div style="font-weight:bold;font-size:0.8rem;color:var(--text-primary);">${esc(item.reason)}</div>
                                <div style="font-size:0.6rem;color:var(--text-secondary);">${esc(item.detail)}</div>
                                <div style="font-size:0.55rem;color:var(--text-muted);">${esc(item.date)}</div>
                            </div>
                            <div style="color:${color};font-weight:bold;font-size:0.8rem;">${displayAmount}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    return `
        <div class="info-box"><i class="fas fa-star"></i> باشگاه امتیازات</div>
        <div class="club-tabs">
            <div class="club-tab ${currentClubTab === 'shop' ? 'active' : ''}" onclick="selectClubTab('shop')">فروشگاه</div>
            <div class="club-tab ${currentClubTab === 'purchases' ? 'active' : ''}" onclick="selectClubTab('purchases')">خریدها</div>
            <div class="club-tab ${currentClubTab === 'coins' ? 'active' : ''}" onclick="selectClubTab('coins')">تاریخچه</div>
        </div>
        <div id="clubTabContent">${tabContent}</div>
    `;
}

function selectClubTab(tab) {
    currentClubTab = tab;
    renderPage('club');
    loadClubFromAdmin().then(function(){ if (currentPage === 'club') renderPage('club'); });
}

function renderPointsRulesHtml() {
    return '<div class="dashboard-section" style="border-right-color:var(--gold-color);">' +
      '<h3><i class="fas fa-list-check" style="color:var(--gold-color);"></i> شرایط دریافت امتیاز</h3>' +
      '<div style="display:grid;gap:6px;font-size:.72rem;color:var(--text-secondary);line-height:1.8;">' +
      '<div>📅 ورود روزانه: ۱ امتیاز</div>' +
      '<div>🎂 تولد: ۵ امتیاز</div>' +
      '<div>💰 پرداخت مقرری ماهانه: ۱ امتیاز</div>' +
      '<div>💳 پرداخت قسط ماهانه: ۱ امتیاز</div>' +
      '<div>🏦 افزایش موجودی: ۱ امتیاز</div>' +
      '<div>✅ نداشتن قسط معوقه: ۱ امتیاز</div>' +
      '<div>🏆 مسابقات و فعالیت‌های تعریف‌شده در پنل مدیریت</div>' +
      '</div></div>';
}
