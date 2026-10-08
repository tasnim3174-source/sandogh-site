/* ============================================================
   صندوق اتحاد - قلک ویژه نوجوانان
   نسخه: 2.0
   ============================================================ */

function getTeenStorageKey() {
    const memberId = currentUser?.memberId || 'guest';
    return 'teenPiggy_' + memberId;
}

function loadTeenData() {
    try {
        const saved = localStorage.getItem(getTeenStorageKey());
        if (saved) {
            const data = JSON.parse(saved);
            teenData.savings = data.savings || [];
            teenData.goals = data.goals || [];
            teenData.challenges = data.challenges || [];
            teenData.points = data.points || 0;
            teenData.level = data.level || 1;
            teenData.badges = data.badges || [];
            teenData.budget = data.budget || { income: 0, expenses: [] };
            teenData.lessons = data.lessons || [];
            teenData.history = data.history || [];
        }
    } catch(e) {}
    updateTeenUI();
}

function saveTeenData() {
    try {
        localStorage.setItem(getTeenStorageKey(), JSON.stringify(teenData));
    } catch(e) {}
    updateTeenUI();
}

function updateTeenUI() {
    const pointsEl = document.getElementById('teenPoints');
    const savingsEl = document.getElementById('teenSavings');
    const levelEl = document.getElementById('teenLevel');
    if (pointsEl) pointsEl.textContent = teenData.points;
    if (savingsEl) {
        const total = teenData.savings.reduce((sum, s) => sum + s.amount, 0);
        savingsEl.textContent = total.toLocaleString('fa-IR');
    }
    if (levelEl) levelEl.textContent = teenData.level;
}

function updateTeenLevel() {
    const points = teenData.points;
    if (points >= 500) teenData.level = 5;
    else if (points >= 300) teenData.level = 4;
    else if (points >= 150) teenData.level = 3;
    else if (points >= 50) teenData.level = 2;
    else teenData.level = 1;
}

function openTeenPiggy() {
    loadTeenData();
    const oldContainer = document.getElementById('teenPiggyContainer');
    if (oldContainer) oldContainer.remove();

    const container = document.createElement('div');
    container.id = 'teenPiggyContainer';
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 3000;
        background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕ بستن';
    closeBtn.style.cssText = `
        position: fixed;
        top: 12px; right: 12px;
        z-index: 3001;
        background: rgba(0,0,0,0.7);
        color: white;
        border: none;
        padding: 8px 18px;
        border-radius: 30px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        font-family: 'B Titr', Tahoma, sans-serif;
    `;
    closeBtn.onclick = function() {
        document.body.removeChild(container);
        document.body.removeChild(closeBtn);
        renderPage('menu');
    };

    container.innerHTML = getTeenPiggyHTML();
    document.body.appendChild(container);
    document.body.appendChild(closeBtn);
}

