/* ============================================================
   صندوق اتحاد - بازی‌ها (مار و پله، دوز، ریاضی)
   نسخه: 2.0
   ============================================================ */

// ============================================================
// 🐍 بازی مار و پله
// ============================================================
function openSnakeGame() {
    const container = document.createElement('div');
    container.id = 'snakeGameContainer';
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 3000;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕ بستن';
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

    const style = document.createElement('style');
    style.textContent = `
        #snakeGameContainer * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        #snakeGameContainer { font-family: 'Segoe UI', Tahoma, sans-serif; color: white; }
        #snakeGameContainer .snake-title { font-size: 28px; font-weight: bold; margin: 10px 0 5px; text-shadow: 3px 3px 10px rgba(0,0,0,0.5); background: linear-gradient(135deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        #snakeGameContainer .snake-sub { font-size: 14px; opacity: 0.9; margin-bottom: 15px; color: white; }
        #snakeGameContainer .record-box { background: rgba(255,255,255,0.2); backdrop-filter: blur(15px); padding: 12px 24px; border-radius: 20px; margin-bottom: 12px; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.2); color: white; text-align: center; }
        #snakeGameContainer .record-box .label { opacity: 0.8; font-size: 12px; }
        #snakeGameContainer .record-box .value { font-size: 28px; font-weight: bold; color: #FFD700; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); }
        #snakeGameContainer .start-btn { background: linear-gradient(135deg, #FFD700, #FFA500, #FF8C00); color: #333; border: none; padding: 16px 50px; font-size: 20px; font-weight: bold; border-radius: 50px; cursor: pointer; box-shadow: 0 8px 25px rgba(255,165,0,0.4); font-family: 'B Titr', Tahoma, sans-serif; margin: 5px 0; }
        #snakeGameContainer .sound-toggle { background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.4); padding: 10px 22px; font-size: 14px; border-radius: 30px; cursor: pointer; font-family: 'B Titr', Tahoma, sans-serif; margin-top: 8px; }
        #snakeGameContainer .top-bar { display: flex; justify-content: space-between; width: 100%; max-width: 450px; margin-bottom: 10px; gap: 10px; }
        #snakeGameContainer .player-card { flex: 1; background: rgba(255,255,255,0.2); backdrop-filter: blur(15px); padding: 10px 12px; border-radius: 16px; display: flex; align-items: center; gap: 8px; border: 2px solid transparent; transition: all 0.4s; box-shadow: 0 4px 15px rgba(0,0,0,0.2); color: white; }
        #snakeGameContainer .player-card.active { border-color: #FFD700; box-shadow: 0 0 25px rgba(255,215,0,0.6); transform: scale(1.03); background: rgba(255,255,255,0.3); }
        #snakeGameContainer .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); flex-shrink: 0; }
        #snakeGameContainer .avatar.p1 { background: linear-gradient(135deg, #2196F3, #1976D2); }
        #snakeGameContainer .avatar.p2 { background: linear-gradient(135deg, #FF9800, #F57C00); }
        #snakeGameContainer .player-name { font-size: 12px; opacity: 0.9; }
        #snakeGameContainer .player-pos { font-size: 16px; font-weight: bold; }
        #snakeGameContainer #board-container { position: relative; width: 100%; max-width: 450px; aspect-ratio: 1; margin-bottom: 10px; }
        #snakeGameContainer #board { display: grid; grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(10, 1fr); border: 4px solid #5D4037; background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%); box-shadow: 0 15px 40px rgba(0,0,0,0.5); width: 100%; aspect-ratio: 1; border-radius: 15px; overflow: hidden; position: relative; }
        #snakeGameContainer .cell { display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; border: 1px solid rgba(139,69,19,0.2); background: linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%); color: #5D4037; position: relative; }
        #snakeGameContainer .cell:nth-child(even) { background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%); }
        #snakeGameContainer .cell-100 { background: linear-gradient(135deg, #FFD700, #FFA500, #FF8C00) !important; color: white; font-size: 12px; }
        #snakeGameContainer .cell-1 { background: linear-gradient(135deg, #C8E6C9, #A5D6A7) !important; color: #2E7D32; font-size: 12px; }
        #snakeGameContainer #svg-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
        #snakeGameContainer .player { position: absolute; width: 60%; height: 60%; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5); transition: all 0.4s; z-index: 10; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; font-weight: bold; }
        #snakeGameContainer .player.p1 { background: linear-gradient(135deg, #2196F3, #1976D2); }
        #snakeGameContainer .player.p2 { background: linear-gradient(135deg, #FF9800, #F57C00); }
        #snakeGameContainer .player.moving { animation: jump 0.4s ease; }
        @keyframes jump { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.25); } }
        #snakeGameContainer .controls { margin-top: 8px; background: rgba(255,255,255,0.2); backdrop-filter: blur(15px); padding: 14px 18px; border-radius: 22px; text-align: center; width: 100%; max-width: 450px; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
        #snakeGameContainer #dice { font-size: 50px; margin: 4px 0; display: inline-block; transition: transform 0.5s; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4)); }
        #snakeGameContainer #dice.rolling { animation: roll 0.15s infinite; }
        @keyframes roll { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } }
        #snakeGameContainer #info { margin: 8px 0; font-size: 14px; min-height: 22px; padding: 8px 14px; background: rgba(0,0,0,0.3); border-radius: 14px; font-weight: bold; color: white; }
        #snakeGameContainer .btn-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        #snakeGameContainer .btn-row button { background: linear-gradient(135deg, #FFD700, #FFA500, #FF8C00); color: #333; border: none; padding: 12px 24px; font-size: 15px; font-weight: bold; border-radius: 30px; cursor: pointer; box-shadow: 0 6px 18px rgba(255,165,0,0.4); flex: 1; min-width: 100px; max-width: 180px; font-family: 'B Titr', Tahoma, sans-serif; }
        #snakeGameContainer .btn-row button:disabled { background: linear-gradient(135deg, #757575, #616161); color: #999; cursor: not-allowed; opacity: 0.6; }
        #snakeGameContainer .confetti { position: fixed; width: 10px; height: 10px; top: -15px; z-index: 3100; animation: fall linear forwards; pointer-events: none; }
        @keyframes fall { to { transform: translateY(100vh) rotate(720deg); } }
        #snakeGameContainer #endScreen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 3050; display: none; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
        #snakeGameContainer #endScreen .end-content { background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); padding: 28px 24px; border-radius: 28px; text-align: center; max-width: 360px; width: 100%; box-shadow: 0 25px 70px rgba(0,0,0,0.6); border: 3px solid rgba(255,255,255,0.3); color: white; }
        #snakeGameContainer #endScreen .end-icon { font-size: 70px; margin-bottom: 10px; }
        #snakeGameContainer #endScreen .end-title { font-size: 28px; font-weight: bold; margin-bottom: 8px; background: linear-gradient(135deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        #snakeGameContainer #endScreen .end-message { font-size: 16px; margin-bottom: 18px; opacity: 0.95; }
        #snakeGameContainer #endScreen .end-stats { background: rgba(0,0,0,0.3); padding: 16px; border-radius: 18px; margin-bottom: 18px; border: 1px solid rgba(255,255,255,0.2); }
        #snakeGameContainer #endScreen .stat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.12); font-size: 14px; }
        #snakeGameContainer #endScreen .stat-row:last-child { border-bottom: none; }
        @keyframes bounce { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-15px) rotate(-5deg); } 75% { transform: translateY(-15px) rotate(5deg); } }
    `;
    container.appendChild(style);

    container.innerHTML += `
        <div id="snakeStartScreen" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;width:100%;max-width:450px;padding:10px;text-align:center;">
            <div style="font-size:70px;margin-bottom:10px;animation:bounce 2s infinite;">🐍🪜</div>
            <div class="snake-title">مار و پله</div>
            <div class="snake-sub">بازی کلاسیک با طراحی مدرن و حرفه‌ای</div>
            <div class="record-box">
                <div class="label">🏆 بهترین رکورد تو</div>
                <div class="value" id="snakeBestRecord">0</div>
                <div class="label">برد</div>
            </div>
            <button class="start-btn" onclick="snakeStartGame()">🎮 شروع بازی</button>
            <button class="sound-toggle" onclick="snakeToggleSound()">🔊 صدا: روشن</button>
        </div>

        <div id="snakeGameScreen" style="display:none;flex-direction:column;align-items:center;width:100%;max-width:450px;">
            <div class="top-bar">
                <div class="player-card active" id="snakeCard1">
                    <div class="avatar p1">👤</div>
                    <div class="player-info">
                        <div class="player-name">تو</div>
                        <div class="player-pos" id="snakePos1">خانه ۱</div>
                    </div>
                </div>
                <div class="player-card" id="snakeCard2">
                    <div class="avatar p2">🤖</div>
                    <div class="player-info">
                        <div class="player-name">کامپیوتر</div>
                        <div class="player-pos" id="snakePos2">خانه ۱</div>
                    </div>
                </div>
            </div>
            <div id="board-container">
                <div id="board"></div>
                <svg id="svg-overlay"></svg>
            </div>
            <div class="controls">
                <div id="dice">🎲</div>
                <div id="info">🔵 نوبت تو - دکمه تاس رو بزن</div>
                <div class="btn-row">
                    <button id="rollBtn" onclick="snakeRollDice()">🎲 پرتاب تاس</button>
                </div>
            </div>
        </div>

        <div id="endScreen">
            <div class="end-content">
                <div class="end-icon" id="snakeEndIcon">🏆</div>
                <div class="end-title" id="snakeEndTitle">تبریک!</div>
                <div class="end-message" id="snakeEndMessage">تو برنده شدی</div>
                <div class="end-stats">
                    <div class="stat-row"><span>🎲 تعداد تاس:</span><span id="statRolls">0</span></div>
                    <div class="stat-row"><span>🐍 مارهای گرفته:</span><span id="statSnakes">0</span></div>
                    <div class="stat-row"><span>🪜 پله‌های سوار شده:</span><span id="statLadders">0</span></div>
                    <div class="stat-row"><span>🎯 تعداد ۶ آوردن:</span><span id="statSixes">0</span></div>
                </div>
                <button class="start-btn" onclick="snakeRestartGame()">🔄 بازی دوباره</button>
                <button class="sound-toggle" onclick="goToSnakeMenu()" style="margin-top:12px">🏠 منوی اصلی</button>
            </div>
        </div>
    `;

    document.body.appendChild(container);
    document.body.appendChild(closeBtn);

    setTimeout(function() {
        const recordEl = document.getElementById('snakeBestRecord');
        if (recordEl) {
            const wins = parseInt(localStorage.getItem('snlWins') || '0');
            recordEl.textContent = wins;
        }
        snakeBuildBoard();
    }, 100);
}

