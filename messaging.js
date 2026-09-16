// ===== منوی ارسال پیام + تاریخچه پیام‌های من =====
function openMessagingMenu(){
  if (typeof currentUser === 'undefined' || !currentUser) { alert('⚠️ لطفاً ابتدا وارد شوید'); return; }
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px';
  var modal = document.createElement('div');
  modal.style.cssText = 'background:linear-gradient(160deg,#1e1e35,#151528);border:2px solid #8b5cf6;border-radius:20px;padding:25px;max-width:420px;width:100%;color:#fff;font-family:tahoma;box-shadow:0 20px 60px rgba(0,0,0,.5)';
  modal.innerHTML =
    '<h3 style="color:#ffd700;margin:0 0 20px;text-align:center;font-size:1.2rem">📨 سامانه پیام‌رسانی</h3>' +
    '<button id="btnMyMessages" style="width:100%;padding:16px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;border:none;border-radius:12px;font-weight:bold;font-size:1rem;cursor:pointer;margin-bottom:12px;font-family:tahoma">📬 پیام‌های من<br><span style="font-size:.75rem;font-weight:normal;opacity:.8">مشاهده پیام‌ها و پاسخ‌های شورا</span></button>' +
    '<button disabled style="width:100%;padding:16px;background:linear-gradient(135deg,#374151,#1f2937);color:rgba(255,255,255,.5);border:none;border-radius:12px;font-weight:bold;font-size:1rem;cursor:not-allowed;margin-bottom:16px;font-family:tahoma;position:relative">👥 ارسال پیام به سایر اعضا<br><span style="font-size:.75rem;font-weight:normal;opacity:.7">🚧 بزودی راه‌اندازی می‌شود</span><span style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;padding:3px 8px;border-radius:8px;font-size:.65rem">بزودی</span></button>' +
    '<button id="btnBack" style="width:100%;padding:12px;background:rgba(255,255,255,.05);color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:10px;cursor:pointer;font-family:tahoma;font-size:.9rem">❌ بازگشت</button>';
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.getElementById('btnBack').onclick = function(){ overlay.remove(); };
  overlay.onclick = function(e){ if (e.target === overlay) overlay.remove(); };
  document.getElementById('btnMyMessages').onclick = function(){ overlay.remove(); openMyMessagesHistory(); };
}

function openMyMessagesHistory(){
  if (typeof currentUser === 'undefined' || !currentUser) { alert('⚠️ لطفاً ابتدا وارد شوید'); return; }
  var userCode = currentUser.username || currentUser.user || currentUser.id || '';
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px';
  var modal = document.createElement('div');
  modal.style.cssText = 'background:linear-gradient(160deg,#1e1e35,#151528);border:2px solid #ffd700;border-radius:20px;padding:25px;max-width:500px;width:100%;max-height:80vh;overflow-y:auto;color:#fff;font-family:tahoma;box-shadow:0 20px 60px rgba(0,0,0,.5)';
  modal.innerHTML = '<h3 style="color:#ffd700;margin:0 0 20px;text-align:center">📨 پیام‌ها و پاسخ‌های من</h3><div id="messagesLoading" style="text-align:center;padding:20px">در حال بارگذاری...</div><div id="messagesList"></div><button id="btnCloseHistory" style="width:100%;padding:12px;background:rgba(255,255,255,.05);color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:10px;cursor:pointer;font-family:tahoma;font-size:.9rem;margin-top:15px">❌ بستن</button>';
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.getElementById('btnCloseHistory').onclick = function(){ overlay.remove(); };
  overlay.onclick = function(e){ if (e.target === overlay) overlay.remove(); };
  fetch(ADMIN_URL + '?action=getMyMessageHistory&user=' + encodeURIComponent(userCode))
    .then(function(r){ return r.json(); })
    .then(function(d){
      var loading = document.getElementById('messagesLoading');
      var list = document.getElementById('messagesList');
      if (!loading || !list) return;
      if (!d || !d.ok || !d.messages || !d.messages.length) { loading.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,.6)">📭 هنوز پیامی ارسال نکرده‌اید</div>'; return; }
      loading.remove();
      d.messages.forEach(function(msg){
        var date = ''; try { date = new Date(msg.timestamp).toLocaleString('fa-IR'); } catch(e){}
        var replyDate = ''; if (msg.replyAt) { try { replyDate = new Date(msg.replyAt).toLocaleString('fa-IR'); } catch(e){} }
        var card = document.createElement('div');
        card.style.cssText = 'background:rgba(255,255,255,.05);border-radius:12px;padding:15px;margin-bottom:15px';
        card.innerHTML =
          '<div style="color:rgba(255,255,255,.5);font-size:.72rem;margin-bottom:8px">📅 ' + date + '</div>' +
          '<div style="background:rgba(255,255,255,.08);border-radius:8px;padding:10px;margin-bottom:10px"><div style="color:rgba(255,255,255,.5);font-size:.7rem;margin-bottom:4px">💬 پیام شما:</div><div style="font-size:.85rem;line-height:1.7">' + String(msg.message||'').replace(/</g,'&lt;').replace(/\n/g,'<br>') + '</div></div>' +
          (msg.status === 'answered' ?
            '<div style="background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.3);border-radius:8px;padding:10px"><div style="color:#ffd700;font-size:.72rem;margin-bottom:4px;font-weight:bold">✨ پاسخ شورا' + (replyDate ? ' (' + replyDate + ')' : '') + ':</div><div style="font-size:.85rem;line-height:1.7">' + String(msg.reply||'').replace(/</g,'&lt;').replace(/\n/g,'<br>') + '</div></div>'
            : '<div style="text-align:center;color:rgba(255,255,255,.4);font-size:.8rem;padding:8px">⏳ در انتظار پاسخ...</div>');
        list.appendChild(card);
      });
    })
    .catch(function(e){ var l = document.getElementById('messagesLoading'); if (l) l.innerHTML = '<div style="color:#ff6b6b;text-align:center">❌ خطا در بارگذاری</div>'; });
}

// مخفی کردن دکمه شناور قدیمی
setInterval(function(){
  var b = document.getElementById('myMessagesBtn');
  if (b) b.style.display = 'none';
}, 1000);