function getTeenPiggyHTML() {
    return `
    <style>
        #teenPiggyContainer .teen-title { font-size: 28px; font-weight: bold; margin: 10px 0 5px; color: #d97706; }
        #teenPiggyContainer .teen-sub { font-size: 14px; color: #666; margin-bottom: 15px; }
        #teenPiggyContainer .teen-stats { display: flex; justify-content: space-around; width: 100%; max-width: 450px; background: rgba(255,255,255,0.9); border-radius: 16px; padding: 15px; margin-bottom: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        #teenPiggyContainer .teen-stat { text-align: center; }
        #teenPiggyContainer .teen-stat .value { font-size: 22px; font-weight: bold; color: #d97706; }
        #teenPiggyContainer .teen-stat .label { font-size: 11px; color: #888; }
        #teenPiggyContainer .teen-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; max-width: 450px; margin: 10px 0; }
        #teenPiggyContainer .teen-card { background: rgba(255,255,255,0.95); border-radius: 16px; padding: 20px 10px; text-align: center; border: 2px solid rgba(217,119,6,0.15); cursor: pointer; }
        #teenPiggyContainer .teen-card:active { transform: scale(0.95); }
        #teenPiggyContainer .teen-card .icon { font-size: 40px; margin-bottom: 8px; display: block; }
        #teenPiggyContainer .teen-card .name { font-size: 14px; font-weight: bold; color: #333; }
        #teenPiggyContainer .teen-card .desc { font-size: 11px; color: #888; margin-top: 4px; }
        #teenPiggyContainer .teen-card .badge-new { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 2px 10px; border-radius: 10px; font-size: 9px; margin-top: 6px; }
        #teenPiggyContainer .teen-footer { color: #999; font-size: 12px; margin-top: 15px; text-align: center; }
        #teenPiggyContainer .teen-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 3100; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
        #teenPiggyContainer .teen-modal.show { display: flex; }
        #teenPiggyContainer .teen-modal-content { background: white; border-radius: 20px; padding: 25px; max-width: 500px; width: 90%; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 50px rgba(0,0,0,0.3); position: relative; }
        #teenPiggyContainer .teen-modal-close { position: absolute; top: 12px; left: 12px; background: #f5576c; border: none; width: 32px; height: 32px; border-radius: 50%; color: white; cursor: pointer; font-size: 18px; }
        #teenPiggyContainer .teen-modal-title { text-align: center; font-size: 22px; font-weight: bold; color: #d97706; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #fef3c7; }
        #teenPiggyContainer .teen-form-group { margin: 12px 0; }
        #teenPiggyContainer .teen-form-group label { display: block; font-weight: bold; color: #333; font-size: 14px; margin-bottom: 5px; }
        #teenPiggyContainer .teen-form-group input { width: 100%; padding: 10px 14px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; outline: none; }
        #teenPiggyContainer .teen-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; font-family: 'B Titr', Tahoma, sans-serif; }
        #teenPiggyContainer .teen-list-item { background: #f9fafb; padding: 12px 15px; border-radius: 10px; margin: 8px 0; display: flex; justify-content: space-between; align-items: center; border-right: 3px solid #d97706; }
        #teenPiggyContainer .teen-list-item .amount { font-weight: bold; color: #d97706; }
        #teenPiggyContainer .teen-progress { height: 8px; background: #e5e7eb; border-radius: 99px; overflow: hidden; margin: 8px 0; }
        #teenPiggyContainer .teen-progress .fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #d97706); border-radius: 99px; transition: width 0.5s ease; }
        @media (max-width: 500px) { #teenPiggyContainer .teen-grid { grid-template-columns: repeat(2, 1fr); } }
    </style>

    <div style="display:flex;flex-direction:column;align-items:center;width:100%;max-width:450px;padding:10px;text-align:center;">
        <div style="font-size:60px;margin-bottom:5px;">🐷</div>
        <div class="teen-title">قلک ویژه نوجوانان</div>
        <div class="teen-sub">💰 مدیریت پولت رو یاد بگیر و برای اهداف مالی برنامه‌ریزی کن!</div>
        
        <div class="teen-stats">
            <div class="teen-stat"><div class="value" id="teenPoints">0</div><div class="label">⭐ امتیاز</div></div>
            <div class="teen-stat"><div class="value" id="teenSavings">0</div><div class="label">💰 پس‌انداز</div></div>
            <div class="teen-stat"><div class="value" id="teenLevel">1</div><div class="label">🏅 سطح</div></div>
        </div>
        
        <div class="teen-grid">
            <div class="teen-card" onclick="openTeenPiggyBank()"><span class="icon">🐷</span><div class="name">قلک دیجیتال</div><div class="desc">ثبت پس‌انداز و هدف</div></div>
            <div class="teen-card" onclick="openTeenChallenges()"><span class="icon">🎯</span><div class="name">چالش‌ها</div><div class="desc">چالش‌های مالی</div><span class="badge-new">جدید</span></div>
            <div class="teen-card" onclick="openTeenBudget()"><span class="icon">📊</span><div class="name">دستیار بودجه</div><div class="desc">مدیریت درآمد و هزینه</div></div>
            <div class="teen-card" onclick="openTeenLessons()"><span class="icon">🎓</span><div class="name">آموزش مالی</div><div class="desc">درس‌های کوتاه</div></div>
            <div class="teen-card" onclick="openTeenBadges()"><span class="icon">🏅</span><div class="name">نشان‌ها</div><div class="desc">مدال‌های افتخار</div></div>
            <div class="teen-card" onclick="openTeenHistory()"><span class="icon">📜</span><div class="name">تاریخچه</div><div class="desc">فعالیت‌های من</div></div>
        </div>
        
        <div class="teen-footer">
            💡 با فعالیت در این بخش، امتیازهای اختصاصی قلک رو دریافت کن!<br>
            <span style="font-size:11px;color:#bbb;">امتیازات این بخش کاملاً جدا از سیستم اصلی صندوق است</span>
        </div>
    </div>
    `;
}

