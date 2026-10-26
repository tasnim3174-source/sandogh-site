/* ============================================================
   صندوق اتحاد - لایه کش هوشمند
   نسخه: 4.0 (اصلاح کامل CORS و مدیریت خطا)
   ============================================================ */

(function(){
  var SMALL  = ['isCouncil','status'];
  var MEM    = ['readExcel'];
  var DEDUPE = ['addPoints','getPointsHistory','getAllMembersWithPoints','updatePoints'];
  var inflight = {};
  var origFetch = window.fetch ? window.fetch.bind(window) : null;
  if (!origFetch) return;

  // 🆕 تابع ساخت پاسخ شبیه‌سازی‌شده با هدرهای CORS کامل
  function resp(data, status){
      return new Response(JSON.stringify(data), {
          status: status || 200, 
          headers:{
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // 🆕 هدر CORS
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
          }
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
    
    // 🆕 اگر درخواست به گوگل (Apps Script) است
    if (url.includes('script.google.com') || url.includes('macros')) {
        
        // 🆕 ساخت یک کپی از init برای جلوگیری از تغییر تنظیمات اصلی
        var newInit = {};
        if (init) {
            for (var key in init) {
                if (init.hasOwnProperty(key)) newInit[key] = init[key];
            }
        }
        
        // 🆕 اجبار به استفاده از text/plain برای جلوگیری از Preflight (OPTIONS)
        // این کار باعث می‌شود مرورگر درخواست OPTIONS اضافی ارسال نکند
        if (newInit.method && newInit.method.toUpperCase() === 'POST') {
            if (!newInit.headers) newInit.headers = {};
            
            // اگر headers یک آبجکت معمولی است
            if (typeof newInit.headers === 'object' && !Array.isArray(newInit.headers)) {
                // حذف Content-Type قبلی و جایگزینی با text/plain
                for (var hKey in newInit.headers) {
                    if (hKey.toLowerCase() === 'content-type') {
                        delete newInit.headers[hKey];
                    }
                }
                newInit.headers['Content-Type'] = 'text/plain';
            }
        }
        
        // 🆕 اضافه کردن پارامتر تصادفی برای دور زدن کش مرورگر
        var newUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
        
        // 🆕 ارسال درخواست واقعی
        return origFetch(newUrl, newInit)
            .then(function(res) {
                // 🆕 بررسی وضعیت پاسخ
                if (!res.ok) {
                    console.warn('🛡️ پاسخ ناموفق از سرور:', res.status, newUrl.substring(0, 100));
                }
                
                // 🆕 خواندن متن پاسخ
                return res.text().then(function(text) {
                    // 🆕 اگر پاسخ HTML بود (معمولاً یعنی خطای CORS یا صفحه ورود گوگل)
                    if (text.trim().startsWith('<')) {
                        console.warn('🛡️ CORS یا HTML مسدود شد:', newUrl.substring(0, 100));
                        return resp({ 
                            ok: false, 
                            error: 'CORS_BLOCKED', 
                            message: 'ارتباط با سرور گوگل مسدود شد. لطفاً کد Apps Script را بررسی کنید.' 
                        });
                    }
                    
                    // 🆕 اگر پاسخ JSON معتبر بود، آن را برگردان
                    try {
                        JSON.parse(text); // تست اعتبار JSON
                        return new Response(text, { 
                            status: res.status, 
                            statusText: res.statusText,
                            headers: res.headers 
                        });
                    } catch(e) {
                        console.warn('🛡️ پاسخ JSON نامعتبر:', text.substring(0, 100));
                        return resp({ 
                            ok: false, 
                            error: 'INVALID_JSON', 
                            message: 'پاسخ سرور معتبر نیست.' 
                        });
                    }
                });
            })
            .catch(function(err) {
                // 🆕 مدیریت خطای شبکه
                console.warn('🛡️ خطای شبکه:', newUrl.substring(0, 100), err);
                return resp({ 
                    ok: false, 
                    error: 'NETWORK_ERROR', 
                    message: 'خطا در ارتباط با شبکه. لطفاً اینترنت خود را بررسی کنید.' 
                });
            });
    }
    
    // 🆕 برای درخواست‌های دیگر، به حالت عادی
    return origFetch(input, init);
  };
})();