function goToSnakeMenu() {
    const container = document.getElementById('snakeGameContainer');
    if (container) {
        const closeBtn = container.parentElement.querySelector('button[style*="position: fixed; top: 12px; right: 12px;"]');
        if (closeBtn) closeBtn.click();
    }
    renderPage('menu');
}

function snakeToggleSound() {
    snakeSoundEnabled = !snakeSoundEnabled;
    const btn = document.querySelector('#snakeGameContainer .sound-toggle');
    if (btn) btn.textContent = snakeSoundEnabled ? '🔊 صدا: روشن' : '🔇 صدا: خاموش';
}

function snakePlaySound(type) {
    if (!snakeSoundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === 'dice') { osc.frequency.value = 400; gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); osc.start(); osc.stop(ctx.currentTime + 0.1); }
        else if (type === 'move') { osc.frequency.value = 600; gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05); osc.start(); osc.stop(ctx.currentTime + 0.05); }
        else if (type === 'snake') { osc.frequency.value = 200; osc.type = 'sawtooth'; gain.gain.setValueAtTime(0.15, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); osc.start(); osc.stop(ctx.currentTime + 0.4); }
        else if (type === 'ladder') { osc.frequency.value = 800; osc.type = 'sine'; gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); osc.start(); osc.stop(ctx.currentTime + 0.3); }
        else if (type === 'six') { [523, 659, 784].forEach((freq, i) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value = freq; g.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.15); o.start(ctx.currentTime + i * 0.1); o.stop(ctx.currentTime + i * 0.1 + 0.15); }); }
        else if (type === 'win') { [523, 659, 784, 1047].forEach((freq, i) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value = freq; g.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.2); o.start(ctx.currentTime + i * 0.15); o.stop(ctx.currentTime + i * 0.15 + 0.2); }); }
    } catch(e) {}
}

function snakeGetCellPosition(num, boardEl) {
    const row = Math.ceil(num / 10);
    const col = (num - 1) % 10;
    const actualCol = (row % 2 === 1) ? col : (9 - col);
    const actualRow = 10 - row;
    const cellWidth = boardEl.offsetWidth / 10;
    const cellHeight = boardEl.offsetHeight / 10;
    return { x: actualCol * cellWidth + cellWidth / 2, y: actualRow * cellHeight + cellHeight / 2 };
}

