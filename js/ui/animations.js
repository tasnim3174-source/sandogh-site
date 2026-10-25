/* ============================================================
   صندوق اتحاد - سیستم جامع انیمیشن‌ها و افکت‌ها
   نسخه: 1.0
   ============================================================ */

window.Animations = (function() {

    // ============================================================
    // ۱. افکت پرده‌برداری و خوش‌آمدگویی (Welcome Reveal)
    // ============================================================
    function showWelcomeReveal(userName) {
        var existing = document.getElementById('welcomeScreen');
        if (existing) existing.remove();

        var welcomeHtml = `
            <div id="welcomeScreen" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;pointer-events:none;opacity:0;background:radial-gradient(circle at center, rgba(26, 26, 46, 0.98) 0%, rgba(15, 15, 26, 1) 100%);clip-path:inset(0 50% 0 50%);transition:clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.3s;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <div style="position:absolute;width:300px;height:300px;background:#f59e0b;border-radius:50%;filter:blur(120px);opacity:0.3;animation:welcomePulseGlow 2s infinite alternate;"></div>
                <div id="welcomeIcon" style="font-size:5rem;margin-bottom:20px;position:relative;z-index:2;opacity:0;transform:scale(0.5);transition:all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s;">🌟</div>
                <div id="welcomeTitle" style="font-size:2rem;font-weight:900;color:#fff;margin-bottom:10px;position:relative;z-index:2;opacity:0;transform:translateY(20px);transition:all 0.5s ease 0.5s;font-family:tahoma;">خوش آمدید، <span style="color:#f59e0b;text-shadow:0 0 20px rgba(245, 158, 11, 0.8);">${userName || 'کاربر'}</span> عزیز</div>
                <div id="welcomeSubtitle" style="font-size:1rem;color:#9ca3af;position:relative;z-index:2;opacity:0;transform:translateY(20px);transition:all 0.5s ease 0.7s;font-family:tahoma;">صندوق اتحاد، همراه همیشگی شما</div>
            </div>
            <style>
                @keyframes welcomePulseGlow { 0% { transform: scale(1); opacity: 0.2; } 100% { transform: scale(1.5); opacity: 0.4; } }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', welcomeHtml);

        var screen = document.getElementById('welcomeScreen');
        
        // باز شدن پرده
        setTimeout(function() {
            screen.style.opacity = '1';
            screen.style.clipPath = 'inset(0 0 0 0)';
            screen.style.pointerEvents = 'auto';
            
            setTimeout(function() {
                document.getElementById('welcomeIcon').style.opacity = '1';
                document.getElementById('welcomeIcon').style.transform = 'scale(1)';
                document.getElementById('welcomeTitle').style.opacity = '1';
                document.getElementById('welcomeTitle').style.transform = 'translateY(0)';
                document.getElementById('welcomeSubtitle').style.opacity = '1';
                document.getElementById('welcomeSubtitle').style.transform = 'translateY(0)';
            }, 300);
        }, 100);

        // بستن پرده بعد از ۲.۵ ثانیه
        setTimeout(function() {
            screen.style.clipPath = 'inset(0 50% 0 50%)';
            screen.style.opacity = '0';
            setTimeout(function() {
                screen.remove();
            }, 800);
        }, 3000);
    }

    // ============================================================
    // ۲. افکت ذرات جادویی (Magic Particles)
    // ============================================================
    var particleColors = ['#f59e0b', '#fbbf24', '#fcd34d', '#10b981', '#8b5cf6', '#ffffff'];
    var lastTime = 0;

    function createParticle(x, y) {
        var now = Date.now();
        if (now - lastTime < 30) return;
        lastTime = now;

        var count = Math.floor(Math.random() * 2) + 1;
        for (var i = 0; i < count; i++) {
            var particle = document.createElement('div');
            particle.className = 'magic-particle';
            if (Math.random() > 0.7) particle.style.borderRadius = '2px';
            
            var size = Math.random() * 10 + 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
            particle.style.boxShadow = '0 0 ' + (size * 1.5) + 'px ' + particle.style.background;
            particle.style.left = (x - size / 2) + 'px';
            particle.style.top = (y - size / 2) + 'px';
            
            var tx = (Math.random() - 0.5) * 100;
            var ty = (Math.random() - 0.5) * 100;
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(particle);
            setTimeout(function() { particle.remove(); }, 800);
        }
    }

    function enableMagicParticles() {
        document.addEventListener('mousemove', function(e) { createParticle(e.clientX, e.clientY); });
        document.addEventListener('touchmove', function(e) {
            for (var i = 0; i < e.touches.length; i++) {
                createParticle(e.touches[i].clientX, e.touches[i].clientY);
            }
        }, { passive: true });
        
        // استایل ذرات
        var style = document.createElement('style');
        style.innerHTML = `
            .magic-particle {
                position: fixed;
                pointer-events: none;
                border-radius: 50%;
                z-index: 9999;
                animation: magicParticleFade 0.8s ease-out forwards;
            }
            @keyframes magicParticleFade {
                0% { transform: scale(1) translate(0, 0); opacity: 1; }
                100% { transform: scale(0) translate(var(--tx), var(--ty)); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // ۳. افکت شمارش اعداد (Animated Counters)
    // ============================================================
    function animateValue(element, start, end, duration) {
        if (!element) return;
        var startTimestamp = null;
        
        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            var progress = Math.min((timestamp - startTimestamp) / duration, 1);
            var easeOutProgress = 1 - Math.pow(1 - progress, 3);
            var currentValue = start + (end - start) * easeOutProgress;
            
            var faNum = String(Math.floor(currentValue)).replace(/\d/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
            var formatted = faNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            element.textContent = formatted;
            
            if (progress < 1) window.requestAnimationFrame(step);
            else element.textContent = String(end).replace(/\d/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        window.requestAnimationFrame(step);
    }

    // ============================================================
    // ۴. افکت اسکرول نرم و ظاهر شدن (Staggered Reveal)
    // ============================================================
    function enableStaggeredReveal(containerSelector) {
        var cards = document.querySelectorAll(containerSelector + ' .reveal-item');
        cards.forEach(function(card, index) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            setTimeout(function() {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    // ============================================================
    // ۵. افکت فشرده شدن سه‌بعدی دکمه‌ها (CSS Only - No JS needed)
    // ============================================================
    function enable3DButtons(selector) {
        var style = document.createElement('style');
        style.innerHTML = `
            ${selector} {
                transition: transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1), 
                            box-shadow 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            ${selector}:active {
                transform: translateY(4px) scale(0.98) !important;
                filter: brightness(0.9);
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // خروجی‌ها (API عمومی)
    // ============================================================
    return {
        showWelcomeReveal: showWelcomeReveal,
        enableMagicParticles: enableMagicParticles,
        animateValue: animateValue,
        enableStaggeredReveal: enableStaggeredReveal,
        enable3DButtons: enable3DButtons
    };
    // ============================================================
    // 🍂 افکت برگ‌های پاییزی
    // ============================================================
    var autumnCanvas, autumnCtx, autumnLeaves = [];
    var autumnColors = ['#ffb703', '#fb8500', '#e63946', '#d62828', '#f4a261', '#e76f51', '#ffd166'];
    var autumnAnim = null;
    var autumnTime = 0;

    function initAutumnCanvas() {
        var old = document.getElementById('autumnCanvas');
        if (old) old.remove();
        
        autumnCanvas = document.createElement('canvas');
        autumnCanvas.id = 'autumnCanvas';
        autumnCanvas.style.position = 'fixed';
        autumnCanvas.style.top = '0';
        autumnCanvas.style.left = '0';
        autumnCanvas.style.width = '100%';
        autumnCanvas.style.height = '100%';
        autumnCanvas.style.pointerEvents = 'none';
        autumnCanvas.style.zIndex = '1';
        document.body.insertBefore(autumnCanvas, document.body.firstChild);
        
        autumnCtx = autumnCanvas.getContext('2d');
        autumnCanvas.width = window.innerWidth;
        autumnCanvas.height = window.innerHeight;
        
        autumnLeaves = [];
        for (var i = 0; i < 60; i++) {
            autumnLeaves.push(createAutumnLeaf());
        }
    }

    function createAutumnLeaf() {
        return {
            x: Math.random() * window.innerWidth,
            y: -20 - Math.random() * 100,
            size: Math.random() * 12 + 8,
            color: autumnColors[Math.floor(Math.random() * autumnColors.length)],
            speedY: Math.random() * 1.5 + 0.8,
            speedX: Math.random() * 1.5 - 0.75,
            angle: Math.random() * Math.PI * 2,
            spin: Math.random() * 0.04 - 0.02,
            swayOffset: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.5 + 0.5
        };
    }

    function drawAutumnLeaf(l) {
        autumnCtx.save();
        autumnCtx.translate(l.x, l.y);
        autumnCtx.rotate(l.angle);
        autumnCtx.globalAlpha = l.opacity;
        autumnCtx.fillStyle = l.color;
        
        autumnCtx.beginPath();
        autumnCtx.ellipse(0, 0, l.size, l.size * 0.5, 0, 0, Math.PI * 2);
        autumnCtx.fill();
        
        autumnCtx.strokeStyle = 'rgba(0,0,0,0.2)';
        autumnCtx.lineWidth = 1;
        autumnCtx.beginPath();
        autumnCtx.moveTo(-l.size, 0);
        autumnCtx.lineTo(l.size, 0);
        autumnCtx.stroke();
        
        autumnCtx.restore();
    }

    function animateAutumn() {
        if (!autumnCtx) return;
        autumnCtx.clearRect(0, 0, autumnCanvas.width, autumnCanvas.height);
        autumnTime += 0.01;
        
        for (var i = 0; i < autumnLeaves.length; i++) {
            var l = autumnLeaves[i];
            l.y += l.speedY;
            l.x += l.speedX + Math.sin(autumnTime + l.swayOffset) * 1.5;
            l.angle += l.spin;
            
            if (l.y > autumnCanvas.height + 30) {
                l.y = -30;
                l.x = Math.random() * autumnCanvas.width;
            }
            if (l.x > autumnCanvas.width + 30) l.x = -30;
            if (l.x < -30) l.x = autumnCanvas.width + 30;
            
            drawAutumnLeaf(l);
        }
        
        autumnAnim = requestAnimationFrame(animateAutumn);
    }

    window.startAutumnLeaves = function() {
        initAutumnCanvas();
        animateAutumn();
        
        window.addEventListener('resize', function() {
            if (autumnCanvas) {
                autumnCanvas.width = window.innerWidth;
                autumnCanvas.height = window.innerHeight;
            }
        });
    };

    window.stopAutumnLeaves = function() {
        if (autumnAnim) cancelAnimationFrame(autumnAnim);
        if (autumnCanvas) autumnCanvas.remove();
        autumnCanvas = null;
        autumnCtx = null;
    };
})();
