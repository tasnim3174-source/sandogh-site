/* ============================================================
   صندوق اتحاد - توابع کمکی
   نسخه: 2.0
   ============================================================ */

// ===== توابع عددی =====
function parseNum(v) {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return v;
    let s = String(v).trim();
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';
    for (let i = 0; i < 10; i++) {
        s = s.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
    }
    let cleaned = '', hasDecimal = false;
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (char === '.' || char === '٫') {
            if (!hasDecimal) { cleaned += '.'; hasDecimal = true; }
        } else if (char === '-' && i === 0) {
            cleaned += '-';
        } else if (char >= '0' && char <= '9') {
            cleaned += char;
        }
    }
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

function fmtNum(n) {
    if (n === null || n === undefined || n === '') return '۰';
    const num = typeof n === 'number' ? n : parseNum(n);
    if (isNaN(num) || num === 0) return '۰';
    return new Intl.NumberFormat('fa-IR').format(num);
}

function esc(s) {
    if (s === null || s === undefined) return '';
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
}

// ===== توابع تاریخ و زمان =====
function getUpdateTime() {
    const time = localStorage.getItem('sandogh_data_time_v2');
    if (time) return new Date(parseInt(time)).toLocaleTimeString('fa-IR');
    return '---';
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'صبح بخیر';
    if (hour >= 12 && hour < 17) return 'ظهر بخیر';
    if (hour >= 17 && hour < 21) return 'عصر بخیر';
    return 'شب بخیر';
}

function getPersianDayName() {
    const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    return days[new Date().getDay()];
}

function getPersianToday() {
    var d = new Date();
    var fmt = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' });
    var p = fmt.formatToParts(d);
    var y = '', m = '', dd = '';
    p.forEach(function(x) {
        if (x.type === 'year') y = x.value;
        if (x.type === 'month') m = x.value.padStart(2, '0');
        if (x.type === 'day') dd = x.value.padStart(2, '0');
    });
    return { year: y, month: m, day: dd, full: y + '/' + m + '/' + dd };
}

function getTodayShamsi() {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const parts = formatter.formatToParts(today);
    let y = 0, m = 0, d = 0;
    parts.forEach(part => {
        if (part.type === 'year') y = parseInt(part.value);
        if (part.type === 'month') m = parseInt(part.value);
        if (part.type === 'day') d = parseInt(part.value);
    });
    return { y, m, d };
}

function shamsiDayNum(year, month, day) {
    const daysInMonth = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    let dayNum = 0;
    for (let m = 1; m < month; m++) {
        dayNum += daysInMonth[m];
    }
    dayNum += day;
    return dayNum;
}

function shamsiToContDays(jy, jm, jd) {
    jy = jy + 1595;
    var days = -355668 + (365 * jy) + (parseInt(jy / 33, 10) * 8) + parseInt(((jy % 33) + 3) / 4, 10) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    return days;
}

function calculateMembershipDuration(datMiladi) {
    if (!datMiladi) return 'نامشخص';
    const open = new Date(datMiladi);
    if (isNaN(open.getTime())) return 'نامشخص';
    const now = new Date();
    let years = now.getFullYear() - open.getFullYear();
    let months = now.getMonth() - open.getMonth();
    let days = now.getDate() - open.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    return years + ' سال، ' + months + ' ماه و ' + days + ' روز';
}

function calculateAgeShamsi(birthDateShamsi) {
    if (!birthDateShamsi) return 0;
    const parts = birthDateShamsi.split('/');
    if (parts.length !== 3) return 0;
    const birthYear = parseInt(parts[0]);
    const birthMonth = parseInt(parts[1]);
    const birthDay = parseInt(parts[2]);
    if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) return 0;
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const faParts = formatter.formatToParts(now);
    const currentYear = parseInt(faParts.find(p => p.type === 'year').value);
    const currentMonth = parseInt(faParts.find(p => p.type === 'month').value) || (now.getMonth() + 1);
    const currentDay = now.getDate();
    let age = currentYear - birthYear;
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
    }
    return age;
}

function addMonthsToJalali(jy, jm, jd, months) {
    let totalMonths = (jy * 12) + jm - 1 + months;
    let newYear = Math.floor(totalMonths / 12);
    let newMonth = (totalMonths % 12) + 1;
    if (newMonth > 12) { newYear++; newMonth -= 12; }
    const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
    const newDay = Math.min(jd, monthDays[newMonth - 1]);
    return { year: newYear, month: newMonth, day: newDay };
}

