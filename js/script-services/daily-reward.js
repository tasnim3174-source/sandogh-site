/* ============================================================
   صندوق اتحاد - پاداش روزانه
   نسخه: 2.0
   ============================================================ */

function openDailyReward(){
    if(!currentUser){alert('⚠️ ابتدا وارد شوید');return;}
    var today = new Date().toISOString().slice(0,10);
    var key = 'daily_reward_view_' + currentUser.memberId + '_' + today;
    var old=document.getElementById('dailyRewardOverlay'); if(old) old.remove();
    var ov=document.createElement('div'); ov.id='dailyRewardOverlay';
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:100001;display:flex;align-items:center;justify-content:center;padding:15px;font-family:tahoma;direction:rtl;';
    ov.innerHTML='<div style="width:min(390px,92%);background:linear-gradient(160deg,#1e1e35,#151528);border:1px solid rgba(255,215,0,.35);border-radius:22px;padding:24px;color:#fff;text-align:center;box-shadow:0 15px 50px rgba(0,0,0,.5)"><div style="font-size:3rem">🎁</div><h2 style="font-size:1.1rem;color:#ffd700;margin:8px 0">پاداش روزانه</h2><p style="font-size:.78rem;color:#bbb;line-height:1.8">با ورود روزانه می‌توانید امتیاز دریافت کنید.<br>امتیاز این بخش از سیستم امتیازات اسکریپت ثبت می‌شود.</p><div style="display:flex;gap:8px;margin-top:18px"><button id="dailyRewardClaim" style="flex:1;background:linear-gradient(135deg,#ffd700,#f59e0b);border:0;border-radius:12px;padding:12px;font-weight:900;color:#17172b;cursor:pointer">⭐ دریافت پاداش امروز</button><button id="dailyRewardClose" style="background:#333;color:#fff;border:0;border-radius:12px;padding:12px 16px;cursor:pointer">بستن</button></div></div>';
    document.body.appendChild(ov);
    document.getElementById('dailyRewardClose').onclick=function(){ov.remove();};
    document.getElementById('dailyRewardClaim').onclick=async function(){
        this.disabled=true; this.textContent='⏳ در حال ثبت...';
        try{ 
            await awardDailyLogin(currentUser); 
            alert('✅ درخواست پاداش روزانه به اسکریپت ارسال شد.'); 
            this.textContent='✅ ثبت شد'; 
        }
        catch(e){ 
            alert('❌ ثبت پاداش ناموفق بود'); 
            this.disabled=false; 
            this.textContent='⭐ دریافت پاداش امروز'; 
        }
    };
    if(localStorage.getItem(key)) document.getElementById('dailyRewardClaim').textContent='✅ امروز بررسی شده';
}
