/* ============================================================
   صندوق اتحاد - برنامه‌های کاربردی
   نسخه: 2.0
   ============================================================ */

function renderUtilitiesPage(content) {
    let tabsHtml = '<div class="ut-tabs">';
    UT_TABS.forEach(function (t, i) {
        tabsHtml += '<button class="ut-tab' + (i === 0 ? ' active' : '') + '" data-ut="' + t.id + '" onclick="switchUtilTab(\'' + t.id + '\')">' + t.label + '</button>';
    });
    tabsHtml += '</div>';
    content.innerHTML =
        '<div class="ut-header"><div class="ut-title"><i class="fas fa-toolbox" style="color:var(--gold-color)"></i> برنامه‌های کاربردی</div>' + tabsHtml + '</div>' +
        '<div id="utContent"></div>' +
        '<div class="ut-modal-overlay" id="utModal"><div class="ut-modal-content"><button class="ut-modal-close" onclick="utCloseModal()">✕</button><div id="utModalBody"></div></div></div>';
    switchUtilTab('phone');
}

function switchUtilTab(id) {
    document.querySelectorAll('.ut-tab').forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-ut') === id); });
    const c = document.getElementById('utContent');
    if (!c) return;
    if (id === 'phone') utRenderPhone(c);
    else if (id === 'calc') utRenderCalc(c);
    else if (id === 'notes') utRenderNotes(c);
    else if (id === 'calendar') utRenderCalendarPage(c);
    else if (id === 'health') utRenderHealth(c);
    else if (id === 'religious') utRenderReligious(c);
}

function utRenderHealth(c) {
    c.innerHTML =
        '<div class="ut-card">' +
            '<div class="ut-card-title"><i class="fas fa-heartbeat" style="color:#ef4444"></i> سلامتی و درمان از احادیث و طب سنتی</div>' +
            '<p style="font-size:0.78rem;color:var(--text-secondary);line-height:1.9;margin-bottom:12px;">راهکارهای سلامتی و درمان بر اساس احادیث و طب سنتی ایرانی-اسلامی</p>' +
            '<button class="ut-btn" onclick="utShowModal(\'<h2 style=margin-bottom:12px>🌿 سلامتی و درمان از احادیث و طب سنتی</h2><div style=font-size:0.8rem;color:var(--text-secondary);line-height:2.2><p>📖 محتوای این بخش به زودی اضافه می‌شود...</p></div>\')">🌿 مشاهده مطالب</button>' +
        '</div>' +
        '<div class="ut-card">' +
            '<div class="ut-card-title"><i class="fas fa-stethoscope" style="color:#3b82f6"></i> درمان و سلامتی طب نوین</div>' +
            '<p style="font-size:0.78rem;color:var(--text-secondary);line-height:1.9;margin-bottom:12px;">راهکارهای سلامتی و درمان بر اساس طب نوین و علم پزشکی</p>' +
            '<button class="ut-btn" onclick="utShowModal(\'<h2 style=margin-bottom:12px>🏥 درمان و سلامتی طب نوین</h2><div style=font-size:0.8rem;color:var(--text-secondary);line-height:2.2><p>📖 محتوای این بخش به زودی اضافه می‌شود...</p></div>\')">🏥 مشاهده مطالب</button>' +
        '</div>';
}

function utRenderReligious(c) {
    c.innerHTML =
        '<div class="ut-card">' +
            '<div class="ut-card-title"><i class="fas fa-book-open" style="color:#10b981"></i> قرآن و احادیث</div>' +
            '<p style="font-size:0.78rem;color:var(--text-secondary);line-height:1.9;margin-bottom:12px;">آیات قرآن کریم و احادیث معصومین (ع)</p>' +
            '<button class="ut-btn" onclick="utShowModal(\'<h2 style=margin-bottom:12px>📖 قرآن و احادیث</h2><div style=font-size:0.8rem;color:var(--text-secondary);line-height:2.2><p>📖 محتوای این بخش به زودی اضافه می‌شود...</p></div>\')">📖 مشاهده مطالب</button>' +
        '</div>' +
        '<div class="ut-card">' +
            '<div class="ut-card-title"><i class="fas fa-praying-hands" style="color:#f59e0b"></i> دعا و مفاتیح</div>' +
            '<p style="font-size:0.78rem;color:var(--text-secondary);line-height:1.9;margin-bottom:12px;">ادعیه و زیارتنامه‌ها از مفاتیح الجنان</p>' +
            '<button class="ut-btn" onclick="utShowModal(\'<h2 style=margin-bottom:12px>🤲 دعا و مفاتیح</h2><div style=font-size:0.8rem;color:var(--text-secondary);line-height:2.2><p>📖 محتوای این بخش به زودی اضافه می‌شود...</p></div>\')">🤲 مشاهده مطالب</button>' +
        '</div>';
}