function generateInstallmentDates(loanDateShamsi, totalInstallments) {
    if (!loanDateShamsi) return [];
    const parts = String(loanDateShamsi).split('/');
    if (parts.length !== 3) return [];
    let a = parseInt(parts[0]), b = parseInt(parts[1]), c = parseInt(parts[2]);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return [];
    let jy, jm, jd;
    if (a > 31) { jy = a; jm = b; jd = c; }
    else if (c > 31) { jy = c; jm = a; jd = b; }
    else { jy = c; jm = a; jd = b; }
    if (jm < 1 || jm > 12 || jd < 1 || jd > 31) return [];
    const dates = [];
    for (let i = 1; i <= totalInstallments; i++) {
        const result = addMonthsToJalali(jy, jm, jd, i);
        const dateStr = String(result.year).padStart(4, '0') + '/' + String(result.month).padStart(2, '0') + '/' + String(result.day).padStart(2, '0');
        dates.push({ index: i, year: result.year, month: result.month, day: result.day, date: dateStr });
    }
    return dates;
}

// ===== توابع خانواده =====
function hasCouncilOrAdminAccess() {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    const member = members.find(m => m.id === currentUser?.memberId);
    return member && member.isCouncil === true;
}

function isHeadOfHousehold() {
    if (!currentUser || !currentUser.memberId) return false;
    const member = members.find(m => m.id === currentUser.memberId);
    return member && member.heh2 && String(member.heh2).trim() === '01';
}

function getFamilyMembers() {
    if (!currentUser || !currentUser.memberId) return [];
    const currentMember = members.find(m => m.id === currentUser.memberId);
    if (!currentMember || !currentMember.heh1) return [];
    return members.filter(m => m.heh1 === currentMember.heh1 && m.id !== currentUser.memberId);
}

function getFamilyRole(heh2) {
    if (!heh2) return null;
    const code = String(heh2).trim();
    if (code === '01') return { role: 'head', label: 'سرپرست خانوار', icon: 'fa-crown' };
    if (code === '02') return { role: 'spouse', label: 'همسر', icon: 'fa-ring' };
    if (parseInt(code) >= 3) return { role: 'child', label: 'فرزند', icon: 'fa-child' };
    return null;
}

function isTeenager(member) {
    const age = calculateAgeShamsi(member.birthDateShamsi);
    return age >= 10 && age <= 18;
}

function isFemale(member) {
    if (member.heh2 === '02') return true;
    if (member.heh2 >= 3 && member.heh2 <= 10) {
        const femaleNames = ['فاطمه','زهرا','مریم','زینب','حدیث','هانیه','ریحانه','نرگس','سارا','یاسمن','یاسمین','مهسا','مهناز','ناهید','مینا','لیلا','نگار','نازنین','الهام','شیدا','شیما','پریسا','پریا','ترانه','نگین','آیدا','آرزو','آتنا','آیسان','آیسا','ستایش','درسا','درنا','غزل','رها','روژان','رویا','سارینا','سلین','سوگند','شایلا','شکیلا','شقایق','شهرزاد','طراحی','عسل','کیانا','کیمیا','گیسو','ملیکا','مانلی','مهتاب','مهشید','ملورین'];
        return femaleNames.some(name => member.firstName.includes(name));
    }
    return false;
}

// ===== توابع اکسل =====
function findCol(names, headers) {
    for (const n of names) {
        const nn = n.toLowerCase().replace(/[_\s\-]/g, '');
        for (const h of headers) {
            if (h.toLowerCase().replace(/[_\s\-]/g, '') === nn) return h;
        }
    }
    for (const n of names) {
        const nn = n.toLowerCase().replace(/[_\s\-]/g, '');
        if (nn.length < 3) continue;
        for (const h of headers) {
            if (h.toLowerCase().replace(/[_\s\-]/g, '').includes(nn)) return h;
        }
    }
    return null;
}

function parseBool(v) {
    if (v === null || v === undefined || v === '') return false;
    if (typeof v === 'number') return v === 1 || v === -1;
    const s = String(v).trim().toLowerCase();
    if (s === '1' || s === '-1') return true;
    if (s === '0') return false;
    return ['true', 'yes', 'فعال', 'بله', '✓', '✅', 'on'].includes(s);
}

