/* ============================================================
   صندوق اتحاد - گزارش‌گیری پیشرفته
   نسخه: 2.0
   ============================================================ */

function renderReportsContent() {
    if (!hasCouncilOrAdminAccess()) {
        return `
            <div class="info-box"><i class="fas fa-lock"></i> دسترسی محدود</div>
            <div class="dashboard-section" style="text-align:center;padding:30px;">
                <i class="fas fa-lock" style="font-size:2.4rem;color:#e53e3e;margin-bottom:12px;"></i>
                <p style="color:var(--text-secondary);font-size:0.9rem;">فقط اعضای شورا و مدیر دسترسی دارند</p>
            </div>
        `;
    }

    const totalMembers = members.length;
    const totalTransactions = transactions.length;
    const totalBalanceSum = members.reduce((sum, m) => sum + (m.balance || 0), 0);
    const totalLoanSum = members.reduce((sum, m) => sum + (m.loanBalance || 0), 0);
    const totalSavings = members.reduce((sum, m) => sum + (m.savingsStatus || 0), 0);
    const totalOverdue = members.reduce((sum, m) => sum + Math.abs(m.overdueInstallments || 0), 0);
    const membersWithLoan = members.filter(m => (m.loanBalance > 0) || (m.loanReceivedAmount > 0)).length;
    const totalPaidInstallments = members.reduce((sum, m) => sum + (m.paidInstallments || 0), 0);
    const totalRemainingInstallments = members.reduce((sum, m) => sum + (m.remainingInstallments || 0), 0);

    const topMembers = [...members]
        .sort((a, b) => (memberScores[b.id]?.score || 0) - (memberScores[a.id]?.score || 0))
        .slice(0, 5);

    return `
        <div class="info-box" style="background:linear-gradient(135deg,#8b5cf615,#6d28d915);border-right-color:#8b5cf6;">
            <i class="fas fa-file-alt" style="color:#8b5cf6;"></i> گزارش‌گیری پیشرفته
            <span style="font-size:0.65rem;color:var(--text-secondary);margin-right:8px;">| آخرین بروزرسانی: ${getUpdateTime()}</span>
        </div>

        <div class="report-summary">
            <div class="summary-card" style="border-color:var(--success-color);">
                <div class="summary-value" style="color:var(--success-color);">${fmtNum(totalMembers)}</div>
                <div class="summary-label">کل اعضا</div>
            </div>
            <div class="summary-card" style="border-color:var(--gold-color);">
                <div class="summary-value" style="color:var(--gold-color);">${fmtNum(totalTransactions)}</div>
                <div class="summary-label">کل تراکنش‌ها</div>
            </div>
            <div class="summary-card" style="border-color:var(--purple-color);">
                <div class="summary-value" style="color:var(--purple-color);">${fmtNum(membersWithLoan)}</div>
                <div class="summary-label">دارای وام</div>
            </div>
            <div class="summary-card" style="border-color:var(--danger-color);">
                <div class="summary-value" style="color:var(--danger-color);">${fmtNum(totalOverdue)}</div>
                <div class="summary-label">جمع معوقه</div>
            </div>
            <div class="summary-card" style="border-color:var(--blue-color);">
                <div class="summary-value" style="color:var(--blue-color);">${fmtNum(totalBalanceSum)}</div>
                <div class="summary-label">جمع موجودی</div>
            </div>
            <div class="summary-card" style="border-color:var(--teal-color);">
                <div class="summary-value" style="color:var(--teal-color);">${fmtNum(totalLoanSum)}</div>
                <div class="summary-label">جمع وام</div>
            </div>
            <div class="summary-card" style="border-color:var(--gold-color);">
                <div class="summary-value" style="color:var(--gold-color);">${fmtNum(totalPaidInstallments)}</div>
                <div class="summary-label">جمع اقساط پرداختی</div>
            </div>
            <div class="summary-card" style="border-color:var(--orange-color);">
                <div class="summary-value" style="color:var(--orange-color);">${fmtNum(totalRemainingInstallments)}</div>
                <div class="summary-label">جمع اقساط باقیمانده</div>
            </div>
        </div>

        <div class="chart-grid">
            <div class="dashboard-section" style="border-right-color:#4facfe;">
                <h3 style="font-size:0.85rem;margin-bottom:8px;"><i class="fas fa-chart-pie" style="color:#4facfe;"></i> توزیع اعضا بر اساس رتبه</h3>
                <div class="chart-container" style="height:200px;">
                    <canvas id="rankDistributionChart"></canvas>
                </div>
            </div>
            <div class="dashboard-section" style="border-right-color:#f093fb;">
                <h3 style="font-size:0.85rem;margin-bottom:8px;"><i class="fas fa-chart-bar" style="color:#f093fb;"></i> ۵ عضو برتر</h3>
                <div class="chart-container" style="height:200px;">
                    <canvas id="topMembersChart"></canvas>
                </div>
            </div>
        </div>

        <div class="dashboard-section" style="border-right-color:var(--gold-color);">
            <h3><i class="fas fa-trophy" style="color:var(--gold-color);"></i> اعضای برتر صندوق</h3>
            <div style="overflow-x:auto;">
                <table class="access-table" style="min-width:400px;font-size:0.6rem;">
                    <thead>
                        <tr><th>رتبه</th><th>نام</th><th>امتیاز</th><th>رتبه</th><th>تعداد تراکنش</th></tr>
                    </thead>
                    <tbody>
                        ${topMembers.map((m, idx) => {
                            const sd = memberScores[m.id];
                            const tierEmoji = sd?.tier === 'gold' ? '⭐' : sd?.tier === 'silver' ? '🥈' : '⚫';
                            const tierColor = sd?.tier === 'gold' ? '#FFD700' : sd?.tier === 'silver' ? '#C0C0C0' : '#6B7280';
                            const txCount = transactions.filter(t => String(t._memberId) === String(m.id)).length;
                            return `
                                <tr>
                                    <td style="font-weight:bold;font-size:0.55rem;">${idx + 1}</td>
                                    <td style="font-size:0.55rem;">${esc(m.firstName)}</td>
                                    <td style="color:var(--gold-color);font-size:0.55rem;font-weight:bold;">${sd?.score || 0}</td>
                                    <td><span style="background:${tierColor};color:#fff;padding:0.5px 1px;border-radius:12px;font-size:0.45rem;">${tierEmoji} ${sd?.tierName || ''}</span></td>
                                    <td style="font-size:0.5rem;">${txCount}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