function utShowModal(html) {
    const m = document.getElementById('utModal');
    const b = document.getElementById('utModalBody');
    if (m && b) { b.innerHTML = html; m.classList.add('show'); }
}
function utCloseModal() {
    const m = document.getElementById('utModal');
    if (m) m.classList.remove('show');
}
function utFaDigits(s) {
    return String(s).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
}

function utLoadContacts() {
    let list = null;
    try { list = JSON.parse(localStorage.getItem('sandogh_ut_contacts')); } catch (e) { }
    if (!list || !list.length) {
        list = [{ id: 1, name: 'پشتیبانی صندوق', rel: 'پشتیبانی', phone: '02112345678' }];
        try { localStorage.setItem('sandogh_ut_contacts', JSON.stringify(list)); } catch (e) { }
    }
    return list;
}
function utSaveContacts(list) {
    try { localStorage.setItem('sandogh_ut_contacts', JSON.stringify(list)); } catch (e) { }
}

function utRenderPhone(c) {
    c.innerHTML = '<div class="ut-card">' +
        '<div class="ut-card-title"><i class="fas fa-address-book" style="color:var(--purple-color)"></i> دفترچه تلفن خانواده ' +
        '<button class="ut-btn ut-btn-success ut-btn-sm" style="margin-right:auto" onclick="utOpenAddContact()"><i class="fas fa-plus"></i> افزودن مخاطب</button></div>' +
        '<div class="ut-search"><input type="text" id="utContactSearch" placeholder="جستجوی نام یا شماره..." oninput="utRenderContactsList()"><i class="fas fa-search"></i></div>' +
        '<div id="utContactsList"></div></div>';
    utRenderContactsList();
}

function utRenderContactsList() {
    const searchEl = document.getElementById('utContactSearch');
    const q = searchEl ? searchEl.value.trim() : '';
    let list = utLoadContacts();
    if (q) list = list.filter(function (x) { return x.name.indexOf(q) >= 0 || x.phone.indexOf(q) >= 0 || x.rel.indexOf(q) >= 0; });
    const el = document.getElementById('utContactsList');
    if (!el) return;
    if (!list.length) { el.innerHTML = '<div class="ut-empty"><div class="ic">📭</div>مخاطبی یافت نشد</div>'; return; }
    let html = '';
    list.forEach(function (x) {
        html += '<div class="ut-contact-item">' +
            '<div class="ut-contact-avatar">' + esc(x.name.charAt(0)) + '</div>' +
            '<div class="ut-contact-info"><h4>' + esc(x.name) + ' <span class="ut-contact-rel">' + esc(x.rel) + '</span></h4>' +
            '<p><i class="fas fa-phone"></i> ' + utFaDigits(x.phone) + '</p></div>' +
            '<div class="ut-contact-actions">' +
            '<a href="tel:' + esc(x.phone) + '" class="ut-icon-btn ut-ic-call" title="تماس"><i class="fas fa-phone"></i></a>' +
            '<a href="sms:' + esc(x.phone) + '" class="ut-icon-btn ut-ic-sms" title="پیامک"><i class="fas fa-sms"></i></a>' +
            '<button class="ut-icon-btn ut-ic-del" onclick="utDeleteContact(' + x.id + ')" title="حذف"><i class="fas fa-trash"></i></button>' +
            '</div></div>';
    });
    el.innerHTML = html;
}

