/* ============================================================
   صندوق اتحاد - صورتحساب و داشبورد
   نسخه: 3.0 (اطلاعات بر اساس بزرگترین ID - جدیدترین تراکنش)
   ============================================================ */

function renderDashboardContent() {
    // ۱. پیدا کردن کاربر
    const member = members.find(m => 
        String(m.id) === String(currentUser.memberId) || 
        String(m.accountNumber) === String(currentUser.accountNumber) ||
        String(m.accountNumber) === String(currentUser.username)
    );
    if (!member) return '<div style="text-align:center;padding:30px;">خطا: کاربر پیدا نشد</div>';

    // ۲. گرفتن تراکنش‌های کاربر و مرتب‌سازی بر اساس بزرگترین ID
    const memberTxns = (transactionsByMember.get(String(member.id)) || [])
        .sort((a, b) => (parseInt(b['ID']) || 0) - (parseInt(a['ID']) || 0));

    // ۳. پیدا کردن جدیدترین تراکنش (بزرگترین ID)
    let latestTx = null;
    let maxId = 0;
    memberTxns.forEach(function(tx) {
        var id = parseInt(tx['ID']) || 0;
        if (id > maxId) {
            maxId = id;
            latestTx = tx;
        }
    });

    // ۴. استخراج اطلاعات از جدیدترین تراکنش (یا کاربر اگر تراکنشی نبود)
    const loanBalance = latestTx ? (parseFloat(latestTx['مانده وام']) || 0) : (member.loanBalance || 0);
    const paidInstallments = latestTx ? (parseFloat(latestTx['تعداد قسط پرداخت شده']) || 0) : (member.paidInstallments || 0);
    const remainingInstallments = latestTx ? (parseFloat(latestTx['تعداد قسط مانده']) || 0) : (member.remainingInstallments || 0);
    const savingsStatus = latestTx ? (parseFloat(latestTx['وضعیت پس انداز']) || 0) : (member.savingsStatus || 0);
    const balance = latestTx ? (parseFloat(latestTx['موجودی']) || 0) : (member.balance || 0);
    const overdueInstallments = latestTx ? Math.abs(parseFloat(latestTx['تعداد قسط معوقه']) || 0) : Math.abs(member.overdueInstallments || 0);
    
    // ۵. محاسبه پیشرفت اقساط
    const totalInstallments = member.totalInstallments || 25;
    const progressPercent = Math.min(100, Math.round((paidInstallments / totalInstallments) * 100));

    let paymentStatus = '', paymentColor = '';
    const hasActiveLoan = totalInstallments > 0 && paidInstallments < totalInstallments;

    if (overdueInstallments > 0) {
        paymentStatus = '⚠️ ' + overdueInstallments + ' قسط معوقه';
        paymentColor = '#ef4444';
    } else if (hasActiveLoan) {
        paymentStatus = '🟡 در حال پرداخت';
        paymentColor = '#f59e0b';
    } else if (totalInstallments > 0 && paidInstallments >= totalInstallments) {
        paymentStatus = '✅ همه اقساط پرداخت شده';
        paymentColor = '#10b981';
    } else {
        paymentStatus = '✅ بدون بدهی';
        paymentColor = '#10b981';
    }

    const waitingLoanCount = window.WAITING_LOAN_COUNT || 0;

    // ============================================================
    // کارت نصب برنامه
    // ============================================================
    const installBannerHtml = `
        <div class="dashboard-section" style="background:linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08)); border:2px solid rgba(16,185,129,0.4); border-radius:16px; padding:14px 16px; margin-bottom:12px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <span style="font-size:2rem; flex-shrink:0;">📲</span>
            <div style="flex:1; min-width:180px;">
                <div style="font-size:1rem; font-weight:900; color:#10b981; margin-bottom:2px;">نصب برنامه روی گوشی</div>
                <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">دسترسی سریع‌تر با نصب روی صفحه اصلی</div>
            </div>
            <a href="install.html" style="padding:10px 20px; background:linear-gradient(135deg,#10b981,#059669); color:#fff; border-radius:10px; font-size:0.9rem; font-weight:800; text-decoration:none; box-shadow:0 4px 12px rgba(16,185,129,0.4); flex-shrink:0; white-space:nowrap;">نصب کن</a>
        </div>
    `;

    // ============================================================
    // کارت تغییر کاربر
    // ============================================================
    let changeUserHtml = '';
    try {
        const cm = members.find(m => 
            String(m.accountNumber) === String(currentUser.accountNumber) ||
            String(m.id) === String(currentUser.memberId)
        );
        const fm = cm && cm.heh1 ? members.filter(m => String(m.heh1) === String(cm.heh1)) : [];
        const isHead = cm && String(cm.heh2) === '01';
        
        if (isHead && fm.length > 1) {
            changeUserHtml = `
                <div class="dashboard-section" style="background:linear-gradient(135deg, rgba(139,92,246,0.15), rgba(124,58,237,0.08)); border:2px solid rgba(139,92,246,0.4); border-radius:16px; padding:14px 16px; margin-bottom:12px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                    <span style="font-size:2rem; flex-shrink:0;">👥</span>
                    <div style="flex:1; min-width:180px;">
                        <div style="font-size:1rem; font-weight:900; color:#8b5cf6; margin-bottom:2px;">تغییر کاربر</div>
                        <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">با اعضای دیگه خانواده وارد بشو</div>
                    </div>
                    <button onclick="if(typeof showFamilySelectScreen==='function'){showFamilySelectScreen();}else{alert('صفحه انتخاب در دسترس نیست');}" style="padding:10px 20px; background:linear-gradient(135deg,#8b5cf6,#7c3aed); color:#fff; border:none; border-radius:10px; font-size:0.9rem; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(139,92,246,0.4); flex-shrink:0; white-space:nowrap; font-family:inherit;">تغییر کاربر</button>
                </div>
            `;
        }
    } catch(e) {}

    // ============================================================
    // خلاصه حساب (کارت‌های بالا)
    // ============================================================
    const summaryBox = `
    <div class="dashboard-section summary-section">
        <h3 class="summary-title">
            <i class="fas fa-file-invoice" style="color:#14b8a6;"></i> خلاصه حساب
        </h3>
        <div class="summary-grid">
            <div class="summary-card sc-balance">
                <span class="sc-icon"><i class="fas fa-wallet"></i></span>
                <div class="sc-label">موجودی</div>
                <div class="sc-value">${fmtNum(balance)}</div>
            </div>
            <div class="summary-card sc-debt">
                <span class="sc-icon"><i class="fas fa-hand-holding-usd"></i></span>
                <div class="sc-label">بدهی</div>
                <div class="sc-value">${fmtNum(Math.abs(loanBalance))}</div>
            </div>
            <div class="summary-card sc-progress">
                <span class="sc-icon"><i class="fas fa-chart-line"></i></span>
                <div class="sc-label">پیشرفت اقساط</div>
                <div class="sc-value">${progressPercent}%</div>
                <div class="sc-progress-bar">
                    <div class="sc-progress-fill" style="width:${progressPercent}%;"></div>
                </div>
            </div>
            <div class="summary-card sc-overdue" style="--card-accent: #8b5cf6;">
                <span class="sc-icon"><i class="fas fa-piggy-bank"></i></span>
                <div class="sc-label">وضعیت پس‌انداز</div>
                <div class="sc-value ${savingsStatus >= 0 ? 'sc-green' : 'sc-red'}">${fmtNum(Math.round(savingsStatus))}</div>
            </div>
            <div class="summary-card sc-overdue">
                <span class="sc-icon"><i class="fas fa-exclamation-triangle"></i></span>
                <div class="sc-label">اقساط معوقه</div>
                <div class="sc-value ${overdueInstallments > 0 ? 'sc-red' : 'sc-green'}">${overdueInstallments}</div>
            </div>
            <div class="summary-card sc-overdue" style="--card-accent: #8b5cf6;">
                <span class="sc-icon"><i class="fas fa-users-clock"></i></span>
                <div class="sc-label">افراد در نوبت وام</div>
                <div class="sc-value sc-purple">${waitingLoanCount}</div>
            </div>
        </div>
    </div>
    `;

    // ============================================================
    // اطلاعات کامل وام (با استفاده از جدیدترین تراکنش)
    // ============================================================
    const loanInfoHtml = `
        <div class="dashboard-section" style="border-right-color:var(--danger-color);">
            <h3><i class="fas fa-hand-holding-usd" style="color:var(--danger-color);"></i> اطلاعات کامل وام و بدهی</h3>
            <div class="loan-info">
                <div class="loan-info-item"><div class="loan-info-label">شماره وام</div><div class="loan-info-value">${esc(member.loanNumber || member.accountNumber || '---')}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مبلغ وام مصوبه</div><div class="loan-info-value">${member.mabVam1 ? fmtNum(member.mabVam1) : '---'}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مبلغ وام دریافتی</div><div class="loan-info-value">${member.loanReceivedAmount ? fmtNum(member.loanReceivedAmount) : '---'}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مانده وام</div><div class="loan-info-value" style="color:var(--danger-color);">${fmtNum(Math.abs(loanBalance))}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط کل</div><div class="loan-info-value">${totalInstallments || 0}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط پرداخت شده</div><div class="loan-info-value" style="color:var(--success-color);">${paidInstallments || 0}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط مانده</div><div class="loan-info-value" style="color:var(--gold-color);">${remainingInstallments || 0}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط معوقه</div><div class="loan-info-value" style="color:var(--danger-color);">${overdueInstallments || 0}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مبلغ هر قسط</div><div class="loan-info-value">${member.installmentAmount ? fmtNum(member.installmentAmount) : '---'}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مبلغ کارمزد</div><div class="loan-info-value">${member.feeAmount ? fmtNum(member.feeAmount) : '---'}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تاریخ درخواست وام</div><div class="loan-info-value">${esc(member.loanRequestDate || '---')}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تاریخ دریافت وام</div><div class="loan-info-value">${esc(member.loanReceiveDate || '---')}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تاریخ آخرین قسط</div><div class="loan-info-value">${esc(member.lastInstallmentDate || '---')}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مقرری ماهانه</div><div class="loan-info-value">${fmtNum(member.monthlySalary || 0)}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">وضعیت پس‌انداز</div><div class="loan-info-value" style="color:${savingsStatus >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">${fmtNum(Math.round(savingsStatus))}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">موجودی تا این ماه</div><div class="loan-info-value" style="color:var(--gold-color);">${fmtNum(Math.round(member.currentMonthBalance || 0))}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط مصوبه</div><div class="loan-info-value">${member.tedad || '---'}</div></div>
            </div>
        </div>
    `;

    // ============================================================
    // مصوبات شورا
    // ============================================================
    const approvedHtml = `
        <div class="approved-section">
            <h3><i class="fas fa-file-contract" style="color:var(--gold-color);"></i> مصوبات شورای صندوق</h3>
            <div class="approved-item"><span class="label">مبلغ وام مصوبه</span><span class="value gold">${member.mabVam1 ? fmtNum(member.mabVam1) : '---'}</span></div>
            <div class="approved-item"><span class="label">تعداد اقساط مصوبه</span><span class="value">${member.tedad || '---'}</span></div>
            <div class="approved-item"><span class="label">مبلغ هر قسط مصوبه</span><span class="value">${member.tedad > 0 ? fmtNum(Math.round(member.mabVam1 / member.tedad)) : '---'}</span></div>
            <div class="approved-item"><span class="label">مقرری ماهانه مصوب</span><span class="value gold">${member.monthlySalaryApproved ? fmtNum(member.monthlySalaryApproved) : '---'}</span></div>
            <div class="approved-item"><span class="label">موجودی تا این ماه</span><span class="value gold">${fmtNum(Math.round(member.currentMonthBalance || 0))}</span></div>
            <div class="approved-item"><span class="label">مبلغ کارمزد مصوبه</span><span class="value gold">${member.feeAmount ? fmtNum(member.feeAmount) : '---'}</span></div>
        </div>
    `;

    // ============================================================
    // برنامه اقساط (با اطلاعات جدید)
    // ============================================================
    const installmentDates = generateInstallmentDates(member.loanReceiveDate, totalInstallments);
    let installmentPlanHtml = '';
    if (installmentDates.length > 0) {
        const paidCount = paidInstallments || 0;
        const overdueCount = overdueInstallments || 0;
        const remainingCount = totalInstallments - paidCount - overdueCount;

        installmentPlanHtml = `
            <div class="installment-plan-section">
                <div class="plan-header">
                    <div class="plan-title">
                        <i class="fas fa-calendar-check"></i>
                        برنامه اقساط وام
                    </div>
                    <div class="plan-summary">
                        <span class="paid">${paidCount} پرداخت شده</span> |
                        <span class="overdue">${overdueCount} معوقه</span> |
                        <span class="remaining">${remainingCount} باقیمانده</span>
                    </div>
                </div>
                <div style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:10px;display:flex;flex-direction:column;gap:6px;line-height:1.7;">
                    <div>📅 تاریخ دریافت وام: <strong style="color:var(--text-primary);">${esc(member.loanReceiveDate || '---')}</strong></div>
                    <div>🔢 تعداد کل اقساط: <strong style="color:var(--text-primary);">${totalInstallments}</strong></div>
                    <div>💰 مبلغ هر قسط: <strong style="color:var(--text-primary);">${member.installmentAmount ? fmtNum(member.installmentAmount) : '---'}</strong></div>
                </div>
                <div class="installment-table-wrapper" style="max-height:300px;overflow-y:auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>شماره</th>
                                <th>تاریخ سررسید</th>
                                <th>وضعیت</th>
                                <th>مبلغ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${installmentDates.map((inst, idx) => {
                                const index = idx + 1;
                                let statusClass = 'pending';
                                let statusText = 'در انتظار';
                                let statusIcon = '⏳';
                                if (index <= paidCount) {
                                    statusClass = 'paid';
                                    statusText = 'پرداخت شده';
                                    statusIcon = '✅';
                                } else if (index <= paidCount + overdueCount) {
                                    statusClass = 'overdue';
                                    statusText = 'معوقه';
                                    statusIcon = '⚠️';
                                }
                                const amount = member.installmentAmount ? fmtNum(member.installmentAmount) : '---';
                                return `<tr class="${statusClass}">
                                    <td><strong>${index}</strong></td>
                                    <td>${inst.date}</td>
                                    <td><span class="installment-status-badge ${statusClass}">${statusIcon} ${statusText}</span></td>
                                    <td>${amount}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ============================================================
    // ۵ تراکنش آخر
    // ============================================================
    const topFiveTxns = memberTxns.slice(0, 5);
    let lastTxHtml = '';
    if (topFiveTxns.length > 0) {
        lastTxHtml = `
            <div class="dashboard-section" style="border-right-color:var(--orange-color);">
                <h3 style="color:var(--orange-color);font-size:1.05rem;"><i class="fas fa-receipt" style="color:var(--orange-color);"></i> ۵ تراکنش آخر</h3>
                <div class="mini-excel-wrapper">
                    <table>
                        <thead><tr><th>شناسه</th><th>تاریخ</th><th>مقرری</th><th>موجودی</th></tr></thead>
                        <tbody>
                            ${topFiveTxns.map(tx => `
                                <tr>
                                    <td>${esc(tx['ID'] || '---')}</td>
                                    <td>${esc(tx['تاریخ تراکنش'] || '---')}</td>
                                    <td>${fmtNum(tx['مقرری ماهانه'] || 0)}</td>
                                    <td>${fmtNum(tx['موجودی'] || 0)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ============================================================
    // وضعیت (کارت رنگی)
    // ============================================================
    const statusHtml =
        '<div class="dashboard-section" style="border-right-color:' + paymentColor + ';padding:14px 16px;">' +
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:nowrap;">' +
                '<span style="font-size:2.2rem;flex-shrink:0;">' + (overdueInstallments > 0 ? '🔴' : (hasActiveLoan ? '🟡' : '🟢')) + '</span>' +
                '<div style="flex:1;min-width:0;">' +
                    '<div style="font-weight:900;color:' + paymentColor + ';font-size:1.25rem;line-height:1.5;">' + paymentStatus + '</div>' +
                    '<div style="font-size:0.95rem;color:var(--text-secondary);margin-top:4px;line-height:1.7;">تعداد اقساط: ' + totalInstallments + ' (پرداخت شده: ' + paidInstallments + ')</div>' +
                    (loanBalance !== 0 ? '<div style="font-size:0.95rem;color:var(--text-secondary);margin-top:4px;line-height:1.7;">مانده وام: ' + fmtNum(Math.abs(loanBalance)) + '</div>' : '') +
                '</div>' +
            '</div>' +
        '</div>';

    const allowanceSummaryHtml =
        '<div class="dashboard-section" style="border-right-color:var(--success-color);">' +
            '<h3><i class="fas fa-piggy-bank" style="color:var(--success-color);"></i> مقرری و پس‌انداز</h3>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value green">' + fmtNum(member.monthlySalary || 0) + '</div><div class="stat-label">مقرری ماهانه</div></div>' +
                '<div class="stat-card"><div class="stat-icon">🏦</div><div class="stat-value ' + (savingsStatus < 0 ? 'red' : 'green') + '">' + fmtNum(Math.round(savingsStatus || 0)) + '</div><div class="stat-label">وضعیت پس‌انداز</div></div>' +
            '</div>' +
        '</div>';

    const tabHtml =
        '<div class="statement-tabs statement-tabs-floating" role="tablist">' +
            '<button type="button" class="statement-tab" data-statement-tab="allowance" onclick="switchDashboardTab(\'allowance\')">💰 مقرری</button>' +
            '<button type="button" class="statement-tab" data-statement-tab="loan" onclick="switchDashboardTab(\'loan\')">🏦 تسهیلات</button>' +
            '<button type="button" class="statement-tab active" data-statement-tab="overview" onclick="switchDashboardTab(\'overview\')">📊 یک نگاه</button>' +
        '</div>';

    window.switchDashboardTab = function(tab) {
        var root = document.getElementById('dashboardStatementRoot');
        if (!root) return;
        root.querySelectorAll('.statement-tab').forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-statement-tab') === tab);
        });
        root.querySelectorAll('.statement-panel').forEach(function(panel) {
            panel.classList.toggle('active', panel.getAttribute('data-statement-panel') === tab);
        });
    };

    return '<div id="dashboardStatementRoot">' +
        installBannerHtml +
        summaryBox +
        tabHtml +
        '<div class="statement-panel" data-statement-panel="allowance">' +
            allowanceSummaryHtml +
            lastTxHtml +
            approvedHtml +
        '</div>' +
        '<div class="statement-panel" data-statement-panel="loan">' +
            statusHtml +
            loanInfoHtml +
            installmentPlanHtml +
        '</div>' +
        '<div class="statement-panel active" data-statement-panel="overview">' +
            statusHtml +
            '<div class="dashboard-section">' +
                '<h3><i class="fas fa-eye" style="color:var(--gradient-start);"></i> حساب شما از یک نگاه</h3>' +
                '<div class="stats-grid">' +
                    '<div class="stat-card"><div class="stat-icon">👤</div><div class="stat-value">' + esc(member.firstName || '---') + '</div><div class="stat-label">عضو صندوق</div></div>' +
                    '<div class="stat-card"><div class="stat-icon">🧾</div><div class="stat-value">' + memberTxns.length + '</div><div class="stat-label">تعداد تراکنش‌ها</div></div>' +
                    '<div class="stat-card"><div class="stat-icon">💳</div><div class="stat-value">' + fmtNum(balance) + '</div><div class="stat-label">موجودی</div></div>' +
                    '<div class="stat-card"><div class="stat-icon">📉</div><div class="stat-value red">' + fmtNum(Math.abs(loanBalance)) + '</div><div class="stat-label">مانده بدهی وام</div></div>' +
                '</div>' +
            '</div>' +
            loanInfoHtml +
            installmentPlanHtml +
            lastTxHtml +
            approvedHtml +
            '<div class="dashboard-section">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">' +
                    '<h3 style="font-size:1.05rem;margin:0;"><i class="fas fa-file-invoice" style="color:#ec4899;"></i> صورتحساب کامل (' + memberTxns.length + ' تراکنش)</h3>' +
                '</div>' +
                '<div class="tx-excel-container"></div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// رندر جدول تراکنش‌ها
// ============================================================
function renderExcelTransactions(txns, containerOrId) {
    const container = typeof containerOrId === 'string'
        ? document.getElementById(containerOrId)
        : containerOrId;
    if (!container) return;
    if (!txns || txns.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:16px;color:var(--text-secondary);font-size:1rem;">هیچ تراکنشی ثبت نشده</p>';
        return;
    }

    const uniqueTxns = [];
    const seenIds = new Set();
    txns.forEach(tx => {
        const id = tx['ID'] || '';
        if (!seenIds.has(id)) { seenIds.add(id); uniqueTxns.push(tx); }
    });

    const numberColumns = ['مقرری ماهانه', 'مبلغ تراکنش', 'مبلغ قسط واریزی', 'جمع واریزی', 'موجودی', 'تعداد قسط پرداخت شده',
        'تعداد قسط مانده', 'وضعیت پس انداز', 'مانده وام'
    ];
    const columns = [
        { key: 'ID', label: 'شناسه', icon: 'fa-hashtag' },
        { key: 'مقرری ماهانه', label: 'مقرری', icon: 'fa-money-bill' },
        { key: 'شماره فیش', label: 'شماره فیش', icon: 'fa-file-invoice' },
        { key: 'تاریخ تراکنش', label: 'تاریخ', icon: 'fa-calendar' },
        { key: 'مبلغ تراکنش', label: 'مبلغ', icon: 'fa-coins' },
        { key: 'نام تراکنش کننده', label: 'تراکنش‌کننده', icon: 'fa-user' },
        { key: 'جمع واریزی', label: 'جمع واریزی', icon: 'fa-calculator' },
        { key: 'موجودی', label: 'موجودی', icon: 'fa-wallet' },
        { key: 'تعداد قسط پرداخت شده', label: 'قسط پرداخت شده', icon: 'fa-check-circle' },
        { key: 'تعداد قسط مانده', label: 'قسط مانده', icon: 'fa-hourglass-half' },
        { key: 'وضعیت پس انداز', label: 'پس‌انداز', icon: 'fa-piggy-bank' },
        { key: 'مانده وام', label: 'مانده وام', icon: 'fa-hand-holding-usd' },
        { key: 'توضیحات', label: 'توضیحات', icon: 'fa-comment' }
    ];

    let html = '<div class="excel-table-wrapper"><table class="excel-table"><thead><tr><th>فیلد</th>';
    uniqueTxns.forEach((tx, idx) => {
        html += `<th>تراکنش ${idx + 1}<br><small style="font-size:0.7rem;opacity:0.9;">ID: ${esc(tx['ID'] || '')}</small></th>`;
    });
    html += '</tr></thead><tbody>';

    columns.forEach(col => {
        html += `<tr><td><i class="fas ${col.icon}"></i> ${col.label}</td>`;
        uniqueTxns.forEach(tx => {
            let value = tx[col.key];
            if (value === null || value === undefined) value = '---';
            else if (numberColumns.includes(col.key)) {
                const num = parseNum(value);
                value = num !== 0 ? fmtNum(num) : '۰';
            }
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function filterExcelTransactions() {
    const search = document.getElementById('searchTx')?.value?.toLowerCase() || '';
    const member = members.find(m => 
        String(m.id) === String(currentUser.memberId) || 
        String(m.accountNumber) === String(currentUser.accountNumber)
    );
    const allTxns = (transactionsByMember.get(String(member?.id)) || [])
        .sort((a, b) => (parseInt(b['ID']) || 0) - (parseInt(a['ID']) || 0));
    const filtered = search
        ? allTxns.filter(tx => Object.values(tx).some(val => String(val).toLowerCase().includes(search)))
        : allTxns;
    document.querySelectorAll('.tx-excel-container').forEach(function(el) {
        renderExcelTransactions(filtered, el);
    });
}
