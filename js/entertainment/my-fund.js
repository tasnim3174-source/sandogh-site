/* ============================================================
   صندوق اتحاد - صندوق من (My Fund)
   نسخه: 2.0
   ============================================================ */

function renderMyFundPage(content) {
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) { content.innerHTML = '<div style="text-align:center;padding:30px;">خطا</div>'; return; }
    let tabsHtml = '<div class="mf-tabs">';
    MF_TABS.forEach(function (t, i) {
        tabsHtml += '<button class="mf-tab' + (i === 0 ? ' active' : '') + '" data-mf="' + t.id + '" onclick="switchMfTab(\'' + t.id + '\')">' + t.label + '</button>';
    });
    tabsHtml += '</div>';
    content.innerHTML = '<div class="mf-header"><div class="mf-title"><i class="fas fa-gem" style="color:var(--gold-color)"></i> صندوق من</div>' + tabsHtml + '</div><div id="mfContent"></div>';
    switchMfTab('performance');
}

function switchMfTab(id) {
    document.querySelectorAll('.mf-tab').forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-mf') === id); });
    const c = document.getElementById('mfContent');
    if (!c) return;
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) return;
    if (id === 'performance') mfRenderPerformance(c, member);
    else if (id === 'tree') mfRenderTree(c, member);
    else if (id === 'postcards') mfRenderPostcards(c);
    else if (id === 'success') mfRenderSuccess(c, member);
    else if (id === 'advisor') mfRenderAdvisor(c);
    else if (id === 'alerts') mfRenderAlerts(c, member);
    else if (id === 'lessons') mfRenderLessons(c, member);
    else if (id === 'quiz') mfRenderQuiz(c, member);
    else if (id === 'news') mfRenderNews(c);
    else if (id === 'loan') mfRenderLoan(c);
    else if (id === 'badges') mfRenderBadges(c, member);
}