function utOpenAddContact() {
    utShowModal('<h2 style="margin-bottom:15px">➕ افزودن مخاطب جدید</h2>' +
        '<div class="ut-form-group"><label>نام و نام خانوادگی</label><input type="text" id="utNcName"></div>' +
        '<div class="ut-form-group"><label>نسبت فامیلی</label><select id="utNcRel"><option>سرپرست خانواده</option><option>همسر</option><option>فرزند</option><option>پدر</option><option>مادر</option><option>برادر</option><option>خواهر</option><option>فامیل</option><option>سایر</option></select></div>' +
        '<div class="ut-form-group"><label>شماره تماس</label><input type="tel" id="utNcPhone" placeholder="09xxxxxxxxx"></div>' +
        '<button class="ut-btn ut-btn-success" style="width:100%" onclick="utSaveNewContact()">✅ ذخیره مخاطب</button>');
}

function utSaveNewContact() {
    const name = document.getElementById('utNcName').value.trim();
    const rel = document.getElementById('utNcRel').value;
    const phone = document.getElementById('utNcPhone').value.trim();
    if (!name || !phone) { alert('⚠️ نام و شماره تماس را وارد کنید'); return; }
    const list = utLoadContacts();
    list.push({ id: Date.now(), name: name, rel: rel, phone: phone });
    utSaveContacts(list);
    utCloseModal();
    utRenderContactsList();
}

function utDeleteContact(id) {
    if (!confirm('آیا از حذف این مخاطب مطمئن هستید؟')) return;
    utSaveContacts(utLoadContacts().filter(function (x) { return x.id !== id; }));
    utRenderContactsList();
}

// ============================================================
// رندر سایر تب‌های utilities
// ============================================================
function utRenderCalc(c) {
    c.innerHTML = '<div class="ut-card">' +
        '<div class="ut-card-title"><i class="fas fa-calculator" style="color:var(--gold-color)"></i> ماشین‌حساب‌های تخصصی</div>' +
        '<div class="ut-calc-selector">' +
        '<button class="ut-calc-sel active" onclick="utSwitchCalc(\'zakat\',this)"><div class="ic">🕌</div><div class="nm">زکات</div></button>' +
        '<button class="ut-calc-sel" onclick="utSwitchCalc(\'khums\',this)"><div class="ic">💎</div><div class="nm">خمس</div></button>' +
        '<button class="ut-calc-sel" onclick="utSwitchCalc(\'retire\',this)"><div class="ic">🏖️</div><div class="nm">بازنشستگی</div></button>' +
        '<button class="ut-calc-sel" onclick="utSwitchCalc(\'inflation\',this)"><div class="ic">📉</div><div class="nm">تورم</div></button>' +
        '</div><div id="utCalcBody"></div></div>';
    utRenderCalcBody();
}