function snakeDrawLaddersAndSnakes() {
    const svg = document.getElementById('svg-overlay');
    const board = document.getElementById('board');
    if (!svg || !board) return;
    svg.innerHTML = '';
    const cellSize = board.offsetWidth / 10 || 40;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const sg = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    sg.setAttribute('id', 'snakeGradient');
    sg.setAttribute('x1', '0%'); sg.setAttribute('y1', '0%');
    sg.setAttribute('x2', '100%'); sg.setAttribute('y2', '100%');
    ['#D32F2F','#F44336','#B71C1C'].forEach((c, i) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); s.setAttribute('offset', (i*50)+'%'); s.setAttribute('style', 'stop-color:'+c+';stop-opacity:1'); sg.appendChild(s); });
    defs.appendChild(sg);
    const lg = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    lg.setAttribute('id', 'ladderGradient');
    lg.setAttribute('x1', '0%'); lg.setAttribute('y1', '0%');
    lg.setAttribute('x2', '100%'); lg.setAttribute('y2', '0%');
    ['#8D6E63','#A1887F','#6D4C41'].forEach((c, i) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); s.setAttribute('offset', (i*50)+'%'); s.setAttribute('style', 'stop-color:'+c+';stop-opacity:1'); lg.appendChild(s); });
    defs.appendChild(lg);
    svg.appendChild(defs);

    Object.entries(SNAKE_LADDERS).forEach(([from, to]) => {
        const fp = snakeGetCellPosition(parseInt(from), board);
        const tp = snakeGetCellPosition(to, board);
        const angle = Math.atan2(tp.y - fp.y, tp.x - fp.x);
        const perpAngle = angle + Math.PI / 2;
        const offset = cellSize * 0.25;
        const x1l = fp.x + Math.cos(perpAngle) * offset;
        const y1l = fp.y + Math.sin(perpAngle) * offset;
        const x2l = tp.x + Math.cos(perpAngle) * offset;
        const y2l = tp.y + Math.sin(perpAngle) * offset;
        const x1r = fp.x - Math.cos(perpAngle) * offset;
        const y1r = fp.y - Math.sin(perpAngle) * offset;
        const x2r = tp.x - Math.cos(perpAngle) * offset;
        const y2r = tp.y - Math.sin(perpAngle) * offset;
        const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l1.setAttribute('x1', x1l); l1.setAttribute('y1', y1l); l1.setAttribute('x2', x2l); l1.setAttribute('y2', y2l);
        l1.setAttribute('stroke', 'url(#ladderGradient)'); l1.setAttribute('stroke-width', cellSize * 0.12); l1.setAttribute('stroke-linecap', 'round');
        svg.appendChild(l1);
        const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l2.setAttribute('x1', x1r); l2.setAttribute('y1', y1r); l2.setAttribute('x2', x2r); l2.setAttribute('y2', y2r);
        l2.setAttribute('stroke', 'url(#ladderGradient)'); l2.setAttribute('stroke-width', cellSize * 0.12); l2.setAttribute('stroke-linecap', 'round');
        svg.appendChild(l2);
        const dist = Math.sqrt(Math.pow(tp.x - fp.x, 2) + Math.pow(tp.y - fp.y, 2));
        const numRungs = Math.max(3, Math.floor(dist / (cellSize * 0.4)));
        for (let i = 1; i < numRungs; i++) {
            const t = i / numRungs;
            const x = fp.x + (tp.x - fp.x) * t;
            const y = fp.y + (tp.y - fp.y) * t;
            const r = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            r.setAttribute('x1', x + Math.cos(perpAngle) * offset);
            r.setAttribute('y1', y + Math.sin(perpAngle) * offset);
            r.setAttribute('x2', x - Math.cos(perpAngle) * offset);
            r.setAttribute('y2', y - Math.sin(perpAngle) * offset);
            r.setAttribute('stroke', '#6D4C41'); r.setAttribute('stroke-width', cellSize * 0.08); r.setAttribute('stroke-linecap', 'round');
            svg.appendChild(r);
        }
    });

    Object.entries(SNAKE_SNAKES).forEach(([from, to]) => {
        const fp = snakeGetCellPosition(parseInt(from), board);
        const tp = snakeGetCellPosition(to, board);
        const dx = tp.x - fp.x, dy = tp.y - fp.y;
        const length = Math.sqrt(dx*dx + dy*dy);
        const amplitude = cellSize * 0.3;
        const pts = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const x = fp.x + dx * t;
            const y = fp.y + dy * t;
            const wave = Math.sin(t * Math.PI * 4) * amplitude * (1 - t * 0.5);
            const perpX = -dy / length * wave;
            const perpY = dx / length * wave;
            pts.push({ x: x + perpX, y: y + perpY });
        }
        let pathData = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length - 1; i++) {
            const xc = (pts[i].x + pts[i+1].x) / 2;
            const yc = (pts[i].y + pts[i+1].y) / 2;
            pathData += ` Q ${pts[i].x} ${pts[i].y} ${xc} ${yc}`;
        }
        pathData += ` L ${pts[pts.length-1].x} ${pts[pts.length-1].y}`;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', 'url(#snakeGradient)');
        path.setAttribute('stroke-width', cellSize * 0.15);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        head.setAttribute('cx', fp.x); head.setAttribute('cy', fp.y);
        head.setAttribute('r', cellSize * 0.18);
        head.setAttribute('fill', '#D32F2F');
        head.setAttribute('stroke', '#B71C1C');
        head.setAttribute('stroke-width', '2');
        svg.appendChild(head);
    });
}

function snakeBuildBoard() {
    const board = document.getElementById('board');
    if (!board) return;
    board.innerHTML = '';
    for (let row = 10; row >= 1; row--) {
        for (let col = 1; col <= 10; col++) {
            let num = (row-1)*10 + (((10-row)%2===0) ? col : (11-col));
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = 'cell-' + num;
            if (num === 100) { cell.classList.add('cell-100'); cell.textContent = '🏆'; }
            else if (num === 1) { cell.classList.add('cell-1'); cell.textContent = '🚩'; }
            else { cell.textContent = num; }
            board.appendChild(cell);
        }
    }
    setTimeout(() => {
        snakeDrawLaddersAndSnakes();
        snakeUpdatePlayers();
    }, 100);
}

function snakeUpdatePlayers() {
    document.querySelectorAll('#board .player').forEach(p => p.remove());
    snakePlayers.forEach((pos, i) => {
        const cell = document.getElementById('cell-' + pos);
        if (cell) {
            const marker = document.createElement('div');
            marker.className = 'player p' + (i+1);
            marker.textContent = i === 0 ? '👤' : '🤖';
            cell.appendChild(marker);
        }
    });
    const p1 = document.getElementById('snakePos1');
    const p2 = document.getElementById('snakePos2');
    if (p1) p1.textContent = 'خانه ' + snakePlayers[0];
    if (p2) p2.textContent = 'خانه ' + snakePlayers[1];
}

function snakeAnimateMove(playerIndex, from, to, callback) {
    const direction = to > from ? 1 : -1;
    let current = from;
    const steps = Math.abs(to - from);
    let step = 0;
    const interval = setInterval(() => {
        current += direction;
        snakePlayers[playerIndex] = current;
        snakeUpdatePlayers();
        snakePlaySound('move');
        const marker = document.querySelector('#board .p' + (playerIndex+1));
        if (marker) { marker.classList.add('moving'); setTimeout(() => marker.classList.remove('moving'), 400); }
        step++;
        if (step >= steps) { clearInterval(interval); if (callback) callback(); }
    }, 180);
}

function snakeRollDice() {
    if (snakeGameOver || snakeIsRolling || snakeCurrentPlayer !== 0) return;
    snakeIsRolling = true;
    snakeTotalRolls++;
    const btn = document.getElementById('rollBtn');
    if (btn) btn.disabled = true;
    const dice = document.getElementById('dice');
    if (dice) { dice.classList.add('rolling'); }
    snakePlaySound('dice');
    let count = 0;
    const anim = setInterval(() => {
        if (dice) dice.textContent = SNAKE_DICE_FACES[Math.floor(Math.random()*6)];
        count++;
        if (count > 10) {
            clearInterval(anim);
            if (dice) dice.classList.remove('rolling');
            const roll = Math.floor(Math.random()*6)+1;
            snakeLastRoll = roll;
            if (dice) dice.textContent = SNAKE_DICE_FACES[roll-1];
            snakeIsRolling = false;
            snakeMovePlayer(roll);
        }
    }, 80);
}

function snakeMovePlayer(steps) {
    const info = document.getElementById('info');
    let pos = snakePlayers[snakeCurrentPlayer];
    const isComputer = snakeCurrentPlayer === 1;
    const color = isComputer ? '🟠' : '🔵';
    const name = isComputer ? 'کامپیوتر' : 'تو';
    if (pos + steps > 100) {
        if (info) info.textContent = `${color} ${name}: عدد ${steps} اومد، ولی باید دقیقاً به ۱۰۰ برسی!`;
        setTimeout(() => {
            if (snakeLastRoll === 6) { snakeGiveBonusRoll(); }
            else { snakeNextTurn(); }
        }, 1500);
        return;
    }
    const targetPos = pos + steps;
    if (info) info.textContent = `${color} ${name}: تاس ${steps} اومد!`;
    snakeAnimateMove(snakeCurrentPlayer, pos, targetPos, () => {
        setTimeout(() => {
            const finalPos = snakePlayers[snakeCurrentPlayer];
            if (SNAKE_SNAKES[finalPos]) {
                if (snakeCurrentPlayer === 0) snakeSnakesHit++;
                snakePlaySound('snake');
                if (info) info.textContent = `${color} ${name} 🐍 ماری گرفت! از ${finalPos} به ${SNAKE_SNAKES[finalPos]} سقوط کرد!`;
                setTimeout(() => {
                    snakeAnimateMove(snakeCurrentPlayer, finalPos, SNAKE_SNAKES[finalPos], () => {
                        if (!snakeCheckWin()) {
                            if (snakeLastRoll === 6) snakeGiveBonusRoll();
                            else snakeNextTurn();
                        }
                    });
                }, 800);
            } else if (SNAKE_LADDERS[finalPos]) {
                if (snakeCurrentPlayer === 0) snakeLaddersHit++;
                snakePlaySound('ladder');
                if (info) info.textContent = `${color} ${name} 🪜 پله‌ای پیدا کرد! از ${finalPos} به ${SNAKE_LADDERS[finalPos]} صعود کرد!`;
                setTimeout(() => {
                    snakeAnimateMove(snakeCurrentPlayer, finalPos, SNAKE_LADDERS[finalPos], () => {
                        if (!snakeCheckWin()) {
                            if (snakeLastRoll === 6) snakeGiveBonusRoll();
                            else snakeNextTurn();
                        }
                    });
                }, 800);
            } else {
                if (!snakeCheckWin()) {
                    if (snakeLastRoll === 6) snakeGiveBonusRoll();
                    else snakeNextTurn();
                }
            }
        }, 400);
    });
}