function mfRenderPerformance(c, member) {
    const t = getTodayShamsi();
    const tn = shamsiDayNum(t.y, t.m, t.d);
    const familyAll = [member, ...getFamilyMembers()];
    const up = [];
    const birthdayList = [];
    let birthMonth = false;

    familyAll.forEach(fm => {
        if (!fm.birthDateShamsi) return;
        let dateStr = String(fm.birthDateShamsi).trim();
        let year, month, day;

        if (/^\d{8}$/.test(dateStr)) {
            year = +dateStr.substring(0, 4);
            month = +dateStr.substring(4, 6);
            day = +dateStr.substring(6, 8);
        } else {
            dateStr = dateStr.replace(/[-.]/g, '/');
            const bb = dateStr.split('/');
            if (bb.length !== 3) return;
            year = +bb[0];
            month = +bb[1];
            day = +bb[2];
        }

        const todayDays = shamsiToContDays(t.y, t.m, t.d);
        let birthdayDays = shamsiToContDays(t.y, month, day);
        if (birthdayDays <= todayDays) {
            birthdayDays = shamsiToContDays(t.y + 1, month, day);
        }
        const daysUntil = birthdayDays - todayDays;
        up.push({ name: fm.firstName, days: daysUntil });

        if (month === t.m) {
            birthdayList.push({ name: fm.firstName, day: day });
            if (fm.id === member.id) birthMonth = true;
        }
    });
    up.sort((a, b) => a.days - b.days);
    birthdayList.sort((a, b) => a.day - b.day);

    let bdayHtml = '';
    if (up.length) {
        bdayHtml = '<div class="bdayrow"><span class="bday">' + ((up[0].days === 0) ? ('🎂 امروز تولد ' + esc(up[0].name) + ' است 🎉') : ('🎂 نزدیک‌ترین تولد: ' + esc(up[0].name) + ' · ' + up[0].days + ' روز دیگر')) + '</span></div>';
    }

    if (birthdayList.length > 0) {
        bdayHtml += '<div style="margin-top:10px;background:var(--bg-secondary);border-radius:12px;padding:12px;border:1px solid var(--border-color);">';
        bdayHtml += '<div style="font-size:0.85rem;font-weight:800;color:var(--text-primary);margin-bottom:8px;">🎂 تولدهای این ماه:</div>';
        birthdayList.forEach(b => {
            const isToday = (b.day === t.d);
            bdayHtml += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px dashed var(--border-color);">';
            bdayHtml += '<span style="font-size:1.2rem;">🎂</span>';
            bdayHtml += '<span style="font-size:0.8rem;font-weight:700;color:var(--text-primary);">' + esc(b.name) + '</span>';
            bdayHtml += '<span style="font-size:0.75rem;color:var(--text-secondary);">روز ' + b.day + ' ماه</span>';
            if (isToday) bdayHtml += '<span style="background:var(--gold-color);color:#fff;padding:2px 8px;border-radius:99px;font-size:0.65rem;font-weight:800;">امروز 🎉</span>';
            bdayHtml += '</div>';
        });
        bdayHtml += '</div>';
    }

    let years = 0;
    if (member.datMiladi) { const dd = new Date(member.datMiladi); if (!isNaN(dd.getTime())) years = Math.max(0, new Date().getFullYear() - dd.getFullYear()); }
    const txs = transactionsByMember.get(String(member.id)) || [];
    let active = false;
    txs.forEach(tx => { const tp = (tx['تاریخ تراکنش'] || '').split('/'); if (tp.length === 3 && +tp[1] === t.m && +tp[0] === t.y) active = true; });
    const sd = memberScores[member.id];
    const badges = [
        { i: '🕰️', n: 'باسابقه', e: years >= 5, d: years + ' سال عضویت' },
        { i: '✅', n: 'منظم', e: (member.paidInstallments || 0) > 0 && (member.overdueInstallments || 0) === 0, d: 'پرداخت منظم اقساط' },
        { i: '💚', n: 'پس‌اندازگر', e: (member.monthlySalary || 0) > 0 && (member.savingsStatus || 0) >= (member.monthlySalary || 0), d: 'پس‌انداز ≥ یک مقرری' },
        { i: '⭐', n: 'طلایی', e: (sd ? sd.score : 0) >= 80, d: 'امتیاز ≥ ۸۰' },
        { i: '🕊️', n: 'بدون بدهی', e: (member.loanBalance || 0) === 0, d: 'مانده بدهی صفر' },
        { i: '🎓', n: 'فارغ‌التحصیل وام', e: (member.totalInstallments || 0) > 0 && (member.paidInstallments || 0) >= (member.totalInstallments || 0), d: 'پایان کامل اقساط' },
        { i: '💎', n: 'پس‌انداز بزرگ', e: (member.monthlySalary || 0) > 0 && (member.savingsStatus || 0) >= 3 * (member.monthlySalary || 0), d: 'پس‌انداز ≥ ۳ مقرری' },
        { i: '⚡', n: 'فعال', e: active, d: 'تراکنش در ماه جاری' },
        { i: '👑', n: 'سرپرست خانوار', e: member.heh2 === '01', d: 'سرپرست خانواده' },
        { i: '🎂', n: 'تولد این ماه', e: birthMonth, d: 'تولد در این ماه' }
    ];
    let achHtml = '<div class="achrow">';
    badges.forEach(b => { achHtml += '<div class="ach ' + (b.e ? 'on' : 'off') + '"><div class="n">' + (b.e ? '' : '🔒 ') + b.i + ' ' + b.n + '</div><div class="d">' + b.d + '</div></div>'; });
    achHtml += '</div>';
    c.innerHTML = '<div class="mf-card"><div class="mf-card-title">🏅 عملکرد شما</div>' + bdayHtml + achHtml + '</div>';
}

function mfTreeData(member) {
    const leaves = member.paidInstallments || 0;
    const salary = member.monthlySalary || 1;
    const fruitsSavings = Math.max(0, Math.floor((member.savingsStatus || 0) / salary));
    const fruitsInst = Math.floor((member.paidInstallments || 0) / 3);
    const fruits = fruitsSavings + fruitsInst;
    const total = leaves + fruits;
    const level = total >= 80 ? 5 : total >= 50 ? 4 : total >= 30 ? 3 : total >= 12 ? 2 : 1;
    return { leaves: leaves, fruits: fruits, level: level };
}

