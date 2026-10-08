/* ============================================================
   صندوق اتحاد - مودال‌ها
   نسخه: 2.0
   ============================================================ */

// ============================================================
// تنظیمات
// ============================================================
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        const currentTheme = localStorage.getItem('sandogh_theme') || 'auto';
        document.querySelectorAll('.theme-option').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.theme-option[onclick="setTheme('${currentTheme}')"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) { modal.style.display = 'none'; modal.classList.remove('show'); }
}

function closeNotifPanel() {
    document.getElementById('notificationPanel').classList.remove('show');
}

// ============================================================
// اعلان‌ها
// ============================================================
function renderNotificationList(filter) {
    const list = document.getElementById('notificationList');
    let filtered = notifications;
    if (filter && filter !== 'all') filtered = notifications.filter(n => n.category === filter);
    if (filtered.length === 0) {
        list.innerHTML = '<p style="text-align:center;padding:16px;color:var(--text-secondary);font-size:0.75rem;">هیچ اعلانی وجود ندارد</p>';
        return;
    }
    list.innerHTML = filtered.map(n => `<div class="notification-item"><div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--gradient-start);"><i class="fas ${n.type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i></div><div style="flex:1;"><div style="font-size:0.75rem;color:var(--text-primary);">${esc(n.title)}</div><div style="font-size:0.65rem;color:var(--text-secondary);">${esc(n.message)}</div><div style="font-size:0.5rem;color:var(--text-muted);margin-top:2px;">${new Date(n.timestamp).toLocaleString('fa-IR')}</div></div><button onclick="deleteNotification('${n.id}')" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:0.8rem;padding:4px;">×</button></div>`).join('');
}