function utSwitchCalc(type, btn) {
    utCurrentCalc = type;
    document.querySelectorAll('.ut-calc-sel').forEach(function (b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    utRenderCalcBody();
}

function utRenderCalcBody() {
    const el = document.getElementById('utCalcBody');
    if (!el) return;
    if (utCurrentCalc === 'zakat') {
        el.innerHTML =
            '<div class="ut-form-row"><div class="ut-form-group"><label>🥇 طلا (گرم)</label><input type="number" id="utZGold" value="0" oninput="utCalcZakat()"></div>' +
            '<div class="ut-form-group"><label>قیمت هر گرم طلا</label><input type="number" id="utZGoldPrice" value="4500000" oninput="utCalcZakat()"></div></div>' +
            '<div class="ut-form-row"><div class="ut-form-group"><label>🥈 نقره (گرم)</label><input type="number" id="utZSilver" value="0" oninput="utCalcZakat()"></div>' +
            '<div class="ut-form-group"><label>قیمت هر گرم نقره</label><input type="number" id="utZSilverPrice" value="60000" oninput="utCalcZakat()"></div></div>' +
            '<div class="ut-form-row"><div class="ut-form-group"><label>🌾 غلات (کیلوگرم)</label><input type="number" id="utZCrop" value="0" oninput="utCalcZakat()"></div>' +
            '<div class="ut-form-group"><label>قیمت هر کیلو</label><input type="number" id="utZCropPrice" value="20000" oninput="utCalcZakat()"></div></div>' +
            '<div class="ut-form-group"><label>💧 روش آبیاری</label><select id="utZIrrigation" onchange="utCalcZakat()"><option value="10">بارانی (۱۰٪)</option><option value="5">ابزاری (۵٪)</option></select></div>' +
            '<div class="ut-calc-result" id="utZakatResult"></div>' +
            '<div class="ut-calc-note">📌 نصاب طلا: ۸۵ گرم | نصاب نقره: ۵۹۵ گرم | نصاب غلات: ۸۴۷ کیلوگرم</div>';
        utCalcZakat();
    } else if (utCurrentCalc === 'khums') {
        el.innerHTML =
            '<div class="ut-form-group"><label>💰 درآمد کل سالانه</label><input type="number" id="utKIncome" value="300000000" oninput="utCalcKhums()"></div>' +
            '<div class="ut-form-group"><label>🏠 هزینه‌های زندگی</label><input type="number" id="utKExpense" value="220000000" oninput="utCalcKhums()"></div>' +
            '<div class="ut-form-group"><label>📉 بدهی‌های قابل کسر</label><input type="number" id="utKDebt" value="0" oninput="utCalcKhums()"></div>' +
            '<div class="ut-calc-result" id="utKhumsResult"></div>' +
            '<div class="ut-calc-note">📌 خمس = ۲۰٪ از مازاد درآمد سالانه</div>';
        utCalcKhums();
    } else if (utCurrentCalc === 'retire') {
        el.innerHTML =
            '<div class="ut-form-row"><div class="ut-form-group"><label>🎂 سن فعلی</label><input type="number" id="utRAge" value="35" oninput="utCalcRetire()"></div>' +
            '<div class="ut-form-group"><label>🏖️ سن بازنشستگی</label><input type="number" id="utRRetireAge" value="60" oninput="utCalcRetire()"></div></div>' +
            '<div class="ut-form-row"><div class="ut-form-group"><label>💵 درآمد ماهانه</label><input type="number" id="utRIncome" value="30000000" oninput="utCalcRetire()"></div>' +
            '<div class="ut-form-group"><label>📊 درصد پس‌انداز</label><input type="number" id="utRPercent" value="20" oninput="utCalcRetire()"></div></div>' +
            '<div class="ut-form-group"><label>📈 نرخ رشد سالانه</label><input type="number" id="utRRate" value="25" oninput="utCalcRetire()"></div>' +
            '<div class="ut-calc-result" id="utRetireResult"></div>' +
            '<div class="ut-calc-note">📌 محاسبه بر اساس سود مرکب</div>';
        utCalcRetire();
    } else if (utCurrentCalc === 'inflation') {
        el.innerHTML =
            '<div class="ut-form-group"><label>💰 مبلغ فعلی</label><input type="number" id="utIAmount" value="100000000" oninput="utCalcInflation()"></div>' +
            '<div class="ut-form-group"><label>📉 نرخ تورم سالانه</label><input type="number" id="utIRate" value="40" oninput="utCalcInflation()"></div>' +
            '<div class="ut-form-group"><label>⏳ تعداد سال</label><input type="number" id="utIYears" value="5" oninput="utCalcInflation()"></div>' +
            '<div class="ut-calc-result" id="utInflationResult"></div>' +
            '<div class="ut-calc-note">📌 برای حفظ ارزش پول، سرمایه‌گذاری لازم است.</div>';
        utCalcInflation();
    }
}

function utCalcZakat() {
    const gold = parseFloat(document.getElementById('utZGold').value) || 0;
    const goldP = parseFloat(document.getElementById('utZGoldPrice').value) || 0;
    const silver = parseFloat(document.getElementById('utZSilver').value) || 0;
    const silverP = parseFloat(document.getElementById('utZSilverPrice').value) || 0;
    const crop = parseFloat(document.getElementById('utZCrop').value) || 0;
    const cropP = parseFloat(document.getElementById('utZCropPrice').value) || 0;
    const irrRate = (parseFloat(document.getElementById('utZIrrigation').value) || 10) / 100;
    let total = 0;
    const details = [];
    if (gold >= 85) { const z = gold * goldP * 0.025; total += z; details.push('🥇 طلا: ' + fmtNum(z)); }
    if (silver >= 595) { const z = silver * silverP * 0.025; total += z; details.push('🥈 نقره: ' + fmtNum(z)); }
    if (crop >= 847) { const z = crop * cropP * irrRate; total += z; details.push('🌾 محصولات: ' + fmtNum(z)); }
    const el = document.getElementById('utZakatResult');
    if (!el) return;
    if (total > 0) {
        el.innerHTML = '<div style="font-size:0.82rem;opacity:.9">مجموع زکات واجب</div><div class="big">' + fmtNum(total) + ' تومان</div><div class="sub">' + details.join('<br>') + '</div>';
    } else {
        el.innerHTML = '<div style="font-size:0.95rem">✅ زکات واجب نیست</div><div class="sub">دارایی شما به نصاب نرسیده.</div>';
    }
}

function utCalcKhums() {
    const income = parseFloat(document.getElementById('utKIncome').value) || 0;
    const expense = parseFloat(document.getElementById('utKExpense').value) || 0;
    const debt = parseFloat(document.getElementById('utKDebt').value) || 0;
    const surplus = income - expense - debt;
    const el = document.getElementById('utKhumsResult');
    if (!el) return;
    if (surplus > 0) {
        el.innerHTML = '<div style="font-size:0.82rem;opacity:.9">خمس سالانه (۲۰٪)</div><div class="big">' + fmtNum(surplus * 0.2) + ' تومان</div><div class="sub">مازاد: ' + fmtNum(surplus) + ' تومان</div>';
    } else {
        el.innerHTML = '<div style="font-size:0.95rem">✅ خمس واجب نیست</div><div class="sub">مازاد درآمدی وجود ندارد.</div>';
    }
}

function utCalcRetire() {
    const age = parseFloat(document.getElementById('utRAge').value) || 0;
    const retireAge = parseFloat(document.getElementById('utRRetireAge').value) || 0;
    const income = parseFloat(document.getElementById('utRIncome').value) || 0;
    const percent = parseFloat(document.getElementById('utRPercent').value) || 0;
    const rate = parseFloat(document.getElementById('utRRate').value) || 0;
    const el = document.getElementById('utRetireResult');
    if (!el) return;
    if (retireAge <= age) { el.innerHTML = '<div style="font-size:0.9rem">⚠️ سن بازنشستگی باید بیشتر باشد</div>'; return; }
    const years = retireAge - age;
    const n = years * 12;
    const monthly = income * percent / 100;
    const r = rate / 100 / 12;
    const fv = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) : monthly * n;
    el.innerHTML = '<div style="font-size:0.82rem;opacity:.9">سرمایه در زمان بازنشستگی</div><div class="big">' + fmtNum(fv) + ' تومان</div>' +
        '<div class="sub">⏳ ' + utFaDigits(years) + ' سال | 💵 ماهانه: ' + fmtNum(monthly) + ' تومان</div>';
}

function utCalcInflation() {
    const amount = parseFloat(document.getElementById('utIAmount').value) || 0;
    const rate = parseFloat(document.getElementById('utIRate').value) || 0;
    const years = parseFloat(document.getElementById('utIYears').value) || 0;
    const factor = Math.pow(1 + rate / 100, years);
    const needed = amount * factor;
    const power = factor > 0 ? amount / factor : amount;
    const el = document.getElementById('utInflationResult');
    if (!el) return;
    el.innerHTML = '<div style="font-size:0.82rem;opacity:.9">در ' + utFaDigits(years) + ' سال نیاز دارید به</div>' +
        '<div class="big">' + fmtNum(needed) + ' تومان</div>' +
        '<div class="sub">📉 قدرت خرید معادل <b>' + fmtNum(power) + '</b> تومان امروز خواهد بود.</div>';
}