function mfRenderTree(c, member) {
    const d = mfTreeData(member);
    const fruitPos = [[65, 80], [135, 85], [100, 50], [80, 110], [125, 105], [55, 100], [145, 100], [100, 95], [70, 60], [130, 65], [90, 128], [115, 122]];
    const fruitColors = ['#f59e0b', '#ef4444', '#ec4899'];
    let fruitsSvg = '';
    const showF = Math.min(d.fruits, fruitPos.length);
    for (let i = 0; i < showF; i++) {
        fruitsSvg += '<circle cx="' + fruitPos[i][0] + '" cy="' + fruitPos[i][1] + '" r="6" fill="' + fruitColors[i % 3] + '"/>';
    }
    c.innerHTML =
        '<div class="mf-card">' +
        '<div class="mf-card-title">🌳 درخت رشد مالی شما</div>' +
        '<div class="mf-tree-wrap">' +
        '<svg class="mf-tree-svg" viewBox="0 0 200 220">' +
        '<rect x="90" y="140" width="20" height="70" fill="#8b5cf6" rx="3"/>' +
        '<circle cx="100" cy="100" r="55" fill="#10b981" opacity="0.85"/>' +
        '<circle cx="70" cy="115" r="35" fill="#059669" opacity="0.9"/>' +
        '<circle cx="130" cy="115" r="35" fill="#059669" opacity="0.9"/>' +
        '<circle cx="100" cy="70" r="30" fill="#34d399" opacity="0.95"/>' +
        '<g>' + fruitsSvg + '</g>' +
        '</svg>' +
        '<div class="mf-tree-stats">' +
        '<div class="mf-tree-stat"><div class="n">' + d.leaves + '</div><div class="l">🍃 برگ<br>پرداخت به‌موقع اقساط</div></div>' +
        '<div class="mf-tree-stat"><div class="n">' + d.fruits + '</div><div class="l">🍎 میوه<br>پس‌انداز و اقساط</div></div>' +
        '<div class="mf-tree-stat"><div class="n">سطح ' + d.level + '</div><div class="l">🌳 رشد درخت</div></div>' +
        '</div>' +
        '<div class="mf-tree-rules">🍃 هر پرداخت به‌موقع قسط = ۱ برگ سبز<br>🍎 هر ۱ مقرری پس‌انداز = ۱ میوه<br>🍎 هر ۳ قسط پرداخت‌شده = ۱ میوه اضافی</div>' +
        '</div>' +
        '</div>';
}

function mfRenderPostcards(c) {
    let html = '<div class="mf-card"><div class="mf-card-title">💌 کارت پستال دیجیتال</div>' +
        '<p class="mf-note">کارت را انتخاب کنید و از طریق پیامک ارسال کنید</p>' +
        '<div class="mf-pc-grid">';
    MF_POSTCARDS.forEach(function (p, i) {
        html += '<div class="mf-postcard ' + p.cls + '" onclick="mfShowPostcard(' + i + ')"><div class="mf-pc-emoji">' + p.emoji + '</div><div class="mf-pc-title">' + p.title + '</div></div>';
    });
    html += '</div><div id="mfPcDetail"></div></div>';
    c.innerHTML = html;
}

function mfShowPostcard(i) {
    const p = MF_POSTCARDS[i];
    if (!p) return;
    const smsText = p.emoji + ' ' + p.title + '\n' + p.text + '\n\n🌟 صندوق اتحاد';
    const smsLink = 'sms:?body=' + encodeURIComponent(smsText);
    const detail = document.getElementById('mfPcDetail');
    if (!detail) return;
    detail.innerHTML = '<div class="mf-pc-detail">' +
        '<div style="font-size:3rem;text-align:center">' + p.emoji + '</div>' +
        '<p style="text-align:center;line-height:2;margin:10px 0">' + p.text + '</p>' +
        '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">' +
        '<a href="' + smsLink + '" class="mf-btn mf-btn-success">📱 ارسال با پیامک</a>' +
        '</div>' +
        '<p class="mf-note" style="text-align:center;margin-top:10px">پس از لمس دکمه، برنامه پیامک گوشی باز می‌شود.</p>' +
        '</div>';
}