function openTeenPiggyBank() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const totalSavings = teenData.savings.reduce((sum, s) => sum + s.amount, 0);
    const goal = teenData.goals.length > 0 ? teenData.goals[0] : null;
    const progress = goal ? Math.min(100, Math.round((totalSavings / goal.target) * 100)) : 0;

    const modal = document.createElement('div');
    modal.className = 'teen-modal show';
    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">🐷 قلک دیجیتال</div>
            <div style="margin:10px 0;">
                <div style="font-size:32px;text-align:center;margin:10px 0;">💰 ${totalSavings.toLocaleString('fa-IR')} تومان</div>
                ${goal ? `
                    <div style="background:#f9fafb;padding:12px;border-radius:10px;margin:10px 0;">
                        <div style="font-weight:bold;color:#d97706;">🎯 هدف: ${goal.name}</div>
                        <div style="font-size:13px;color:#666;">هدف: ${goal.target.toLocaleString('fa-IR')} تومان</div>
                        <div class="teen-progress"><div class="fill" style="width:${progress}%"></div></div>
                        <div style="font-size:12px;color:#888;">${progress}% تکمیل شده</div>
                    </div>
                ` : '<div style="color:#888;text-align:center;padding:10px;">هنوز هدفی تعیین نکردی!</div>'}
            </div>
            <div class="teen-form-group"><label>💰 مبلغ پس‌انداز (تومان)</label><input type="number" id="teenSaveAmount" placeholder="مبلغ را وارد کن..." min="1000"></div>
            <div class="teen-form-group"><label>📝 توضیحات (اختیاری)</label><input type="text" id="teenSaveDesc" placeholder="مثلاً: پول توجیبی امروز"></div>
            <button class="teen-btn" onclick="addTeenSaving()">➕ ثبت پس‌انداز</button>
            <hr style="margin:15px 0;border-color:#eee;">
            <div style="display:flex;gap:8px;">
                <button class="teen-btn" style="flex:1;background:linear-gradient(135deg,#10b981,#059669);" onclick="openTeenGoalForm()">🎯 هدف جدید</button>
                <button class="teen-btn" style="flex:1;background:linear-gradient(135deg,#8b5cf6,#7c3aed);" onclick="showTeenSavingsHistory()">📜 تاریخچه</button>
            </div>
            <div id="teenSavingsList" style="margin-top:10px;max-height:200px;overflow-y:auto;"></div>
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
    renderTeenSavingsList();
}

function addTeenSaving() {
    const amount = parseInt(document.getElementById('teenSaveAmount').value);
    const desc = document.getElementById('teenSaveDesc').value || 'پس‌انداز روزانه';
    if (!amount || amount < 1000) { alert('❌ لطفاً مبلغ معتبر (حداقل ۱۰۰۰ تومان) وارد کن!'); return; }
    teenData.savings.push({ date: new Date().toLocaleDateString('fa-IR'), amount: amount, desc: desc });
    const pointsEarned = Math.floor(amount / 10000);
    teenData.points += pointsEarned;
    teenData.history.push({ date: new Date().toLocaleDateString('fa-IR'), action: 'پس‌انداز', detail: `${amount.toLocaleString('fa-IR')} تومان - ${desc}`, points: pointsEarned });
    updateTeenLevel();
    saveTeenData();
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    openTeenPiggyBank();
}

function openTeenGoalForm() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const modal = document.createElement('div');
    modal.className = 'teen-modal show';
    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">🎯 هدف جدید</div>
            <div class="teen-form-group"><label>🎯 نام هدف</label><input type="text" id="teenGoalName" placeholder="مثلاً: خرید دوچرخه"></div>
            <div class="teen-form-group"><label>💰 مبلغ هدف (تومان)</label><input type="number" id="teenGoalTarget" placeholder="مبلغ هدف رو وارد کن..." min="10000"></div>
            <button class="teen-btn" onclick="addTeenGoal()">✅ ثبت هدف</button>
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
}

function addTeenGoal() {
    const name = document.getElementById('teenGoalName').value;
    const target = parseInt(document.getElementById('teenGoalTarget').value);
    if (!name || !target || target < 10000) { alert('❌ لطفاً نام و مبلغ معتبر وارد کن!'); return; }
    teenData.goals = [{ name: name, target: target, date: new Date().toLocaleDateString('fa-IR') }];
    teenData.history.push({ date: new Date().toLocaleDateString('fa-IR'), action: 'هدف‌گذاری', detail: `${name} - ${target.toLocaleString('fa-IR')} تومان`, points: 5 });
    teenData.points += 5;
    saveTeenData();
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    openTeenPiggyBank();
}

