/* ============================================================
   صندوق اتحاد - لایه کش هوشمند
   نسخه: 2.3 (بدون کش قدیمی برای همیشه اطلاعات جدید)
   ============================================================ */

(function(){
  var TTL_SMALL = 0; // 🆕 کش غیرفعال شد
  var TTL_MEM   = 0; // 🆕 کش غیرفعال شد
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

  window.fetch = function(input, init){
    var url = (typeof input==='string') ? input : ((input && input.url) || '');
    var m = which(url, SMALL) || which(url, MEM);
    var d = which(url, DEDUPE);
    
    if (!m && !d) {
        // اگر درخواست به گوگل است، با یک تایم‌اوت و مدیریت خطا اجرا کن
        if (url.includes('script.google.com') || url.includes('macros')) {
            return origFetch(input, init)
                .then(function(res) {
                    return res.text().then(function(text) {
                        if (text.trim().startsWith('<')) {
                            console.warn('🛡️ CORS یا HTML مسدود شد:', url.substring(0, 50));
                            return resp({ ok: false, error: 'CORS Blocked' });
                        }
                        return new Response(text, { status: res.status, headers: res.headers });
                    });
                })
                .catch(function(err) {
                    console.warn('🛡️ خطای شبکه مسدود شد:', url.substring(0, 50));
                    return resp({ ok: false, error: 'Network Error' });
                });
        }
        return origFetch(input, init);
    }

    if (m) {
        // 🆕 همیشه اطلاعات جدید را از سرور بخوان (کش غیرفعال شد)
        console.log('🔄 خواندن اطلاعات جدید از سرور برای:', url.substring(0, 50));
    }
    
    if (inflight[url]) return inflight[url].then(function(x){ return resp(x); });

    inflight[url] = origFetch(input, init)
      .then(function(r){ return r.text(); })
      .then(function(text){
        if (text.trim().startsWith('<')) {
            throw new Error('HTML received');
        }
        var x = JSON.parse(text);
        // 🆕 دیگر در کش ذخیره نمی‌کنیم
        delete inflight[url];
        return x;
      })
      .catch(function(e){ 
          delete inflight[url]; 
          return { ok: false, error: 'CORS or Timeout' }; 
      });

    return inflight[url].then(function(x){ return resp(x); });
  };
})();