function snakeGiveBonusRoll() {
    const info = document.getElementById('info');
    const isComputer = snakeCurrentPlayer === 1;
    const color = isComputer ? '🟠' : '🔵';
    const name = isComputer ? 'کامپیوتر' : 'تو';
    if (snakeCurrentPlayer === 0) snakeSixesCount++;
    snakePlaySound('six');
    if (info) info.textContent = `🎉 ${color} ${name} ۶ آوردی! یک بار دیگه تاس بنداز! 🎲`;
    setTimeout(() => {
        if (snakeCurrentPlayer === 0) {
            const btn = document.getElementById('rollBtn');
            if (btn) btn.disabled = false;
            if (info) info.textContent = '🔵 نوبت تو - دکمه تاس رو بزن (جایزه ۶!)';
        } else {
            snakeComputerRoll();
        }
    }, 1500);
}

function snakeComputerRoll() {
    if (snakeGameOver || snakeIsRolling) return;
    snakeIsRolling = true;
    snakeTotalRolls++;
    const dice = document.getElementById('dice');
    const info = document.getElementById('info');
    if (info) info.textContent = '🤖 کامپیوتر در حال پرتاب تاس...';
    if (dice) dice.classList.add('rolling');
    snakePlaySound('dice');
    let count = 0;
    const anim = setInterval(() => {
        if (dice) dice.textContent = SNAKE_DICE_FACES[Math.floor(Math.random()*6)];
        count++;
        if (count > 10) {
            clearInterval(anim);
            if (dice) dice.classList.remove('rolling');
            const roll = Math.floor(Math.random()*6)+1;
            snakeLastRoll = roll;
            if (dice) dice.textContent = SNAKE_DICE_FACES[roll-1];
            snakeIsRolling = false;
            snakeMovePlayer(roll);
        }
    }, 80);
}

function snakeCheckWin() {
    if (snakePlayers[snakeCurrentPlayer] === 100) {
        snakeGameOver = true;
        if (snakeCurrentPlayer === 0) {
            snakeWins++;
            localStorage.setItem('snlWins', snakeWins);
            snakePlaySound('win');
            snakeShowConfetti();
        }
        setTimeout(() => snakeShowEndScreen(snakeCurrentPlayer === 0), 1000);
        return true;
    }
    return false;
}

function snakeNextTurn() {
    snakeCurrentPlayer = 1 - snakeCurrentPlayer;
    const info = document.getElementById('info');
    const btn = document.getElementById('rollBtn');
    const card1 = document.getElementById('snakeCard1');
    const card2 = document.getElementById('snakeCard2');
    if (snakeCurrentPlayer === 0) {
        if (info) info.textContent = '🔵 نوبت تو - دکمه تاس رو بزن';
        if (btn) btn.disabled = false;
        if (card1) card1.classList.add('active');
        if (card2) card2.classList.remove('active');
    } else {
        if (info) info.textContent = '🟠 نوبت کامپیوتر...';
        if (btn) btn.disabled = true;
        if (card1) card1.classList.remove('active');
        if (card2) card2.classList.add('active');
        setTimeout(() => { if (!snakeGameOver) snakeComputerRoll(); }, 1500);
    }
}

function snakeShowConfetti() {
    const colors = ['#FFD700','#FF6B6B','#4CAF50','#2196F3','#FF9800','#E91E63','#9C27B0'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'confetti';
            el.style.left = Math.random()*100 + '%';
            el.style.background = colors[Math.floor(Math.random()*colors.length)];
            el.style.animationDuration = (Math.random()*2+2)+'s';
            el.style.transform = 'rotate('+Math.random()*360+'deg)';
            el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        }, i*40);
    }
}

function snakeShowEndScreen(won) {
    const screen = document.getElementById('endScreen');
    if (!screen) return;
    screen.style.display = 'flex';
    if (won) {
        document.getElementById('snakeEndIcon').textContent = '🏆';
        document.getElementById('snakeEndTitle').textContent = 'تبریک!';
        document.getElementById('snakeEndMessage').textContent = 'تو برنده شدی! 🎉';
    } else {
        document.getElementById('snakeEndIcon').textContent = '😢';
        document.getElementById('snakeEndTitle').textContent = 'باختی!';
        document.getElementById('snakeEndMessage').textContent = 'کامپیوتر برنده شد. دوباره تلاش کن!';
    }
    document.getElementById('statRolls').textContent = snakeTotalRolls;
    document.getElementById('statSnakes').textContent = snakeSnakesHit;
    document.getElementById('statLadders').textContent = snakeLaddersHit;
    document.getElementById('statSixes').textContent = snakeSixesCount;
}

function snakeStartGame() {
    document.getElementById('snakeStartScreen').style.display = 'none';
    document.getElementById('snakeGameScreen').style.display = 'flex';
    document.getElementById('endScreen').style.display = 'none';
    snakeResetGame();
}

function snakeRestartGame() {
    document.getElementById('endScreen').style.display = 'none';
    snakeResetGame();
}

function snakeResetGame() {
    snakePlayers = [1, 1];
    snakeCurrentPlayer = 0;
    snakeGameOver = false;
    snakeIsRolling = false;
    snakeTotalRolls = 0;
    snakeSnakesHit = 0;
    snakeLaddersHit = 0;
    snakeSixesCount = 0;
    snakeLastRoll = 0;
    const btn = document.getElementById('rollBtn');
    if (btn) btn.disabled = false;
    const dice = document.getElementById('dice');
    if (dice) dice.textContent = '🎲';
    const info = document.getElementById('info');
    if (info) info.textContent = '🔵 نوبت تو - دکمه تاس رو بزن';
    const card1 = document.getElementById('snakeCard1');
    const card2 = document.getElementById('snakeCard2');
    if (card1) card1.classList.add('active');
    if (card2) card2.classList.remove('active');
    snakeBuildBoard();
}

