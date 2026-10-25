/* ============================================================
   صندوق اتحاد - بارگذاری داده از اکسل
   نسخه: 4.1 (بدون کش + محاسبه بر اساس بزرگترین ID + فیلدهای پیامکی)
   ============================================================ */

// ============================================================
// توابع کمکی کش کاربران
// ============================================================
function saveUsersToCache(usersList) { 
    try { 
        localStorage.setItem('sandogh_users_cache', JSON.stringify({ version: 1, timestamp: Date.now(), users: usersList })); 
    } catch (e) {} 
}
function loadUsersFromCache() { 
    try { 
        const c = localStorage.getItem('sandogh_users_cache'); 
        if (!c) return null; 
        const d = JSON.parse(c); 
        if (Date.now() - (d.timestamp || 0) > 24*60*60*1000) return null; 
        return d.users; 
    } catch (e) { 
        return null; 
    } 
}
function clearUsersCache() { 
    try { localStorage.removeItem('sandogh_users_cache'); } catch (e) {} 
}

// ============================================================
// خواندن فایل اکسل از گیت‌هاب
// ============================================================
async function parseOneExcelFile(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const finalUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
        const response = await fetch(finalUrl, { cache: 'no-cache', signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) throw new Error('خطای سرور: ' + response.status);

        const arrayBuffer = await response.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const sh = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sh, { defval: '', raw: false });

        if (!rows.length) return { members: [], transactions: [], users: [] };

        const headers = Object.keys(rows[0]);
        
        if (url === DATA_URL && rows.length > 0) {
            const firstRow = rows[0];
            const supportPhone = findCol(['telepon', 'تلفن', 'شماره تماس'], headers);
            if (supportPhone) SUPPORT_INFO.phone = String(firstRow[supportPhone] || '').trim();
            const supportAccount = findCol(['shomareh hasab', 'شماره حساب صندوق', 'شماره حساب'], headers);
            if (supportAccount) SUPPORT_INFO.accountNumber = String(firstRow[supportAccount] || '').trim();
            const supportCard = findCol(['shomareh kart', 'شماره کارت صندوق', 'شماره کارت', 'card'], headers);
            if (supportCard) SUPPORT_INFO.cardNumber = String(firstRow[supportCard] || '').trim();
            const supportSheba = findCol(['adress', 'شماره شبا صندوق', 'شماره شبا', 'sheba', 'شبا'], headers);
            if (supportSheba) SUPPORT_INFO.shebaNumber = String(firstRow[supportSheba] || '').trim();
            const supportWebsite = findCol(['web site', 'وب سایت', 'website', 'سایت'], headers);
            if (supportWebsite) SUPPORT_INFO.websiteAddress = String(firstRow[supportWebsite] || '').trim();
            const systemMessage = findCol(['پیام سیستم', 'system message', 'message', 'پیام'], headers);
            if (systemMessage) SYSTEM_MESSAGE = String(firstRow[systemMessage] || '').trim();
        }

        const colMap = {
            accountNumber: findCol(['شماره حساب'], headers),
            name: findCol(['name', 'نام'], headers),
            phone: findCol(['phone', 'تلفن', 'تلفن 1'], headers),
            phone2: findCol(['phone2', 'تلفن2', 'تلفن 2'], headers),
            balance: findCol(['موجودی'], headers),
            savingsStatus: findCol(['وضعیت پس انداز'], headers),
            loanBalanceCol: findCol(['مانده وام'], headers),
            paidInstallments: findCol(['paidinstallments', 'تعداد قسط پرداخت شده'], headers),
            overdueInstallments: findCol(['overdueinstallments', 'تعداد قسط معوقه'], headers),
            remainingInstallments: findCol(['remaininginstallments', 'تعداد قسط مانده'], headers),
            monthlySalary: findCol(['monthlysalary', 'مقرری ماهانه'], headers),
            monthlySalaryApproved: findCol(['مقرری ماهانه مصوب'], headers),
            openDate: findCol(['date ozviyat', 'تاریخ عضویت'], headers),
            datMiladi: findCol(['dat miladi', 'تاریخ میلادی'], headers),
            dateBirth: findCol(['date birth'], headers),
            transactionDate: findCol(['transactiondate', 'تاریخ تراکنش'], headers),
            amount: findCol(['amount', 'مبلغ تراکنش'], headers),
            fishNumber: findCol(['fishnumber', 'شماره فیش'], headers),
            transactionName: findCol(['transactionname', 'نام تراکنش کننده'], headers),
            description: findCol(['description', 'توضیحات'], headers),
            installmentAmountTx: findCol(['مبلغ قسط واریزی'], headers),
            installmentDateTx: findCol(['تاریخ قسط واریزی'], headers),
            total: findCol(['total', 'جمع واریزی'], headers),
            active: findCol(['active'], headers),
            kodOmomi: findCol(['kod omomi'], headers),
            kodOverdue: findCol(['kod'], headers),
            noVam: findCol(['no vam', 'شماره وام'], headers),
            shenaseh: findCol(['shenaseh'], headers),
            namemahsool: findCol(['namemahsool'], headers),
            tozihmahsool: findCol(['tozihmahsool'], headers),
            price: findCol(['price'], headers),
            mojodiSekeh: findCol(['mojodi sekeh'], headers),
            karbari: findCol(['karbari', 'کاربری', 'username'], headers),
            ramz: findCol(['ramz', 'رمز', 'password'], headers),
            heh1: findCol(['heh1', 'کد خانوار'], headers),
            heh2: findCol(['heh2', 'نقش خانوار'], headers),
            mabVam1: findCol(['mab vam1', 'مبلغ وام مصوبه'], headers),
            tedad: findCol(['tedad', 'تعداد اقساط مصوبه'], headers),
            lock: findCol(['lock', 'قفل'], headers),
            mojodiTaInLahzeh: findCol(['mojodi ta in lahzeh'], headers),
            mablaghVamReceived: findCol(['mablagh vam', 'مبلغ وام دریافتی'], headers),
            dateSabt: findCol(['date sabt', 'تاریخ ثبت'], headers),
            dateVam: findCol(['date vam', 'تاریخ وام'], headers),
            akharinGhest: findCol(['akharin ghest', 'آخرین قسط'], headers),
            mablaghHarGhest: findCol(['mablagh har ghest', 'مبلغ هر قسط'], headers),
            mablaghKarmozd: findCol(['mablagh karmozd', 'مبلغ کارمزد'], headers),
            tedadAghsat: findCol(['tedad aghsat', 'تعداد اقساط'], headers),
            loanBalanceO: findCol(['ooooooo', 'مانده وام', 'loan balance'], headers),
            id: findCol(['ID', 'id'], headers),
            kodSarparast: findCol(['kod sarparast'], headers),
            kodMoavaghe: findCol(['kod moavaghe'], headers),
            kodMosabegheh: findCol(['kod mosabegheh'], headers),
            kodKhabarnameh: findCol(['kod khabarnameh'], headers),
            kodTavalod: findCol(['kod tavalod'], headers),
            kodMonasebat: findCol(['kod monasebat'], headers),
            waitingLoan: findCol(['CountOfdate ersal payamak vam', 'تعداد افراد در نوبت وام', 'waiting loan', 'نوبت وام'], headers),
            smsActive: findCol(['پیامک واریز', 'smsActive'], headers)
        };

        if (url === DATA_URL) {
            let waitingLoanCount = 0;
            if (rows.length > 0 && colMap.waitingLoan) {
                waitingLoanCount = parseInt(rows[0][colMap.waitingLoan]) || 0;
            }
            window.WAITING_LOAN_COUNT = waitingLoanCount;
        }

        const membersMap = new Map();
        const txs = [];
        const latestTxByAcc = new Map();

        rows.forEach((row, index) => {
            const accNum = String(row[colMap.accountNumber] || '').trim();
            if (!accNum) return;

            const rowId = colMap.id ? String(row[colMap.id] || '') : String(index + 1);
            const txIdNum = parseInt(rowId) || 0;

            const tx = {
                'ID': rowId,
                'شماره حساب': accNum,
                'مقرری ماهانه': colMap.monthlySalary ? parseNum(row[colMap.monthlySalary]) : 0,
                'شماره فیش': colMap.fishNumber ? String(row[colMap.fishNumber] || '') : '',
                'تاریخ تراکنش': colMap.transactionDate ? String(row[colMap.transactionDate] || '') : '',
                'مبلغ تراکنش': colMap.amount ? parseNum(row[colMap.amount]) : 0,
                'نام تراکنش کننده': colMap.transactionName ? String(row[colMap.transactionName] || '') : '',
                'مبلغ قسط واریزی': colMap.installmentAmountTx ? parseNum(row[colMap.installmentAmountTx]) : 0,
                'تاریخ قسط واریزی': colMap.installmentDateTx ? String(row[colMap.installmentDateTx] || '') : '',
                'جمع واریزی': colMap.total ? parseNum(row[colMap.total]) : 0,
                'موجودی': colMap.balance ? parseNum(row[colMap.balance]) : 0,
                'تعداد قسط پرداخت شده': colMap.paidInstallments ? parseNum(row[colMap.paidInstallments]) : 0,
                'تعداد قسط مانده': colMap.remainingInstallments ? parseNum(row[colMap.remainingInstallments]) : 0,
                'وضعیت پس انداز': colMap.savingsStatus ? parseNum(row[colMap.savingsStatus]) : 0,
                'مانده وام': colMap.loanBalanceO ? parseNum(row[colMap.loanBalanceO]) : (colMap.loanBalanceCol ? parseNum(row[colMap.loanBalanceCol]) : 0),
                _transactionId: rowId,
                _amount: colMap.amount ? parseNum(row[colMap.amount]) : 0,
                smsActive: colMap.smsActive ? parseBool(row[colMap.smsActive]) : false,
                smsOmomi: colMap.kodOmomi ? parseBool(row[colMap.kodOmomi]) : false,
                smsKod: colMap.kodOverdue ? parseBool(row[colMap.kodOverdue]) : false,
                smsSarparast: colMap.kodSarparast ? parseBool(row[colMap.kodSarparast]) : false,
                smsMoavaghe: colMap.kodMoavaghe ? parseBool(row[colMap.kodMoavaghe]) : false,
                smsMosabegheh: colMap.kodMosabegheh ? parseBool(row[colMap.kodMosabegheh]) : false,
                smsKhabarnameh: colMap.kodKhabarnameh ? parseBool(row[colMap.kodKhabarnameh]) : false,
                smsTavalod: colMap.kodTavalod ? parseBool(row[colMap.kodTavalod]) : false,
                smsMonasebat: colMap.kodMonasebat ? parseBool(row[colMap.kodMonasebat]) : false
            };
            txs.push(tx);

            const existingLatest = latestTxByAcc.get(accNum);
            if (!existingLatest || txIdNum > existingLatest.idNum) {
                latestTxByAcc.set(accNum, { idNum: txIdNum, tx: tx, row: row });
            }
        });

        latestTxByAcc.forEach((data, accNum) => {
            const row = data.row;
            const memberId = membersMap.size + 1;
            
            const isCouncil = colMap.kodOverdue ? parseBool(row[colMap.kodOverdue]) : false;
            const karbari = colMap.karbari ? String(row[colMap.karbari] || '').trim() : '';
            const ramz = colMap.ramz ? String(row[colMap.ramz] || '').trim() : '';
            const heh1 = colMap.heh1 ? String(row[colMap.heh1] || '').trim() : '';
            const heh2 = colMap.heh2 ? String(row[colMap.heh2] || '').trim() : '';

            membersMap.set(accNum, {
                id: memberId,
                firstName: colMap.name ? String(row[colMap.name] || '').trim() : '',
                accountNumber: accNum,
                phone1: colMap.phone ? String(row[colMap.phone] || '').trim() : '',
                phone2: colMap.phone2 ? String(row[colMap.phone2] || '').trim() : '',
                openDate: colMap.openDate ? String(row[colMap.openDate] || '').trim() : '',
                datMiladi: colMap.datMiladi ? String(row[colMap.datMiladi] || '').trim() : '',
                birthDateShamsi: colMap.dateBirth ? String(row[colMap.dateBirth] || '').trim() : '',
                active: colMap.active ? parseBool(row[colMap.active]) : true,
                balance: data.tx['موجودی'],
                currentMonthBalance: colMap.mojodiTaInLahzeh ? parseNum(row[colMap.mojodiTaInLahzeh]) : 0,
                savingsStatus: data.tx['وضعیت پس انداز'],
                loanReceivedAmount: colMap.mablaghVamReceived ? parseNum(row[colMap.mablaghVamReceived]) : 0,
                loanBalance: data.tx['مانده وام'],
                paidInstallments: data.tx['تعداد قسط پرداخت شده'],
                overdueInstallments: colMap.overdueInstallments ? parseNum(row[colMap.overdueInstallments]) : 0,
                remainingInstallments: data.tx['تعداد قسط مانده'],
                monthlySalary: data.tx['مقرری ماهانه'],
                monthlySalaryApproved: colMap.monthlySalaryApproved ? parseNum(row[colMap.monthlySalaryApproved]) : 0,
                loanRequestDate: colMap.dateSabt ? String(row[colMap.dateSabt] || '').trim() : '',
                loanReceiveDate: colMap.dateVam ? String(row[colMap.dateVam] || '').trim() : '',
                lastInstallmentDate: colMap.akharinGhest ? String(row[colMap.akharinGhest] || '').trim() : '',
                installmentAmount: colMap.mablaghHarGhest ? parseNum(row[colMap.mablaghHarGhest]) : 0,
                feeAmount: colMap.mablaghKarmozd ? parseNum(row[colMap.mablaghKarmozd]) : 0,
                totalInstallments: colMap.tedadAghsat ? parseNum(row[colMap.tedadAghsat]) : 0,
                loanNumber: colMap.noVam ? String(row[colMap.noVam] || '').trim() : accNum,
                isCouncil: isCouncil,
                karbari: karbari,
                ramz: ramz,
                heh1: heh1,
                heh2: heh2,
                mabVam1: colMap.mabVam1 ? parseNum(row[colMap.mabVam1]) : 0,
                tedad: colMap.tedad ? parseNum(row[colMap.tedad]) : 0,
                isLocked: colMap.lock ? parseBool(row[colMap.lock]) : false,
                smsActive: data.tx.smsActive,
                smsOmomi: data.tx.smsOmomi,
                smsKod: data.tx.smsKod,
                smsSarparast: data.tx.smsSarparast,
                smsMoavaghe: data.tx.smsMoavaghe,
                smsMosabegheh: data.tx.smsMosabegheh,
                smsKhabarnameh: data.tx.smsKhabarnameh,
                smsTavalod: data.tx.smsTavalod,
                smsMonasebat: data.tx.smsMonasebat
            });
        });

        const membersArr = Array.from(membersMap.values());
        
        const accToIdMap = new Map();
        membersArr.forEach(m => accToIdMap.set(m.accountNumber, m.id));
        txs.forEach(tx => {
            tx._memberId = accToIdMap.get(tx['شماره حساب']) || 0;
        });

        const usersArr = membersArr.map(m => {
            const username = (m.karbari && m.karbari.trim() !== '') ? m.karbari.trim() : m.accountNumber;
            const password = (m.ramz && m.ramz.trim() !== '') ? m.ramz.trim() : m.accountNumber;
            return { id: m.id, username, password, role: m.isCouncil ? 'council' : 'member', memberId: username };
        });
        if (url === DATA_URL) {
            usersArr.push({ id: 999, username: 'admin', password: 'admin123', role: 'admin', memberId: null });
        }

        return { members: membersArr, transactions: txs, users: usersArr };

    } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') throw new Error('زمان بارگذاری به پایان رسید: ' + url);
        throw error;
    }
}