function mfRenderSuccess(c, member) {
    const items = [];
    if (member.datMiladi) {
        const d = new Date(member.datMiladi);
        if (!isNaN(d.getTime())) items.push({ date: d.toLocaleDateString('fa-IR'), icon: '🌱', title: 'شروع عضویت', desc: 'به خانواده بزرگ صندوق اتحاد پیوستید' });
    }
    if (member.loanReceiveDate) items.push({ date: member.loanReceiveDate, icon: '🏦', title: 'دریافت وام', desc: 'تسهیلات شما پرداخت شد' });
    if ((member.paidInstallments || 0) > 0) items.push({ date: '', icon: '✅', title: member.paidInstallments + ' قسط پرداخت‌شده', desc: 'ادامه بدهید!' });
    if ((member.savingsStatus || 0) > 0) items.push({ date: '', icon: '💰', title: 'پس‌انداز ' + fmtNum(member.savingsStatus) + ' تومانی', desc: 'پس‌انداز شما در حال رشد است' });
    const sd = memberScores[member.id];
    if (sd) items.push({ date: '', icon: '⭐', title: 'امتیاز ' + sd.score + ' - سطح ' + sd.tierName, desc: 'با فعالیت مستمر، امتیاز خود را بالاتر ببرید' });
    let html = '<div class="mf-card"><div class="mf-card-title">🏆 موفقیت‌های من</div><p class="mf-note">دستاوردهای شما به صورت خودکار ساخته می‌شود</p><div class="mf-timeline">';
    items.forEach(function (it) {
        html += '<div class="mf-tl-item">' + (it.date ? '<div class="mf-tl-date">📅 ' + it.date + '</div>' : '') + '<h4>' + it.icon + ' ' + it.title + '</h4><p>' + it.desc + '</p></div>';
    });
    html += '</div>';
    if ((member.paidInstallments || 0) < 12) {
        const pct = Math.round((member.paidInstallments || 0) / 12 * 100);
        html += '<div class="mf-goal"><b>🎯 هدف بعدی: نشان «تیرانداز»</b><div class="mf-progress"><i style="width:' + pct + '%"></i></div><p class="mf-note">' + (member.paidInstallments || 0) + ' از ۱۲ قسط</p></div>';
    }
    html += '</div>';
    c.innerHTML = html;
}

function mfRenderAdvisor(c) {
    c.innerHTML = '<div class="mf-card"><div class="mf-card-title">🤖 مشاور مالی مجازی</div>' +
        '<div class="mf-chat" id="mfChatBox"></div>' +
        '<div class="mf-chat-row">' +
        '<input type="text" class="mf-chat-input" id="mfChatInput" placeholder="سؤال مالی خود را بپرسید..." onkeypress="if(event.key===\'Enter\')mfSendChat()">' +
        '<button class="mf-btn" onclick="mfSendChat()"><i class="fas fa-paper-plane"></i></button>' +
        '</div>' +
        '<div class="mf-quick">' +
        '<button onclick="mfQuickChat(\'چقدر پس‌انداز کنم؟\')">چقدر پس‌انداز کنم؟</button>' +
        '<button onclick="mfQuickChat(\'وام بگیرم؟\')">وام بگیرم؟</button>' +
        '<button onclick="mfQuickChat(\'نکته مالی\')">نکته مالی</button>' +
        '</div></div>';
    mfBotMsg('سلام! 👋 من مشاور مالی مجازی شما هستم. چطور می‌توانم کمکتان کنم؟');
}

function mfBotMsg(t) { const b = document.getElementById('mfChatBox'); if (!b) return; b.innerHTML += '<div class="mf-msg mf-bot"><div>🤖 ' + t + '</div></div>'; b.scrollTop = b.scrollHeight; }
function mfUserMsg(t) { const b = document.getElementById('mfChatBox'); if (!b) return; b.innerHTML += '<div class="mf-msg mf-user"><div>' + t + '</div></div>'; b.scrollTop = b.scrollHeight; }
function mfSendChat() {
    const input = document.getElementById('mfChatInput');
    if (!input) return;
    const t = input.value.trim();
    if (!t) return;
    mfUserMsg(t);
    input.value = '';
    setTimeout(function () { mfBotMsg(mfBotReply(t)); }, 500);
}
function mfQuickChat(q) { mfUserMsg(q); setTimeout(function () { mfBotMsg(mfBotReply(q)); }, 500); }
function mfBotReply(q) {
    if (q.indexOf('پس‌انداز') >= 0) return 'پیشنهاد من: حداقل ۲۰٪ درآمد ماهانه را پس‌انداز کنید.';
    if (q.indexOf('وام') >= 0) return 'وام گرفتن برای سرمایه‌گذاری مناسب است. مجموع اقساط بیشتر از ۳۰٪ درآمدتان نباشد.';
    if (q.indexOf('نکته') >= 0) return '💡 نکته امروز: «اول به خودت پرداخت کن!» یعنی به محض دریافت درآمد، سهم پس‌انداز را جدا کنید.';
    return 'سؤال خوبی است! پیشنهاد می‌کنم بخش سواد مالی را هم ببینید.';
}

