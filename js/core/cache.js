/* ============================================================
   صندوق اتحاد - لایه کش هوشمند
   نسخه: 2.1 (اضافه شدن Timeout برای جلوگیری از قفل شدن)
   ============================================================ */

(function(){
  var TTL_SMALL = 5 * 60 * 1000;
  var TTL_MEM   = 5 * 60 * 1000;
  var SMALL  = ['isCouncil','status'];
  var MEM    = ['readExcel'];
  var DEDUPE = ['addPoints','getPointsHistory','getAllMembersWithPoints','updatePoints'];
  var memCache = {};
  var inflight = {};
  var origFetch = window.fetch ? window.fetch.bind(window) : null;
  if (!origFetch) return;

  function resp(data){ 
      return new Response(JSON.stringify(data), {
          status:200, 
          headers:{'Content-Type':'application/json'}
      }); 
  }
  
  function sGet(url){ 
      try{ 
          var r=sessionStorage.getItem('fc_'+url); 
          if(!r) return null; 
          var o=JSON.parse(r); 
          if(Date.now()-o.t<TTL_SMALL) return o.d; 
          sessionStorage.removeItem('fc_'+url);
      }catch(e){} 
      return null; 
  }
  
  function sSet(url,d){ 
      try{ 
          sessionStorage.setItem('fc_'+url, JSON.stringify({t:Date.now(),d:d})); 
      }catch(e){} 
  }
  
  function which(url, list){ 
      for(var i=0;i<list.length;i++){ 
          if(url.indexOf('action='+list[i])>-1) return list[i]; 
      } 
      return null; 
  }

  // تابع کمکی برای اعمال Timeout روی درخواست‌ها
  function fetchWithTimeout(url, init, timeout) {
      var controller = new AbortController();
      var signal = controller.signal;
      
      // اگر init قبلی signal داشت، با سیگنال جدید ادغام می‌شود
      var newInit = Object.assign({}, init, { signal: signal });
      
      var timeoutId = setTimeout(function () { 
          controller.abort(); 
      }, timeout);

      return origFetch(url, newInit).then(function(res) {
          clearTimeout(timeoutId);
          return res;
      }).catch(function(err) {
          clearTimeout(timeoutId);
          throw err;
      });
  }

  window.fetch = function(input, init){
    var url = (typeof input==='string') ? input : ((input && input.url) || '');
    var m = which(url, SMALL) || which(url, MEM);
    var d = which(url, DEDUPE);
    
    // اگر آدرسی در لیست کش‌ها نبود، همان درخواست عادی (با تایم‌اوت) را ارسال کن
    if (!m && !d) {
        return fetchWithTimeout(input, init, 3000).catch(function(err) {
            console.warn('⚠️ خطای شبکه در درخواست (اما نادیده گرفته شد):', url);
            // برگرداندن یک پاسخ خالی برای جلوگیری از کرش برنامه
            return new Response(JSON.stringify({ok: false, error: 'Timeout or Network Error'}), {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            });
        });
    }

    if (m) {
      if (SMALL.indexOf(m) > -1) { 
          var cs = sGet(url); 
          if (cs !== null) return Promise.resolve(resp(cs)); 
      }
      else { 
          var cm = memCache[url]; 
          if (cm && Date.now()-cm.t < TTL_MEM) return Promise.resolve(resp(cm.d)); 
      }
    }
    if (inflight[url]) return inflight[url].then(function(x){ return resp(x); });

    // اجرای درخواست با تایم‌اوت ۳ ثانیه‌ای
    inflight[url] = fetchWithTimeout(input, init, 3000)
      .then(function(r){ return r.json(); })
      .then(function(x){
        if (m) { 
            if (SMALL.indexOf(m) > -1) sSet(url,x); 
            else memCache[url] = {t:Date.now(), d:x}; 
        }
        delete inflight[url];
        return x;
      })
      .catch(function(e){ 
          console.warn('⚠️ تایم‌اوت یا خطای شبکه برای:', url);
          delete inflight[url]; 
          // در صورت خطا یک آبجکت خالی برمی‌گردانیم تا برنامه کرش نکند
          return { ok: false, error: 'CORS or Timeout' };
      });

    return inflight[url].then(function(x){ return resp(x); });
  };
})();