// ============================================================
// بارگذاری فایل data1
// ============================================================
async function loadFile1Smart() {
    try {
        const result = await parseOneExcelFile(DATA_URL_1);
        if (result && result.members && result.members.length > 0) {
            return { source: 'GitHub', data: result };
        }
    } catch (err) {
        console.warn('⚠️ گیت‌هاب ناموفق بود:', err.message);
    }
    return { source: 'None', data: { members: [], transactions: [], users: [] } };
}

// ============================================================
// ادغام دو فایل اکسل
// ============================================================
async function loadMainData() {
    if (typeof XLSX === 'undefined') {
        await new Promise(resolve => {
            const check = setInterval(() => { if (typeof XLSX !== 'undefined') { clearInterval(check); resolve(); } }, 200);
            setTimeout(() => { clearInterval(check); resolve(); }, 5000);
        });
        if (typeof XLSX === 'undefined') throw new Error('کتابخانه XLSX بارگذاری نشد');
    }

    const [dataOld, dataNew] = await Promise.all([
        parseOneExcelFile(DATA_URL).catch(err => {
            console.warn('⚠️ فایل data بارگذاری نشد:', err.message);
            return { members: [], transactions: [], users: [] };
        }),
        (async () => {
            const r = await loadFile1Smart();
            return r.data;
        })().catch(err => {
            console.warn('⚠️ فایل data1 بارگذاری نشد:', err.message);
            return { members: [], transactions: [], users: [] };
        })
    ]);

    const membersMap = new Map();
    dataOld.members.forEach(m => membersMap.set(m.accountNumber, {...m}));
    dataNew.members.forEach(newMember => {
        const oldMember = membersMap.get(newMember.accountNumber);
        if (oldMember) {
            const merged = {...oldMember};
            const financialFields = ['balance', 'savingsStatus', 'totalInstallments',
                                   'paidInstallments', 'overdueInstallments',
                                   'remainingInstallments', 'currentMonthBalance',
                                   'loanBalance', 'loanReceivedAmount', 'monthlySalary',
                                   'monthlySalaryApproved'];
            financialFields.forEach(field => {
                if (newMember[field] !== undefined && newMember[field] !== null && newMember[field] !== '') {
                    merged[field] = newMember[field];
                }
            });
            const textFields = ['phone1', 'phone2', 'openDate', 'datMiladi',
                               'birthDateShamsi', 'loanRequestDate', 'loanReceiveDate',
                               'lastInstallmentDate', 'loanNumber'];
            textFields.forEach(field => {
                if (newMember[field] && String(newMember[field]).trim() !== '') {
                    merged[field] = newMember[field];
                }
            });
            if (newMember.firstName && newMember.firstName.trim()) {
                merged.firstName = newMember.firstName;
            }
            merged.isCouncil = newMember.isCouncil;
            merged.karbari = newMember.karbari;
            merged.ramz = newMember.ramz;
            merged.isLocked = newMember.isLocked;
            merged.active = newMember.active;
            
            // 🆕 فیلدهای پیامکی را هم ادغام کن
            ['smsActive', 'smsOmomi', 'smsKod', 'smsSarparast', 'smsMoavaghe', 'smsMosabegheh', 'smsKhabarnameh', 'smsTavalod', 'smsMonasebat'].forEach(function(field) {
                if (newMember[field] !== undefined) merged[field] = newMember[field];
            });
            
            membersMap.set(newMember.accountNumber, merged);
        } else {
            membersMap.set(newMember.accountNumber, {...newMember});
        }
    });

    const combinedMembers = Array.from(membersMap.values());
    combinedMembers.forEach((m, idx) => { m.id = idx + 1; });

    const accToIdMap = new Map();
    combinedMembers.forEach(m => accToIdMap.set(m.accountNumber, m.id));

    const allTransactions = [...dataOld.transactions, ...dataNew.transactions];
    const txMap = new Map();
    allTransactions.forEach(tx => {
        const key = tx._transactionId + '_' + tx['شماره حساب'];
        const accNum = tx['شماره حساب'];
        tx._memberId = accToIdMap.get(accNum) || tx._memberId;
        txMap.set(key, tx);
    });
    const combinedTransactions = Array.from(txMap.values());

    const usersMap = new Map();
    dataOld.users.forEach(u => usersMap.set(u.username, u));
    dataNew.users.forEach(u => usersMap.set(u.username, u));
    const combinedUsers = Array.from(usersMap.values());

    const finalUsers = [];
    combinedUsers.forEach(u => {
        const accNum = String(u.username).trim();
        const member = combinedMembers.find(m => String(m.accountNumber) === accNum);
        if (!member) return;

        let password = String(member.ramz || '').trim();
        if (!password || password === '' || password === '0') {
            password = accNum;
        }

        finalUsers.push({
            id: member.id,
            username: accNum,
            password: password,
            role: member.isCouncil ? 'council' : 'member',
            memberId: member.id
        });
    });

    if (!finalUsers.find(u => u.username === 'admin')) {
        finalUsers.push({ id: 999, username: 'admin', password: 'admin123', role: 'admin', memberId: null });
    }

    return {
        members: combinedMembers,
        transactions: combinedTransactions,
        users: finalUsers
    };
}

