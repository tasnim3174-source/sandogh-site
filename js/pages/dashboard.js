/* ============================================================
   صندوق اتحاد - صورتحساب
   نسخه 4.0 - کامل و بدون خطا
   ============================================================ */

function renderDashboardContent() {
    if (!members || members.length === 0) {
        return '<div style="padding:30px;text-align:center;">در حال بارگذاری...</div>';
    }

    var member = members.find(function(m) { return String(m.id) === String(currentUser.memberId); });
    if (!member) {
        return '<div style="padding:30px;text-align:center;color:#ef4444;">اطلاعات کاربر پیدا نشد</div>';
    }

    var memberTxns = (transactionsByMember.get(String(member.id)) || [])
        .sort(function(a, b) { return (parseInt(b._transactionId) || 0) - (parseInt(a._transactionId) || 0); });

    var latestTx = memberTxns.length ? memberTxns[0] : null;
    var balance = latestTx ? (latestTx['موجودی'] || '0') : '0';
    var savingsStatusFromTx = memberTxns.length > 0 ? (parseFloat(memberTxns[0]['وضعیت پس انداز']) || 0) : 0;

    var totalInstallments = member.totalInstallments || 1;
    var paidInstallments = member.paidInstallments || 0;
    var overdueInstallments = Math.abs(member.overdueInstallments || 0);
    var progressPercent = Math.min(100, Math.round((paidInstallments / totalInstallments) * 100));

    var paymentStatus = '✅ بدون بدهی';
    var paymentColor = '#10b981';
    if (overdueInstallments > 0) {
        paymentStatus = '⚠️ ' + overdueInstallments + ' قسط معوقه';
        paymentColor = '#ef4444';
    } else if (totalInstallments > 0 && paidInstallments < totalInstallments) {
        paymentStatus = '🟡 در حال پرداخت';
        paymentColor = '#f59e0b';
    }

    var summaryBox = 
        '<div class="dashboard-section summary-section">' +
            '<h3 style="font-size:0.95rem;margin-bottom:12px;"><i class="fas fa-file-invoice" style="color:#14b8a6;"></i> خلاصه حساب</h3>' +
            '<div class="summary-grid">' +
                '<div class="summary-card sc-balance"><span class="sc-icon"><i class="fas fa-wallet"></i></span><div class="sc-label">موجودی</div><div class="sc-value">' + fmtNum(balance) + '</div></div>' +
                '<div class="summary-card sc-debt"><span class="sc-icon"><i class="fas fa-hand-holding-usd"></i></span><div class="sc-label">بدهی</div><div class="sc-value">' + fmtNum(member.loanBalance || 0) + '</div></div>' +
                '<div class="summary-card sc-progress"><span class="sc-icon"><i class="fas fa-chart-line"></i></span><div class="sc-label">پیشرفت اقساط</div><div class="sc-value">' + progressPercent + '%</div></div>' +
                '<div class="summary-card sc-overdue" style="border-right-color:#8b5cf6;"><span class="sc-icon"><i class="fas fa-piggy-bank"></i></span><div class="sc-label">وضعیت پس‌انداز</div><div class="sc-value" style="color:' + (savingsStatusFromTx >= 0 ? '#10b981' : '#ef4444') + ';">' + fmtNum(Math.round(savingsStatusFromTx)) + '</div></div>' +
                '<div class="summary-card sc-overdue"><span class="sc-icon"><i class="fas fa-exclamation-triangle"></i></span><div class="sc-label">اقساط معوقه</div><div class="sc-value" style="color:' + (overdueInstallments > 0 ? '#ef4444' : '#10b981') + ';">' + overdueInstallments + '</div></div>' +
                '<div class="summary-card sc-overdue" style="border-right-color:#8b5cf6;"><span class="sc-icon"><i class="fas fa-users-clock"></i></span><div class="sc-label">افراد در نوبت وام</div><div class="sc-value" style="color:#8b5cf6;">' + (window.WAITING_LOAN_COUNT || 0) + '</div></div>' +
            '</div>' +
        '</div>';

    var tabHtml = 
        '<div class="statement-tabs" role="tablist">' +
            '<button type="button" class="statement-tab active" data-statement-tab="overview" onclick="switchDashboardTab(\'overview\')">📊 حساب شما از یک نگاه</button>' +
            '<button type="button" class="statement-tab" data-statement-tab="allowance" onclick="switchDashboardTab(\'allowance\')">💰 مقرری و پس‌انداز</button>' +
            '<button type="button" class="statement-tab" data-statement-tab="loan" onclick="switchDashboardTab(\'loan\')">🏦 تسهیلات</button>' +
        '</div>';

    var statusHtml = 
        '<div class="dashboard-section" style="border-right-color:' + paymentColor + ';padding:12px 14px;">' +
            '<div style="display:flex;align-items:center;gap:12px;">' +
                '<span style="font-size:1.8rem;">' + (overdueInstallments > 0 ? '🔴' : (totalInstallments > 0 && paidInstallments < totalInstallments ? '🟡' : '🟢')) + '</span>' +
                '<div><div style="font-weight:900;color:' + paymentColor + ';font-size:1.05rem;">' + paymentStatus + '</div>' +
                '<div style="font-size:0.72rem;color:#888;margin-top:2px;">اقساط: ' + totalInstallments + ' | پرداخت شده: ' + paidInstallments + '</div></div>' +
            '</div>' +
        '</div>';

    var loanInfoHtml = 
        '<div class="dashboard-section" style="border-right-color:#ef4444;">' +
            '<h3><i class="fas fa-hand-holding-usd" style="color:#ef4444;"></i> اطلاعات کامل وام</h3>' +
            '<div class="loan-info">' +
                '<div class="loan-info-item"><div class="loan-info-label">شماره وام</div><div class="loan-info-value">' + esc(member.loanNumber || member.accountNumber || '---') + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">مبلغ وام مصوبه</div><div class="loan-info-value">' + (member.mabVam1 ? fmtNum(member.mabVam1) : '---') + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">مانده وام</div><div class="loan-info-value" style="color:#ef4444;">' + fmtNum(member.loanBalance || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">اقساط کل</div><div class="loan-info-value">' + (member.totalInstallments || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">پرداخت شده</div><div class="loan-info-value" style="color:#10b981;">' + (member.paidInstallments || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">معوقه</div><div class="loan-info-value" style="color:#ef4444;">' + overdueInstallments + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">مقرری ماهانه</div><div class="loan-info-value">' + fmtNum(member.monthlySalary || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">وضعیت پس‌انداز</div><div class="loan-info-value">' + fmtNum(Math.round(member.savingsStatus || 0)) + '</div></div>' +
            '</div>' +
        '</div>';

    var allowanceHtml = 
        '<div class="dashboard-section" style="border-right-color:#10b981;">' +
            '<h3><i class="fas fa-piggy-bank" style="color:#10b981;"></i> مقرری و پس‌انداز</h3>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value green">' + fmtNum(member.monthlySalary || 0) + '</div><div class="stat-label">مقرری ماهانه</div></div>' +
                '<div class="stat-card"><div class="stat-icon">🏦</div><div class="stat-value">' + fmtNum(Math.round(member.savingsStatus || 0)) + '</div><div class="stat-label">وضعیت پس‌انداز</div></div>' +
            '</div>' +
        '</div>';

    var overviewHtml = 
        '<div class="dashboard-section">' +
            '<h3><i class="fas fa-eye" style="color:#667eea;"></i> حساب شما از یک نگاه</h3>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-value">' + esc(member.firstName || '---') + '</div><div class="stat-label">عضو</div></div>' +
                '<div class="stat-card"><div class="stat-value">' + memberTxns.length + '</div><div class="stat-label">تراکنش‌ها</div></div>' +
                '<div class="stat-card"><div class="stat-value">' + fmtNum(balance) + '</div><div class="stat-label">موجودی</div></div>' +
                '<div class="stat-card"><div class="stat-value red">' + fmtNum(member.loanBalance || 0) + '</div><div class="stat-label">بدهی</div></div>' +
            '</div>' +
        '</div>' +
        loanInfoHtml +
        allowanceHtml;

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
        summaryBox +
        tabHtml +
        '<div class="statement-panel active" data-statement-panel="overview">' + statusHtml + overviewHtml + '</div>' +
        '<div class="statement-panel" data-statement-panel="allowance">' + statusHtml + allowanceHtml + '</div>' +
        '<div class="statement-panel" data-statement-panel="loan">' + statusHtml + loanInfoHtml + '</div>' +
    '</div>';
}

function renderExcelTransactions(txns, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    if (!txns || txns.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:12px;color:#888;">هیچ تراکنشی نیست</p>';
        return;
    }
    var html = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.7rem;"><thead><tr style="background:#667eea;color:#fff;"><th style="padding:8px;">ID</th><th style="padding:8px;">تاریخ</th><th style="padding:8px;">مبلغ</th><th style="padding:8px;">موجودی</th></tr></thead><tbody>';
    txns.slice(0, 50).forEach(function(tx) {
        html += '<tr>' +
            '<td style="padding:6px;border:1px solid #ddd;text-align:center;">' + (tx['ID'] || '') + '</td>' +
            '<td style="padding:6px;border:1px solid #ddd;text-align:center;">' + (tx['تاریخ تراکنش'] || '') + '</td>' +
            '<td style="padding:6px;border:1px solid #ddd;text-align:center;">' + fmtNum(parseNum(tx['مبلغ تراکنش'] || 0)) + '</td>' +
            '<td style="padding:6px;border:1px solid #ddd;text-align:center;">' + fmtNum(parseNum(tx['موجودی'] || 0)) + '</td>' +
        '</tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function filterExcelTransactions() {
    var search = '';
    var el = document.getElementById('searchTx');
    if (el) search = el.value.toLowerCase();
    var member = members.find(function(m) { return String(m.id) === String(currentUser.memberId); });
    var allTxns = (transactionsByMember.get(String(member ? member.id : '')) || []);
    if (!search) { renderExcelTransactions(allTxns, 'txExcelContainer'); return; }
    var filtered = allTxns.filter(function(tx) {
        return Object.values(tx).some(function(val) { return String(val).toLowerCase().indexOf(search) > -1; });
    });
    renderExcelTransactions(filtered, 'txExcelContainer');
}
