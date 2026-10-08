/* ============================================================
   صندوق اتحاد - خدمات آنلاین (Script Services)
   نسخه: 2.0
   ============================================================ */

window.__scriptServicesCache = window.__scriptServicesCache || {
    loaded: false, 
    loading: null, 
    points: null, 
    products: null, 
    quizzes: null, 
    email: null
};

function showScriptServicesLoading(){
    var old = document.getElementById('scriptServicesLoading'); 
    if(old) old.remove();
    var ov = document.createElement('div'); 
    ov.id = 'scriptServicesLoading';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(8,10,25,.78);backdrop-filter:blur(5px);z-index:100000;display:flex;align-items:center;justify-content:center;font-family:tahoma;direction:rtl;';
    ov.innerHTML = '<div style="width:min(380px,88%);background:#17172b;border:1px solid rgba(56,189,248,.45);border-radius:20px;padding:24px;text-align:center;color:#fff;box-shadow:0 15px 50px rgba(0,0,0,.45)"><div style="font-size:2.4rem">☁️</div><div style="font-size:1rem;font-weight:900;color:#38bdf8">در حال دریافت خدمات آنلاین</div><div style="font-size:.76rem;color:#bbb;margin-top:8px;line-height:1.9">اطلاعات امتیازات، فروشگاه، مسابقات و تنظیمات مرتبط با اسکریپت در حال بارگذاری است.<br>لطفاً چند لحظه صبر کنید...</div><div style="height:6px;background:#2b2b45;border-radius:10px;overflow:hidden;margin-top:16px"><div style="height:100%;background:linear-gradient(90deg,#38bdf8,#8b5cf6);animation:scriptLoadBar 1.1s infinite alternate;border-radius:10px"></div></div></div>';
    document.body.appendChild(ov);
}

function hideScriptServicesLoading(){
    var ov = document.getElementById('scriptServicesLoading');
    if(ov) ov.remove();
}

async function loadScriptServicesOnce(){
    var c = window.__scriptServicesCache; 
    if(c.loaded) return c; 
    if(c.loading) return c.loading; 
    if(!currentUser) throw new Error('کاربر وارد نشده است');
    
    showScriptServicesLoading();
    
    c.loading = (async function(){
        var uid = currentUser.memberId || currentUser.username || '';
        var rs = await Promise.all([
            fetch(SHOP_URL + '?action=getPointsHistory&user=' + encodeURIComponent(uid), {cache:'no-cache'}).then(r=>r.json()).catch(()=>({history:[]})),
            fetch(SHOP_URL + '?action=getShopProducts', {cache:'no-cache'}).then(r=>r.json()).catch(()=>({products:[]})),
            fetch(ADMIN_URL + '?action=getQuizzes', {cache:'no-cache'}).then(r=>r.json()).catch(()=>({quizzes:[]})),
            fetch(ADMIN_URL + '?action=getStatementEmail&user=' + encodeURIComponent(currentUser.username||''), {cache:'no-cache'}).then(r=>r.json()).catch(()=>({ok:false}))
        ]);
        c.points = rs[0].history || []; 
        c.products = rs[1].products || []; 
        c.quizzes = rs[2].quizzes || []; 
        c.email = rs[3] || {ok:false}; 
        c.loaded = true; 
        c.loading = null; 
        hideScriptServicesLoading(); 
        return c;
    })().catch(e => {
        c.loading = null; 
        hideScriptServicesLoading(); 
        throw e;
    });
    
    return c.loading;
}

async function openScriptService(tab){
    try{ 
        await loadScriptServicesOnce(); 
    } catch(e) { 
        alert('❌ دریافت اطلاعات خدمات آنلاین ناموفق بود.\nلطفاً دوباره تلاش کنید.'); 
        return; 
    }
    if(tab === 'emailForm') return openEmailForm();
    if(tab === 'club') return selectMenuItem('club');
    if(tab === 'dailyReward') return openDailyReward();
    if(tab === 'quizzes') return openQuizzes();
    if(tab === 'messaging') return openMessagingMenu();
    if(tab === 'survey') return showComingSoon('نظرسنجی');
}

function checkUserAlerts() {
    if (typeof currentUser === 'undefined' || !currentUser) return;
    var userCode = currentUser.username || currentUser.user || currentUser.id || '';
    if (!userCode) return;
    if (window.__alertsShown) return;
    window.__alertsShown = true;
    fetch(ADMIN_URL + '?action=getUserAlerts&user=' + encodeURIComponent(userCode))
        .then(function(r){ return r.json(); })
        .then(function(d){
            if (!d || !d.ok || !d.alerts || !d.alerts.length) return;
            d.alerts.forEach(function(a, i){
                setTimeout(function(){
                    showSimpleToast(a.icon || '⚠️', a.title || '', a.message || '', a.borderColor || '#ffd700');
                }, i * 1500);
            });
        })
        .catch(function(e){ console.log('خطا:', e); });
}

setInterval(function(){
    if (typeof currentUser !== 'undefined' && currentUser && !window.__alertsShown) {
        setTimeout(checkUserAlerts, 2000);
    }
}, 1000);
