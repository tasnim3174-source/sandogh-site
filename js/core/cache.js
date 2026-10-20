/* ============================================================
   صندوق اتحاد - لایه کش هوشمند
   نسخه: 3.0 (بدون کش، همیشه اطلاعات جدید)
   ============================================================ */

(function(){
  var SMALL  = ['isCouncil','status'];
  var MEM    = ['readExcel'];
  var DEDUPE = ['addPoints','getPointsHistory','getAllMembersWithPoints','updatePoints'];
  var inflight = {};
  var origFetch = window.fetch ? window.fetch.bind(window) : null;
  if (!origFetch) return;

  function resp(data){ 
      return new Response(JSON.stringify(data), {
          status:200, 
          headers:{'Content-Type':'application/json'}
      }); 
  }

  function which(url, list){ 
      for(var i=0;i<list.length;i++){ 
          if(url.indexOf('action='+list[i])>-1) return list[i]; 
      } 
      return null; 
  }

  window.fetch = function(input, init){
    var url = (typeof input==='string') ? input : ((input && input.url) || '');
    var m = which(url, SMALL) || which(url, MEM);
    var d = which(url, DEDUPE);
    
    // اگر درخواست به گوگل است، همیشه آن را ارسال کن (بدون کش)
    if (url.includes('script.google.com') || url.includes('macros')) {
        // اضافه کردن یک پارامتر تصادفی برای دور زدن کش مرورگر
        var newUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
        
        return origFetch(newUrl, init)
            .then(function(res) {
                return res.text().then(function(text) {
                    // اگر پاسخ HTML بود (خطای CORS)، یک آبجکت خالی برگردان
                    if (text.trim().startsWith('<')) {
                        console.warn('🛡️ CORS یا HTML مسدود شد:', newUrl.substring(0, 80));
                        return resp({ ok: false, error: 'CORS Blocked' });
                    }
                    // اگر پاسخ JSON بود، آن را برگردان
                    return new Response(text, { status: res.status, headers: res.headers });
                });
            })
            .catch(function(err) {
                console.warn('🛡️ خطای شبکه:', newUrl.substring(0, 80));
                return resp({ ok: false, error: 'Network Error' });
            });
    }
    
    // برای درخواست‌های دیگر، به حالت عادی
    return origFetch(input, init);
  };
})();
