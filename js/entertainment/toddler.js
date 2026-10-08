/* ============================================================
   صندوق اتحاد - رشد ویژه خردسالان
   نسخه: 2.0
   ============================================================ */

function openToddlerGames() {
    const container = document.createElement('div');
    container.id = 'toddlerGamesContainer';
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 3000;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕ بازگشت به منو';
    closeBtn.style.cssText = `
        position: fixed;
        top: 12px; right: 12px;
        z-index: 3001;
        background: rgba(255,255,255,0.25);
        color: white;
        border: 2px solid rgba(255,255,255,0.4);
        padding: 8px 18px;
        border-radius: 30px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        backdrop-filter: blur(10px);
        font-family: 'B Titr', Tahoma, sans-serif;
    `;
    closeBtn.onclick = function() {
        document.body.removeChild(container);
        document.body.removeChild(closeBtn);
        renderPage('menu');
    };

    container.innerHTML = getToddlerGamesHTML();
    document.body.appendChild(container);
    document.body.appendChild(closeBtn);
}

function getToddlerGamesHTML() {
    return `
    <style>
        #toddlerGamesContainer .toddler-title { font-size: 28px; font-weight: bold; margin: 10px 0 5px; text-shadow: 3px 3px 10px rgba(0,0,0,0.5); background: linear-gradient(135deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        #toddlerGamesContainer .toddler-sub { font-size: 14px; opacity: 0.9; margin-bottom: 15px; color: white; text-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
        #toddlerGamesContainer .games-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; width: 100%; max-width: 450px; margin: 10px 0; }
        #toddlerGamesContainer .game-card { background: rgba(255,255,255,0.2); backdrop-filter: blur(15px); border-radius: 20px; padding: 20px 12px; text-align: center; border: 2px solid rgba(255,255,255,0.3); cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
        #toddlerGamesContainer .game-card:active { transform: scale(0.95); }
        #toddlerGamesContainer .game-card .game-icon { font-size: 55px; margin-bottom: 10px; display: block; }
        #toddlerGamesContainer .game-card .game-name { font-size: 16px; font-weight: bold; color: white; text-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
        #toddlerGamesContainer .game-card .game-desc { font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 5px; }
        #toddlerGamesContainer .game-card .game-badge { display: inline-block; background: rgba(255,215,0,0.3); padding: 2px 12px; border-radius: 12px; font-size: 11px; color: #FFD700; margin-top: 8px; border: 1px solid rgba(255,215,0,0.3); }
        #toddlerGamesContainer .toddler-footer { color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 15px; text-align: center; }
    </style>

    <div style="display:flex;flex-direction:column;align-items:center;width:100%;max-width:450px;min-height:70vh;padding:10px;text-align:center;">
        <div style="font-size:60px;margin-bottom:5px;">🧒</div>
        <div class="toddler-title">رشد ویژه خردسالان</div>
        <div class="toddler-sub">🎮 بازی‌های آموزشی و سرگرم‌کننده برای کودکان</div>
        
        <div class="games-grid">
            <div class="game-card" onclick="openSnakeGame()">
                <span class="game-icon">🐍</span>
                <div class="game-name">مار و پله</div>
                <div class="game-desc">بازی کلاسیک با کامپیوتر</div>
                <span class="game-badge">🎯 فعال</span>
            </div>
            
            <div class="game-card" onclick="openTicTacToe()">
                <span class="game-icon">❌⭕</span>
                <div class="game-name">بازی دوز</div>
                <div class="game-desc">بازی فکری با هوش مصنوعی</div>
                <span class="game-badge">🧠 جدید</span>
            </div>

            <div class="game-card" onclick="openMathGameNew()">
                <span class="game-icon">🧮</span>
                <div class="game-name">بازی ریاضی</div>
                <div class="game-desc">تمرین ریاضی با تایمر</div>
                <span class="game-badge">📚 جدید</span>
            </div>
        </div>
        
        <div class="toddler-footer">
            💡 این بازی‌ها برای تقویت مهارت‌های ذهنی و ریاضی کودکان طراحی شده‌اند
        </div>
    </div>
    `;
}
