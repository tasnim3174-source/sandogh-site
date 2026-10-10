/* ============================================================
   صندوق اتحاد - صورتحساب و داشبورد
   نسخه: 2.0
   ============================================================ */

function renderDashboardContent() {
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) return '<div style="text-align:center;padding:30px;">خطا</div>';

    const memberTxns = (transactionsByMember.get(String(member.id)) || [])
        .sort((a, b) => (parseInt(b._transactionId) || 0) - (parseInt(a._transactionId) || 0));

    let savingsStatusFromTx = 0;
    if (memberTxns.length > 0) {
        savingsStatusFromTx = parseFloat(memberTxns[0]['وضعیت پس انداز']) || 0;
    }

    const latestTx = memberTxns.length ? memberTxns[0] : null;
    const balance = latestTx ? latestTx['موجودی'] || '0' : '0';

    const totalInstallments = member?.totalInstallments || 1;
    const paidInstallments = member?.paidInstallments || 0;
    const overdueInstallments = Math.abs(member?.overdueInstallments || 0);
    const progressPercent = Math.min(100, Math.round((paidInstallments / totalInstallments) * 100));

    let paymentStatus = '', paymentColor = '';
    const overdue = Math.abs(member.overdueInstallments || 0);
    const hasActiveLoan = (parseInt(member.totalInstallments) || 0) > 0 && (parseInt(member.paidInstallments) || 0) < (parseInt(member.totalInstallments) || 0);

    if (overdue > 0) {
        paymentStatus = '⚠️ ' + overdue + ' قسط معوقه';
        paymentColor = '#ef4444';
    } else if (hasActiveLoan) {
        paymentStatus = '🟡 در حال پرداخت';
        paymentColor = '#f59e0b';
    } else if ((parseInt(member.totalInstallments) || 0) > 0 && (parseInt(member.paidInstallments) || 0) >= (parseInt(member.totalInstallments) || 0)) {
        paymentStatus = '✅ همه اقساط پرداخت شده';
        paymentColor = '#10b981';
    } else {
        paymentStatus = '✅ بدون بدهی';
        paymentColor = '#10b981';
    }

    const waitingLoanCount = window.WAITING_LOAN_COUNT || 0;

    const summaryBox = `
        <div class="dashboard-section summary-section">
            <h3 style="font-size:0.95rem;margin-bottom:12px;">
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
                    <div class="sc-value">${fmtNum(member?.loanBalance || 0)}</div>
                </div>
                <div class="summary-card sc-progress">
                    <span class="sc-icon"><i class="fas fa-chart-line"></i></span>
                    <div class="sc-label">پیشرفت اقساط</div>
                    <div class="sc-value">${progressPercent}%</div>
                    <div style="width:100%;height:5px;background:#e5e7eb;border-radius:99px;overflow:hidden;margin-top:6px;">
                        <div style="width:${progressPercent}%;height:100%;background:linear-gradient(90deg,var(--gold-color),#d97706);border-radius:99px;transition:width 0.5s ease;"></div>
                    </div>
                </div>
                <div class="summary-card sc-overdue" style="border-right-color: #8b5cf6;">
                    <span class="sc-icon"><i class="fas fa-piggy-bank"></i></span>
                    <div class="sc-label">وضعیت پس‌انداز</div>
                    <div class="sc-value" style="color:${savingsStatusFromTx >= 0 ? '#10b981' : '#ef4444'};">${fmtNum(Math.round(savingsStatusFromTx))}</div>
                </div>
                <div class="summary-card sc-overdue">
                    <span class="sc-icon"><i class="fas fa-exclamation-triangle"></i></span>
                    <div class="sc-label">اقساط معوقه</div>
                    <div class="sc-value" style="color:${overdueInstallments > 0 ? '#ef4444' : '#10b981'};">${overdueInstallments}</div>
                </div>
                <div class="summary-card sc-overdue" style="border-right-color: #8b5cf6;">
                    <span class="sc-icon"><i class="fas fa-users-clock"></i></span>
                    <div class="sc-label">افراد در نوبت وام</div>
                    <div class="sc-value" style="color:#8b5cf6;">${waitingLoanCount}</div>
                </div>
            </div>
        </div>
    `;

    let adminHtml = '';
    if (currentUser.role === 'admin') {
        const totalMembers = members.length;
        const totalTransactions = transactions.length;
        const totalBalanceSum = members.reduce((sum, m) => sum + (m.balance || 0), 0);
        const totalLoanSum = members.reduce((sum, m) => sum + (m.loanBalance || 0), 0);
        adminHtml = `
            <div class="dashboard-section" style="border-right-color:var(--gold-color);background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(217,119,6,0.06));">
                <h3><i class="fas fa-crown" style="color:var(--gold-color);"></i> پنل مدیریت</h3>
                <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);">
                    <div class="stat-card"><div class="stat-icon"><i class="fas fa-users" style="color:var(--gradient-start);"></i></div><div class="stat-value">${fmtNum(totalMembers)}</div><div class="stat-label">اعضا</div></div>
                    <div class="stat-card"><div class="stat-icon"><i class="fas fa-wallet" style="color:var(--success-color);"></i></div><div class="stat-value green">${fmtNum(totalBalanceSum)}</div><div class="stat-label">جمع موجودی</div></div>
                    <div class="stat-card"><div class="stat-icon"><i class="fas fa-hand-holding-usd" style="color:var(--danger-color);"></i></div><div class="stat-value red">${fmtNum(totalLoanSum)}</div><div class="stat-label">جمع وام</div></div>
                    <div class="stat-card"><div class="stat-icon"><i class="fas fa-file-invoice" style="color:var(--gold-color);"></i></div><div class="stat-value gold">${fmtNum(totalTransactions)}</div><div class="stat-label">تراکنش‌ها</div></div>
                </div>
            </div>
        `;
    }

    let warningsHtml = '';
    if (member.active === false) warningsHtml += '<div class="warning-box"><i class="fas fa-exclamation-triangle"></i> حساب غیرفعال</div>';
    if (member.savingsStatus < 0) warningsHtml += '<div class="warning-box"><i class="fas fa-exclamation-triangle"></i> کسری موجودی</div>';

    const loanInfoHtml = `
        <div class="dashboard-section" style="border-right-color:var(--danger-color);">
            <h3><i class="fas fa-hand-holding-usd" style="color:var(--danger-color);"></i> اطلاعات کامل وام و بدهی</h3>
            <div class="loan-info">
                <div class="loan-info-item"><div class="loan-info-label">شماره وام</div><div class="loan-info-value">${esc(member.loanNumber || member.accountNumber || '---')}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مبلغ وام مصوبه</div><div class="loan-info-value">${member.mabVam1 ? fmtNum(member.mabVam1) : '---'}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مبلغ وام دریافتی</div><div class="loan-info-value">${member.loanReceivedAmount ? fmtNum(member.loanReceivedAmount) : '---'}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مانده وام</div><div class="loan-info-value" style="color:var(--danger-color);">${fmtNum(member.loanBalance || 0)}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط کل</div><div class="loan-info-value">${member.totalInstallments || 0}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط پرداخت شده</div><div class="loan-info-value" style="color:var(--success-color);">${member.paidInstallments || 0}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط مانده</div><div class="loan-info-value" style="color:var(--gold-color);">${member.remainingInstallments || 0}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط معوقه</div><div class="loan-info-value" style="color:var(--danger-color);">${Math.abs(member.overdueInstallments || 0)}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مبلغ هر قسط</div><div class="loan-info-value">${member.installmentAmount ? fmtNum(member.installmentAmount) : '---'}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مبلغ کارمزد</div><div class="loan-info-value">${member.feeAmount ? fmtNum(member.feeAmount) : '---'}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تاریخ درخواست وام</div><div class="loan-info-value">${esc(member.loanRequestDate || '---')}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تاریخ دریافت وام</div><div class="loan-info-value">${esc(member.loanReceiveDate || '---')}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تاریخ آخرین قسط</div><div class="loan-info-value">${esc(member.lastInstallmentDate || '---')}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مقرری ماهانه</div><div class="loan-info-value">${fmtNum(member.monthlySalary || 0)}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">مقرری مصوب</div><div class="loan-info-value">${member.monthlySalaryApproved ? fmtNum(member.monthlySalaryApproved) : '---'}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">وضعیت پس‌انداز</div><div class="loan-info-value" style="color:${member.savingsStatus >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">${fmtNum(Math.round(member.savingsStatus || 0))}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">موجودی تا این ماه</div><div class="loan-info-value" style="color:var(--gold-color);">${fmtNum(Math.round(member.currentMonthBalance || 0))}</div></div>
                <div class="loan-info-item"><div class="loan-info-label">تعداد اقساط مصوبه</div><div class="loan-info-value">${member.tedad || '---'}</div></div>
            </div>
        </div>
    `;

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
                <div style="font-size:0.65rem;color:var(--text-secondary);margin-bottom:8px;display:flex;flex-direction:column;gap:4px;">
                    <div>📅 تاریخ دریافت وام: <strong style="color:var(--text-primary);">${esc(member.loanReceiveDate || '---')}</strong></div>
                    <div>🔢 تعداد کل اقساط: <strong style="color:var(--text-primary);">${totalInstallments}</strong></div>
                    <div>💰 مبلغ هر قسط: <strong style="color:var(--text-primary);">${member.installmentAmount ? fmtNum(member.installmentAmount) : '---'}</strong></div>
                </div>
                <div class="installment-table-wrapper" style="max-height:250px;overflow-y:auto;">
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

    const topFiveTxns = memberTxns.slice(0, 5);
    let lastTxHtml = '';
    if (topFiveTxns.length > 0) {
        lastTxHtml = `
            <div class="dashboard-section" style="border-right-color:var(--orange-color);">
                <h3 style="color:var(--orange-color);font-size:0.9rem;"><i class="fas fa-receipt" style="color:var(--orange-color);"></i> ۵ تراکنش آخر</h3>
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

    let miniSmsHtml = '';
    if (latestTx) {
        const amount = latestTx['مبلغ تراکنش'] || 0;
        const loanBalance2 = latestTx['مانده وام'] || 0;
        const paidInst = latestTx['تعداد قسط پرداخت شده'] || 0;
        const remainingInst = latestTx['تعداد قسط مانده'] || 0;
        const transactionDate = latestTx['تاریخ تراکنش'] || '---';
        const txName = latestTx['نام تراکنش کننده'] || '---';
        const monthlySalary = latestTx['مقرری ماهانه'] || 0;
        const savings = Math.round(latestTx['وضعیت پس انداز'] || 0);
        const total = latestTx['جمع واریزی'] || 0;
        const id = latestTx['ID'] || '---';
        const desc = latestTx['توضیحات'] || '---';

        miniSmsHtml = `
            <div class="dashboard-section" style="border-right-color:var(--teal-color);background:linear-gradient(135deg,rgba(20,184,166,0.04),rgba(13,148,136,0.04));margin-top:8px;">
                <h3 style="font-size:0.85rem;color:var(--text-primary);margin-bottom:6px;"><i class="fas fa-sms" style="color:var(--teal-color);"></i> آخرین پیامک صورتحساب ارسالی برای شما</h3>
                <div style="font-size:0.55rem;color:var(--text-muted);margin-bottom:4px;">ID تراکنش: ${id}</div>
                <div class="mini-sms-box-right" style="font-size:0.55rem;padding:8px 12px;">
                    <div><span class="sms-label">نام:</span> <span class="sms-value">${member.firstName}</span></div>
                    <div><span class="sms-label">شماره حساب:</span> <span class="sms-value">${member.accountNumber}</span></div>
                    <div><span class="sms-label">تاریخ تراکنش:</span> <span class="sms-value">${transactionDate}</span></div>
                    <div><span class="sms-label">نام تراکنش کننده:</span> <span class="sms-value">${txName}</span></div>
                    <div><span class="sms-label">مبلغ تراکنش:</span> <span class="sms-value">${fmtNum(amount)} ریال</span></div>
                    <div><span class="sms-label">مقرری ماهانه:</span> <span class="sms-value">${fmtNum(monthlySalary)}</span></div>
                    <div><span class="sms-label">وضعیت پس‌انداز:</span> <span class="sms-value">${fmtNum(savings)}</span></div>
                    <div><span class="sms-label">جمع واریزی:</span> <span class="sms-value">${fmtNum(total)}</span></div>
                    <div><span class="sms-label">موجودی:</span> <span class="sms-value">${fmtNum(balance)}</span></div>
                    <div><span class="sms-label">قسط پرداخت شده:</span> <span class="sms-value">${paidInst}</span></div>
                    <div><span class="sms-label">قسط مانده:</span> <span class="sms-value">${remainingInst}</span></div>
                    <div><span class="sms-label">مانده وام:</span> <span class="sms-value">${fmtNum(loanBalance2)}</span></div>
                    <div><span class="sms-label">توضیحات:</span> <span class="sms-value">${esc(desc)}</span></div>
                </div>
            </div>
        `;
    }

    const allTxnsHtml = `
        <div class="dashboard-section">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
                <h3 style="font-size:0.9rem;margin:0;"><i class="fas fa-file-invoice" style="color:#ec4899;"></i> صورتحساب کامل (${memberTxns.length} تراکنش)</h3>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button class="btn-small excel-btn" onclick="downloadExcel()" style="font-size:0.65rem;padding:6px 14px;min-height:32px;"><i class="fas fa-file-excel"></i> Excel</button>
                    <button class="btn-small pdf-btn" onclick="downloadPDF()" style="font-size:0.65rem;padding:6px 14px;min-height:32px;"><i class="fas fa-file-pdf"></i> PDF</button>
                </div>
            </div>
            <div class="filter-bar">
                <input type="text" id="searchTx" placeholder="جستجو..." oninput="filterExcelTransactions()" style="font-size:0.65rem;padding:6px 10px;min-height:30px;">
                <button class="btn-small info-btn" onclick="document.getElementById('searchTx').value='';filterExcelTransactions()" style="min-height:30px;padding:6px 12px;font-size:0.6rem;">پاک کردن</button>
            </div>
            <div id="txExcelContainer"></div>
        </div>
    `;

    setTimeout(function() {
        var container = document.getElementById('txExcelContainer');
        if (container) renderExcelTransactions(memberTxns, 'txExcelContainer');
    }, 200);

    const statusHtml =
        '<div class="dashboard-section" style="border-right-color:' + paymentColor + ';padding:12px 14px;">' +
            '<div style="display:flex;align-items:center;gap:12px;flex-wrap:nowrap;">' +
                '<span style="font-size:1.8rem;flex-shrink:0;">' + (overdueInstallments > 0 ? '🔴' : (hasActiveLoan ? '🟡' : '🟢')) + '</span>' +
                '<div style="flex:1;min-width:0;">' +
                    '<div style="font-weight:900;color:' + paymentColor + ';font-size:1.05rem;line-height:1.4;">' + paymentStatus + '</div>' +
                    '<div style="font-size:0.72rem;color:var(--text-secondary);margin-top:2px;">تعداد اقساط: ' + totalInstallments + ' (پرداخت شده: ' + paidInstallments + ')</div>' +
                    (member.loanBalance > 0 ? '<div style="font-size:0.72rem;color:var(--text-secondary);margin-top:2px;">مانده وام: ' + fmtNum(member.loanBalance || 0) + '</div>' : '') +
                '</div>' +
            '</div>' +
        '</div>' +
        adminHtml + warningsHtml;

    const allowanceSummaryHtml =
        '<div class="dashboard-section" style="border-right-color:var(--success-color);">' +
            '<h3><i class="fas fa-piggy-bank" style="color:var(--success-color);"></i> مقرری و پس‌انداز</h3>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value green">' + fmtNum(member.monthlySalary || 0) + '</div><div class="stat-label">مقرری ماهانه</div></div>' +
                '<div class="stat-card"><div class="stat-icon">🏦</div><div class="stat-value ' + (member.savingsStatus < 0 ? 'red' : 'green') + '">' + fmtNum(Math.round(member.savingsStatus || 0)) + '</div><div class="stat-label">وضعیت پس‌انداز</div></div>' +
            '</div>' +
        '</div>';

        const tabHtml =
        '<div class="statement-tabs" role="tablist">' +
            '<button type="button" class="statement-tab" data-statement-tab="allowance" onclick="switchDashboardTab(\'allowance\')">💰 مقرری و پس‌انداز</button>' +
            '<button type="button" class="statement-tab" data-statement-tab="loan" onclick="switchDashboardTab(\'loan\')">🏦 تسهیلات</button>' +
            '<button type="button" class="statement-tab active" data-statement-tab="overview" onclick="switchDashboardTab(\'overview\')">📊 حساب شما از یک نگاه</button>' +
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
        if (tab === 'overview') {
            var c = document.getElementById('txExcelContainer');
            if (c && memberTxns) renderExcelTransactions(memberTxns, 'txExcelContainer');
        }
    };

    window.downloadExcel = function() {
        const m = members.find(function(x) { return x.id === currentUser.memberId; });
        if (!m) { alert('❌ اطلاعات کاربر یافت نشد'); return; }
        const mTxns = (transactionsByMember.get(String(m.id)) || []).sort(function(a, b) { return (parseInt(b._transactionId) || 0) - (parseInt(a._transactionId) || 0); });
        if (mTxns.length === 0) { alert('❌ هیچ تراکنشی وجود ندارد'); return; }
        const data = mTxns.map(function(tx) { var row = {}; Object.keys(tx).forEach(function(k) { if (!k.startsWith('_')) row[k] = tx[k]; }); return row; });
        try {
            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, 'صورتحساب');
            XLSX.writeFile(wb, 'صورتحساب_' + m.firstName + '.xlsx');
            alert('✅ اکسل دانلود شد!');
        } catch (e) { alert('❌ خطا: ' + e.message); }
    };

    window.downloadPDF = function() {
        var m = members.find(function(x) { return x.id === currentUser.memberId; });
        if (!m) { alert('❌ اطلاعات کاربر یافت نشد'); return; }
        var mTxns = (transactionsByMember.get(String(m.id)) || []).sort(function(a, b) { return (parseInt(b._transactionId) || 0) - (parseInt(a._transactionId) || 0); });
        if (mTxns.length === 0) { alert('❌ هیچ تراکنشی وجود ندارد'); return; }
        try {
            var doc = new jspdf.jsPDF('l', 'mm', 'a4');
            var pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(16);
            doc.text('Statement ' + m.firstName, pageWidth / 2, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text('Date: ' + new Date().toLocaleDateString('en-US'), pageWidth / 2, 22, { align: 'center' });
            var columns = [
                { header: 'ID', dataKey: 'ID' },
                { header: 'Date', dataKey: 'Date' },
                { header: 'Amount', dataKey: 'Amount' },
                { header: 'Balance', dataKey: 'Balance' }
            ];
            var data = mTxns.map(function(tx) {
                return {
                    'ID': tx['ID'] || '',
                    'Date': tx['تاریخ تراکنش'] || '',
                    'Amount': fmtNum(tx['مبلغ تراکنش'] || 0),
                    'Balance': fmtNum(tx['موجودی'] || 0)
                };
            });
            doc.autoTable({ columns: columns, body: data, startY: 28, styles: { fontSize: 6, cellPadding: 1 }, headerStyles: { fillColor: [102, 126, 234], textColor: [255, 255, 255], fontSize: 7 } });
            doc.save('Statement_' + m.firstName + '.pdf');
            alert('✅ PDF دانلود شد!');
        } catch (e) { alert('❌ خطا: ' + e.message); }
    };

            return '<div id="dashboardStatementRoot">' +
        summaryBox +
        tabHtml +
        '<div class="statement-panel" data-statement-panel="allowance">' +
            allowanceSummaryHtml +
            warningsHtml +
            lastTxHtml +
            approvedHtml +
            miniSmsHtml +
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
                    '<div class="stat-card"><div class="stat-icon">📉</div><div class="stat-value red">' + fmtNum(member.loanBalance || 0) + '</div><div class="stat-label">مانده بدهی وام</div></div>' +
                '</div>' +
            '</div>' +
            loanInfoHtml +
            installmentPlanHtml +
            lastTxHtml +
            approvedHtml +
            miniSmsHtml +
            allTxnsHtml +
        '</div>' +
    '</div>';
// ============================================================
// رندر جدول تراکنش‌ها
// ============================================================
function renderExcelTransactions(txns, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!txns || txns.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:12px;color:var(--text-secondary);font-size:0.75rem;">هیچ تراکنشی ثبت نشده</p>';
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
        html += `<th>تراکنش ${idx + 1}<br><small style="font-size:0.45rem;opacity:0.9;">ID: ${esc(tx['ID'] || '')}</small></th>`;
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
    const member = members.find(m => m.id === currentUser.memberId);
    const allTxns = (transactionsByMember.get(String(member?.id)) || []).sort((a, b) => (parseInt(b._transactionId) || 0) - (parseInt(a._transactionId) || 0));
    if (!search) { renderExcelTransactions(allTxns, 'txExcelContainer'); return; }
    const filtered = allTxns.filter(tx => Object.values(tx).some(val => String(val).toLowerCase().includes(search)));
    renderExcelTransactions(filtered, 'txExcelContainer');
}