// ============================================================
// ❌⭕ بازی دوز
// ============================================================
function openTicTacToe() {
    const container = document.createElement('div');
    container.id = 'tttGameContainer';
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 3000;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕ بستن';
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

    const style = document.createElement('style');
    style.textContent = `
        #tttGameContainer * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        #tttGameContainer { font-family: 'Segoe UI', Tahoma, sans-serif; color: white; }
        #tttGameContainer .ttt-title { font-size: 28px; font-weight: bold; margin: 10px 0 5px; text-shadow: 3px 3px 10px rgba(0,0,0,0.5); background: linear-gradient(135deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        #tttGameContainer .ttt-sub { font-size: 13px; opacity: 0.9; margin-bottom: 12px; color: white; }
        #tttGameContainer .record-box { background: rgba(255,255,255,0.2); backdrop-filter: blur(15px); padding: 12px 24px; border-radius: 20px; margin-bottom: 12px; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.2); color: white; text-align: center; }
        #tttGameContainer .record-box .label { opacity: 0.8; font-size: 12px; }
        #tttGameContainer .record-box .value { font-size: 28px; font-weight: bold; color: #FFD700; }
        #tttGameContainer .diff-section { background: rgba(255,255,255,0.15); backdrop-filter: blur(15px); padding: 18px; border-radius: 20px; margin-bottom: 15px; width: 100%; max-width: 350px; border: 2px solid rgba(255,255,255,0.2); }
        #tttGameContainer .diff-title { font-size: 15px; margin-bottom: 12px; font-weight: bold; }
        #tttGameContainer .diff-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
        #tttGameContainer .diff-btn { flex: 1; min-width: 70px; padding: 10px 14px; background: rgba(255,255,255,0.2); border: 2px solid transparent; border-radius: 12px; color: white; cursor: pointer; font-size: 13px; font-weight: bold; font-family: 'B Titr', Tahoma, sans-serif; }
        #tttGameContainer .diff-btn.active { background: linear-gradient(135deg, #FFD700, #FFA500); color: #333; border-color: white; }
        #tttGameContainer .start-btn { background: linear-gradient(135deg, #FFD700, #FFA500, #FF8C00); color: #333; border: none; padding: 16px 50px; font-size: 20px; font-weight: bold; border-radius: 50px; cursor: pointer; box-shadow: 0 8px 25px rgba(255,165,0,0.4); font-family: 'B Titr', Tahoma, sans-serif; margin: 5px 0; }
        #tttGameContainer .top-bar { display: flex; justify-content: space-between; width: 100%; max-width: 400px; margin-bottom: 12px; gap: 10px; }
        #tttGameContainer .player-card { flex: 1; background: rgba(255,255,255,0.2); backdrop-filter: blur(15px); padding: 10px 12px; border-radius: 16px; display: flex; align-items: center; gap: 8px; border: 2px solid transparent; transition: all 0.4s; color: white; }
        #tttGameContainer .player-card.active { border-color: #FFD700; box-shadow: 0 0 25px rgba(255,215,0,0.6); transform: scale(1.03); background: rgba(255,255,255,0.3); }
        #tttGameContainer .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; border: 3px solid white; flex-shrink: 0; }
        #tttGameContainer .avatar.p1 { background: linear-gradient(135deg, #2196F3, #1976D2); color: white; }
        #tttGameContainer .avatar.p2 { background: linear-gradient(135deg, #FF9800, #F57C00); color: white; }
        #tttGameContainer .player-name { font-size: 12px; opacity: 0.9; }
        #tttGameContainer .player-score { font-size: 18px; font-weight: bold; }
        #tttGameContainer #tttBoard { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 10px; background: rgba(255,255,255,0.1); padding: 16px; border-radius: 22px; box-shadow: 0 15px 40px rgba(0,0,0,0.4); margin: 12px 0; width: 100%; max-width: 350px; aspect-ratio: 1; }
        #tttGameContainer .ttt-cell { background: rgba(255,255,255,0.95); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 60px; font-weight: bold; cursor: pointer; transition: all 0.3s; box-shadow: 0 6px 16px rgba(0,0,0,0.3); user-select: none; aspect-ratio: 1; }
        #tttGameContainer .ttt-cell:active:not(.taken) { transform: scale(0.95); }
        #tttGameContainer .ttt-cell.taken { cursor: not-allowed; animation: pop 0.3s ease-out; }
        @keyframes pop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
        #tttGameContainer .ttt-cell.x { color: #2196F3; }
        #tttGameContainer .ttt-cell.o { color: #FF9800; }
        #tttGameContainer .ttt-cell.win { background: linear-gradient(135deg, #4CAF50, #45a049) !important; color: white !important; animation: pulse 0.6s infinite alternate; }
        @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.08); } }
        #tttGameContainer #tttInfo { font-size: 16px; margin: 10px 0; min-height: 28px; background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 18px; text-align: center; font-weight: bold; width: 100%; max-width: 350px; }
        #tttGameContainer .btn-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; width: 100%; max-width: 350px; }
        #tttGameContainer .btn-row button { background: linear-gradient(135deg, #FFD700, #FFA500, #FF8C00); color: #333; border: none; padding: 12px 24px; font-size: 15px; font-weight: bold; border-radius: 30px; cursor: pointer; flex: 1; min-width: 100px; max-width: 160px; font-family: 'B Titr', Tahoma, sans-serif; }
        #tttGameContainer .btn-secondary { background: rgba(255,255,255,0.25); color: white; border: 2px solid rgba(255,255,255,0.4); }
        #tttGameContainer .confetti { position: fixed; width: 10px; height: 10px; top: -15px; z-index: 3100; animation: fall linear forwards; pointer-events: none; }
        @keyframes fall { to { transform: translateY(100vh) rotate(720deg); } }
        #tttGameContainer #tttEndScreen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 3050; display: none; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
        #tttGameContainer #tttEndScreen .end-content { background: linear-gradient(135deg, #1e3c72, #2a5298, #7e8ba3); padding: 28px 24px; border-radius: 28px; text-align: center; max-width: 360px; width: 100%; border: 3px solid rgba(255,255,255,0.3); color: white; }
        #tttGameContainer #tttEndScreen .end-icon { font-size: 70px; margin-bottom: 10px; }
        #tttGameContainer #tttEndScreen .end-title { font-size: 28px; font-weight: bold; margin-bottom: 8px; background: linear-gradient(135deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        #tttGameContainer #tttEndScreen .end-message { font-size: 16px; margin-bottom: 18px; }
        #tttGameContainer #tttEndScreen .end-stats { background: rgba(0,0,0,0.3); padding: 16px; border-radius: 18px; margin-bottom: 18px; }
        #tttGameContainer #tttEndScreen .stat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.12); font-size: 14px; }
        #tttGameContainer #tttEndScreen .stat-row:last-child { border-bottom: none; }
        @keyframes bounce { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-15px) rotate(-5deg); } 75% { transform: translateY(-15px) rotate(5deg); } }
    `;
    container.appendChild(style);

    container.innerHTML += `
        <div id="tttStartScreen" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;width:100%;max-width:450px;padding:10px;text-align:center;">
            <div style="font-size:70px;margin-bottom:10px;animation:bounce 2s infinite;">❌⭕</div>
            <div class="ttt-title">بازی دوز</div>
            <div class="ttt-sub">بازی کلاسیک با هوش مصنوعی</div>
            <div class="record-box">
                <div class="label">🏆 تعداد برد تو</div>
                <div class="value" id="tttBestRecord">0</div>
            </div>
            <div class="diff-section">
                <div class="diff-title">🎯 سطح سختی:</div>
                <div class="diff-buttons">
                    <button class="diff-btn active" data-level="easy" onclick="tttSetDifficulty('easy')">آسون</button>
                    <button class="diff-btn" data-level="medium" onclick="tttSetDifficulty('medium')">متوسط</button>
                    <button class="diff-btn" data-level="hard" onclick="tttSetDifficulty('hard')">سخت</button>
                </div>
            </div>
            <button class="start-btn" onclick="tttStartGame()">🎮 شروع بازی</button>
        </div>

        <div id="tttGameScreen" style="display:none;flex-direction:column;align-items:center;width:100%;max-width:450px;">
            <div class="top-bar">
                <div class="player-card active" id="tttCard1">
                    <div class="avatar p1">❌</div>
                    <div class="player-info">
                        <div class="player-name">تو</div>
                        <div class="player-score" id="tttScore1">0</div>
                    </div>
                </div>
                <div class="player-card" id="tttCard2">
                    <div class="avatar p2">⭕</div>
                    <div class="player-info">
                        <div class="player-name">کامپیوتر</div>
                        <div class="player-score" id="tttScore2">0</div>
                    </div>
                </div>
            </div>
            <div id="tttBoard"></div>
            <div id="tttInfo">نوبت تو (❌) - روی یک خانه کلیک کن</div>
            <div class="btn-row">
                <button onclick="tttResetGame()">🔄 بازی جدید</button>
                <button class="btn-secondary" onclick="tttExitGame()">🚪 خروج</button>
            </div>
        </div>

        <div id="tttEndScreen">
            <div class="end-content">
                <div class="end-icon" id="tttEndIcon">🏆</div>
                <div class="end-title" id="tttEndTitle">تبریک!</div>
                <div class="end-message" id="tttEndMessage">تو برنده شدی</div>
                <div class="end-stats">
                    <div class="stat-row"><span>❌ برد تو:</span><span id="tttStatWins">0</span></div>
                    <div class="stat-row"><span>⭕ برد کامپیوتر:</span><span id="tttStatLosses">0</span></div>
                    <div class="stat-row"><span>🤝 مساوی:</span><span id="tttStatDraws">0</span></div>
                </div>
                <button class="start-btn" onclick="tttRestartGame()">🔄 بازی دوباره</button>
                <button class="btn-secondary" onclick="tttGoToMenu()" style="margin-top:12px">🏠 منوی اصلی</button>
            </div>
        </div>
    `;

    document.body.appendChild(container);
    document.body.appendChild(closeBtn);

    setTimeout(function() {
        tttBuildBoard();
    }, 100);
}