function mfAlertBox(type, icon, title, text) {
    return '<div class="mf-alert mf-alert-' + type + '"><div class="ic">' + icon + '</div><div class="tx"><b>' + title + '</b>' + text + '</div></div>';
}
function mfRenderAlerts(c, member) {
    let html = '<div class="mf-card"><div class="mf-card-title">🔔 هشدارهای هوشمند</div>';
    if (Math.abs(member.overdueInstallments || 0) > 0) {
        html += mfAlertBox('danger', '⏰', 'قسط معوقه', 'شما ' + Math.abs(member.overdueInstallments) + ' قسط معوقه دارید.');
    }
    const t = getTodayShamsi();
    const tn = shamsiDayNum(t.y, t.m, t.d);
    const instDates = generateInstallmentDates(member.loanReceiveDate, member.totalInstallments || 0);
    let nextInst = null;
    const todayContAlert = shamsiToContDays(t.y, t.m, t.d);
    for (let i = 0; i < instDates.length; i++) {
        const num = shamsiToContDays(instDates[i].year, instDates[i].month, instDates[i].day);
        if (num >= todayContAlert) { nextInst = num; break; }
    }
    if (nextInst !== null) {
        const daysLeft = nextInst - todayContAlert;
        if (daysLeft <= 7) {
            html += mfAlertBox('warn', '📅', 'قسط نزدیک', 'قسط بعدی شما ' + (daysLeft === 0 ? 'امروز' : daysLeft + ' روز دیگر') + ' سررسید می‌شود.');
        }
    }
    if ((member.monthlySalary || 0) > 0 && (member.savingsStatus || 0) >= (member.monthlySalary || 0)) {
        html += mfAlertBox('ok', '🎉', 'پس‌انداز عالی', 'پس‌انداز شما معادل حداقل یک مقرری کامل است.');
    } else {
        html += mfAlertBox('warn', '💤', 'یادآوری پس‌انداز', 'با مبلغی کوچک شروع کنید؛ تداوم مهم‌تر از مبلغ است.');
    }
    if ((member.loanBalance || 0) === 0 && (member.totalInstallments || 0) > 0) {
        html += mfAlertBox('ok', '🕊️', 'بدون بدهی', 'تبریک! مانده بدهی شما صفر است.');
    }
    html += '</div>';
    c.innerHTML = html;
}

function mfRenderLessons(c, member) {
    let html = '<div class="mf-card"><div class="mf-card-title">🎓 سواد مالی <span class="mf-note">🎁 هر درس ۱ امتیاز</span></div>';
    MF_LESSONS.forEach(function (l) {
        const read = localStorage.getItem('sandogh_mf_lesson_' + member.id + '_' + l.id) === '1';
        html += '<div class="mf-lesson">' +
            '<div class="mf-lesson-head">' +
            '<div style="flex:1"><h4 id="mfLessonTitle' + l.id + '"><i class="fas ' + l.icon + '" style="color:' + l.color + '"></i> ' + l.title + (read ? ' <span style="color:var(--success-color);font-size:0.65rem">✅ دریافت شد</span>' : '') + '</h4><div class="meta">⏱ ' + l.time + ' | 🎁 ۱ امتیاز</div></div>' +
            '<button class="mf-mini-btn" id="mfLessonBtn' + l.id + '" onclick="mfToggleLesson(' + l.id + ')">📖 مشاهده درس</button>' +
            '</div>' +
            '<div class="mf-lesson-body" id="mfLessonBody' + l.id + '">' + l.content + '</div>' +
            '</div>';
    });
    html += '</div>';
    c.innerHTML = html;
}

function mfToggleLesson(id) {
    const el = document.getElementById('mfLessonBody' + id);
    const btn = document.getElementById('mfLessonBtn' + id);
    if (!el) return;
    const isOpen = el.style.display === 'block';
    el.style.display = isOpen ? 'none' : 'block';
    if (btn) btn.textContent = isOpen ? '📖 مشاهده درس' : '🔼 بستن';
    if (!isOpen) {
        const member = members.find(m => m.id === currentUser.memberId);
        if (!member) return;
        const key = 'sandogh_mf_lesson_' + member.id + '_' + id;
        if (localStorage.getItem(key) !== '1') {
            localStorage.setItem(key, '1');
            mfAddPoints(1);
            const lesson = MF_LESSONS.find(l => l.id === id);
            const titleEl = document.getElementById('mfLessonTitle' + id);
            if (titleEl) titleEl.innerHTML += ' <span style="color:var(--success-color);font-size:0.65rem">✅ دریافت شد</span>';
            setTimeout(function () { alert('🎉 ۱ امتیاز برای «' + lesson.title + '» اضافه شد!'); }, 300);
        }
    }
}

