/* ============================================================
   صندوق اتحاد - تقویم مذهبی و ملی
   نسخه: 2.0
   ============================================================ */

function utRenderCalendarPage(c) {
    const t = getTodayShamsi();
    utCalYear = t.y;
    utCalMonth = t.m;
    c.innerHTML = '<div class="ut-card">' +
        '<div class="ut-card-title"><i class="fas fa-calendar-alt" style="color:var(--teal-color)"></i> تقویم مذهبی و ملی</div>' +
        '<div class="ut-cal-nav"><button onclick="utChangeMonth(-1)"><i class="fas fa-chevron-right"></i></button>' +
        '<div class="ut-month-name" id="utCalMonthName"></div>' +
        '<button onclick="utChangeMonth(1)"><i class="fas fa-chevron-left"></i></button></div>' +
        '<div class="ut-cal-grid" id="utCalGrid"></div>' +
        '<p class="ut-cal-hint">🔴 جمعه‌ها و روزهای دارای نقطه طلایی مناسبت دارند</p>' +
        '</div>' +
        '<div class="ut-card"><div class="ut-card-title">⏳ مناسبت‌های پیش رو</div><div id="utUpcoming"></div></div>';
    utRenderCalendarGrid();
    utRenderUpcoming();
}

function utChangeMonth(delta) {
    utCalMonth += delta;
    if (utCalMonth > 12) { utCalMonth = 1; utCalYear++; }
    if (utCalMonth < 1) { utCalMonth = 12; utCalYear--; }
    utRenderCalendarGrid();
}

function utRenderCalendarGrid() {
    const nameEl = document.getElementById('utCalMonthName');
    const grid = document.getElementById('utCalGrid');
    if (!nameEl || !grid) return;
    nameEl.textContent = UT_MONTHS[utCalMonth - 1] + ' ' + utFaDigits(utCalYear);
    const today = getTodayShamsi();
    let html = '';
    UT_WEEKDAYS.forEach(function (w, i) {
        html += '<div class="ut-cal-weekday' + (i === 6 ? ' fri' : '') + '">' + w + '</div>';
    });
    const firstWd = utJalaliWeekday(utCalYear, utCalMonth, 1);
    const days = utJalaliMonthDays(utCalYear, utCalMonth);
    for (let i = 0; i < firstWd; i++) html += '<div class="ut-cal-day empty"></div>';
    for (let d = 1; d <= days; d++) {
        const wd = utJalaliWeekday(utCalYear, utCalMonth, d);
        const isToday = (utCalYear === today.y && utCalMonth === today.m && d === today.d);
        const ev = UT_EVENTS.find(function (e) { return e.m === utCalMonth && e.d === d; });
        let cls = 'ut-cal-day';
        if (wd === 6) cls += ' friday';
        if (isToday) cls += ' today';
        if (ev) cls += ' has-event';
        const click = ev ? ' onclick="utShowEvent(' + utCalMonth + ',' + d + ')"' : '';
        html += '<div class="' + cls + '"' + click + '>' + utFaDigits(d) + (ev ? '<span class="dot"></span>' : '') + '</div>';
    }
    grid.innerHTML = html;
}

function utShowEvent(m, d) {
    const ev = UT_EVENTS.find(function (e) { return e.m === m && e.d === d; });
    if (!ev) return;
    utShowModal('<div style="text-align:center"><div style="font-size:3.5rem">' + (ev.r ? '🕌' : (ev.h ? '🇮🇷' : '📅')) + '</div>' +
        '<h2 style="margin:12px 0">' + esc(ev.t) + '</h2>' +
        '<p style="color:var(--text-secondary)">📅 ' + utFaDigits(d) + ' ' + UT_MONTHS[m - 1] + '</p>' +
        '<div style="margin-top:12px">' + (ev.h ? '<span class="ut-holiday-badge">تعطیل رسمی</span>' : '') +
        (ev.r ? '<span class="ut-religious-badge">مناسبت مذهبی</span>' : '') + '</div></div>');
}

function utRenderUpcoming() {
    const el = document.getElementById('utUpcoming');
    if (!el) return;
    const today = getTodayShamsi();
    const todayNum = utDayOfYear(today.m, today.d);
    const upcoming = UT_EVENTS.map(function (e) {
        let diff = utDayOfYear(e.m, e.d) - todayNum;
        if (diff < 0) diff += 365;
        return { m: e.m, d: e.d, t: e.t, h: e.h, r: e.r, diff: diff };
    }).sort(function (a, b) { return a.diff - b.diff; }).slice(0, 8);
    let html = '';
    upcoming.forEach(function (e) {
        const countdown = e.diff === 0 ? '🎉 امروز' : (e.diff === 1 ? 'فردا' : utFaDigits(e.diff) + ' روز دیگر');
        html += '<div class="ut-event-item">' +
            '<div class="ut-event-date"><span class="d">' + utFaDigits(e.d) + '</span><span class="m">' + UT_MONTHS[e.m - 1] + '</span></div>' +
            '<div class="ut-event-info"><h4>' + esc(e.t) + '</h4><p>' + (e.h ? 'تعطیل رسمی' : '') + (e.r ? ' | مذهبی' : '') + '</p></div>' +
            '<div class="ut-event-countdown">' + countdown + '</div></div>';
    });
    el.innerHTML = html;
}