function showTeenSavingsHistory() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const modal = document.createElement('div');
    modal.className = 'teen-modal show';
    let html = '<div style="max-height:300px;overflow-y:auto;">';
    if (teenData.savings.length === 0) {
        html += '<div style="text-align:center;color:#888;padding:20px;">هنوز پس‌اندازی ثبت نشده!</div>';
    } else {
        teenData.savings.slice().reverse().forEach(s => {
            html += `<div class="teen-list-item"><div><div style="font-weight:bold;">${s.desc}</div><div style="font-size:11px;color:#888;">${s.date}</div></div><div class="amount">${s.amount.toLocaleString('fa-IR')} تومان</div></div>`;
        });
    }
    html += '</div>';
    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">📜 تاریخچه پس‌انداز</div>
            ${html}
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
}

function renderTeenSavingsList() {
    const list = document.getElementById('teenSavingsList');
    if (!list) return;
    const recent = teenData.savings.slice().reverse().slice(0, 5);
    if (recent.length === 0) { list.innerHTML = '<div style="text-align:center;color:#888;padding:10px;">هنوز پس‌اندازی ثبت نشده!</div>'; return; }
    list.innerHTML = recent.map(s => `
        <div class="teen-list-item">
            <div><div style="font-weight:bold;">${s.desc}</div><div style="font-size:11px;color:#888;">${s.date}</div></div>
            <div class="amount">${s.amount.toLocaleString('fa-IR')} تومان</div>
        </div>
    `).join('');
}

