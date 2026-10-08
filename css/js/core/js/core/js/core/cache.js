/* ============================================================
   صندوق اتحاد - لایه کش هوشمند
   نسخه: 2.0
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

  window.fetch = function(input, init){
    var url = (typeof input==='string') ? input : ((input && input.url) || '');
    var m = which(url, SMALL) || which(url, MEM);
    var d = which(url, DEDUPE);
    if (!m && !d) return origFetch(input, init);

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

    inflight[url] = origFetch(input, init)
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
          delete inflight[url]; 
          throw e; 
      });

    return inflight[url].then(function(x){ return resp(x); });
  };
})();