// ============================================================
// بارگذاری بدون کش
// ============================================================
async function loadMainDataWithCache(forceRefresh = false) {
    console.log('📥 بارگذاری اطلاعات جدید از گیت‌هاب...');
    try {
        try {
            sessionStorage.removeItem('sandogh_data_v2');
            sessionStorage.removeItem('sandogh_data_time_v2');
            localStorage.removeItem('sandogh_data_v2');
            localStorage.removeItem('sandogh_data_time_v2');
        } catch(e) {}
        return await loadMainData();
    } catch (e) {
        console.error('❌ خطا:', e);
        throw e;
    }
}

// ============================================================
// به‌روزرسانی اجباری
// ============================================================
async function forceUpdateData() {
    if (!currentUser) return;
    try {
        try {
            localStorage.removeItem('sandogh_data_v2');
            localStorage.removeItem('sandogh_data_time_v2');
            sessionStorage.removeItem('sandogh_data_v2');
            sessionStorage.removeItem('sandogh_data_time_v2');
        } catch(e) {}
        
        const data = await loadMainDataWithCache(true);
        members = data.members;
        transactions = data.transactions || [];
        users = data.users;
        transactionsByMember = new Map();
        transactions.forEach(t => {
            const id = String(t._memberId);
            if (!transactionsByMember.has(id)) transactionsByMember.set(id, []);
            transactionsByMember.get(id).push(t);
        });
        members.forEach(m => { memberScores[m.id] = calculateMemberScore(m); });

        try { localStorage.setItem('sandogh_data_time_v2', String(Date.now())); } catch(e) {}
        
        if (currentPage) renderPage(currentPage);
        showToast({ type: 'success', title: 'بروزرسانی موفق', message: 'اطلاعات به‌روز شد.' });
    } catch (e) {
        console.error('خطا در بروزرسانی:', e);
    }
}