// ============================================================
// جشن تولد
// ============================================================
function showBirthdayWish(member, birthDay, birthMonth) {
    const monthNames = [
        '', 'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
        'مهر','آبان','آذر','دی','بهمن','اسفند'
    ];
    const monthName = monthNames[birthMonth] || '';
    const firstName = member.firstName ? member.firstName.replace(/^(آقای|خانم|آقا|خانم)\s*/i, '') : '';

    const overlay = document.createElement('div');
    overlay.className = 'birthday-overlay';
    overlay.id = 'birthdayOverlay';

    overlay.innerHTML = `
        <div class="birthday-card">
            <div class="balloon">🎈</div>
            <div class="balloon">🎈</div>
            <div class="balloon">🎁</div>
            <div class="balloon">🎊</div>
            <div class="sparkle" style="top:15%;left:10%">✨</div>
            <div class="sparkle" style="top:20%;right:15%">⭐</div>
            <div class="sparkle" style="bottom:25%;left:20%">💫</div>
            <div class="sparkle" style="bottom:20%;right:10%">✨</div>

            <div class="birthday-cake">🎂</div>
            <div class="birthday-title">🎉 تولدت مبارک 🎉</div>
            <div class="birthday-name">${firstName}</div>
            <div class="birthday-date">🎁 ${birthDay} ${monthName}</div>
            <div class="birthday-message">
                از طرف خانواده صندوق، بهترین آرزوها را برایت داریم.<br>
                امیدواریم سالی پر از سلامتی، شادی و موفقیت داشته باشی! 💐
            </div>
            <button class="birthday-close" onclick="closeBirthday()">ممنونم 🙏</button>
        </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => { closeBirthday(); }, 7000);
}

function closeBirthday() {
    const overlay = document.getElementById('birthdayOverlay');
    if (overlay) {
        overlay.classList.add('birthday-out');
        setTimeout(() => overlay.remove(), 500);
    }
}

// ============================================================
// Coming Soon
// ============================================================
function showComingSoon(featureName) {
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:2000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);';

    var box = document.createElement('div');
    box.style.cssText = 'background:var(--card-bg);border-radius:20px;padding:30px;text-align:center;max-width:340px;margin:20px;box-shadow:0 20px 60px var(--shadow-color);border:1px solid var(--glass-border);';

    var emoji = document.createElement('div');
    emoji.style.cssText = 'font-size:4rem;margin-bottom:12px;';
    emoji.textContent = '🚧';

    var title = document.createElement('h3');
    title.style.cssText = 'color:var(--text-primary);margin-bottom:10px;font-size:1.1rem;';
    title.textContent = 'در حال طراحی';

    var desc = document.createElement('p');
    desc.style.cssText = 'color:var(--text-secondary);font-size:0.85rem;margin-bottom:16px;line-height:1.8;';
    desc.innerHTML = 'بخش <strong style="color:var(--gold-color);">' + featureName + '</strong> در حال طراحی و توسعه است.<br>به‌زودی در دسترس شما عزیزان قرار خواهد گرفت. 🌟';

    var btn = document.createElement('button');
    btn.style.cssText = 'background:linear-gradient(135deg,var(--gradient-start),var(--gradient-end));color:#fff;border:none;padding:10px 28px;border-radius:12px;cursor:pointer;font-size:0.9rem;touch-action:manipulation;box-shadow:0 4px 15px var(--shadow-color);font-family:inherit;';
    btn.textContent = 'متوجه شدم 👍';
    btn.onclick = function() { modal.remove(); };

    box.appendChild(emoji);
    box.appendChild(title);
    box.appendChild(desc);
    box.appendChild(btn);
    modal.appendChild(box);
    document.body.appendChild(modal);
}

// ============================================================
// مودال اطلاعات حساب (دکمه وسط نوار پایین)
// ============================================================
function showBottomNavModal() {
    if (!currentUser) { alert('⚠️ لطفاً ابتدا وارد شوید'); return; }
    const member = members.find(m => m.id === currentUser.memberId);
    if (!member) { alert('⚠️ اطلاعات عضو یافت نشد'); return; }

    const sd = memberScores[member.id];
    const score = sd ? sd.score : 0;
    const tierName = sd ? sd.tierName : 'نامشخص';
    const tierEmoji = sd ? sd.tierEmoji : '❓';
    const isGold = sd && sd.tier === 'gold';
    const isSilver = sd && sd.tier === 'silver';

    const famScores = computeFamilyScores();
    const myRank = famScores.findIndex(f => f.code === member.heh1) + 1;
    const totalFam = famScores.length;
    const betterThan = totalFam > 1 ? Math.round((totalFam - myRank) / (totalFam - 1) * 100) : 100;
    const posPct = Math.round((totalFam - myRank + 1) / totalFam * 100);
    const progPct = (member.totalInstallments || 0) > 0 ? Math.round((member.paidInstallments || 0) / member.totalInstallments * 100) : 0;

    var modalHtml = `
        <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:2000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);" onclick="if(event.target===this)this.remove()">
            <div style="background:var(--card-bg);border-radius:20px;padding:24px;max-width:420px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px var(--shadow-color);border:1px solid var(--glass-border);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h3 style="color:var(--text-primary);font-size:1.1rem;margin:0;">📊 اطلاعات حساب شما</h3>
                    <button onclick="this.closest('div[style*=fixed]').remove()" style="background:var(--danger-color);color:#fff;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;">✕</button>
                </div>

                <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;margin-bottom:12px;">
                    <div style="font-size:0.9rem;color:var(--text-primary);font-weight:bold;margin-bottom:12px;">💰 خلاصه حساب</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                        <div style="background:rgba(16,185,129,.1);border-radius:10px;padding:12px;text-align:center;border:1px solid rgba(16,185,129,.2);">
                            <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:4px;">💵 موجودی</div>
                            <div style="font-size:1.1rem;color:var(--success-color);font-weight:bold;">${fmtNum(getMemberRealBalance(member.id))}</div>
                        </div>
                        <div style="background:rgba(239,68,68,.1);border-radius:10px;padding:12px;text-align:center;border:1px solid rgba(239,68,68,.2);">
                            <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:4px;">💳 مانده بدهی</div>
                            <div style="font-size:1.1rem;color:var(--danger-color);font-weight:bold;">${fmtNum(member.loanBalance || 0)}</div>
                        </div>
                        <div style="background:rgba(245,158,11,.1);border-radius:10px;padding:12px;text-align:center;border:1px solid rgba(245,158,11,.2);">
                            <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:4px;">🏦 وضعیت پس‌انداز</div>
                            <div style="font-size:1.1rem;color:${(member.savingsStatus || 0) >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};font-weight:bold;">${fmtNum(member.savingsStatus || 0)}</div>
                        </div>
                        <div style="background:rgba(139,92,246,.1);border-radius:10px;padding:12px;text-align:center;border:1px solid rgba(139,92,246,.2);">
                            <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:4px;">⚠️ قسط معوقه</div>
                            <div style="font-size:1.1rem;color:var(--purple-color,#8b5cf6);font-weight:bold;">${Math.abs(member.overdueInstallments || 0)} قسط</div>
                        </div>
                    </div>
                </div>

                <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;margin-bottom:12px;">
                    <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">📊 پیشرفت اقساط</div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:0.8rem;color:var(--text-muted);">${member.paidInstallments || 0} قسط از ${member.totalInstallments || 0} قسط پرداخت شده</span>
                        <span style="font-size:1.1rem;color:var(--gold-color);font-weight:bold;">${progPct}٪</span>
                    </div>
                    <div style="height:8px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden;">
                        <div style="height:100%;width:${progPct}%;background:linear-gradient(135deg,var(--gradient-start),var(--gradient-end));border-radius:99px;"></div>
                    </div>
                </div>

                <div style="background:linear-gradient(135deg, ${isGold ? 'rgba(80,60,10,.85)' : isSilver ? 'rgba(70,70,75,.85)' : 'rgba(40,40,40,.85)'}, ${isGold ? 'rgba(50,35,5,.75)' : isSilver ? 'rgba(45,45,50,.75)' : 'rgba(25,25,25,.75)'});border-radius:12px;padding:16px;margin-bottom:12px;border:1px solid ${isGold ? 'rgba(255,215,0,.5)' : isSilver ? 'rgba(220,220,220,.4)' : 'rgba(150,150,150,.3)'};">
                    <div style="font-size:0.85rem;color:${isGold ? '#ffd700' : isSilver ? '#e0e0e0' : '#aaa'};margin-bottom:6px;">⭐ رتبه شخص شما در صندوق:</div>
                    <div style="font-size:1.3rem;font-weight:bold;color:${isGold ? '#ffd700' : isSilver ? '#e0e0e0' : '#aaa'};">${tierEmoji} ${tierName}</div>
                </div>

                <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="font-size:0.85rem;color:var(--text-secondary);">💎 امتیاز کل:</span>
                        <span style="font-size:1.2rem;font-weight:900;color:var(--gold-color);">${score}</span>
                    </div>
                </div>

                <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;margin-bottom:12px;">
                    <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">👨‍👩‍👧‍👦 خانواده شما:</div>
                    <div style="font-size:1.1rem;color:var(--text-primary);font-weight:bold;margin-bottom:8px;">خانواده ${member.firstName} · رتبه ${myRank} از ${totalFam} خانوار</div>
                    <div style="height:8px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden;margin-bottom:6px;">
                        <div style="height:100%;width:${posPct}%;background:linear-gradient(135deg,var(--gradient-start),var(--gradient-end));border-radius:99px;"></div>
                    </div>
                    <div style="font-size:0.85rem;color:var(--success-color);font-weight:bold;">شما از ${betterThan}٪ خانوارها جلوترید 🚀</div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// ============================================================