function mfRenderQuiz(c, member) {
    mfQuizIdx = 0;
    mfQuizCorrect = 0;
    const done = localStorage.getItem('sandogh_mf_quiz_' + member.id) === '1';
    c.innerHTML = '<div class="mf-card"><div class="mf-card-title">🧠 کوئیز مالی</div>' +
        '<div class="mf-quiz-info">' + (done ? '🏆 پاداش را قبلاً دریافت کرده‌اید' : '🏆 ۱ امتیاز برای تکمیل کامل') + '</div>' +
        '<div id="mfQuizBox"></div></div>';
    mfRenderQuizQuestion();
}

function mfRenderQuizQuestion() {
    const box = document.getElementById('mfQuizBox');
    if (!box) return;
    const member = members.find(m => m.id === currentUser.memberId);
    if (mfQuizIdx >= MF_QUIZ.length) {
        const key = 'sandogh_mf_quiz_' + (member ? member.id : '');
        const done = localStorage.getItem(key) === '1';
        let reward = '';
        if (!done) {
            localStorage.setItem(key, '1');
            mfAddPoints(1);
            reward = '<div class="mf-reward-on">🎉 ۱ امتیاز اضافه شد</div>';
        } else {
            reward = '<div class="mf-reward-off">پاداش قبلاً دریافت شده 🎁</div>';
        }
        box.innerHTML = '<div style="text-align:center;padding:20px">' +
            '<div style="font-size:3rem">🎉</div>' +
            '<h3>کوئیز تمام شد!</h3>' +
            '<p>پاسخ درست: <b>' + mfQuizCorrect + '</b> از ' + MF_QUIZ.length + '</p>' +
            reward +
            '<button class="mf-btn" style="margin-top:12px" onclick="mfRestartQuiz()">🔄 شروع دوباره</button>' +
            '</div>';
        return;
    }
    const q = MF_QUIZ[mfQuizIdx];
    let html = '<h4 style="margin-bottom:12px">سؤال ' + (mfQuizIdx + 1) + ': ' + q.q + '</h4>';
    q.options.forEach(function (opt, i) {
        html += '<button class="mf-quiz-opt" onclick="mfAnswerQuiz(this,' + i + ')">' + opt + '</button>';
    });
    box.innerHTML = html;
}

function mfAnswerQuiz(btn, i) {
    const q = MF_QUIZ[mfQuizIdx];
    const opts = btn.parentElement.querySelectorAll('.mf-quiz-opt');
    opts.forEach(function (b) { b.disabled = true; });
    if (i === q.correct) { btn.classList.add('correct'); mfQuizCorrect++; }
    else { btn.classList.add('wrong'); opts[q.correct].classList.add('correct'); }
    setTimeout(function () { mfQuizIdx++; mfRenderQuizQuestion(); }, 1200);
}

function mfRestartQuiz() {
    const member = members.find(m => m.id === currentUser.memberId);
    if (member) mfRenderQuiz(document.getElementById('mfContent'), member);
}

function mfRenderNews(c) {
    const items = [
        { title: '💡 آیا می‌دانستید؟', text: 'خانواده‌هایی که بودجه ماهانه دارند، ۳۰٪ بیشتر پس‌انداز می‌کنند.', date: 'هفته جاری' },
        { title: '📈 پس‌انداز در شرایط تورمی', text: 'ترکیب پس‌انداز منظم و تسهیلات صندوق، بهترین راه حفظ ارزش پول شماست.', date: 'هفته گذشته' },
        { title: '🎓 هفته سواد مالی', text: 'با مطالعه درس‌ها و کوئیز، امتیاز کسب کنید.', date: 'این ماه' }
    ];
    let html = '<div class="mf-card"><div class="mf-card-title">📰 خبرنامه مالی</div>';
    items.forEach(function (n) {
        html += '<div class="mf-news"><h4>' + n.title + '</h4><p>' + n.text + '</p><div class="d">📅 ' + n.date + '</div></div>';
    });
    html += '</div>';
    c.innerHTML = html;
}

