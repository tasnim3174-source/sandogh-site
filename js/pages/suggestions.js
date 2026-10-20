/* ============================================================
   صندوق اتحاد - صندوق پیشنهادات و انتقادات
   نسخه: 1.0
   ============================================================ */

function renderSuggestionsContent() {
    return `
        <div class="info-box" style="background:linear-gradient(135deg,rgba(139,92,246,0.1),rgba(124,58,237,0.05));border:1px solid rgba(139,92,246,0.3);">
            <i class="fas fa-comment-dots" style="color:#8b5cf6;"></i> 
            ارتباط با شورا (صندوق پیشنهادات)
        </div>
        
        <div class="dashboard-section" style="border-right-color:#8b5cf6;background:linear-gradient(135deg,rgba(139,92,246,0.05),rgba(124,58,237,0.02));">
            <h3 style="color:#8b5cf6;font-size:1.1rem;margin-bottom:15px;">
                <i class="fas fa-pen"></i> پیام خود را بنویسید
            </h3>
            <p style="color:var(--text-secondary);font-size:0.85rem;line-height:1.8;margin-bottom:15px;">
                انتقاد، پیشنهاد، یا پیام تشکر خود را برای شورای صندوق بنویسید. پیام شما مستقیماً به گروه ایتای شورا ارسال می‌شود.
            </p>
            
            <textarea id="suggestionText" placeholder="پیام خود را اینجا بنویسید..." rows="5" style="width:100%;padding:14px;border-radius:12px;border:2px solid rgba(139,92,246,0.3);background:rgba(255,255,255,0.05);color:var(--text-primary);font-family:inherit;font-size:0.95rem;resize:vertical;outline:none;transition:border-color 0.3s;" onfocus="this.style.borderColor='#8b5cf6'" onblur="this.style.borderColor='rgba(139,92,246,0.3)'"></textarea>
            
            <div style="display:flex;gap:10px;margin-top:15px;flex-wrap:wrap;">
                <button onclick="submitSuggestion()" id="submitSuggestionBtn" style="flex:2;min-width:150px;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;font-weight:900;cursor:pointer;font-family:inherit;font-size:1rem;box-shadow:0 4px 15px rgba(139,92,246,0.4);">
                    <i class="fas fa-paper-plane"></i> ارسال پیام به شورا
                </button>
                <button onclick="document.getElementById('suggestionText').value=''" style="flex:1;min-width:80px;padding:14px;border:1px solid rgba(255,255,255,0.2);border-radius:12px;background:rgba(255,255,255,0.05);color:var(--text-primary);font-weight:700;cursor:pointer;font-family:inherit;font-size:0.9rem;">
                    <i class="fas fa-eraser"></i> پاک کردن
                </button>
            </div>
        </div>
        
        <!-- بخش تاریخچه پیام‌ها -->
        <div class="dashboard-section" style="border-right-color:var(--gold-color);margin-top:15px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                <h3 style="color:var(--gold-color);font-size:1.05rem;margin:0;">
                    <i class="fas fa-history"></i> پیام‌های قبلی من
                </h3>
                <button onclick="loadMySuggestions()" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);cursor:pointer;font-size:0.75rem;font-family:inherit;">
                    <i class="fas fa-sync-alt"></i> به‌روزرسانی
                </button>
            </div>
            <div id="mySuggestionsList">
                <div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:0.85rem;">در حال بارگذاری...</div>
            </div>
        </div>
    `;
}

// ============================================================
// ارسال پیام به شورا
// ============================================================
async function submitSuggestion() {
    var textEl = document.getElementById('suggestionText');
    var btn = document.getElementById('submitSuggestionBtn');
    
    if (!textEl) return;
    
    var message = textEl.value.trim();
    if (message.length < 5) {
        alert('⚠️ لطفاً یک پیام حداقل ۵ حرفی بنویسید.');
        return;
    }
    
    if (!currentUser || !currentUser.memberId) {
        alert('❌ لطفاً دوباره وارد شوید.');
        return;
    }
    
    var member = members.find(function(m) { 
        return String(m.id) === String(currentUser.memberId) || 
               String(m.accountNumber) === String(currentUser.accountNumber); 
    });
    
    if (!member) {
        alert('❌ اطلاعات کاربر یافت نشد.');
        return;
    }
    
    // غیرفعال کردن دکمه
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
    
    // ذخیره محلی (برای تاریخچه)
    var localKey = 'sandogh_my_suggestions_' + currentUser.memberId;
    var localSuggestions = [];
    try {
        localSuggestions = JSON.parse(localStorage.getItem(localKey) || '[]');
    } catch(e) {}
    
    localSuggestions.unshift({
        id: 'sug_' + Date.now(),
        text: message,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    try {
        localStorage.setItem(localKey, JSON.stringify(localSuggestions));
    } catch(e) {}
    
    // ارسال به گوگل (و در نتیجه به ایتا)
    try {
        var url = ADMIN_URL + '?action=sendMessageToCouncil'
            + '&user=' + encodeURIComponent(member.id || member.accountNumber)
            + '&name=' + encodeURIComponent(member.firstName || '')
            + '&message=' + encodeURIComponent(message);
        
        fetch(url, { cache: 'no-cache', mode: 'no-cors' })
            .then(function() { console.log('✅ پیام به سرور ارسال شد.'); })
            .catch(function(e) { console.log('⚠️ خطا:', e); });
    } catch(e) {
        console.log('⚠️ خطا در ارسال:', e);
    }
    
    // پیام موفقیت
    setTimeout(function() {
        alert('✅ پیام شما با موفقیت به شورای صندوق ارسال شد!\n\nاز اینکه با ما در ارتباط هستید سپاسگزاریم.');
        textEl.value = '';
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال پیام به شورا';
        loadMySuggestions();
    }, 800);
}

// ============================================================
// نمایش تاریخچه پیام‌های کاربر
// ============================================================
function loadMySuggestions() {
    var listEl = document.getElementById('mySuggestionsList');
    if (!listEl) return;
    
    if (!currentUser || !currentUser.memberId) return;
    
    var localKey = 'sandogh_my_suggestions_' + currentUser.memberId;
    var suggestions = [];
    try {
        suggestions = JSON.parse(localStorage.getItem(localKey) || '[]');
    } catch(e) {}
    
    if (suggestions.length === 0) {
        listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:0.85rem;">📭 هنوز پیامی ارسال نکرده‌اید.</div>';
        return;
    }
    
    var html = '';
    suggestions.forEach(function(s) {
        var date = new Date(s.timestamp).toLocaleString('fa-IR');
        html += '<div style="background:var(--bg-secondary);border-radius:12px;padding:12px;margin-bottom:8px;border-right:3px solid #8b5cf6;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        html += '<span style="font-size:0.7rem;color:#8b5cf6;font-weight:800;"><i class="fas fa-comment"></i> پیام شما</span>';
        html += '<span style="font-size:0.65rem;color:var(--text-secondary);">' + date + '</span>';
        html += '</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-primary);line-height:1.7;">' + escapeHtml(s.text) + '</div>';
        html += '<div style="font-size:0.65rem;color:#f59e0b;margin-top:6px;">⏳ در انتظار بررسی توسط شورا</div>';
        html += '</div>';
    });
    
    listEl.innerHTML = html;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(c) {
        return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c];
    }).replace(/\n/g, '<br>');
}

// اجرای خودکار بارگذاری تاریخچه
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadMySuggestions, 1000);
});
