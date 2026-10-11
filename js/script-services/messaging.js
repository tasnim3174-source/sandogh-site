/* ============================================================
   صندوق اتحاد - سیستم پیام‌رسانی
   نسخه: 3.0
   ============================================================ */

window.__messagingState = window.__messagingState || {
    messages: [],
    replies: [],
    loading: false,
    lastFetch: 0
};

/* ─── باز کردن منوی پیام‌رسانی ─── */
function openMessagingMenu() {
    renderMessagingUI();
}

/* ─── رندر UI اصلی ─── */
function renderMessagingUI() {
    var isCouncil = currentUser && (currentUser.isCouncil === true);
    
    var modal = document.getElementById('messagingModal');
    if (modal) modal.remove();
    
    modal = document.createElement('div');
    modal.id = 'messagingModal';
    modal.className = 'msg-modal';
    
    var html = '<div class="msg-container">';
    
    // هدر
    html += '<div class="msg-header">';
    html += '<div class="msg-title">📨 سیستم پیام‌رسانی</div>';
    html += '<button class="msg-close" onclick="closeMessagingMenu()">✕</button>';
    html += '</div>';
    
    // تب‌ها
    html += '<div class="msg-tabs">';
    html += '<button class="msg-tab active" id="msgTabSend" onclick="switchMsgTab(\'send\')">📤 ارسال پیام</button>';
    html += '<button class="msg-tab" id="msgTabInbox" onclick="switchMsgTab(\'inbox\')">📬 پاسخ‌ها <span class="msg-badge" id="msgInboxBadge"></span></button>';
    
    if (isCouncil) {
        html += '<button class="msg-tab" id="msgTabCouncil" onclick="switchMsgTab(\'council\')">👥 پیام‌های اعضا</button>';
    }
    
    html += '</div>';
    
    // محتوای تب‌ها
    html += '<div class="msg-body">';
    
    // تب ارسال
    html += '<div class="msg-panel active" id="msgPanelSend">';
    html += '<div class="msg-field">';
    html += '<label>📝 متن پیام شما:</label>';
    html += '<textarea id="msgText" placeholder="پیام خود را اینجا بنویسید... (حداقل ۵ کاراکتر)" maxlength="1000"></textarea>';
    html += '<div class="msg-counter"><span id="msgCharCount">0</span> / 1000</div>';
    html += '</div>';
    html += '<button class="msg-send-btn" id="msgSendBtn" onclick="sendMessageToCouncilUI()">';
    html += '<span>📤</span> ارسال به شورا';
    html += '</button>';
    html += '<div class="msg-hint">💡 پیام شما پس از ارسال، برای شورای صندوق ارسال می‌شود</div>';
    html += '</div>';
    
    // تب پاسخ‌ها
    html += '<div class="msg-panel" id="msgPanelInbox">';
    html += '<div id="msgRepliesList" class="msg-list">';
    html += '<div class="msg-empty">در حال بارگذاری...</div>';
    html += '</div>';
    html += '</div>';
    
    // تب شورا
    if (isCouncil) {
        html += '<div class="msg-panel" id="msgPanelCouncil">';
        html += '<div id="msgCouncilList" class="msg-list">';
        html += '<div class="msg-empty">در حال بارگذاری...</div>';
        html += '</div>';
        html += '</div>';
    }
    
    html += '</div>'; // msg-body
    html += '</div>'; // msg-container
    modal.innerHTML = html;
    document.body.appendChild(modal);
    
    // بستن با کلیک بیرون
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeMessagingMenu();
    });
    
    // شمارنده کاراکتر
    var txt = document.getElementById('msgText');
    if (txt) {
        txt.addEventListener('input', function() {
            document.getElementById('msgCharCount').textContent = txt.value.length;
        });
    }
    
    // بستن با ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeMessagingMenu();
            document.removeEventListener('keydown', escHandler);
        }
    });
    
    // لود پاسخ‌ها
    loadMyReplies();
}

/* ─── بستن ─── */
function closeMessagingMenu() {
    var modal = document.getElementById('messagingModal');
    if (modal) modal.remove();
}

