/* ============================================================
   صندوق اتحاد - افکت‌های بصری (باران، برف، ستاره)
   ============================================================ */

(function() {
    var EFFECTS = {
        rain: false,
        snow: false,
        stars: false
    };

    // خواندن تنظیمات ذخیره شده
    function loadSettings() {
        try {
            var saved = localStorage.getItem('sandogh_effects_settings');
            if (saved) {
                var parsed = JSON.parse(saved);
                EFFECTS.rain = !!parsed.rain;
                EFFECTS.snow = !!parsed.snow;
                EFFECTS.stars = !!parsed.stars;
            }
        } catch(e) {}
    }

    function createCanvas(id) {
        // پاک کردن کنواس قبلی اگر وجود داشت
        var oldCanvas = document.getElementById(id);
        if (oldCanvas) oldCanvas.remove();

        var canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0'; 
        document.body.insertBefore(canvas, document.body.firstChild);
        return canvas;
    }

    var rainAnim, snowAnim, starsAnim;

    function startRain() {
        var canvas = createCanvas('rainCanvas');
        var ctx = canvas.getContext('2d');
        var w = canvas.width = window.innerWidth;
        var h = canvas.height = window.innerHeight;
        var drops = [];
        for (var i = 0; i < 60; i++) {
            drops.push({ x: Math.random() * w, y: Math.random() * h, len: Math.random() * 20 + 10, speed: Math.random() * 5 + 4 });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = 'rgba(174, 194, 224, 0.4)';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            for (var i = 0; i < drops.length; i++) {
                var d = drops[i];
                ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y + d.len); ctx.stroke();
                d.y += d.speed;
                if (d.y > h) { d.y = -d.len; d.x = Math.random() * w; }
            }
            rainAnim = requestAnimationFrame(draw);
        }
        draw();
        
        window.addEventListener('resize', function() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });
    }

    function startSnow() {
        var canvas = createCanvas('snowCanvas');
        var ctx = canvas.getContext('2d');
        var w = canvas.width = window.innerWidth;
        var h = canvas.height = window.innerHeight;
        var flakes = [];
        for (var i = 0; i < 60; i++) {
            flakes.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 + 1, speed: Math.random() * 1.5 + 0.5, angle: Math.random() * Math.PI * 2, sway: Math.random() * 0.02 });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            for (var i = 0; i < flakes.length; i++) {
                var f = flakes[i];
                ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
                f.y += f.speed; f.angle += f.sway; f.x += Math.sin(f.angle) * 0.5;
                if (f.y > h) { f.y = -f.r; f.x = Math.random() * w; }
            }
            snowAnim = requestAnimationFrame(draw);
        }
        draw();
        
        window.addEventListener('resize', function() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });
    }

    function startStars() {
        var canvas = createCanvas('starsCanvas');
        var ctx = canvas.getContext('2d');
        var w = canvas.width = window.innerWidth;
        var h = canvas.height = window.innerHeight;
        var stars = [];
        for (var i = 0; i < 90; i++) {
            stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + 0.5, alpha: Math.random(), speed: Math.random() * 0.02 + 0.01 });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < stars.length; i++) {
                var s = stars[i];
                s.alpha += s.speed;
                if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
                ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.abs(s.alpha) + ')';
                ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
            }
            starsAnim = requestAnimationFrame(draw);
        }
        draw();
        
        window.addEventListener('resize', function() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });
    }

    // تابع سراسری برای اعمال تغییرات از منوی تنظیمات
    window.applyEffects = function() {
        if (rainAnim) cancelAnimationFrame(rainAnim);
        if (snowAnim) cancelAnimationFrame(snowAnim);
        if (starsAnim) cancelAnimationFrame(starsAnim);

        ['rainCanvas', 'snowCanvas', 'starsCanvas'].forEach(function(id) {
            var c = document.getElementById(id);
            if (c) c.remove();
        });

        if (EFFECTS.rain) startRain();
        if (EFFECTS.snow) startSnow();
        if (EFFECTS.stars) startStars();
        
        localStorage.setItem('sandogh_effects_settings', JSON.stringify(EFFECTS));
    };

    // اجرای اولیه
    window.addEventListener('load', function() {
        loadSettings();
        setTimeout(function() { window.applyEffects(); }, 500);
    });
})();