function tttUpdateBestRecord() {
    const el = document.getElementById('tttBestRecord');
    if (el) el.textContent = tttWins;
}

function tttSetDifficulty(level) {
    tttDifficulty = level;
    document.querySelectorAll('#tttGameContainer .diff-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === level) btn.classList.add('active');
    });
}

function tttBuildBoard() {
    const boardEl = document.getElementById('tttBoard');
    if (!boardEl) return;
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => tttHandleCellClick(i));
        boardEl.appendChild(cell);
    }
    tttUpdateBestRecord();
}

function tttHandleCellClick(index) {
    if (!tttGameActive || tttBoard[index] !== '') return;
    tttMakeMove(index, TTT_HUMAN);
    const result = tttCheckResult();
    if (result) { tttEndGame(result); return; }

    tttGameActive = false;
    document.getElementById('tttInfo').textContent = '🤖 کامپیوتر در حال فکر کردن...';
    document.getElementById('tttCard1').classList.remove('active');
    document.getElementById('tttCard2').classList.add('active');

    setTimeout(() => {
        const bestMove = tttGetBestMove();
        tttMakeMove(bestMove, TTT_COMPUTER);
        const result2 = tttCheckResult();
        if (result2) { tttEndGame(result2); return; }
        tttGameActive = true;
        document.getElementById('tttInfo').textContent = 'نوبت تو (❌) - روی یک خانه کلیک کن';
        document.getElementById('tttCard1').classList.add('active');
        document.getElementById('tttCard2').classList.remove('active');
    }, 600);
}

function tttMakeMove(index, player) {
    tttBoard[index] = player;
    const cell = document.querySelector(`#tttBoard .ttt-cell[data-index="${index}"]`);
    if (cell) {
        cell.textContent = player === 'X' ? '❌' : '⭕';
        cell.classList.add('taken', player.toLowerCase());
    }
}

function tttCheckResult() {
    for (const pattern of TTT_WIN_PATTERNS) {
        const [a, b, c] = pattern;
        if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            return { winner: tttBoard[a], pattern: pattern };
        }
    }
    if (!tttBoard.includes('')) return { winner: 'D', pattern: null };
    return null;
}

function tttEndGame(result) {
    tttGameActive = false;
    const info = document.getElementById('tttInfo');

    if (result.winner === TTT_HUMAN) {
        info.textContent = '🎉 تبریک! تو برنده شدی! 🏆';
        tttScores.X++;
        tttWins++;
        localStorage.setItem('tttWins', tttWins);
        tttShowConfetti();
    } else if (result.winner === TTT_COMPUTER) {
        info.textContent = '😢 کامپیوتر برنده شد! دوباره تلاش کن';
        tttScores.O++;
    } else {
        info.textContent = '🤝 بازی مساوی شد!';
        tttScores.D++;
    }

    if (result.pattern) {
        result.pattern.forEach(i => {
            const cell = document.querySelector(`#tttBoard .ttt-cell[data-index="${i}"]`);
            if (cell) cell.classList.add('win');
        });
    }

    tttUpdateScores();
    tttUpdateBestRecord();
    setTimeout(() => tttShowEndScreen(result.winner), 2000);
}

function tttUpdateScores() {
    const s1 = document.getElementById('tttScore1');
    const s2 = document.getElementById('tttScore2');
    if (s1) s1.textContent = tttScores.X;
    if (s2) s2.textContent = tttScores.O;
}

function tttGetBestMove() {
    if (tttDifficulty === 'easy') {
        if (Math.random() < 0.7) return tttGetRandomMove();
    } else if (tttDifficulty === 'medium') {
        if (Math.random() < 0.3) return tttGetRandomMove();
    }
    return tttGetMinimaxMove();
}

function tttGetRandomMove() {
    const available = [];
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') available.push(i);
    }
    return available[Math.floor(Math.random() * available.length)];
}

function tttGetMinimaxMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = TTT_COMPUTER;
            const score = tttMinimax(tttBoard, 0, false);
            tttBoard[i] = '';
            if (score > bestScore) { bestScore = score; bestMove = i; }
        }
    }
    return bestMove;
}