// ============================================================
// بارگذاری از Apps Script (fallback)
// ============================================================
async function parseOneExcelFromAppsScript(url) {
    try {
        const fullUrl = url + (url.includes('?') ? '&' : '?') + 'action=readExcel&_t=' + Date.now();
        const response = await fetch(fullUrl, { cache: 'no-cache' });
        const json = await response.json();

        if (json.error) {
            console.warn('⚠️ خطای Apps Script:', json.error);
            return { members: [], transactions: [], users: [] };
        }

        const rows = json.rows || [];
        if (!rows.length) return { members: [], transactions: [], users: [] };

        const headers = Object.keys(rows[0]);
        const colMap = {
            accountNumber: findCol(['شماره حساب'], headers),
            name: findCol(['name', 'نام'], headers),
            karbari: findCol(['karbari', 'کاربری', 'username'], headers),
            ramz: findCol(['ramz', 'رمز', 'password'], headers),
            id: findCol(['ID', 'id'], headers)
        };

        if (!colMap.accountNumber) {
            return { members: [], transactions: [], users: [] };
        }

        const membersArr = [];
        rows.forEach((row, index) => {
            const accNum = String(row[colMap.accountNumber] || '').trim();
            if (!accNum) return;
            membersArr.push({
                id: index + 1,
                firstName: colMap.name ? String(row[colMap.name] || '').trim() : '',
                accountNumber: accNum,
                karbari: colMap.karbari ? String(row[colMap.karbari] || '').trim() : '',
                ramz: colMap.ramz ? String(row[colMap.ramz] || '').trim() : ''
            });
        });

        return { members: membersArr, transactions: [], users: [] };
    } catch (error) {
        console.warn('⚠️ خطای Apps Script:', error.message);
        return { members: [], transactions: [], users: [] };
    }
}

