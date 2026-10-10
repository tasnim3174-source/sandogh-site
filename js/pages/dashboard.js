/* ============================================================
   صندوق اتحاد - صورتحساب
   نسخه: 3.0 - کامل و بدون خطای Syntax
   ============================================================ */

function renderDashboardContent() {
    if (!members || members.length === 0) {
        return '<div style="padding:30px;text-align:center;">در حال بارگذاری...</div>';
    }
    
    var member = members.find(function(m) { return String(m.id) === String(currentUser.memberId); });
    if (!member) {
        return '<div style="padding:30px;text-align:center;color:#ef4444;">⚠️ اطلاعات کاربر پیدا نشد</div>';
    }
    
    var memberTxns = (transactionsByMember.get(String(member.id)) || [])
        .sort(function(a, b) { return (parseInt(b._transactionId) || 0) - (parseInt(a._transactionId) || 0); });
    
    var savingsStatusFromTx = 0;
    if (memberTxns.length > 0) {
        savingsStatusFromTx = parseFloat(memberTxns[0]['وضعیت پس انداز']) || 0;
    }
    
    var latestTx = memberTxns.length ? memberTxns[0] : null;
    var balance = latestTx ? (latestTx['موجودی'] || '0') : '0';
    
    var totalInstallments = member.totalInstallments || 1;
    var paidInstallments = member.paidInstallments || 0;
    var overdueInstallments = Math.abs(member.overdueInstallments || 0);
    var progressPercent = Math.min(100, Math.round((paidInstallments / totalInstallments) * 100));
    
    var overdue = Math.abs(member.overdueInstallments || 0);
    var hasActiveLoan = (parseInt(member.totalInstallments) || 0) > 0 && 
                        (parseInt(member.paidInstallments) || 0) < (parseInt(member.totalInstallments) || 0);
    
    var paymentStatus = '', paymentColor = '';
    if (overdue > 0) {
        paymentStatus = '⚠️ ' + overdue + ' قسط معوقه';
        paymentColor = '#ef4444';
    } else if (hasActiveLoan) {
        paymentStatus = '🟡 در حال پرداخت';
        paymentColor = '#f59e0b';
    } else {
        paymentStatus = '✅ بدون بدهی';
        paymentColor = '#10b981';
    }
    
    var waitingLoanCount = window.WAITING_LOAN_COUNT || 0;
    
    // ============================================================
    // خلاصه حساب
    // ============================================================
    var summaryBox = 
        '<div class="dashboard-section summary-section">' +
            '<h3 style="font-size:0.95rem;margin-bottom:12px;">' +
                '<i class="fas fa-file-invoice" style="color:#14b8a6;"></i> خلاصه حساب' +
            '</h3>' +
            '<div class="summary-grid">' +
                '<div class="summary-card sc-balance">' +
                    '<span class="sc-icon"><i class="fas fa-wallet"></i></span>' +
                    '<div class="sc-label">موجودی</div>' +
                    '<div class="sc-value">' + fmtNum(balance) + '</div>' +
                '</div>' +
                '<div class="summary-card sc-debt">' +
                    '<span class="sc-icon"><i class="fas fa-hand-holding-usd"></i></span>' +
                    '<div class="sc-label">بدهی</div>' +
                    '<div class="sc-value">' + fmtNum(member.loanBalance || 0) + '</div>' +
                '</div>' +
                '<div class="summary-card sc-progress">' +
                    '<span class="sc-icon"><i class="fas fa-chart-line"></i></span>' +
                    '<div class="sc-label">پیشرفت اقساط</div>' +
                    '<div class="sc-value">' + progressPercent + '%</div>' +
                '</div>' +
                '<div class="summary-card sc-overdue" style="border-right-color: #8b5cf6;">' +
                    '<span class="sc-icon"><i class="fas fa-piggy-bank"></i></span>' +
                    '<div class="sc-label">وضعیت پس‌انداز</div>' +
                    '<div class="sc-value" style="color:' + (savingsStatusFromTx >= 0 ? '#10b981' : '#ef4444') + ';">' + fmtNum(Math.round(savingsStatusFromTx)) + '</div>' +
                '</div>' +
                '<div class="summary-card sc-overdue">' +
                    '<span class="sc-icon"><i class="fas fa-exclamation-triangle"></i></span>' +
                    '<div class="sc-label">اقساط معوقه</div>' +
                    '<div class="sc-value" style="color:' + (overdueInstallments > 0 ? '#ef4444' : '#10b981') + ';">' + overdueInstallments + '</div>' +
                '</div>' +
                '<div class="summary-card sc-overdue" style="border-right-color: #8b5cf6;">' +
                    '<span class="sc-icon"><i class="fas fa-users-clock"></i></span>' +
                    '<div class="sc-label">افراد در نوبت وام</div>' +
                    '<div class="sc-value" style="color:#8b5cf6;">' + waitingLoanCount + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    
    // ============================================================
    // تب‌ها - تب پیش‌فرض: overview
    // ============================================================
    var tabHtml = 
        '<div class="statement-tabs" role="tablist">' +
            '<button type="button" class="statement-tab active" data-statement-tab="overview" onclick="switchDashboardTab(\'overview\')">📊 حساب شما از یک نگاه</button>' +
            '<button type="button" class="statement-tab" data-statement-tab="allowance" onclick="switchDashboardTab(\'allowance\')">💰 مقرری و پس‌انداز</button>' +
            '<button type="button" class="statement-tab" data-statement-tab="loan" onclick="switchDashboardTab(\'loan\')">🏦 تسهیلات</button>' +
        '</div>';
    
    // ============================================================
    // اطلاعات وام
    // ============================================================
    var loanInfoHtml = 
        '<div class="dashboard-section" style="border-right-color:#ef4444;">' +
            '<h3><i class="fas fa-hand-holding-usd" style="color:#ef4444;"></i> اطلاعات کامل وام</h3>' +
            '<div class="loan-info">' +
                '<div class="loan-info-item"><div class="loan-info-label">شماره وام</div><div class="loan-info-value">' + esc(member.loanNumber || member.accountNumber || '---') + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">مبلغ وام مصوبه</div><div class="loan-info-value">' + (member.mabVam1 ? fmtNum(member.mabVam1) : '---') + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">مانده وام</div><div class="loan-info-value" style="color:#ef4444;">' + fmtNum(member.loanBalance || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">تعداد اقساط کل</div><div class="loan-info-value">' + (member.totalInstallments || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">پرداخت شده</div><div class="loan-info-value" style="color:#10b981;">' + (member.paidInstallments || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">مانده</div><div class="loan-info-value" style="color:#f59e0b;">' + (member.remainingInstallments || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">معوقه</div><div class="loan-info-value" style="color:#ef4444;">' + Math.abs(member.overdueInstallments || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">مبلغ هر قسط</div><div class="loan-info-value">' + (member.installmentAmount ? fmtNum(member.installmentAmount) : '---') + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">مقرری ماهانه</div><div class="loan-info-value">' + fmtNum(member.monthlySalary || 0) + '</div></div>' +
                '<div class="loan-info-item"><div class="loan-info-label">وضعیت پس‌انداز</div><div class="loan-info-value">' + fmtNum(Math.round(member.savingsStatus || 0)) + '</div></div>' +
            '</div>' +
        '</div>';
    
    // ============================================================
    // وضعیت
    // ============================================================
    var statusHtml = 
        '<div class="dashboard-section" style="border-right-color:' + paymentColor + ';">' +
            '<div style="display:flex;align-items:center;gap:12px;">' +
                '<span style="font-size:1.8rem;">' + (overdue > 0 ? '🔴' : (hasActiveLoan ? '🟡' : '🟢')) + '</span>' +
                '<div>' +
                    '<div style="font-weight:900;color:' + paymentColor + ';font-size:1.05rem;">' + paymentStatus + '</div>' +
                    '<div style="font-size:0.72rem;color:#888;margin-top:2px;">تعداد اقساط: ' + totalInstallments + ' | پرداخت شده: ' + paidInstallments + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    
    // ============================================================
    // مقرری و پس‌انداز
    // ============================================================
    var allowanceHtml = 
        '<div class="dashboard-section" style="border-right-color:#10b981;">' +
            '<h3><i class="fas fa-piggy-bank" style="color:#10b981;"></i> مقرری و پس‌انداز</h3>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value green">' + fmtNum(member.monthlySalary || 0) + '</div><div class="stat-label">مقرری ماهانه</div></div>' +
                '<div class="stat-card"><div class="stat-icon">🏦</div><div class="stat-value">' + fmtNum(Math.round(member.savingsStatus || 0)) + '</div><div class="stat-label">وضعیت پس‌انداز</div></div>' +
            '</div>' +
        '</div>';
    
    // ============================================================
    // تراکنش‌ها
    // ============================================================
    var txsHtml = 
        '<div class="dashboard-section">' +
            '<h3 style="font-size:0.9rem;"><i class="fas fa-file-invoice" style="color:#ec4899;"></i> تراکنش‌ها (' + memberTxns.length + ')</h3>' +
            '<div class="filter-bar" style="margin-top:8px;">' +
                '<input type="text" id="searchTx" placeholder="جستجو..." oninput="filterExcelTransactions()">' +
            '</div>' +
            '<div id="txExcelContainer"></div>' +
        '</div>';
    
    // رندر تراکنش‌ها
    setTimeout(function() {
        var container = document.getElementById('txExcelContainer');
        if (container) renderExcelTransactions(memberTxns, 'txExcelContainer');
    }, 200);
    
    // ============================================================
    // تابع تغییر تب
    // ============================================================
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
            if (c) renderExcelTransactions(memberTxns, 'txExcelContainer');
        }
    };
    
    // ============================================================
    // HTML نهایی
    // ============================================================
    return '<div id="dashboardStatementRoot">' +
        summaryBox +
        tabHtml +
        '<div class="statement-panel active" data-statement-panel="overview">' +
            statusHtml +
            '<div class="dashboard-section">' +
                '<h3><i class="fas fa-eye" style="color:#667eea;"></i> حساب شما از یک نگاه</h3>' +
                '<div class="stats-grid">' +
                    '<div class="stat-card"><div class="stat-icon">👤</div><div class="stat-value">' + esc(member.firstName || '---') + '</div><div class="stat-label">عضو</div></div>' +
                    '<div class="stat-card"><div class="stat-icon">🧾</div><div class="stat-value">' + memberTxns.length + '</div><div class="stat-label">تراکنش‌ها</div></div>' +
                    '<div class="stat-card"><div class="stat-icon">💳</div><div class="stat-value">' + fmtNum(balance) + '</div><div class="stat-label">موجودی</div></div>' +
                    '<div class="stat-card"><div class="stat-icon">📉</div><div class="stat-value red">' + fmtNum(member.loanBalance || 0) + '</div><div class="stat-label">بدهی</div></div>' +
                '</div>' +
            '</div>' +
            loanInfoHtml +
            allowanceHtml +
            txsHtml +
        '</div>' +
        '<div class="statement-panel" data-statement-panel="allowance">' +
            allowanceHtml +
            statusHtml +
        '</div>' +
        '<div class="statement-panel" data-statement-panel="loan">' +
            statusHtml +
            loanInfoHtml +
        '</div>' +
    '</div>';
}

