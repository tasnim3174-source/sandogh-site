/* ============================================================
   صندوق اتحاد - بخش ویژه بانوان
   نسخه: 2.0
   ============================================================ */

function getLadySectionHTML() {
    return `
    <style>
        #ladySectionContainer .lady-title { font-size: 28px; font-weight: bold; margin: 10px 0 5px; color: #764ba2; text-shadow: 2px 2px 8px rgba(0,0,0,0.1); }
        #ladySectionContainer .lady-sub { font-size: 14px; color: #666; margin-bottom: 15px; }
        #ladySectionContainer .lady-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; width: 100%; max-width: 450px; margin: 10px 0; }
        #ladySectionContainer .lady-card { background: rgba(255,255,255,0.95); backdrop-filter: blur(15px); border-radius: 20px; padding: 25px 15px; text-align: center; border: 2px solid rgba(118,75,162,0.2); cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
        #ladySectionContainer .lady-card:active { transform: scale(0.95); }
        #ladySectionContainer .lady-card:hover { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(118,75,162,0.2); border-color: #764ba2; }
        #ladySectionContainer .lady-card .lady-icon { font-size: 55px; margin-bottom: 10px; display: block; }
        #ladySectionContainer .lady-card .lady-name { font-size: 16px; font-weight: bold; color: #333; }
        #ladySectionContainer .lady-card .lady-desc { font-size: 12px; color: #888; margin-top: 5px; }
        #ladySectionContainer .lady-card .lady-badge { display: inline-block; background: rgba(118,75,162,0.15); padding: 2px 12px; border-radius: 12px; font-size: 11px; color: #764ba2; margin-top: 8px; border: 1px solid rgba(118,75,162,0.2); }
        #ladySectionContainer .lady-footer { color: #999; font-size: 12px; margin-top: 15px; text-align: center; }
    </style>

    <div style="display:flex;flex-direction:column;align-items:center;width:100%;max-width:450px;min-height:70vh;padding:10px;text-align:center;">
        <div style="font-size:60px;margin-bottom:5px;">👩</div>
        <div class="lady-title">بانو ویژه بانوان</div>
        <div class="lady-sub">💎 برنامه‌های ویژه برای بانوان</div>
        
        <div class="lady-grid">
            <div class="lady-card" onclick="openCookingApp()">
                <span class="lady-icon">🍽️</span>
                <div class="lady-name">پخت و پز</div>
                <div class="lady-desc">منوی غذاهای ایرانی با تهیه مواد</div>
                <span class="lady-badge">📚 فعال</span>
            </div>
            
            <div class="lady-card" onclick="alert('به زودی اضافه می‌شود')">
                <span class="lady-icon">🌸</span>
                <div class="lady-name">به‌زودی...</div>
                <div class="lady-desc">برنامه‌های جدید در راه است</div>
                <span class="lady-badge">🚧 در دست ساخت</span>
            </div>
        </div>
        
        <div class="lady-footer">
            💡 این بخش شامل برنامه‌های کاربردی ویژه بانوان است
        </div>
    </div>
    `;
}

function openLadySection() {
    const container = document.createElement('div');
    container.id = 'ladySectionContainer';
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 3000;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕ بستن';
    closeBtn.style.cssText = `
        position: fixed;
        top: 12px; right: 12px;
        z-index: 3001;
        background: rgba(255,255,255,0.9);
        color: #333;
        border: 2px solid rgba(0,0,0,0.15);
        padding: 8px 18px;
        border-radius: 30px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        backdrop-filter: blur(10px);
        font-family: 'B Titr', Tahoma, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    closeBtn.onclick = function() {
        document.body.removeChild(container);
        document.body.removeChild(closeBtn);
        renderPage('menu');
    };

    container.innerHTML = getLadySectionHTML();
    document.body.appendChild(container);
    document.body.appendChild(closeBtn);
}