// ============================================================
// Lazy Data Loading
// ============================================================
var _lazyDataCache = {};
async function loadLazyData(sectionName) {
    if (_lazyDataCache[sectionName]) return _lazyDataCache[sectionName];
    var fileName = null;
    switch (sectionName) {
        case 'reports':     fileName = 'reports.xlsx'; break;
        case 'stats': case 'infoStats': fileName = 'stats.xlsx'; break;
        case 'club':        fileName = 'club.xlsx'; break;
        case 'quizzes':     fileName = 'quizzes.xlsx'; break;
        case 'games':       fileName = 'games.xlsx'; break;
        case 'access':      fileName = 'access.xlsx'; break;
        case 'manageCoins': fileName = 'coins.xlsx'; break;
        case 'family':      fileName = 'family.xlsx'; break;
        case 'familyInfo':  fileName = 'family-info.xlsx'; break;
        case 'dashboard': case 'sms': fileName = 'sms.xlsx'; break;
        case 'requests':    fileName = 'requests.xlsx'; break;
        default: return null;
    }
    try {
        var data = null;
        if (typeof readExcelFile === 'function') data = await readExcelFile(fileName);
        else if (typeof loadExcelFromServer === 'function') data = await loadExcelFromServer(fileName);
        else if (typeof fetchExcelData === 'function') data = await fetchExcelData(fileName);
        _lazyDataCache[sectionName] = data;
        return data;
    } catch (err) { return null; }
}
function invalidateLazyData(sectionName) {
    if (sectionName) delete _lazyDataCache[sectionName];
    else _lazyDataCache = {};
}
window.DataLoader = { loadLazyData: loadLazyData, invalidateLazyData: invalidateLazyData };