function tttMinimax(boardState, depth, isMaximizing) {
    const result = tttCheckResultFor(boardState);
    if (result !== null) {
        if (result === TTT_COMPUTER) return 10 - depth;
        if (result === TTT_HUMAN) return depth - 10;
        return 0;
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                boardState[i] = TTT_COMPUTER;
                const score = tttMinimax(boardState, depth + 1, false);
                boardState[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                boardState[i] = TTT_HUMAN;
                const score = tttMinimax(boardState, depth + 1, true);
                boardState[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function tttCheckResultFor(boardState) {
    for (const pattern of TTT_WIN_PATTERNS) {
        const [a, b, c] = pattern;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    if (!boardState.includes('')) return 'D';
    return null;
}

function tttShowConfetti() {
    const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'confetti';
            el.style.left = Math.random() * 100 + '%';
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
            el.style.animationDuration = (Math.random() * 2 + 2) + 's';
            el.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        }, i * 40);
    }
}

function tttShowEndScreen(winner) {
    const screen = document.getElementById('tttEndScreen');
    if (!screen) return;
    screen.style.display = 'flex';
    if (winner === TTT_HUMAN) {
        document.getElementById('tttEndIcon').textContent = '🏆';
        document.getElementById('tttEndTitle').textContent = 'تبریک!';
        document.getElementById('tttEndMessage').textContent = 'تو برنده شدی! 🎉';
    } else if (winner === TTT_COMPUTER) {
        document.getElementById('tttEndIcon').textContent = '😢';
        document.getElementById('tttEndTitle').textContent = 'باختی!';
        document.getElementById('tttEndMessage').textContent = 'کامپیوتر برنده شد. دوباره تلاش کن!';
    } else {
        document.getElementById('tttEndIcon').textContent = '🤝';
        document.getElementById('tttEndTitle').textContent = 'مساوی!';
        document.getElementById('tttEndMessage').textContent = 'بازی مساوی شد!';
    }
    document.getElementById('tttStatWins').textContent = tttScores.X;
    document.getElementById('tttStatLosses').textContent = tttScores.O;
    document.getElementById('tttStatDraws').textContent = tttScores.D;
}

function tttStartGame() {
    document.getElementById('tttStartScreen').style.display = 'none';
    document.getElementById('tttGameScreen').style.display = 'flex';
    tttResetGame();
}

function tttRestartGame() {
    document.getElementById('tttEndScreen').style.display = 'none';
    tttResetGame();
}

function tttResetGame() {
    tttBoard = Array(9).fill('');
    tttGameActive = true;
    document.getElementById('tttInfo').textContent = 'نوبت تو (❌) - روی یک خانه کلیک کن';
    document.getElementById('tttCard1').classList.add('active');
    document.getElementById('tttCard2').classList.remove('active');
    tttBuildBoard();
}

function tttGoToMenu() {
    const container = document.getElementById('tttGameContainer');
    if (container) {
        const closeBtn = container.parentElement.querySelector('button[style*="position: fixed; top: 12px; right: 12px;"]');
        if (closeBtn) closeBtn.click();
    }
    renderPage('menu');
}

function tttExitGame() {
    if (confirm('می‌خوای از بازی خارج بشی؟')) {
        tttGoToMenu();
    }
}

// ============================================================
// 🧮 بازی ریاضی
// ============================================================
function openMathGameNew() {
    const container = document.createElement('div');
    container.id = 'mathGameContainer';
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 3000;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
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
        if (window.mathTimerInterval) {
            clearInterval(window.mathTimerInterval);
            window.mathTimerInterval = null;
        }
    };

    const style = document.createElement('style');
    style.textContent = `
        #mathGameContainer * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        #mathGameContainer { font-family: 'Segoe UI', Tahoma, sans-serif; color: white; }
        #mathGameContainer .math-container { background: rgba(255,255,255,0.15); backdrop-filter: blur(15px); border-radius: 30px; padding: 25px 20px; max-width: 500px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.2); }
        #mathGameContainer .math-title { text-align: center; font-size: 30px; margin-bottom: 20px; text-shadow: 2px 2px 6px rgba(0,0,0,0.4); background: linear-gradient(135deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        #mathGameContainer .stats { display: flex; justify-content: space-around; margin-bottom: 18px; gap: 8px; }
        #mathGameContainer .stat-box { background: rgba(0,0,0,0.3); padding: 12px 10px; border-radius: 16px; text-align: center; flex: 1; border: 1px solid rgba(255,255,255,0.1); }
        #mathGameContainer .stat-box .label { font-size: 11px; opacity: 0.85; margin-bottom: 4px; }
        #mathGameContainer .stat-box .value { font-size: 24px; font-weight: bold; }
        #mathGameContainer #mathTimer.warning { color: #ff6b6b; animation: blink 0.5s infinite; }
        @keyframes blink { 50% { opacity: 0.5; } }
        #mathGameContainer .question-box { background: rgba(255,255,255,0.95); color: #333; padding: 30px 18px; border-radius: 22px; text-align: center; margin-bottom: 18px; font-size: 48px; font-weight: bold; box-shadow: 0 10px 30px rgba(0,0,0,0.2); min-height: 120px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; border: 3px solid rgba(255,255,255,0.3); }
        #mathGameContainer .question-box.correct { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; }
        #mathGameContainer .question-box.wrong { background: linear-gradient(135deg, #f44336, #d32f2f); color: white; }
        #mathGameContainer .answer-input { width: 100%; padding: 18px; font-size: 28px; text-align: center; border: 3px solid rgba(255,255,255,0.3); border-radius: 18px; background: rgba(255,255,255,0.95); color: #333; font-weight: bold; outline: none; margin-bottom: 14px; transition: all 0.3s; }
        #mathGameContainer .answer-input:focus { border-color: #FFD700; box-shadow: 0 0 20px rgba(255,215,0,0.4); }
        #mathGameContainer .btn { width: 100%; padding: 16px; font-size: 17px; font-weight: bold; border: none; border-radius: 18px; cursor: pointer; margin-bottom: 10px; background: linear-gradient(135deg, #FFD700, #FFA500, #FF8C00); color: #333; box-shadow: 0 6px 20px rgba(255,165,0,0.4); font-family: 'B Titr', Tahoma, sans-serif; }
        #mathGameContainer .btn:active:not(:disabled) { transform: scale(0.95); }
        #mathGameContainer .btn-secondary { background: rgba(255,255,255,0.25); color: white; border: 2px solid rgba(255,255,255,0.4); }
        #mathGameContainer .combo-display { text-align: center; font-size: 18px; margin-bottom: 10px; min-height: 26px; font-weight: bold; }
        #mathGameContainer .combo-display.active { color: #FFD700; animation: pulse 0.5s; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
        #mathGameContainer .final-stats { background: rgba(0,0,0,0.3); padding: 20px 16px; border-radius: 18px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.2); }
        #mathGameContainer .final-stat { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.15); font-size: 16px; }
        #mathGameContainer .final-stat:last-child { border-bottom: none; }
        #mathGameContainer .hidden { display: none; }
        #mathGameContainer .settings { background: rgba(0,0,0,0.25); padding: 20px 16px; border-radius: 18px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.15); }
        #mathGameContainer .settings h3 { margin-bottom: 12px; font-size: 16px; }
        #mathGameContainer .options { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        #mathGameContainer .option-btn { flex: 1; min-width: 65px; padding: 12px 8px; background: rgba(255,255,255,0.2); border: 2px solid transparent; border-radius: 14px; color: white; cursor: pointer; font-size: 13px; font-weight: bold; text-align: center; font-family: 'B Titr', Tahoma, sans-serif; }
        #mathGameContainer .option-btn.active { background: linear-gradient(135deg, #FFD700, #FFA500); color: #333; border-color: white; }
    `;
    container.appendChild(style);

    container.innerHTML += `
        <div class="math-container" id="mathGameContainerInner">
            <div id="mathSetupScreen">
                <div class="math-title">🧮 بازی ریاضی 🎯</div>
                <div class="settings">
                    <h3>🎚️ سطح سختی:</h3>
                    <div class="options" id="mathDifficultyOptions">
                        <button class="option-btn active" data-value="easy">آسون</button>
                        <button class="option-btn" data-value="medium">متوسط</button>
                        <button class="option-btn" data-value="hard">سخت</button>
                    </div>
                    <h3>🔢 نوع عملیات:</h3>
                    <div class="options" id="mathOperationOptions">
                        <button class="option-btn active" data-value="+">➕ جمع</button>
                        <button class="option-btn active" data-value="-">➖ تفریق</button>
                        <button class="option-btn active" data-value="×">✖️ ضرب</button>
                        <button class="option-btn active" data-value="÷">➗ تقسیم</button>
                    </div>
                </div>
                <button class="btn" onclick="mathStartGame()">🚀 شروع بازی</button>
            </div>

            <div id="mathGameScreen" class="hidden">
                <div class="stats">
                    <div class="stat-box"><div class="label">⏱️ زمان</div><div class="value" id="mathTimer">60</div></div>
                    <div class="stat-box"><div class="label">⭐ امتیاز</div><div class="value" id="mathScore">0</div></div>
                    <div class="stat-box"><div class="label">✅ درست</div><div class="value" id="mathCorrectCount">0</div></div>
                </div>
                <div class="combo-display" id="mathComboDisplay"></div>
                <div class="question-box" id="mathQuestionBox"><span id="mathQuestion">۵ + ۳ = ؟</span></div>
                <input type="number" class="answer-input" id="mathAnswerInput" placeholder="پاسخ خود را وارد کنید" autocomplete="off" inputmode="numeric">
                <button class="btn" onclick="mathSubmitAnswer()">✅ ثبت پاسخ</button>
                <button class="btn btn-secondary" onclick="mathSkipQuestion()">⏭️ رد شدن</button>
            </div>

            <div id="mathEndScreen" class="hidden">
                <h2 style="text-align:center;font-size:34px;margin-bottom:20px;background:linear-gradient(135deg,#FFD700,#FFA500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">🏆 پایان بازی!</h2>
                <div class="final-stats">
                    <div class="final-stat"><span>⭐ امتیاز نهایی:</span><span id="mathFinalScore">0</span></div>
                    <div class="final-stat"><span>✅ پاسخ درست:</span><span id="mathFinalCorrect">0</span></div>
                    <div class="final-stat"><span>❌ پاسخ غلط:</span><span id="mathFinalWrong">0</span></div>
                    <div class="final-stat"><span>⏭️ رد شده:</span><span id="mathFinalSkipped">0</span></div>
                    <div class="final-stat"><span>🔥 بیشترین Combo:</span><span id="mathFinalCombo">0</span></div>
                    <div class="final-stat"><span>📊 دقت:</span><span id="mathFinalAccuracy">0%</span></div>
                </div>
                <button class="btn" onclick="mathRestartGame()">🔄 بازی دوباره</button>
                <button class="btn btn-secondary" onclick="mathGoToSetup()">⚙️ تنظیمات</button>
            </div>
        </div>
    `;

    document.body.appendChild(container);
    document.body.appendChild(closeBtn);

    setTimeout(function() {
        mathInitGame();
    }, 100);
}

function mathInitGame() {
    document.querySelectorAll('#mathDifficultyOptions .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#mathDifficultyOptions .option-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            mathSettings.difficulty = this.dataset.value;
        });
    });

    document.querySelectorAll('#mathOperationOptions .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const op = this.dataset.value;
            if (this.classList.contains('active')) {
                if (!mathSettings.operations.includes(op)) mathSettings.operations.push(op);
            } else {
                mathSettings.operations = mathSettings.operations.filter(o => o !== op);
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && mathGameActive) {
            const screen = document.getElementById('mathGameScreen');
            if (screen && !screen.classList.contains('hidden')) {
                mathSubmitAnswer();
            }
        }
    });
}