function openTeenChallenges() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const modal = document.createElement('div');
    modal.className = 'teen-modal show';
    let html = '<div style="max-height:400px;overflow-y:auto;">';
    teenChallengesList.forEach(ch => {
        const completed = teenData.challenges.includes(ch.id);
        html += `
            <div style="background:${completed ? '#d1fae5' : '#f9fafb'};padding:15px;border-radius:12px;margin:10px 0;border-right:4px solid ${completed ? '#10b981' : '#f59e0b'};">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div><div style="font-weight:bold;color:#333;">${ch.name}</div><div style="font-size:12px;color:#666;">${ch.desc}</div><div style="font-size:11px;color:#888;">⭐ ${ch.points} امتیاز</div></div>
                    <div>${completed ? '<span style="color:#10b981;font-weight:bold;">✅ انجام شد</span>' : `<button class="teen-btn" style="padding:8px 16px;font-size:13px;width:auto;" onclick="startTeenChallenge(${ch.id})">شروع</button>`}</div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">🎯 چالش‌های مالی</div>
            ${html}
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
}

function startTeenChallenge(id) {
    if (teenData.challenges.includes(id)) { alert('✅ این چالش رو قبلاً انجام دادی!'); return; }
    if (confirm('آماده‌ای چالش رو شروع کنی؟')) {
        const challenge = teenChallengesList.find(c => c.id === id);
        teenData.challenges.push(id);
        teenData.points += challenge.points;
        teenData.history.push({ date: new Date().toLocaleDateString('fa-IR'), action: 'چالش', detail: `تکمیل چالش: ${challenge.name}`, points: challenge.points });
        updateTeenLevel();
        saveTeenData();
        document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
        openTeenChallenges();
        alert(`🎉 تبریک! ${challenge.points} امتیاز گرفتی!`);
    }
}

function openTeenBudget() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const modal = document.createElement('div');
    modal.className = 'teen-modal show';
    const totalIncome = teenData.budget.income || 0;
    const totalExpenses = teenData.budget.expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpenses;
    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">📊 دستیار بودجه‌بندی</div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:10px 0;">
                <div style="background:#d1fae5;padding:12px;border-radius:10px;text-align:center;"><div style="font-size:11px;color:#666;">درآمد</div><div style="font-weight:bold;color:#10b981;">${totalIncome.toLocaleString('fa-IR')}</div></div>
                <div style="background:#fef3c7;padding:12px;border-radius:10px;text-align:center;"><div style="font-size:11px;color:#666;">هزینه</div><div style="font-weight:bold;color:#d97706;">${totalExpenses.toLocaleString('fa-IR')}</div></div>
                <div style="background:${balance >= 0 ? '#d1fae5' : '#fecaca'};padding:12px;border-radius:10px;text-align:center;"><div style="font-size:11px;color:#666;">مانده</div><div style="font-weight:bold;color:${balance >= 0 ? '#10b981' : '#ef4444'};">${balance.toLocaleString('fa-IR')}</div></div>
            </div>
            <div style="display:flex;gap:8px;margin:10px 0;">
                <button class="teen-btn" style="flex:1;background:linear-gradient(135deg,#10b981,#059669);" onclick="openTeenIncomeForm()">➕ ثبت درآمد</button>
                <button class="teen-btn" style="flex:1;background:linear-gradient(135deg,#ef4444,#dc2626);" onclick="openTeenExpenseForm()">➖ ثبت هزینه</button>
            </div>
            <div id="teenBudgetList" style="max-height:250px;overflow-y:auto;margin-top:10px;"></div>
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
    renderTeenBudgetList();
}

function openTeenIncomeForm() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const modal = document.createElement('div');
    modal.className = 'teen-modal show';
    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">➕ ثبت درآمد</div>
            <div class="teen-form-group"><label>💰 مبلغ درآمد (تومان)</label><input type="number" id="teenIncomeAmount" placeholder="مبلغ رو وارد کن..." min="1000"></div>
            <div class="teen-form-group"><label>📝 توضیحات</label><input type="text" id="teenIncomeDesc" placeholder="مثلاً: پول توجیبی"></div>
            <button class="teen-btn" onclick="addTeenIncome()">✅ ثبت درآمد</button>
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
}

function addTeenIncome() {
    const amount = parseInt(document.getElementById('teenIncomeAmount').value);
    const desc = document.getElementById('teenIncomeDesc').value || 'درآمد';
    if (!amount || amount < 1000) { alert('❌ لطفاً مبلغ معتبر وارد کن!'); return; }
    teenData.budget.income += amount;
    teenData.budget.expenses.push({ date: new Date().toLocaleDateString('fa-IR'), amount: amount, desc: desc, type: 'income' });
    teenData.history.push({ date: new Date().toLocaleDateString('fa-IR'), action: 'درآمد', detail: `${amount.toLocaleString('fa-IR')} تومان - ${desc}`, points: 2 });
    teenData.points += 2;
    saveTeenData();
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    openTeenBudget();
}

function openTeenExpenseForm() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const modal = document.createElement('div');
    modal.className = 'teen-modal show';
    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">➖ ثبت هزینه</div>
            <div class="teen-form-group"><label>💰 مبلغ هزینه (تومان)</label><input type="number" id="teenExpenseAmount" placeholder="مبلغ رو وارد کن..." min="1000"></div>
            <div class="teen-form-group"><label>📝 توضیحات</label><input type="text" id="teenExpenseDesc" placeholder="مثلاً: خرید خوراکی"></div>
            <button class="teen-btn" onclick="addTeenExpense()">✅ ثبت هزینه</button>
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
}

function addTeenExpense() {
    const amount = parseInt(document.getElementById('teenExpenseAmount').value);
    const desc = document.getElementById('teenExpenseDesc').value || 'هزینه';
    if (!amount || amount < 1000) { alert('❌ لطفاً مبلغ معتبر وارد کن!'); return; }
    teenData.budget.expenses.push({ date: new Date().toLocaleDateString('fa-IR'), amount: amount, desc: desc, type: 'expense' });
    teenData.history.push({ date: new Date().toLocaleDateString('fa-IR'), action: 'هزینه', detail: `${amount.toLocaleString('fa-IR')} تومان - ${desc}`, points: 0 });
    saveTeenData();
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    openTeenBudget();
}

function renderTeenBudgetList() {
    const list = document.getElementById('teenBudgetList');
    if (!list) return;
    const all = [...teenData.budget.expenses].reverse();
    if (all.length === 0) { list.innerHTML = '<div style="text-align:center;color:#888;padding:10px;">هنوز تراکنشی ثبت نشده!</div>'; return; }
    list.innerHTML = all.map(e => `
        <div class="teen-list-item" style="border-right-color:${e.type === 'income' ? '#10b981' : '#ef4444'};">
            <div><div style="font-weight:bold;">${e.desc}</div><div style="font-size:11px;color:#888;">${e.date}</div></div>
            <div class="amount" style="color:${e.type === 'income' ? '#10b981' : '#ef4444'};">${e.type === 'income' ? '+' : '-'} ${e.amount.toLocaleString('fa-IR')}</div>
        </div>
    `).join('');
}

function openTeenLessons() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const modal = document.createElement('div');
    modal.className = 'teen-modal show';
    let html = '<div style="max-height:400px;overflow-y:auto;">';
    teenLessons.forEach(lesson => {
        const completed = teenData.lessons.includes(lesson.id);
        html += `
            <div style="background:${completed ? '#d1fae5' : '#f9fafb'};padding:15px;border-radius:12px;margin:10px 0;border-right:4px solid ${completed ? '#10b981' : '#8b5cf6'};">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div><div style="font-weight:bold;color:#333;">${lesson.title}</div><div style="font-size:12px;color:#666;">${lesson.desc}</div><div style="font-size:11px;color:#888;">⭐ ${lesson.points} امتیاز</div></div>
                    <div>${completed ? '<span style="color:#10b981;font-weight:bold;">✅ خوانده شد</span>' : `<button class="teen-btn" style="padding:8px 16px;font-size:13px;width:auto;" onclick="completeTeenLesson(${lesson.id})">📖 بخوان</button>`}</div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">🎓 آموزش مالی</div>
            ${html}
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
}

function completeTeenLesson(id) {
    if (teenData.lessons.includes(id)) { alert('✅ این درس رو قبلاً خوندی!'); return; }
    const lesson = teenLessons.find(l => l.id === id);
    teenData.lessons.push(id);
    teenData.points += lesson.points;
    teenData.history.push({ date: new Date().toLocaleDateString('fa-IR'), action: 'درس مالی', detail: `تکمیل درس: ${lesson.title}`, points: lesson.points });
    updateTeenLevel();
    saveTeenData();
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    openTeenLessons();
    alert(`🎉 تبریک! ${lesson.points} امتیاز گرفتی!`);
}

function openTeenBadges() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const modal = document.createElement('div');
    modal.className = 'teen-modal show';

    const stats = {
        savings: teenData.savings.length,
        goals: teenData.goals.length,
        challenges: teenData.challenges.length,
        transactions: teenData.budget.expenses.length,
        lessons: teenData.lessons.length
    };

    teenBadgesList.forEach(badge => {
        let earned = false;
        if (badge.id === 'first_save' && stats.savings >= 1) earned = true;
        else if (badge.id === 'goal_setter' && stats.goals >= 1) earned = true;
        else if (badge.id === 'challenger' && stats.challenges >= 1) earned = true;
        else if (badge.id === 'saver_10' && stats.savings >= 10) earned = true;
        else if (badge.id === 'budget_master' && stats.transactions >= 5) earned = true;
        else if (badge.id === 'learner' && stats.lessons >= 3) earned = true;
        if (earned && !teenData.badges.includes(badge.id)) teenData.badges.push(badge.id);
    });
    saveTeenData();

    let html = '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:10px;">';
    teenBadgesList.forEach(badge => {
        const has = teenData.badges.includes(badge.id);
        html += `
            <div style="background:${has ? '#fef3c7' : '#f3f4f6'};padding:15px;border-radius:15px;text-align:center;width:120px;border:2px solid ${has ? '#f59e0b' : '#e5e7eb'};">
                <div style="font-size:36px;">${has ? badge.icon : '🔒'}</div>
                <div style="font-size:13px;font-weight:bold;color:${has ? '#92400e' : '#9ca3af'};">${badge.name}</div>
                <div style="font-size:10px;color:${has ? '#92400e' : '#9ca3af'};">${badge.desc}</div>
            </div>
        `;
    });
    html += '</div>';

    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">🏅 نشان‌های من</div>
            ${html}
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
}

