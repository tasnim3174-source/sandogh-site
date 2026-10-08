/* ============================================================
   صندوق اتحاد - یادداشت‌ها
   نسخه: 2.0
   ============================================================ */

function utLoadNotes() { 
    try { return JSON.parse(localStorage.getItem('sandogh_ut_notes')) || []; } catch (e) { return []; } 
}
function utSaveNotes(list) { 
    try { localStorage.setItem('sandogh_ut_notes', JSON.stringify(list)); } catch (e) { } 
}

function utDateToJalali(dateObj) {
    const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(dateObj);
    let y = 0, m = 0, d = 0;
    parts.forEach(function (p) { 
        if (p.type === 'year') y = +p.value; 
        if (p.type === 'month') m = +p.value; 
        if (p.type === 'day') d = +p.value; 
    });
    return { y: y, m: m, d: d };
}

function utRenderNotes(c) {
    c.innerHTML = '<div class="ut-card">' +
        '<div class="ut-card-title"><i class="fas fa-sticky-note" style="color:#ec4899"></i> یادداشت‌های مالی ' +
        '<button class="ut-btn ut-btn-sm" style="margin-right:auto" onclick="utOpenNoteForm()"><i class="fas fa-plus"></i> یادداشت جدید</button></div>' +
        '<div class="ut-search"><input type="text" id="utNoteSearch" placeholder="جستجو..." oninput="utRenderNotesList()"><i class="fas fa-search"></i></div>' +
        '<div id="utNotesList"></div></div>';
    utRenderNotesList();
}

function utRenderNotesList() {
    const searchEl = document.getElementById('utNoteSearch');
    const q = searchEl ? searchEl.value.trim() : '';
    let list = utLoadNotes().sort(function (a, b) { return b.id - a.id; });
    if (q) list = list.filter(function (n) { return n.title.indexOf(q) >= 0 || n.text.indexOf(q) >= 0; });
    const el = document.getElementById('utNotesList');
    if (!el) return;
    if (!list.length) { el.innerHTML = '<div class="ut-empty"><div class="ic">📝</div>هنوز یادداشتی ندارید</div>'; return; }
    const t = getTodayShamsi();
    const todayNum = t.y * 10000 + t.m * 100 + t.d;
    let html = '';
    list.forEach(function (n) {
        let remindHtml = '';
        if (n.remind) {
            const rp = n.remind.split('/').map(Number);
            const remindNum = rp[0] * 10000 + rp[1] * 100 + rp[2];
            if (remindNum <= todayNum) {
                remindHtml = '<span class="ut-remind-alert">⏰ سررسید: ' + utFaDigits(n.remind) + '</span>';
            } else {
                remindHtml = '<span style="font-size:0.63rem;color:var(--text-muted)">📅 یادآوری: ' + utFaDigits(n.remind) + '</span>';
            }
        }
        const catInfo = UT_CATS[n.cat] || UT_CATS.personal;
        html += '<div class="ut-note-item cat-' + n.cat + '">' +
            '<div class="ut-note-head"><h4>' + esc(n.title) + '</h4><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' + remindHtml +
            '<span class="ut-note-cat ' + catInfo.badge + '">' + catInfo.label + '</span></div></div>' +
            '<div class="ut-note-text">' + esc(n.text) + '</div>' +
            '<div class="ut-note-foot"><span>🗓️ ثبت: ' + utFaDigits(n.created) + '</span>' +
            '<button class="ut-btn ut-btn-danger ut-btn-sm" onclick="utDeleteNote(' + n.id + ')"><i class="fas fa-trash"></i> حذف</button></div>' +
            '</div>';
    });
    el.innerHTML = html;
}

function utOpenNoteForm() {
    utShowModal('<h2 style="margin-bottom:15px">📝 یادداشت جدید</h2>' +
        '<div class="ut-form-group"><label>عنوان</label><input type="text" id="utNtTitle"></div>' +
        '<div class="ut-form-group"><label>متن</label><textarea id="utNtText"></textarea></div>' +
        '<div class="ut-form-group"><label>دسته‌بندی</label><select id="utNtCat"><option value="money">💰 مالی</option><option value="reminder">⏰ یادآوری</option><option value="personal">👤 شخصی</option></select></div>' +
        '<div class="ut-form-group"><label>تاریخ یادآوری (اختیاری)</label><input type="date" id="utNtRemind"></div>' +
        '<button class="ut-btn" style="width:100%" onclick="utSaveNote()">✅ ذخیره</button>');
}

function utSaveNote() {
    const title = document.getElementById('utNtTitle').value.trim();
    const text = document.getElementById('utNtText').value.trim();
    const cat = document.getElementById('utNtCat').value;
    const remindInput = document.getElementById('utNtRemind').value;
    if (!title) { alert('⚠️ عنوان را وارد کنید'); return; }
    let remind = '';
    if (remindInput) {
        const j = utDateToJalali(new Date(remindInput + 'T12:00:00'));
        remind = j.y + '/' + String(j.m).padStart(2, '0') + '/' + String(j.d).padStart(2, '0');
    }
    const t = getTodayShamsi();
    const created = t.y + '/' + String(t.m).padStart(2, '0') + '/' + String(t.d).padStart(2, '0');
    const list = utLoadNotes();
    list.push({ id: Date.now(), title: title, text: text, cat: cat, remind: remind, created: created });
    utSaveNotes(list);
    utCloseModal();
    utRenderNotesList();
}

function utDeleteNote(id) {
    if (!confirm('حذف این یادداشت؟')) return;
    utSaveNotes(utLoadNotes().filter(function (n) { return n.id !== id; }));
    utRenderNotesList();
}