// ===== توابع امتیاز =====
function calculateMemberScore(member) {
    let score = 0;
    const totalInstallments = member.totalInstallments || 0;
    const paidInstallments = member.paidInstallments || 0;
    const overdueInstallments = Math.abs(member.overdueInstallments || 0);
    const monthlySalary = member.monthlySalary || 1;
    const savings = member.savingsStatus || 0;
    const balance = member.balance || 0;

    let installmentScore = 0;
    if (totalInstallments > 0) {
        const payRatio = paidInstallments / totalInstallments;
        installmentScore = payRatio * 30;
        installmentScore = Math.max(0, installmentScore - (overdueInstallments * 4));
        if (overdueInstallments === 0 && paidInstallments > 0) {
            installmentScore = Math.min(30, installmentScore + 5);
        }
    } else {
        installmentScore = 15;
    }
    installmentScore = Math.max(0, Math.min(30, installmentScore));

    let savingsScore = 0;
    if (savings > 0) {
        const savingsRatio = Math.min(savings / monthlySalary, 6) / 6;
        savingsScore = savingsRatio * 30;
    }
    savingsScore = Math.max(0, Math.min(30, savingsScore));

    let balanceScore = 0;
    if (balance > 0) {
        const balanceRatio = Math.min(balance / (monthlySalary * 3), 1);
        balanceScore = balanceRatio * 20;
    }
    balanceScore = Math.max(0, Math.min(20, balanceScore));

    const coins = getMemberCoins(member.id);
    let coinsScore = Math.min(coins / 50, 1) * 10;
    const txCount = transactions.filter(t => String(t._memberId) === String(member.id)).length;
    let activityScore = Math.min(txCount / 10, 1) * 10;
    const activityTotal = Math.max(0, Math.min(20, coinsScore + activityScore));

    score = Math.round(Math.max(0, Math.min(100, installmentScore + savingsScore + balanceScore + activityTotal)));

    let tier, tierName, tierEmoji;
    const goldEligible = checkGoldConditions(member);
    if (goldEligible) {
        if (score < 80) score = 80;
        tier = 'gold'; tierName = 'طلایی'; tierEmoji = '⭐';
    } else if (score >= 50) {
        tier = 'silver'; tierName = 'نقره‌ای'; tierEmoji = '🥈';
    } else {
        tier = 'black'; tierName = 'سیاه'; tierEmoji = '⚫';
    }
    return { score, tier, tierName, tierEmoji };
}

function checkGoldConditions(member) {
    if (Math.abs(member.overdueInstallments || 0) > 0) return false;

    var allMonths = [];
    transactions.forEach(function(t) {
        var d = String(t['تاریخ تراکنش'] || '');
        if (d.length >= 6) allMonths.push(d.substring(0, 6));
    });
    if (allMonths.length === 0) return false;
    allMonths.sort();
    var lastRegisteredMonth = allMonths[allMonths.length - 1];

    var memberTxns = transactions.filter(function(t) { return String(t._memberId) === String(member.id); });
    if (memberTxns.length === 0) return false;

    var hasSalaryInLastMonth = memberTxns.some(function(t) {
        var d = String(t['تاریخ تراکنش'] || '');
        return d.length >= 6 && d.substring(0, 6) === lastRegisteredMonth && (parseInt(t['مقرری ماهانه']) || 0) > 0;
    });
    if (!hasSalaryInLastMonth) return false;

    var sortedTxns = memberTxns.slice().sort(function(a, b) { return (parseInt(b._transactionId) || 0) - (parseInt(a._transactionId) || 0); });
    var lastTxn = sortedTxns[0];
    var realBalance = lastTxn ? (parseInt(lastTxn['موجودی']) || 0) : 0;
    var requiredBalance = parseFloat(member.currentMonthBalance) || 0;
    if (requiredBalance > 0 && realBalance < requiredBalance) return false;

    var hasLoan = (parseInt(member.totalInstallments) || 0) > 0 || (parseFloat(member.mabVam1) || 0) > 0;
    var loanCompleted = hasLoan && (parseInt(member.paidInstallments) || 0) >= (parseInt(member.totalInstallments) || 0);

    if (!hasLoan || loanCompleted) {
        return true;
    }

    var paidInstallments = parseInt(member.paidInstallments) || 0;
    var totalInstallments = parseInt(member.totalInstallments) || 0;
    if (totalInstallments > 0 && member.loanReceiveDate) {
        try {
            var instDates = generateInstallmentDates(member.loanReceiveDate, totalInstallments);
            var now = new Date();
            var jy, jm, jd;
            try {
                var j = toJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
                jy = j.jy; jm = j.jm; jd = j.jd;
            } catch(e) {
                var fmt = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {year:'numeric',month:'2-digit',day:'2-digit'});
                var parts = fmt.format(now).split('/');
                jy = parseInt(parts[0]); jm = parseInt(parts[1]); jd = parseInt(parts[2]);
            }
            var currentDayNum = shamsiDayNum(jy, jm, jd);
            var expectedByNow = instDates.filter(function(d) { return shamsiDayNum(d.year, d.month, d.day) <= currentDayNum; }).length;
            if (paidInstallments < expectedByNow) return false;
        } catch(e) {}
    }

    return true;
}