/* ─── تغییر تب ─── */
function switchMsgTab(tab) {
    document.querySelectorAll('.msg-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.msg-panel').forEach(function(p) { p.classList.remove('active'); });
    
    if (tab === 'send') {
        document.getElementById('msgTabSend').classList.add('active');
        document.getElementById('msgPanelSend').classList.add('active');
    } else if (tab === 'inbox') {
        document.getElementById('msgTabInbox').classList.add('active');
        document.getElementById('msgPanelInbox').classList.add('active');
        loadMyReplies();
    } else if (tab === 'council') {
        document.getElementById('msgTabCouncil').classList.add('active');
        document.getElementById('msgPanelCouncil').classList.add('active');
        loadCouncilMessages();
    }
}

/* ─── ارسال پیام ─── */
async function sendMessageToCouncilUI() {
    var txt = document.getElementById('msgText');
    var btn = document.getElementById('msgSendBtn');
    if (!txt || !btn) return;
    
    var message = txt.value.trim();
    if (message.length < 5) {
        showSimpleToast('⚠️', 'خطا', 'پیام باید حداقل ۵ کاراکتر باشد', '#ef4444');
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> در حال ارسال...';
    
    try {
        var uid = currentUser.memberId || currentUser.username || '';
        var uname = currentUser.firstName || currentUser.name || 'کاربر';
        
        var url = ADMIN_URL + '?action=sendMessageToCouncil'
            + '&user=' + encodeURIComponent(uid)
            + '&name=' + encodeURIComponent(uname)
            + '&message=' + encodeURIComponent(message);
        
        var res = await fetch(url, { cache: 'no-cache' });
        var data = await res.json();
        
        if (data.ok) {
            showSimpleToast('✅', 'ارسال شد', data.msg || 'پیام شما با موفقیت ارسال شد', '#10b981');
            txt.value = '';
            document.getElementById('msgCharCount').textContent = '0';
        } else {
            showSimpleToast('❌', 'خطا', data.error || 'خطا در ارسال پیام', '#ef4444');
        }
    } catch (e) {
        showSimpleToast('❌', 'خطای شبکه', 'لطفاً اتصال اینترنت خود را بررسی کنید', '#ef4444');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>📤</span> ارسال به شورا';
    }
}

/* ─── لود پاسخ‌های من ─── */
async function loadMyReplies() {
    var list = document.getElementById('msgRepliesList');
    if (!list) return;
    
    list.innerHTML = '<div class="msg-empty">در حال بارگذاری...</div>';
    
    try {
        var uid = currentUser.memberId || currentUser.username || '';
        var url = ADMIN_URL + '?action=getMyReplies&user=' + encodeURIComponent(uid);
        var res = await fetch(url, { cache: 'no-cache' });
        var data = await res.json();
        
        var replies = (data && data.replies) || [];
        window.__messagingState.replies = replies;
        
        if (replies.length === 0) {
            list.innerHTML = '<div class="msg-empty">📭 هنوز پاسخی دریافت نکرده‌اید</div>';
            return;
        }
        
        var html = '';
        replies.forEach(function(r) {
            var date = formatMsgDate(r.replyAt);
            var isNew = !r.seen;
            html += '<div class="msg-item' + (isNew ? ' msg-new' : '') + '">';
            if (isNew) html += '<span class="msg-new-dot"></span>';
            html += '<div class="msg-item-date">📅 ' + date + '</div>';
            html += '<div class="msg-item-question"><b>پیام شما:</b><br>' + escapeHtml(r.message) + '</div>';
            html += '<div class="msg-item-answer"><b>✅ پاسخ شورا:</b><br>' + escapeHtml(r.reply) + '</div>';
            html += '</div>';
        });
        list.innerHTML = html;
        
        // علامت‌گذاری به عنوان دیده‌شده
        var uid2 = currentUser.memberId || currentUser.username || '';
        fetch(ADMIN_URL + '?action=markRepliesSeen&user=' + encodeURIComponent(uid2), { cache: 'no-cache' })
            .then(function() { updateInboxBadge(); });
        
    } catch (e) {
        list.innerHTML = '<div class="msg-empty">❌ خطا در بارگذاری</div>';
    }
}

/* ─── لود پیام‌های اعضا (فقط شورا) ─── */
async function loadCouncilMessages() {
    var list = document.getElementById('msgCouncilList');
    if (!list) return;
    
    list.innerHTML = '<div class="msg-empty">در حال بارگذاری...</div>';
    
    try {
        var url = ADMIN_URL + '?action=getCouncilMessages&key=admin12345';
        var res = await fetch(url, { cache: 'no-cache' });
        var data = await res.json();
        
        var messages = (data && data.messages) || [];
        
        if (messages.length === 0) {
            list.innerHTML = '<div class="msg-empty">📭 هیچ پیامی دریافت نشده</div>';
            return;
        }
        
        var html = '';
        messages.forEach(function(m) {
            var date = formatMsgDate(m.timestamp);
            var status = m.status === 'answered' ? '✅ پاسخ داده شده' : '⏳ در انتظار پاسخ';
            var statusClass = m.status === 'answered' ? 'msg-status-done' : 'msg-status-pending';
            
            html += '<div class="msg-council-item">';
            html += '<div class="msg-council-head">';
            html += '<div><b>👤 ' + escapeHtml(m.name || 'ناشناس') + '</b>';
            html += '<span class="msg-council-uid"> (' + escapeHtml(m.user || '') + ')</span></div>';
            html += '<div class="msg-council-date">' + date + '</div>';
            html += '</div>';
            html += '<div class="msg-council-text">' + escapeHtml(m.message) + '</div>';
            
            if (m.reply) {
                html += '<div class="msg-council-reply"><b>پاسخ شما:</b> ' + escapeHtml(m.reply) + '</div>';
            }
            
            html += '<div class="msg-council-footer">';
            html += '<span class="' + statusClass + '">' + status + '</span>';
            if (m.status !== 'answered') {
                html += '<button class="msg-reply-btn" onclick="openReplyBox(\'' + m.id + '\')">✍️ پاسخ دادن</button>';
            }
            html += '</div>';
            
            html += '<div class="msg-reply-box" id="replyBox_' + m.id + '" style="display:none">';
            html += '<textarea placeholder="پاسخ خود را بنویسید..."></textarea>';
            html += '<button onclick="submitReply(\'' + m.id + '\')">ارسال پاسخ</button>';
            html += '</div>';
            
            html += '</div>';
        });
        list.innerHTML = html;
        
    } catch (e) {
        list.innerHTML = '<div class="msg-empty">❌ خطا در بارگذاری</div>';
    }
}

/* ─── باز کردن باکس پاسخ (شورا) ─── */
function openReplyBox(id) {
    var box = document.getElementById('replyBox_' + id);
    if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

/* ─── ارسال پاسخ (شورا) ─── */
async function submitReply(messageId) {
    var box = document.getElementById('replyBox_' + messageId);
    if (!box) return;
    var txt = box.querySelector('textarea');
    var reply = txt.value.trim();
    
    if (reply.length < 3) {
        showSimpleToast('⚠️', 'خطا', 'پاسخ باید حداقل ۳ کاراکتر باشد', '#ef4444');
        return;
    }
    
    try {
        var url = ADMIN_URL + '?action=replyToMember'
            + '&key=admin12345'
            + '&messageId=' + encodeURIComponent(messageId)
            + '&reply=' + encodeURIComponent(reply)
            + '&replyBy=' + encodeURIComponent(currentUser.firstName || 'شورا');
        
        var res = await fetch(url, { cache: 'no-cache' });
        var data = await res.json();
        
        if (data.ok) {
            showSimpleToast('✅', 'ارسال شد', 'پاسخ شما ثبت شد', '#10b981');
            loadCouncilMessages();
        } else {
            showSimpleToast('❌', 'خطا', data.error || 'خطا در ارسال', '#ef4444');
        }
    } catch (e) {
        showSimpleToast('❌', 'خطا', 'خطای شبکه', '#ef4444');
    }
}

/* ─── آپدیت بج پاسخ‌های خوانده‌نشده ─── */
async function updateInboxBadge() {
    try {
        var uid = currentUser.memberId || currentUser.username || '';
        var res = await fetch(ADMIN_URL + '?action=getUnreadCount&user=' + encodeURIComponent(uid), { cache: 'no-cache' });
        var data = await res.json();
        var badge = document.getElementById('msgInboxBadge');
        if (badge && data && data.count > 0) {
            badge.textContent = data.count;
            badge.style.display = 'inline-block';
        } else if (badge) {
            badge.style.display = 'none';
        }
    } catch (e) {}
}

/* ─── توابع کمکی ─── */
function formatMsgDate(isoStr) {
    if (!isoStr) return '-';
    try {
        var d = new Date(isoStr);
        return d.toLocaleDateString('fa-IR') + ' - ' + d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return '-'; }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    }).replace(/\n/g, '<br>');
}

// چک کردن پاسخ‌های جدید هر ۶۰ ثانیه
setInterval(function() {
    if (currentUser && document.getElementById('messagingModal')) {
        updateInboxBadge();
    }
}, 60000);
