/* ============================================================
   صندوق اتحاد - Lazy Loader
   بارگذاری هوشمند فایل‌ها فقط هنگام نیاز
   ============================================================ */

(function() {
  'use strict';

  // ============================================================
  // نقشه وابستگی: هر صفحه چه فایل‌هایی نیاز دارد
  // ============================================================
  const SECTION_DEPS = {
    // --- صفحات داده‌محور (نیاز به اکسل) ---
    dashboard:      { scripts: ['js/pages/dashboard.js'],           message: 'لطفاً صبر کنید، صورتحساب در حال بارگذاری است...' },
    sms:            { scripts: ['js/pages/sms.js'],                 message: 'لطفاً صبر کنید، سامانه‌های پیامکی در حال بارگذاری است...' },
    requests:       { scripts: ['js/pages/requests.js'],            message: 'لطفاً صبر کنید، درخواست‌ها در حال بارگذاری است...' },
    support:        { scripts: ['js/pages/support.js'],             message: 'لطفاً صبر کنید، پشتیبانی در حال بارگذاری است...' },
    family:         { scripts: ['js/pages/family.js'],              message: 'لطفاً صبر کنید، اطلاعات خانواده در حال بارگذاری است...' },
    familyInfo:     { scripts: ['js/pages/family-info.js'],         message: 'لطفاً صبر کنید، اطلاعات کلی خانواده در حال بارگذاری است...' },
    access:         { scripts: ['js/pages/access.js'],              message: 'لطفاً صبر کنید، دسترسی‌ها در حال بارگذاری است...' },
    infoStats:      { scripts: ['js/pages/stats.js'],               message: 'لطفاً صبر کنید، اطلاعات و آمار در حال بارگذاری است...' },
    manageCoins:    { scripts: ['js/pages/manage-coins.js'],        message: 'لطفاً صبر کنید، مدیریت امتیازها در حال بارگذاری است...' },
    reports:        { scripts: ['js/pages/reports.js'],             message: 'لطفاً صبر کنید، گزارش‌ها در حال بارگذاری است...' },

    // --- سرویس‌های اسکریپتی ---
    club:           { scripts: ['js/script-services/club.js'],        message: 'لطفاً صبر کنید، باشگاه مشتریان در حال بارگذاری است...' },
    quizzes:        { scripts: ['js/script-services/quizzes.js'],     message: 'لطفاً صبر کنید، مسابقات در حال بارگذاری است...' },
    dailyReward:    { scripts: ['js/script-services/daily-reward.js'],message: 'لطفاً صبر کنید، پاداش روزانه در حال بارگذاری است...' },
    emailForm:      { scripts: ['js/script-services/email-form.js'],  message: 'لطفاً صبر کنید، فرم ایمیل در حال بارگذاری است...' },
    messaging:      { scripts: ['js/script-services/messaging.js'],   message: 'لطفاً صبر کنید، پیام‌رسان در حال بارگذاری است...' },
    survey:         { scripts: ['js/script-services/messaging.js'],   message: 'لطفاً صبر کنید، نظرسنجی در حال بارگذاری است...' },

    // --- سرگرمی و بازی ---
    games:          { scripts: ['js/entertainment/games.js'],          message: 'لطفاً صبر کنید، بازی‌ها در حال بارگذاری است...' },
    ladySection:    { scripts: ['js/entertainment/lady-section.js'],   message: 'لطفاً صبر کنید، بخش بانوان در حال بارگذاری است...' },
    cooking:        { scripts: ['js/entertainment/cooking.js'],        message: 'لطفاً صبر کنید، آشپزی در حال بارگذاری است...' },
    teenPiggy:      { scripts: ['js/entertainment/teen-piggy.js'],     message: 'لطفاً صبر کنید، قلک نوجوانان در حال بارگذاری است...' },
    toddler:        { scripts: ['js/entertainment/toddler.js'],        message: 'لطفاً صبر کنید، بخش خردسالان در حال بارگذاری است...' },
    myFund:         { scripts: ['js/entertainment/my-fund.js'],        message: 'لطفاً صبر کنید، صندوق من در حال بارگذاری است...' },
    utilities:      { scripts: ['js/entertainment/utilities.js'],      message: 'لطفاً صبر کنید، برنامه‌های کاربردی در حال بارگذاری است...' },
    calendar:       { scripts: ['js/entertainment/calendar.js'],       message: 'لطفاً صبر کنید، تقویم در حال بارگذاری است...' },
    notes:          { scripts: ['js/entertainment/notes.js'],          message: 'لطفاً صبر کنید، یادداشت‌ها در حال بارگذاری است...' },
    calculators:    { scripts: ['js/entertainment/calculators.js'],    message: 'لطفاً صبر کنید، ماشین‌حساب‌ها در حال بارگذاری است...' },
  };

  // ============================================================
  // کش فایل‌های بارگذاری‌شده
  // ============================================================
  const loadedScripts = new Set();
  const loadingPromises = {};

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
  // نمایش/مخفی کردن لودر بخش
  // ============================================================
  function showSectionLoader(message) {
    let el = document.getElementById('sectionLoader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sectionLoader';
      el.innerHTML = `
        <div class="section-loader-box">
          <div class="section-spinner"></div>
          <p id="sectionLoaderMsg"></p>
        </div>
      `;
      document.body.appendChild(el);
    }
    document.getElementById('sectionLoaderMsg').textContent = message || 'لطفاً صبر کنید...';
    el.classList.add('show');
  }

  function hideSectionLoader() {
    const el = document.getElementById('sectionLoader');
    if (el) el.classList.remove('show');
  }

  // ============================================================
  // بارگذاری یک بخش (همه فایل‌های لازم)
  // ============================================================
  async function ensureSectionLoaded(section) {
    const config = SECTION_DEPS[section];
    if (!config) return; // بخشی که نیازی به لود ندارد

    showSectionLoader(config.message);

    try {
      for (const src of config.scripts) {
        await loadScriptOnce(src);
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
      return cfg ? cfg.scripts.every(s => loadedScripts.has(s)) : false;
    }
  };

  console.log('🚀 LazyLoader آماده است - ' + Object.keys(SECTION_DEPS).length + ' بخش ثبت شد');
})();