function mathStartGame() {
    if (mathSettings.operations.length === 0) {
        alert('لطفاً حداقل یک نوع عملیات را انتخاب کنید!');
        return;
    }
    if (mathTimerInterval) { clearInterval(mathTimerInterval); mathTimerInterval = null; }

    mathScore = 0;
    mathCombo = 0;
    mathMaxCombo = 0;
    mathCorrectCount = 0;
    mathWrongCount = 0;
    mathSkippedCount = 0;
    mathTimeLeft = 60;
    mathTotalQuestions = 0;
    mathGameActive = true;

    document.getElementById('mathSetupScreen').classList.add('hidden');
    document.getElementById('mathEndScreen').classList.add('hidden');
    document.getElementById('mathGameScreen').classList.remove('hidden');

    mathUpdateStats();
    mathGenerateQuestion();

    mathTimerInterval = setInterval(function() {
        mathTimeLeft--;
        document.getElementById('mathTimer').textContent = mathTimeLeft;
        if (mathTimeLeft <= 10) document.getElementById('mathTimer').classList.add('warning');
        if (mathTimeLeft <= 0) mathEndGame();
    }, 1000);

    document.getElementById('mathAnswerInput').focus();
}

function mathGenerateQuestion() {
    const range = mathDifficultyRanges[mathSettings.difficulty];
    const op = mathSettings.operations[Math.floor(Math.random() * mathSettings.operations.length)];
    let a, b, answer;

    switch(op) {
        case '+':
            a = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            b = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            answer = a + b;
            break;
        case '-':
            a = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            b = Math.floor(Math.random() * a) + 1;
            answer = a - b;
            break;
        case '×':
            const multMax = mathSettings.difficulty === 'easy' ? 10 : mathSettings.difficulty === 'medium' ? 15 : 20;
            a = Math.floor(Math.random() * multMax) + 1;
            b = Math.floor(Math.random() * multMax) + 1;
            answer = a * b;
            break;
        case '÷':
            b = Math.floor(Math.random() * 10) + 2;
            answer = Math.floor(Math.random() * 10) + 1;
            a = b * answer;
            break;
    }

    mathCurrentQuestion = { a, b, op, answer };
    document.getElementById('mathQuestion').textContent = `${a} ${op} ${b} = ؟`;
    document.getElementById('mathAnswerInput').value = '';
    document.getElementById('mathAnswerInput').focus();
}

function mathSubmitAnswer() {
    if (!mathGameActive) return;
    const input = document.getElementById('mathAnswerInput');
    const userAnswer = parseInt(input.value);
    if (isNaN(userAnswer)) { input.focus(); return; }
    mathTotalQuestions++;
    const questionBox = document.getElementById('mathQuestionBox');

    if (userAnswer === mathCurrentQuestion.answer) {
        mathCombo++;
        if (mathCombo > mathMaxCombo) mathMaxCombo = mathCombo;
        mathCorrectCount++;
        const points = 10 * mathCombo;
        mathScore += points;
        questionBox.classList.add('correct');
        mathUpdateComboDisplay();
        setTimeout(function() { questionBox.classList.remove('correct'); mathGenerateQuestion(); }, 400);
    } else {
        mathCombo = 0;
        mathWrongCount++;
        questionBox.classList.add('wrong');
        mathUpdateComboDisplay();
        setTimeout(function() { questionBox.classList.remove('wrong'); mathGenerateQuestion(); }, 700);
    }
    mathUpdateStats();
}

function mathSkipQuestion() {
    if (!mathGameActive) return;
    mathTotalQuestions++;
    mathSkippedCount++;
    mathCombo = 0;
    mathUpdateComboDisplay();
    mathUpdateStats();
    mathGenerateQuestion();
}

function mathUpdateStats() {
    document.getElementById('mathScore').textContent = mathScore;
    document.getElementById('mathCorrectCount').textContent = mathCorrectCount;
}

function mathUpdateComboDisplay() {
    const display = document.getElementById('mathComboDisplay');
    if (mathCombo >= 2) {
        display.textContent = `🔥 Combo x${mathCombo}! امتیاز: ${10 * mathCombo}`;
        display.classList.add('active');
        setTimeout(function() { display.classList.remove('active'); }, 500);
    } else {
        display.textContent = '';
    }
}

function mathEndGame() {
    mathGameActive = false;
    if (mathTimerInterval) { clearInterval(mathTimerInterval); mathTimerInterval = null; }
    document.getElementById('mathGameScreen').classList.add('hidden');
    document.getElementById('mathEndScreen').classList.remove('hidden');
    const answered = mathCorrectCount + mathWrongCount;
    const accuracy = answered > 0 ? Math.round((mathCorrectCount / answered) * 100) : 0;
    document.getElementById('mathFinalScore').textContent = mathScore;
    document.getElementById('mathFinalCorrect').textContent = mathCorrectCount;
    document.getElementById('mathFinalWrong').textContent = mathWrongCount;
    document.getElementById('mathFinalSkipped').textContent = mathSkippedCount;
    document.getElementById('mathFinalCombo').textContent = mathMaxCombo;
    document.getElementById('mathFinalAccuracy').textContent = accuracy + '%';
}

function mathRestartGame() {
    document.getElementById('mathTimer').classList.remove('warning');
    mathStartGame();
}

function mathGoToSetup() {
    if (mathTimerInterval) { clearInterval(mathTimerInterval); mathTimerInterval = null; }
    mathGameActive = false;
    document.getElementById('mathEndScreen').classList.add('hidden');
    document.getElementById('mathSetupScreen').classList.remove('hidden');
    document.getElementById('mathTimer').classList.remove('warning');
}

function mathExitGame() {
    if (mathTimerInterval) { clearInterval(mathTimerInterval); mathTimerInterval = null; }
    mathGameActive = false;
    const container = document.getElementById('mathGameContainer');
    if (container) {
        const closeBtn = container.parentElement.querySelector('button[style*="position: fixed; top: 12px; right: 12px;"]');
        if (closeBtn) closeBtn.click();
    }
    renderPage('menu');
}