function mfRenderLoan(c) {
    c.innerHTML = '<div class="mf-card"><div class="mf-card-title">🧮 شبیه‌ساز وام</div>' +
        '<div class="mf-form">' +
        '<label>💰 مبلغ وام (تومان)</label><input type="number" id="mfLoanAmount" value="50000000" step="1000000" oninput="mfCalcLoan()">' +
        '<label>📅 تعداد اقساط (ماه)</label><input type="number" id="mfLoanMonths" value="24" min="1" max="120" oninput="mfCalcLoan()">' +
        '<label>📊 کارمزد سالانه (درصد)</label><input type="number" id="mfLoanRate" value="2" min="0" max="30" step="0.5" oninput="mfCalcLoan()">' +
        '</div>' +
        '<div class="mf-loan-result" id="mfLoanResult"></div></div>';
    mfCalcLoan();
}

function mfCalcLoan() {
    const res = document.getElementById('mfLoanResult');
    if (!res) return;
    const amount = parseFloat(document.getElementById('mfLoanAmount').value) || 0;
    let months = parseInt(document.getElementById('mfLoanMonths').value);
    const rate = parseFloat(document.getElementById('mfLoanRate').value) || 0;
    if (!months || months < 1) { res.innerHTML = '<div style="font-size:0.85rem">⚠️ تعداد اقساط معتبر وارد کنید</div>'; return; }
    if (months > 120) months = 120;
    const fee = amount * (rate / 100) * (months / 12);
    const total = amount + fee;
    const monthly = total / months;
    res.innerHTML = '<div class="mf-lr-label">قسط ماهانه شما</div>' +
        '<div class="mf-lr-amount">' + fmtNum(monthly) + ' تومان</div>' +
        '<div class="mf-lr-grid"><div>مجموع بازپرداخت<br><b>' + fmtNum(total) + '</b></div><div>کارمزد کل<br><b>' + fmtNum(fee) + '</b></div></div>';
}

function mfRenderBadges(c, member) {
    let years = 0;
    if (member.datMiladi) { const dd = new Date(member.datMiladi); if (!isNaN(dd.getTime())) years = Math.max(0, new Date().getFullYear() - dd.getFullYear()); }
    const txCount = (transactionsByMember.get(String(member.id)) || []).length;
    const salary = member.monthlySalary || 0;
    const badges = [
        { icon: '👑', name: 'پیشکسوت', desc: 'بیش از ۱۰ سال عضویت', rarity: 'افسانه‌ای', cls: 'mf-r-legendary', on: years >= 10 },
        { icon: '🕰️', name: 'وفادار', desc: 'بیش از ۵ سال عضویت', rarity: 'حماسی', cls: 'mf-r-epic', on: years >= 5 },
        { icon: '💯', name: 'صد تراکنشی', desc: '۱۰۰ تراکنش موفق', rarity: 'کمیاب', cls: 'mf-r-rare', on: txCount >= 100 },
        { icon: '🎯', name: 'تیرانداز', desc: '۱۲ قسط پرداخت‌شده', rarity: 'کمیاب', cls: 'mf-r-rare', on: (member.paidInstallments || 0) >= 12 },
        { icon: '🐋', name: 'نهنگ پس‌انداز', desc: 'پس‌انداز ≥ ۱۰ مقرری', rarity: 'حماسی', cls: 'mf-r-epic', on: salary > 0 && (member.savingsStatus || 0) >= 10 * salary },
        { icon: '🕊️', name: 'آسمان آبی', desc: 'بدون هیچ بدهی', rarity: 'معمولی', cls: 'mf-r-common', on: (member.loanBalance || 0) === 0 }
    ];
    let html = '<div class="mf-card"><div class="mf-card-title">🏅 نشان‌های کمیاب</div><p class="mf-note">بر اساس فعالیت واقعی شما فعال می‌شوند</p><div class="mf-badge-grid">';
    badges.forEach(function (b) {
        html += '<div class="mf-badge ' + (b.on ? 'on' : 'off') + '"><div class="ic">' + (b.on ? b.icon : '🔒') + '</div><div class="nm">' + b.name + '</div><div class="ds">' + b.desc + '</div><div class="rr ' + b.cls + '">' + b.rarity + '</div></div>';
    });
    html += '</div></div>';
    c.innerHTML = html;
}
