/* ============================================================
   صندوق اتحاد - Lazy Loader
   بارگذاری هوشمند فایل‌ها فقط هنگام نیاز
   نسخه: 2.0 (با پیام‌های سرگرم‌کننده و نوار پیشرفت)
   ============================================================ */

(function() {
  'use strict';

  // ============================================================
  // نقشه وابستگی: هر بخش چه فایل‌هایی نیاز دارد
  // ============================================================
  const SECTION_DEPS = {
    dashboard:      { scripts: ['js/pages/dashboard.js'],           message: 'در حال آماده‌سازی صورتحساب...' },
    sms:            { scripts: ['js/pages/sms.js'],                 message: 'در حال آماده‌سازی سامانه‌های پیامکی...' },
    requests:       { scripts: ['js/pages/requests.js'],            message: 'در حال آماده‌سازی درخواست‌ها...' },
    support:        { scripts: ['js/pages/support.js'],             message: 'در حال آماده‌سازی پشتیبانی...' },
    family:         { scripts: ['js/pages/family.js'],              message: 'در حال آماده‌سازی اطلاعات خانواده...' },
    familyInfo:     { scripts: ['js/pages/family-info.js'],         message: 'در حال آماده‌سازی اطلاعات کلی خانواده...' },
    access:         { scripts: ['js/pages/access.js'],              message: 'در حال آماده‌سازی دسترسی‌ها...' },
    infoStats:      { scripts: ['js/pages/stats.js'],               message: 'در حال آماده‌سازی اطلاعات و آمار...' },
    manageCoins:    { scripts: ['js/pages/manage-coins.js'],        message: 'در حال آماده‌سازی مدیریت امتیازها...' },
    reports:        { scripts: ['js/pages/reports.js'],             message: 'در حال آماده‌سازی گزارش‌ها...' },

    club:           { scripts: ['js/script-services/club.js'],        message: 'در حال آماده‌سازی باشگاه مشتریان...' },
    quizzes:        { scripts: ['js/script-services/quizzes.js'],     message: 'در حال آماده‌سازی مسابقات...' },
    dailyReward:    { scripts: ['js/script-services/daily-reward.js'],message: 'در حال آماده‌سازی پاداش روزانه...' },
    emailForm:      { scripts: ['js/script-services/email-form.js'],  message: 'در حال آماده‌سازی فرم ایمیل...' },
    messaging:      { scripts: ['js/script-services/messaging.js'],   message: 'در حال آماده‌سازی پیام‌رسان...' },
    survey:         { scripts: ['js/script-services/messaging.js'],   message: 'در حال آماده‌سازی نظرسنجی...' },

    games:          { scripts: ['js/entertainment/games.js'],          message: 'در حال آماده‌سازی بازی‌ها...' },
    ladySection:    { scripts: ['js/entertainment/lady-section.js'],   message: 'در حال آماده‌سازی بخش بانوان...' },
    cooking:        { scripts: ['js/entertainment/cooking.js'],        message: 'در حال آماده‌سازی آشپزی...' },
    teenPiggy:      { scripts: ['js/entertainment/teen-piggy.js'],     message: 'در حال آماده‌سازی قلک نوجوانان...' },
    toddler:        { scripts: ['js/entertainment/toddler.js'],        message: 'در حال آماده‌سازی بخش خردسالان...' },
    myFund:         { scripts: ['js/entertainment/my-fund.js'],        message: 'در حال آماده‌سازی صندوق من...' },
    utilities:      { scripts: ['js/entertainment/utilities.js'],      message: 'در حال آماده‌سازی برنامه‌های کاربردی...' },
    calendar:       { scripts: ['js/entertainment/calendar.js'],       message: 'در حال آماده‌سازی تقویم...' },
    notes:          { scripts: ['js/entertainment/notes.js'],          message: 'در حال آماده‌سازی یادداشت‌ها...' },
    calculators:    { scripts: ['js/entertainment/calculators.js'],    message: 'در حال آماده‌سازی ماشین‌حساب‌ها...' }
  };

  // ============================================================
  // کش فایل‌های بارگذاری‌شده
  // ============================================================
  const loadedScripts = new Set();
  const loadingPromises = {};

  // ============================================================
  // پیام‌های سرگرم‌کننده
  // ============================================================
  const FUNNY_MESSAGES = [
    '🔄 در حال آماده‌سازی اطلاعات...',
    '📊 داریم جدول‌ها رو مرتب می‌کنیم...',
    '💰 محاسبه صورتحساب در جریان است...',
    '🎯 چند لحظه دیگه تمام می‌شه...',
    '⚡ فقط چند ثانیه صبر کنید...',
    '✨ در حال آماده‌سازی تجربه‌ی بهتر...',
    '🎁 یه سورپرایز کوچیک داریم...',
    '🚀 تقریباً آماده است...',
    '☕ یه چای بنوشید تا آماده بشه...',
    '🌟 اطلاعات ارزشمند در راه است...'
  ];

  let __msgInterval = null;
  let __msgIndex = 0;
  let __progressInterval = null;
  let __progressValue = 0;

  // ============================================================
  // بارگذاری داینامیک یک فایل JS
  // ============================================================
  function loadScriptOnce(src) {
    if (loadedScripts.has(src)) return Promise.resolve();
    if (loadingPromises[src]) return loadingPromises[src];

    loadingPromises[src] = new Promise(function(resolve, reject) {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function() {
        loadedScripts.add(src);
        delete loadingPromises[src];
        console.log('✅ Lazy loaded:', src);
        resolve();
      };
      s.onerror = function() {
        delete loadingPromises[src];
        console.error('❌ Lazy load failed:', src);
        reject(new Error('خطا در بارگذاری ' + src));
      };
      document.head.appendChild(s);
    });

    return loadingPromises[src];
  }

  // ============================================================
  // پیام‌های سرگرم‌کننده
  // ============================================================
  function startFunnyMessages() {
    stopFunnyMessages();
    var el = document.getElementById('sectionLoaderMsg');
    if (!el) return;
    __msgIndex = 0;
    __msgInterval = setInterval(function() {
      __msgIndex = (__msgIndex + 1) % FUNNY_MESSAGES.length;
      el.style.opacity = '0';
      setTimeout(function() {
        el.textContent = FUNNY_MESSAGES[__msgIndex];
        el.style.opacity = '1';
      }, 200);
    }, 2500);
  }

  function stopFunnyMessages() {
    if (__msgInterval) {
      clearInterval(__msgInterval);
      __msgInterval = null;
    }
  }

  // ============================================================
  // نوار پیشرفت
  // ============================================================
  function startProgressBar() {
    stopProgressBar();
    var bar = document.querySelector('.section-progress-bar');
    if (!bar) return;
    __progressValue = 0;
    bar.style.width = '0%';
    
    __progressInterval = setInterval(function() {
      if (__progressValue < 90) {
        __progressValue += Math.random() * 3;
        if (__progressValue > 90) __progressValue = 90;
        bar.style.width = __progressValue + '%';
      }
    }, 300);
  }

  function stopProgressBar() {
    var bar = document.querySelector('.section-progress-bar');
    if (bar) {
      bar.style.width = '100%';
      setTimeout(function() { 
        if (bar) bar.style.width = '0%'; 
      }, 400);
    }
    if (__progressInterval) {
      clearInterval(__progressInterval);
      __progressInterval = null;
    }
    __progressValue = 0;
  }

  // ============================================================
  // نمایش/مخفی کردن لودر بخش
  // ============================================================
  function showSectionLoader(message) {
    let el = document.getElementById('sectionLoader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sectionLoader';
      el.innerHTML =
        '<div class="section-loader-box">' +
          '<div class="section-spinner"></div>' +
          '<p id="sectionLoaderMsg" style="transition: opacity 0.3s;"></p>' +
          '<div class="section-progress"><div class="section-progress-bar"></div></div>' +
          '<p id="sectionLoaderHint">از این فرصت استفاده کنید و یه چای بنوشید ☕</p>' +
        '</div>';
      document.body.appendChild(el);
    }
    
    var msgEl = document.getElementById('sectionLoaderMsg');
    if (msgEl) {
      msgEl.textContent = message || 'لطفاً صبر کنید...';
      msgEl.style.opacity = '1';
    }
    
    el.classList.add('show');
    startFunnyMessages();
    startProgressBar();
  }

  function hideSectionLoader() {
    stopFunnyMessages();
    stopProgressBar();
    const el = document.getElementById('sectionLoader');
    if (el) el.classList.remove('show');
  }

  // ============================================================
  // بارگذاری یک بخش (همه فایل‌های لازم)
  // ============================================================
  async function ensureSectionLoaded(section) {
    const config = SECTION_DEPS[section];
    if (!config) return;

    showSectionLoader(config.message);

    try {
      for (let i = 0; i < config.scripts.length; i++) {
        await loadScriptOnce(config.scripts[i]);
      }
    } catch (err) {
      hideSectionLoader();
      throw err;
    }

    hideSectionLoader();
  }

  // ============================================================
  // در معرض عموم
  // ============================================================
  window.LazyLoader = {
    ensureSectionLoaded: ensureSectionLoaded,
    showSectionLoader: showSectionLoader,
    hideSectionLoader: hideSectionLoader,
    SECTION_DEPS: SECTION_DEPS,
    isLoaded: function(section) {
      const cfg = SECTION_DEPS[section];
      return cfg ? cfg.scripts.every(function(s) { return loadedScripts.has(s); }) : false;
    }
  };

  console.log('🚀 LazyLoader آماده است - ' + Object.keys(SECTION_DEPS).length + ' بخش ثبت شد');
})();