// مودال اطلاعات و راهنما (دکمه آخر نوار پایین)
// ============================================================
function showInfoNavModal() {
    if (!currentUser) { alert('⚠️ لطفاً ابتدا وارد شوید'); return; }

    var modalHtml = `
        <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:2000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);" onclick="if(event.target===this)this.remove()">
            <div style="background:var(--card-bg);border-radius:20px;padding:24px;max-width:420px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px var(--shadow-color);border:1px solid var(--glass-border);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h3 style="color:var(--text-primary);font-size:1.1rem;margin:0;">ℹ️ اطلاعات، تماس و راهنما</h3>
                    <button onclick="this.closest('div[style*=fixed]').remove()" style="background:var(--danger-color);color:#fff;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;">✕</button>
                </div>

                ${SUPPORT_INFO.phone ? `
                <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;margin-bottom:12px;">
                    <div style="font-size:0.9rem;color:var(--text-primary);font-weight:bold;margin-bottom:12px;">📞 اطلاعات تماس</div>
                    <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:12px;">
                        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">تلفن حسابداری</div>
                        <div style="font-size:1rem;color:var(--text-primary);font-weight:bold;direction:ltr;text-align:left;margin-bottom:8px;">${esc(SUPPORT_INFO.phone)}</div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;">
                            <button onclick="copyText('${esc(SUPPORT_INFO.phone)}',this)" style="background:var(--success-color);color:#fff;border:none;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:0.75rem;">📋 کپی</button>
                            <a href="tel:${esc(SUPPORT_INFO.phone)}" style="background:var(--success-color);color:#fff;padding:6px 14px;border-radius:8px;text-decoration:none;font-size:0.75rem;">📞 تماس</a>
                        </div>
                    </div>
                </div>
                ` : ''}

                <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;">
                    <div style="font-size:0.9rem;color:var(--text-primary);font-weight:bold;margin-bottom:12px;">📖 راهنمای برنامه</div>
                    <div style="display:grid;gap:10px;font-size:0.8rem;color:var(--text-secondary);">
                        <div style="padding:8px;background:rgba(255,255,255,.03);border-radius:8px;"><b style="color:var(--text-primary);">🏠 خانه:</b> بازگشت به صفحه اصلی</div>
                        <div style="padding:8px;background:rgba(255,255,255,.03);border-radius:8px;"><b style="color:var(--text-primary);">📊 دکمه وسط:</b> مشاهده رتبه، امتیاز و اطلاعات مالی</div>
                        <div style="padding:8px;background:rgba(255,255,255,.03);border-radius:8px;"><b style="color:var(--text-primary);">📋 صورتحساب:</b> جزئیات اقساط و پرداخت‌ها</div>
                        <div style="padding:8px;background:rgba(255,255,255,.03);border-radius:8px;"><b style="color:var(--text-primary);">📝 درخواست‌ها:</b> ثبت و پیگیری درخواست‌ها</div>
                        <div style="padding:8px;background:rgba(255,255,255,.03);border-radius:8px;"><b style="color:var(--text-primary);">⭐ امتیازات:</b> مشاهده امتیازات و رتبه‌ها</div>
                        <div style="padding:8px;background:rgba(255,255,255,.03);border-radius:8px;"><b style="color:var(--text-primary);">👨‍👩‍👧 خانواده من:</b> اطلاعات اعضای خانواده (فقط سرپرستان)</div>
                        <div style="padding:8px;background:rgba(255,255,255,.03);border-radius:8px;"><b style="color:var(--text-primary);">👑 بخش شورا:</b> مدیریت و گزارش‌گیری (فقط شورا و مدیر)</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// ============================================================
// توابع کمکی پیام‌ها
// ============================================================
function openMessagingMenu() {
    alert('📨 سیستم پیام‌رسانی به زودی فعال می‌شود');
}

function openSpecialModal(emoji, title, messageHtml) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position:fixed;top:0;left:0;right:0;bottom:0;
        background:rgba(0,0,0,0.7);z-index:2000;
        display:flex;align-items:center;justify-content:center;
        backdrop-filter:blur(8px);
    `;
    modal.innerHTML = `
        <div style="background:var(--card-bg);border-radius:20px;padding:30px;text-align:center;max-width:340px;margin:20px;box-shadow:0 20px 60px var(--shadow-color);border:1px solid var(--glass-border);">
            <div style="font-size:4rem;margin-bottom:12px;">${emoji}</div>
            <h3 style="color:var(--text-primary);margin-bottom:10px;font-size:1.1rem;">${title}</h3>
            <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:16px;line-height:1.8;">${messageHtml}</p>
            <button onclick="this.closest('div').parentElement.remove()" 
                    style="background:linear-gradient(135deg,var(--gradient-start),var(--gradient-end));color:#fff;border:none;padding:10px 28px;border-radius:12px;cursor:pointer;font-size:0.9rem;touch-action:manipulation;box-shadow:0 4px 15px var(--shadow-color);font-family:inherit;">
                متوجه شدم 👍
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}