function openTeenHistory() {
    document.querySelectorAll('#teenPiggyContainer .teen-modal').forEach(el => el.remove());
    const modal = document.createElement('div');
    modal.className = 'teen-modal show';
    let html = '<div style="max-height:400px;overflow-y:auto;">';
    if (teenData.history.length === 0) {
        html += '<div style="text-align:center;color:#888;padding:20px;">هنوز فعالیتی ثبت نشده!</div>';
    } else {
        teenData.history.slice().reverse().forEach(h => {
            html += `
                <div class="teen-list-item">
                    <div><div style="font-weight:bold;">${h.action}</div><div style="font-size:12px;color:#666;">${h.detail}</div><div style="font-size:11px;color:#888;">${h.date}</div></div>
                    <div style="color:${h.points > 0 ? '#10b981' : '#888'};">${h.points > 0 ? '+' + h.points : ''}</div>
                </div>
            `;
        });
    }
    html += '</div>';
    modal.innerHTML = `
        <div class="teen-modal-content">
            <button class="teen-modal-close" onclick="this.closest('.teen-modal').remove()">✕</button>
            <div class="teen-modal-title">📜 تاریخچه فعالیت‌ها</div>
            ${html}
        </div>
    `;
    document.getElementById('teenPiggyContainer').appendChild(modal);
}
