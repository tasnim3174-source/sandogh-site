/* ============================================================
   صندوق اتحاد - پیام‌های شناور (Toast)
   نسخه: 2.0
   ============================================================ */

function showToast(notification) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = notification.type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    const color = notification.type === 'success' ? '#10b981' : '#667eea';
    toast.innerHTML = `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:${color}"><i class="fas ${icon}"></i></div><div style="flex:1"><div style="font-size:0.8rem;">${esc(notification.title)}</div><div style="font-size:0.7rem;color:var(--text-secondary);">${esc(notification.message)}</div></div><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:0.9rem;padding:4px;">×</button>`;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

function showSimpleToast(icon, title, msg, color) {
    var c = document.getElementById('simpleToastContainer');
    if (!c) {
        c = document.createElement('div');
        c.id = 'simpleToastContainer';
        c.style.cssText = 'position:fixed;bottom:25px;left:50%;transform:translateX(-50%);z-index:99999999;display:flex;flex-direction:column;gap:12px;width:400px;max-width:90%';
        document.body.appendChild(c);
    }
    var t = document.createElement('div');
    t.style.cssText = 'background:linear-gradient(135deg,#1e1e35,#151528);border:2px solid ' + color + ';border-radius:14px;padding:14px;color:#fff;font-family:tahoma;box-shadow:0 10px 30px rgba(0,0,0,.5);opacity:0;transform:translateY(30px);transition:all .4s';
    t.innerHTML = '<div style="display:flex;gap:10px"><div style="font-size:1.3rem">' + icon + '</div><div style="flex:1"><div style="font-weight:bold;color:' + color + ';margin-bottom:4px">' + title + '</div><div style="font-size:.82rem;line-height:1.6">' + msg + '</div></div></div>';
    c.appendChild(t);
    setTimeout(function(){ t.style.opacity = '1'; t.style.transform = 'translateY(0)'; }, 50);
    setTimeout(function(){ 
        t.style.opacity = '0'; 
        t.style.transform = 'translateY(30px)'; 
        setTimeout(function(){ if(t.parentElement) t.remove(); }, 400); 
    }, 8000);
}
