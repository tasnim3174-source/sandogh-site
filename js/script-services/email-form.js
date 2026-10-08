/* ============================================================
   صندوق اتحاد - ثبت نحوه ارسال صورتحساب
   نسخه: 2.0
   ============================================================ */

function openEmailForm() {
    var kb = currentUser ? currentUser.username : '';
    if (!kb) { alert('❌ ابتدا وارد شوید'); return; }
    var old = document.getElementById('emailFormOverlay');
    if (old) old.parentNode.removeChild(old);
    var ov = document.createElement('div');
    ov.id = 'emailFormOverlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:tahoma;';
    ov.innerHTML = '<div style="background:#1a1a2e;border:1px solid #b8860b;border-radius:18px;padding:22px;width:92%;max-width:420px;color:#fff;direction:rtl;max-height:90vh;overflow-y:auto">' +
        '<div style="font-weight:800;margin-bottom:4px">📬 اطلاع‌رسانی صورتحساب</div>' +
        '<div style="font-size:.78rem;color:#ffd700;margin-bottom:16px">از کدام طریق صورتحساب را دریافت کنید؟</div>' +
        '<label style="display:flex;align-items:center;gap:10px;background:#111;border:1px solid #333;border-radius:12px;padding:12px 14px;margin-bottom:10px;cursor:pointer">' +
            '<input type="checkbox" id="chkSms" style="width:20px;height:20px;accent-color:#ffd700;cursor:pointer" />' +
            '<span style="font-size:.9rem">📱 پیامک</span>' +
        '</label>' +
        '<label style="display:flex;align-items:center;gap:10px;background:#111;border:1px solid #333;border-radius:12px;padding:12px 14px;margin-bottom:10px;cursor:pointer">' +
            '<input type="checkbox" id="chkEmail" style="width:20px;height:20px;accent-color:#ffd700;cursor:pointer" />' +
            '<span style="font-size:.9rem">📧 ایمیل (جیمیل)</span>' +
        '</label>' +
        '<label style="display:flex;align-items:center;gap:10px;background:#111;border:1px solid #333;border-radius:12px;padding:12px 14px;margin-bottom:10px;cursor:pointer">' +
            '<input type="checkbox" id="chkSite" style="width:20px;height:20px;accent-color:#ffd700;cursor:pointer" />' +
            '<span style="font-size:.9rem">🌐 داخل همین سایت (نمایش هنگام ورود)</span>' +
        '</label>' +
        '<div id="emailBox" style="display:none;margin-bottom:12px">' +
            '<div style="font-size:.75rem;color:#bbb;margin-bottom:6px">📧 آدرس ایمیل:</div>' +
            '<input id="stmtEmailInput" type="email" dir="ltr" placeholder="example@gmail.com" style="width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid #444;background:#111;color:#fff;font-size:.9rem" />' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:6px">' +
        '<button id="stmtEmailSave" style="flex:1;background:linear-gradient(135deg,#b8860b,#ffd700);color:#1a1a2e;border:none;border-radius:10px;padding:11px;font-weight:800;cursor:pointer">💾 ثبت</button>' +
        '<button id="stmtEmailClose" style="background:#333;color:#fff;border:none;border-radius:10px;padding:11px 16px;cursor:pointer">بستن</button>' +
        '</div></div>';
    document.body.appendChild(ov);

    var chkE = document.getElementById('chkEmail');
    var boxE = document.getElementById('emailBox');
    chkE.onchange = function(){ boxE.style.display = chkE.checked ? 'block' : 'none'; };

    var emailSource = (window.__scriptServicesCache && window.__scriptServicesCache.loaded && window.__scriptServicesCache.email)
        ? Promise.resolve(window.__scriptServicesCache.email)
        : fetch(ADMIN_URL + '?action=getStatementEmail&user=' + encodeURIComponent(kb)).then(function(r){ return r.json(); });
    emailSource.then(function(d){
        if (!d.ok) return;
        document.getElementById('chkSms').checked = !!d.wantSms;
        chkE.checked = !!d.wantEmail;
        document.getElementById('chkSite').checked = !!d.wantSite;
        boxE.style.display = chkE.checked ? 'block' : 'none';
        if (d.email) document.getElementById('stmtEmailInput').value = d.email;
    }).catch(function(){});

    document.getElementById('stmtEmailSave').onclick = function(){
        var we = chkE.checked ? 1 : 0;
        var ws = document.getElementById('chkSms').checked ? 1 : 0;
        var wsi = document.getElementById('chkSite').checked ? 1 : 0;
        var em = document.getElementById('stmtEmailInput').value.trim();

        if (we === 1 && (em.indexOf('@') < 1)) { alert('❌ لطفاً آدرس ایمیل معتبر وارد کنید'); return; }
        if (we + ws + wsi === 0) { alert('⚠️ حداقل یک روش را انتخاب کنید'); return; }

        fetch(ADMIN_URL + '?action=setStatementEmail&user=' + encodeURIComponent(kb) +
          '&name=' + encodeURIComponent(currentUser.firstName || currentUser.username) +
          '&email=' + encodeURIComponent(em) +
          '&wantEmail=' + we +
          '&wantSms=' + ws +
          '&wantSite=' + wsi
        ).then(function(r){ return r.json(); }).then(function(d){
          alert(d.ok ? '✅ تنظیمات اطلاع‌رسانی ثبت شد!' : '❌ خطا: ' + (d.error || ''));
          if (d.ok) ov.parentNode.removeChild(ov);
        }).catch(function(){ alert('❌ خطا در اتصال'); });
    };
    document.getElementById('stmtEmailClose').onclick = function(){ ov.parentNode.removeChild(ov); };