// ============================================================
// رندر جدول تراکنش‌ها
// ============================================================
function renderExcelTransactions(txns, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    
    if (!txns || txns.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:12px;color:#888;font-size:0.8rem;">هیچ تراکنشی ثبت نشده</p>';
        return;
    }
    
    var uniqueTxns = [];
    var seenIds = {};
    txns.forEach(function(tx) {
        var id = tx['ID'] || '';
        if (!seenIds[id]) { 
            seenIds[id] = true; 
            uniqueTxns.push(tx); 
        }
    });
    
    var columns = [
        { key: 'ID', label: 'شناسه' },
        { key: 'تاریخ تراکنش', label: 'تاریخ' },
        { key: 'مبلغ تراکنش', label: 'مبلغ' },
        { key: 'موجودی', label: 'موجودی' },
        { key: 'مقرری ماهانه', label: 'مقرری' },
        { key: 'مانده وام', label: 'مانده وام' }
    ];
    
    var html = '<div class="excel-table-wrapper"><table class="excel-table"><thead><tr><th>فیلد</th>';
    uniqueTxns.slice(0, 30).forEach(function(tx, idx) {
        html += '<th>#' + (idx + 1) + '</th>';
    });
    html += '</tr></thead><tbody>';
    
    columns.forEach(function(col) {
        html += '<tr><td><strong>' + col.label + '</strong></td>';
        uniqueTxns.slice(0, 30).forEach(function(tx) {
            var value = tx[col.key];
            if (value === null || value === undefined || value === '') {
                value = '---';
            } else if (['مبلغ تراکنش', 'موجودی', 'مقرری ماهانه', 'مانده وام'].indexOf(col.key) > -1) {
                value = fmtNum(parseNum(value));
            }
            html += '<td>' + value + '</td>';
        });
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// ============================================================
// فیلتر تراکنش‌ها
// ============================================================
function filterExcelTransactions() {
    var searchInput = document.getElementById('searchTx');
    var search = searchInput ? searchInput.value.toLowerCase() : '';
    
    var member = members.find(function(m) { return m.id === currentUser.memberId; });
    var allTxns = (transactionsByMember.get(String(member ? member.id : '')) || [])
        .sort(function(a, b) { return (parseInt(b._transactionId) || 0) - (parseInt(a._transactionId) || 0); });
    
    if (!search) { 
        renderExcelTransactions(allTxns, 'txExcelContainer'); 
        return; 
    }
    
    var filtered = allTxns.filter(function(tx) {
        return Object.values(tx).some(function(val) {
            return String(val).toLowerCase().indexOf(search) > -1;
        });
    });
    renderExcelTransactions(filtered, 'txExcelContainer');
}

console.log('✅ dashboard.js نسخه 3.0 لود شد');