function getMemberRealBalance(memberId) {
    const txns = (transactionsByMember.get(String(memberId)) || [])
        .sort((a, b) => (parseInt(b._transactionId) || 0) - (parseInt(a._transactionId) || 0));
    if (txns.length > 0) {
        return parseFloat(txns[0]['موجودی']) || 0;
    }
    const m = members.find(x => x.id === memberId);
    return m ? (m.balance || 0) : 0;
}

function computeFamilyScores() {
    if (!members || members.length === 0) return [];
    const families = {};
    members.forEach(m => {
        if (!m.heh1) return;
        if (!families[m.heh1]) {
            families[m.heh1] = [];
        }
        families[m.heh1].push(m);
    });

    const familyScores = [];
    Object.keys(families).forEach(famCode => {
        const famMembers = families[famCode];
        let totalScore = 0;
        let count = 0;
        famMembers.forEach(m => {
            const sd = memberScores ? memberScores[m.id] : null;
            if (sd && typeof sd.score === 'number') {
                totalScore += sd.score;
                count++;
            }
        });
        if (count > 0) {
            const avgScore = Math.round(totalScore / count);
            familyScores.push({
                code: famCode,
                score: avgScore,
                memberCount: count
            });
        }
    });
    familyScores.sort((a, b) => b.score - a.score);
    return familyScores;
}

// ===== توابع سکه =====
function getMemberCoins(memberId) {
    try { return parseInt(localStorage.getItem('sandogh_coins_' + memberId)) || 0; } catch (e) { return 0; }
}

function getMemberPurchases(memberId) {
    try { return JSON.parse(localStorage.getItem('sandogh_purchases_' + memberId)) || []; } catch (e) { return []; }
}

// ===== توابع لودر =====
function ldrFa(n) { return new Intl.NumberFormat('fa-IR').format(n); }

// ===== توابع تقویم =====
function utJalaliToGregorian(jy, jm, jd) {
    jy += 1595;
    let days = -355668 + (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    let gy = 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) { gy += 100 * Math.floor(--days / 36524); days %= 36524; if (days >= 365) days++; }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) { gy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
    let gd = days + 1;
    const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm;
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    return { gy: gy, gm: gm, gd: gd };
}

function utJalaliMonthDays(jy, jm) {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    const a = utJalaliToGregorian(jy, 12, 1);
    const b = utJalaliToGregorian(jy + 1, 1, 1);
    return Math.round((Date.UTC(b.gy, b.gm - 1, b.gd) - Date.UTC(a.gy, a.gm - 1, a.gd)) / 86400000);
}

function utJalaliWeekday(jy, jm, jd) {
    const g = utJalaliToGregorian(jy, jm, jd);
    return (new Date(g.gy, g.gm - 1, g.gd).getDay() + 1) % 7;
}

function utDayOfYear(jm, jd) {
    const md = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    let s = 0;
    for (let i = 1; i < jm; i++) s += md[i];
    return s + jd;
}

function utFaDigits(s) {
    return String(s).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
}

// ===== توابع کمکی UI =====
function togglePassword(targetId, iconId) {
    const target = document.getElementById(targetId);
    const icon = document.getElementById(iconId);
    if (!target || !icon) return;
    if (target.tagName === 'INPUT') {
        if (target.type === 'password') {
            target.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            target.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = 'کپی شد';
        setTimeout(() => { btn.innerHTML = 'کپی'; }, 2000);
    });
}
