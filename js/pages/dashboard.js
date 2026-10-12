/* ============================================================
   خلاصه حساب - فونت بزرگ، بولد و ریسپانسیو
   ============================================================ */

/* عنوان بخش */
.summary-section .summary-title {
    font-size: 1.5rem !important;
    font-weight: 900 !important;
    line-height: 1.8 !important;
    margin-bottom: 18px !important;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-primary);
}

/* چیدمان کارت‌ها */
.summary-section .summary-grid {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px !important;
}

/* ظاهر کارت‌ها */
.summary-section .summary-card {
    position: relative;
    min-width: 0 !important;
    padding: 18px 12px !important;
    border-radius: 16px !important;
    text-align: center !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    overflow: hidden;
    min-height: 120px;
}

.summary-section .summary-card::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: var(--card-accent, var(--gold-color, #f59e0b));
    border-radius: 0 16px 16px 0;
}

.summary-section .summary-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

/* رنگ اختصاصی هر کارت */
.summary-section .sc-balance { --card-accent: #10b981; }
.summary-section .sc-balance .sc-icon { background: rgba(16,185,129,0.15); }

.summary-section .sc-debt { --card-accent: #ef4444; }
.summary-section .sc-debt .sc-icon { background: rgba(239,68,68,0.15); }

.summary-section .sc-progress { --card-accent: #f59e0b; }
.summary-section .sc-progress .sc-icon { background: rgba(245,158,11,0.15); }

/* آیکن‌ها */
.summary-section .sc-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: rgba(255,255,255,0.08);
    font-size: 1.8rem !important;
    color: var(--card-accent, var(--gold-color, #f59e0b));
    flex-shrink: 0;
    margin-bottom: 4px !important;
}

/* لیبل‌ها */
.summary-section .sc-label {
    font-size: 1.05rem !important;
    font-weight: 800 !important;
    line-height: 1.6 !important;
    color: var(--text-secondary);
    overflow-wrap: anywhere !important;
    margin: 4px 0 !important;
}

/* اعداد اصلی - بزرگ و بولد */
.summary-section .sc-value {
    font-size: 1.8rem !important;
    font-weight: 900 !important;
    line-height: 1.5 !important;
    letter-spacing: -0.5px;
    color: var(--text-primary);
    overflow-wrap: anywhere !important;
    word-break: normal !important;
    font-variant-numeric: tabular-nums;
    max-width: 100%;
}

/* رنگ اعداد */
.summary-section .sc-value.sc-green { color: #10b981 !important; }
.summary-section .sc-value.sc-red { color: #ef4444 !important; }
.summary-section .sc-value.sc-purple { color: #8b5cf6 !important; }

/* نوار پیشرفت */
.summary-section .sc-progress-bar {
    width: 100%;
    height: 10px !important;
    background: rgba(255,255,255,0.1);
    border-radius: 10px !important;
    overflow: hidden !important;
    margin-top: 10px !important;
}

.summary-section .sc-progress-fill {
    height: 100% !important;
    background: linear-gradient(90deg, #f59e0b, #d97706);
    border-radius: 10px !important;
    transition: width 0.6s ease;
}

/* ============================================================
   هدر جدول تراکنش‌ها و نوار جستجو
   ============================================================ */

.tx-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
}

.tx-header-bar h3 {
    font-size: 1.1rem !important;
    font-weight: 800;
    margin: 0;
}

.tx-btn-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tx-btn-group .btn-small {
    font-size: 0.9rem !important;
    padding: 8px 16px !important;
    min-height: 40px !important;
    font-weight: 700;
}

.filter-bar input {
    font-size: 1rem !important;
    padding: 10px 14px !important;
    min-height: 42px !important;
    border-radius: 10px !important;
    flex: 1;
    min-width: 0;
}

.filter-bar button {
    font-size: 0.9rem !important;
    padding: 10px 16px !important;
    min-height: 42px !important;
    font-weight: 700;
}

/* ============================================================
   باکس پیامک - فونت خوانا
   ============================================================ */

.mini-sms-box-right {
    font-size: 1rem !important;
    line-height: 2 !important;
    padding: 12px 14px !important;
    background: rgba(20, 184, 166, 0.06);
    border-radius: 12px;
    border: 1px solid rgba(20, 184, 166, 0.15);
}

.mini-sms-box-right > div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 4px 0;
    border-bottom: 1px dashed rgba(255,255,255,0.06);
}

.mini-sms-box-right > div:last-child {
    border-bottom: none;
}

.mini-sms-box-right .sms-label {
    font-weight: 700 !important;
    color: var(--text-secondary);
    font-size: 0.95rem;
    flex-shrink: 0;
}

.mini-sms-box-right .sms-value {
    font-weight: 800 !important;
    color: var(--text-primary);
    font-size: 1rem;
    text-align: left;
    word-break: break-word;
    overflow-wrap: anywhere;
}

/* ============================================================
   اطلاعات وام - فونت بزرگ‌تر
   ============================================================ */

.loan-info-label {
    font-size: 1rem !important;
    font-weight: 700 !important;
    color: var(--text-secondary);
}

.loan-info-value {
    font-size: 1.05rem !important;
    font-weight: 800 !important;
}

/* مصوبات */
.approved-item .label {
    font-size: 1rem !important;
    font-weight: 700;
}

.approved-item .value {
    font-size: 1.05rem !important;
    font-weight: 900 !important;
}

/* کارت‌های آماری */
.stat-card .stat-value {
    font-size: 1.5rem !important;
    font-weight: 900 !important;
}

.stat-card .stat-label {
    font-size: 0.95rem !important;
    font-weight: 700 !important;
}

.stat-card .stat-icon {
    font-size: 1.6rem !important;
}

/* تب‌ها */
.statement-tab {
    font-size: 1rem !important;
    padding: 14px 16px !important;
    font-weight: 800 !important;
}

/* جدول‌ها */
.excel-table,
.mini-excel-wrapper table,
.installment-table-wrapper table {
    font-size: 0.95rem !important;
}

.excel-table th,
.excel-table td,
.mini-excel-wrapper th,
.mini-excel-wrapper td,
.installment-table-wrapper th,
.installment-table-wrapper td {
    padding: 12px 10px !important;
    font-size: 0.95rem !important;
}

/* عنوان بخش‌ها */
.dashboard-section h3 {
    font-size: 1.15rem !important;
    font-weight: 800 !important;
}

/* ============================================================
   تبلت
   ============================================================ */
@media (max-width: 900px) {
    .summary-section .summary-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 12px !important;
    }

    .summary-section .sc-value {
        font-size: 1.9rem !important;
    }
}

/* ============================================================
   موبایل
   ============================================================ */
@media (max-width: 600px) {
    .summary-section {
        padding: 14px !important;
    }

    .summary-section .summary-title {
        font-size: 1.4rem !important;
        margin-bottom: 16px !important;
    }

    .summary-section .summary-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 12px !important;
    }

    .summary-section .summary-card {
        padding: 18px 8px !important;
        min-height: 135px !important;
    }

    .summary-section .sc-label {
        font-size: 1.05rem !important;
        line-height: 1.9 !important;
        margin: 6px 0 !important;
    }

    .summary-section .sc-value {
        font-size: clamp(1.55rem, 6vw, 2rem) !important;
        font-weight: 900 !important;
        line-height: 1.8 !important;
    }

    .summary-section .sc-icon {
        font-size: 1.7rem !important;
        width: 44px;
        height: 44px;
    }

    .summary-section .sc-progress-bar {
        width: 90% !important;
        height: 10px !important;
    }

    /* جدول تراکنش‌ها */
    .tx-header-bar h3 {
        font-size: 1rem !important;
    }

    .tx-btn-group .btn-small {
        font-size: 0.85rem !important;
        padding: 8px 12px !important;
        min-height: 38px !important;
    }

    .filter-bar {
        flex-direction: column;
        gap: 8px;
    }

    .filter-bar input,
    .filter-bar button {
        width: 100% !important;
    }

    /* پیامک */
    .mini-sms-box-right {
        font-size: 0.95rem !important;
        padding: 10px 12px !important;
    }

    .mini-sms-box-right > div {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
    }

    .mini-sms-box-right .sms-value {
        text-align: right;
        width: 100%;
    }

    /* جدول‌ها */
    .excel-table th,
    .excel-table td,
    .mini-excel-wrapper th,
    .mini-excel-wrapper td,
    .installment-table-wrapper th,
    .installment-table-wrapper td {
        padding: 10px 8px !important;
        font-size: 0.9rem !important;
    }

    .statement-tab {
        font-size: 0.9rem !important;
        padding: 12px 10px !important;
    }
}

/* ============================================================
   گوشی‌های کوچک
   ============================================================ */
@media (max-width: 360px) {
    .summary-section .summary-grid {
        gap: 8px !important;
    }

    .summary-section .summary-card {
        padding: 14px 5px !important;
        min-height: 125px !important;
    }

    .summary-section .sc-label {
        font-size: 0.95rem !important;
    }

    .summary-section .sc-value {
        font-size: 1.45rem !important;
    }

    .summary-section .sc-icon {
        width: 40px;
        height: 40px;
        font-size: 1.5rem !important;
    }

    .statement-tab {
        font-size: 0.8rem !important;
        padding: 10px 6px !important;
    }
}
