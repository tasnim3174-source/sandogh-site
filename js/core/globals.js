/* ============================================================
   صندوق اتحاد - متغیرهای سراسری
   نسخه: 2.0
   ============================================================ */

// ===== متغیرهای اصلی =====
var currentUser = null;
var currentPage = 'menu';
var currentClubTab = 'shop';

var members = [];
var transactions = [];
var users = [];
var memberScores = {};
var userCoins = 0;
var coinHistory = [];
var notifications = [];
var userPurchases = [];
var transactionsByMember = new Map();
var gameScores = {};

var autoUpdateInterval = null;
var keepAliveInterval = null;
var chartInstances = {};
var lastVisitInfo = {};

// ===== آدرس‌های API =====
var ADMIN_URL = 'https://script.google.com/macros/s/AKfycbxN3lDjLcnSDGNwWqhpi1n0YsYXVPfuTv08_EO1Vys0YNauITE0cGrKYypxHeNhLcjr/exec';
var STMT_API = ADMIN_URL;
var SHOP_URL = ADMIN_URL;
var COUNCIL_URL = ADMIN_URL;
var EMAIL_API = ADMIN_URL;
var RW_API = ADMIN_URL;

// ===== آدرس‌های داده =====
const DATA_URL = 'https://raw.githubusercontent.com/tasnim3174-source/sandogh-site/main/data.xlsx';
const DATA_URL_1 = 'https://raw.githubusercontent.com/tasnim3174-source/sandogh-site/main/data1.xlsx';
const APK_DOWNLOAD_URL = 'https://raw.githubusercontent.com/tasnim3174-source/sandogh-site/main/app.apk';

// ===== تنظیمات =====
const FEATURES = { showMyFund: true };

const SUPPORT_INFO = {
    phone: '09138944709',
    accountNumber: '',
    cardNumber: '',
    shebaNumber: '',
    websiteAddress: '',
    itaaAddress: '@ethads'
};

let SYSTEM_MESSAGE = '';

// ===== متغیرهای لودر =====
var ldrFx, ldrCx, W = 0, H = 0, dust = [], conf = [];
var ldrStages = [
    { u: 25, t: 'اتصال به سرور اصلی' },
    { u: 50, t: 'احراز هویت و امنیت' },
    { u: 78, t: 'همگام‌سازی تراکنش‌ها' },
    { u: 101, t: 'بارگذاری داشبورد مالی' }
];

var ldrP = 0, ldrTimer = null, ldrDone = false, ldrSecs = 0, ldrSecT = null, ldrFi = 0, ldrStartTime = 0;
var C = 414.7;
var loginDataReady = false;
var loginResult = null;
// ===== توابع لودر =====
function ldrFa(n) { return new Intl.NumberFormat('fa-IR').format(n); }
// ===== متغیرهای فراموشی رمز =====
var forgotUser = null;
var forgotStep = 1;
var forgotAllUsers = null;

// ===== متغیرهای بازی‌ها =====
const SNAKE_LADDERS = {1:38, 4:14, 9:31, 21:42, 28:84, 36:44, 51:67, 71:91, 80:100};
const SNAKE_SNAKES = {16:6, 47:26, 49:11, 56:53, 62:19, 64:60, 87:24, 93:73, 95:75, 98:78};
const SNAKE_DICE_FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];

let snakePlayers = [1, 1];
let snakeCurrentPlayer = 0;
let snakeGameOver = false;
let snakeIsRolling = false;
let snakeSoundEnabled = true;
let snakeTotalRolls = 0;
let snakeSnakesHit = 0;
let snakeLaddersHit = 0;
let snakeSixesCount = 0;
let snakeLastRoll = 0;
let snakeWins = parseInt(localStorage.getItem('snlWins') || '0');

let tttBoard = Array(9).fill('');
let tttGameActive = true;
let tttDifficulty = 'easy';
let tttScores = { X: 0, O: 0, D: 0 };
let tttWins = parseInt(localStorage.getItem('tttWins') || '0');
const TTT_HUMAN = 'X';
const TTT_COMPUTER = 'O';
const TTT_WIN_PATTERNS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

let mathSettings = {
    difficulty: 'easy',
    operations: ['+', '-', '×', '÷']
};
let mathCurrentQuestion = {};
let mathScore = 0;
let mathCombo = 0;
let mathMaxCombo = 0;
let mathCorrectCount = 0;
let mathWrongCount = 0;
let mathSkippedCount = 0;
let mathTimeLeft = 60;
let mathTotalQuestions = 0;
let mathTimerInterval = null;
let mathGameActive = false;

const mathDifficultyRanges = {
    easy: { min: 1, max: 10 },
    medium: { min: 10, max: 50 },
    hard: { min: 20, max: 100 }
};

// ===== متغیرهای صندوق من =====
const MF_TABS = [
    { id: 'performance', label: '🏅 عملکرد شما' },
    { id: 'tree', label: '🌳 درخت رشد' },
    { id: 'postcards', label: '💌 کارت پستال' },
    { id: 'success', label: '🏆 موفقیت‌های من' },
    { id: 'advisor', label: '🤖 مشاور مالی' },
    { id: 'alerts', label: '🔔 هشدارها' },
    { id: 'lessons', label: '🎓 سواد مالی' },
    { id: 'quiz', label: '🧠 کوئیز' },
    { id: 'news', label: '📰 خبرنامه' },
    { id: 'loan', label: '🧮 شبیه‌ساز وام' },
    { id: 'badges', label: '🏅 نشان‌ها' }
];

const MF_POSTCARDS = [
    { title: 'تبریک تولد', emoji: '🎂', text: 'تولدت مبارک! برایت سلامتی، شادی و موفقیت آرزومندم. 🌟', cls: 'mf-pc-birthday' },
    { title: 'تبریک نوروز', emoji: '🌸', text: 'نوروزتان پیروز! سالی سرشار از برکت و سلامتی برایتان آرزومندم. 🌷', cls: 'mf-pc-nowruz' },
    { title: 'تبریک یلدا', emoji: '🍉', text: 'شب یلدا مبارک! شبی گرم و پرمهر در کنار عزیزان داشته باشید. ❤️', cls: 'mf-pc-yalda' },
    { title: 'تبریک موفقیت', emoji: '🏆', text: 'تبریک بابت موفقیت ارزشمند شما! به داشتن دوستی مثل تو افتخار می‌کنم. 👏', cls: 'mf-pc-success' }
];

const MF_LESSONS = [
    { id: 1, title: 'بودجه‌بندی ۵۰/۳۰/۲۰', icon: 'fa-chart-pie', color: '#667eea', time: '۲ دقیقه', content: 'قانون ۵۰/۳۰/۲۰:\n\n🔹 ۵۰٪ درآمد: نیازهای ضروری\n🔹 ۳۰٪ درآمد: خواسته‌ها\n🔹 ۲۰٪ درآمد: پس‌انداز' },
    { id: 2, title: 'قدرت پس‌انداز خودکار', icon: 'fa-piggy-bank', color: '#10b981', time: '۳ دقیقه', content: '💡 نکته: «اول به خودت پرداخت کن!»\n\nاگر اول ماه ۱۰٪ را پس‌انداز کنید، به مرور ثروت قابل توجهی جمع می‌شود.' },
    { id: 3, title: 'مدیریت بدهی', icon: 'fa-hand-holding-usd', color: '#ef4444', time: '۴ دقیقه', content: '✅ بدهی خوب: وام مسکن، وام کسب‌وکار\n❌ بدهی بد: خرید کالاهای مصرفی\n\n🎯 مجموع اقساط نباید بیشتر از ۳۰٪ درآمد باشد.' },
    { id: 4, title: 'سرمایه‌گذاری با درآمد کم', icon: 'fa-coins', color: '#f59e0b', time: '۵ دقیقه', content: '🌱 از مبالغ کوچک شروع کنید\n📈 تداوم مهم‌تر از مبلغ است\n🥚 همه تخم‌مرغ‌ها را در یک سبد نگذارید' }
];

const MF_QUIZ = [
    { q: 'چند درصد درآمد را باید پس‌انداز کرد؟', options: ['۵٪', '۱۰٪', '۲۰٪', '۵۰٪'], correct: 2 },
    { q: 'مجموع اقساط نباید بیشتر از چند درصد درآمد باشد؟', options: ['۱۰٪', '۳۰٪', '۵۰٪', '۷۰٪'], correct: 1 },
    { q: 'کدام بدهی «خوب» محسوب می‌شود؟', options: ['خرید گوشی با اقساط', 'وام مسکن', 'وام سفر', 'خرید لباس'], correct: 1 },
    { q: 'قانون ۵۰/۳۰/۲۰ مربوط به چیست؟', options: ['سرمایه‌گذاری', 'بودجه‌بندی', 'وام', 'بیمه'], correct: 1 }
];
let mfQuizIdx = 0, mfQuizCorrect = 0;

// ===== متغیرهای برنامه‌های کاربردی =====
const UT_TABS = [
    { id: 'phone', label: '📞 دفترچه تلفن' },
    { id: 'calc', label: '🧮 ماشین‌حساب‌ها' },
    { id: 'notes', label: '📝 یادداشت‌ها' },
    { id: 'calendar', label: '📅 تقویم مذهبی و ملی' },
    { id: 'health', label: '🏥 سلامتی و درمان' },
    { id: 'religious', label: '🕌 معارف اسلامی' }
];

const UT_CATS = {
    money: { label: '💰 مالی', badge: 'ut-cat-badge-money' },
    reminder: { label: '⏰ یادآوری', badge: 'ut-cat-badge-reminder' },
    personal: { label: '👤 شخصی', badge: 'ut-cat-badge-personal' }
};

const UT_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const UT_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const UT_EVENTS = [
    { m: 1, d: 1, t: 'نوروز', h: true },
    { m: 1, d: 2, t: 'عید نوروز', h: true },
    { m: 1, d: 3, t: 'عید نوروز', h: true },
    { m: 1, d: 4, t: 'عید نوروز', h: true },
    { m: 1, d: 12, t: 'روز جمهوری اسلامی', h: true },
    { m: 1, d: 13, t: 'روز طبیعت', h: true },
    { m: 2, d: 2, t: 'روز معلم' },
    { m: 3, d: 14, t: 'رحلت امام خمینی', h: true },
    { m: 3, d: 15, t: 'قیام ۱۵ خرداد', h: true },
    { m: 4, d: 4, t: 'تاسوعای حسینی (تقریبی)', h: true, r: true },
    { m: 4, d: 5, t: 'عاشورای حسینی (تقریبی)', h: true, r: true },
    { m: 5, d: 14, t: 'اربعین حسینی (تقریبی)', h: true, r: true },
    { m: 5, d: 24, t: 'رحلت پیامبر (تقریبی)', h: true, r: true },
    { m: 6, d: 2, t: 'شهادت امام رضا (تقریبی)', h: true, r: true },
    { m: 6, d: 17, t: 'قیام ۱۷ شهریور', h: true },
    { m: 6, d: 27, t: 'روز شعر و ادب فارسی' },
    { m: 6, d: 31, t: 'آغاز هفته دفاع مقدس' },
    { m: 7, d: 14, t: 'میلاد پیامبر (تقریبی)', h: true, r: true },
    { m: 8, d: 13, t: 'روز دانش‌آموز' },
    { m: 9, d: 16, t: 'روز دانشجو' },
    { m: 10, d: 25, t: 'عید مبعث (تقریبی)', h: true, r: true },
    { m: 11, d: 14, t: 'نیمه شعبان (تقریبی)', h: true, r: true },
    { m: 11, d: 22, t: 'پیروزی انقلاب اسلامی', h: true },
    { m: 12, d: 18, t: 'عید فطر (تقریبی)', h: true, r: true },
    { m: 12, d: 29, t: 'ملی شدن صنعت نفت', h: true }
];
let utCalYear = 0, utCalMonth = 0;

let utCurrentCalc = 'zakat';

// ===== متغیرهای قلک نوجوانان =====
const teenData = {
    savings: [],
    goals: [],
    challenges: [],
    points: 0,
    level: 1,
    badges: [],
    budget: { income: 0, expenses: [] },
    lessons: [],
    history: []
};

const teenChallengesList = [
    { id: 1, name: 'چالش ۱۰۰ تومانی', desc: '۳۰ روز هر روز ۱۰۰ تومان پس‌انداز کن!', days: 30, points: 50 },
    { id: 2, name: 'بدون خرید اینترنتی', desc: '۷ روز هیچ خرید اینترنتی نداشته باش!', days: 7, points: 30 },
    { id: 3, name: 'مدیریت خرج هفتگی', desc: '۱۴ روز بودجه هفتگی رو مدیریت کن!', days: 14, points: 40 },
    { id: 4, name: 'پس‌انداز تصادفی', desc: '۳۰ روز هر روز یه عدد تصادفی پس‌انداز کن!', days: 30, points: 60 }
];

const teenLessons = [
    { id: 1, title: '💰 پول چیست؟', desc: 'آشنایی با تاریخچه پول و انواع آن', points: 10 },
    { id: 2, title: '🏦 بانک و حساب بانکی', desc: 'چطور بانک کار میکنه و چطور حساب باز کنیم؟', points: 10 },
    { id: 3, title: '📈 سرمایه‌گذاری', desc: 'چطور پولت رو بیشتر کنی؟', points: 15 },
    { id: 4, title: '🎯 هدف‌گذاری مالی', desc: 'چطور برای اهداف مالی برنامه‌ریزی کنی؟', points: 10 },
    { id: 5, title: '🛡️ ریسک و بیمه', desc: 'چطور از پولت محافظت کنی؟', points: 15 }
];

const teenBadgesList = [
    { id: 'first_save', icon: '🐣', name: 'اولین پس‌انداز', desc: 'اولین پس‌انداز رو ثبت کن' },
    { id: 'goal_setter', icon: '🎯', name: 'هدف‌گذار', desc: 'اولین هدف رو تعیین کن' },
    { id: 'challenger', icon: '🏆', name: 'چالش‌گر', desc: 'یک چالش رو کامل کن' },
    { id: 'saver_10', icon: '💰', name: 'پس‌اندازکار', desc: '۱۰ بار پس‌انداز ثبت کن' },
    { id: 'budget_master', icon: '📊', name: 'مدیر بودجه', desc: '۵ تراکنش ثبت کن' },
    { id: 'learner', icon: '🎓', name: 'دانش‌آموز', desc: '۳ درس مالی رو بخوان' }
];

// ===== متغیرهای آشپزی =====
const ladyFoodItems = [
    { id: 1, name: 'کباب کوبیده', category: 'کباب‌ها', emoji: '🥩', recipe: [
        { ingredient: 'گوشت مخلوط', amount: '۸۰۰ گرم' },
        { ingredient: 'پیاز آب گرفته', amount: '۲۰۰ گرم' },
        { ingredient: 'دنبه تازه گوسفندی', amount: '۱۰۰ گرم' },
        { ingredient: 'نمک', amount: '۱ قاشق چایخوری' },
        { ingredient: 'بکینگ پودر (اختیاری)', amount: '۱ قاشق چایخوری' },
        { ingredient: 'فلفل سیاه', amount: 'به اندازه دلخواه' },
        { ingredient: 'زعفران دم کرده', amount: '۴ قاشق غذاخوری' }
    ]},
    { id: 2, name: 'جوجه کباب', category: 'کباب‌ها', emoji: '🍗', recipe: [
        { ingredient: 'سینه مرغ', amount: '۱ کیلوگرم' },
        { ingredient: 'ماست', amount: '۱ پیمانه' },
        { ingredient: 'پیاز', amount: '۲ عدد' },
        { ingredient: 'آبلیمو', amount: '۳ قاشق غذاخوری' },
        { ingredient: 'زعفران دم کرده', amount: '۳ قاشق غذاخوری' },
        { ingredient: 'نمک و فلفل', amount: 'به اندازه دلخواه' },
        { ingredient: 'کره', amount: '۵۰ گرم' }
    ]},
    { id: 3, name: 'کباب برگ', category: 'کباب‌ها', emoji: '🍖', recipe: [
        { ingredient: 'راسته گوسفندی', amount: '۵۰۰ گرم' },
        { ingredient: 'پیاز رنده شده', amount: '۱ عدد' },
        { ingredient: 'روغن زیتون', amount: '۳ قاشق غذاخوری' },
        { ingredient: 'نمک و فلفل', amount: 'به اندازه دلخواه' },
        { ingredient: 'زعفران', amount: '۱ قاشق چایخوری' }
    ]},
    { id: 4, name: 'قرمه سبزی', category: 'خورشت‌ها', emoji: '🍲', recipe: [
        { ingredient: 'سبزی قرمه', amount: '۵۰۰ گرم' },
        { ingredient: 'گوشت خورشتی', amount: '۳۰۰ گرم' },
        { ingredient: 'لوبیا قرمز', amount: '۱ پیمانه' },
        { ingredient: 'لیمو عمانی', amount: '۴ عدد' },
        { ingredient: 'پیاز', amount: '۱ عدد' },
        { ingredient: 'نمک و فلفل', amount: 'به اندازه دلخواه' },
        { ingredient: 'روغن', amount: '۳ قاشق غذاخوری' }
    ]},
    { id: 5, name: 'قیمه', category: 'خورشت‌ها', emoji: '🍛', recipe: [
        { ingredient: 'گوشت خورشتی', amount: '۳۰۰ گرم' },
        { ingredient: 'لپه', amount: '۱ پیمانه' },
        { ingredient: 'لیمو عمانی', amount: '۲ عدد' },
        { ingredient: 'رب گوجه فرنگی', amount: '۲ قاشق غذاخوری' },
        { ingredient: 'پیاز', amount: '۱ عدد' },
        { ingredient: 'سیب زمینی', amount: '۲ عدد' },
        { ingredient: 'زعفران', amount: '½ قاشق چایخوری' }
    ]},
    { id: 6, name: 'فسنجان', category: 'خورشت‌ها', emoji: '🍗', recipe: [
        { ingredient: 'گردو', amount: '۳۰۰ گرم' },
        { ingredient: 'مرغ یا اردک', amount: '۴ تکه' },
        { ingredient: 'رب انار', amount: '۳ قاشق غذاخوری' },
        { ingredient: 'پیاز', amount: '۱ عدد' },
        { ingredient: 'شکر', amount: '۱ قاشق غذاخوری' },
        { ingredient: 'نمک و فلفل', amount: 'به اندازه دلخواه' }
    ]},
    { id: 7, name: 'پلو ساده', category: 'پلوها', emoji: '🍚', recipe: [
        { ingredient: 'برنج ایرانی', amount: '۳ پیمانه' },
        { ingredient: 'نمک', amount: '۲ قاشق غذاخوری' },
        { ingredient: 'روغن یا کره', amount: '۴ قاشق غذاخوری' },
        { ingredient: 'زعفران دم کرده', amount: '۲ قاشق غذاخوری' },
        { ingredient: 'نان (برای ته‌دیگ)', amount: 'به اندازه دلخواه' }
    ]},
    { id: 8, name: 'سبزی پلو با ماهی', category: 'پلوها', emoji: '🐟', recipe: [
        { ingredient: 'برنج', amount: '۳ پیمانه' },
        { ingredient: 'سبزی پلویی', amount: '۳۰۰ گرم' },
        { ingredient: 'ماهی قزل‌آلا', amount: '۴ تکه' },
        { ingredient: 'سیر', amount: '۳ حبه' },
        { ingredient: 'لیمو ترش', amount: '۲ عدد' },
        { ingredient: 'روغن', amount: 'به اندازه لازم' }
    ]},
    { id: 9, name: 'باقالی پلو با ماهیچه', category: 'پلوها', emoji: '🍖', recipe: [
        { ingredient: 'برنج', amount: '۳ پیمانه' },
        { ingredient: 'باقالی', amount: '۲ پیمانه' },
        { ingredient: 'شوید', amount: '۲۰۰ گرم' },
        { ingredient: 'ماهیچه گوسفندی', amount: '۵۰۰ گرم' },
        { ingredient: 'پیاز', amount: '۲ عدد' },
        { ingredient: 'زعفران', amount: '۱ قاشق چایخوری' }
    ]},
    { id: 10, name: 'زرشک پلو با مرغ', category: 'پلوها', emoji: '🐔', recipe: [
        { ingredient: 'برنج', amount: '۳ پیمانه' },
        { ingredient: 'زرشک', amount: '۱۰۰ گرم' },
        { ingredient: 'مرغ', amount: '۴ تکه' },
        { ingredient: 'پیاز', amount: '۱ عدد' },
        { ingredient: 'زعفران', amount: '۱ قاشق چایخوری' },
        { ingredient: 'کره', amount: '۵۰ گرم' },
        { ingredient: 'شکر', amount: '۱ قاشق غذاخوری' }
    ]},
    { id: 11, name: 'آش رشته', category: 'آش‌ها', emoji: '🥣', recipe: [
        { ingredient: 'رشته آش', amount: '۲۰۰ گرم' },
        { ingredient: 'حبوبات (نخود، لوبیا، عدس)', amount: '۱ پیمانه' },
        { ingredient: 'سبزی آش', amount: '۵۰۰ گرم' },
        { ingredient: 'پیاز داغ', amount: '۳ قاشق غذاخوری' },
        { ingredient: 'کشک', amount: '۱ پیمانه' },
        { ingredient: 'نعنا داغ', amount: '۲ قاشق غذاخوری' }
    ]},
    { id: 12, name: 'دیزی (آبگوشت)', category: 'آش‌ها', emoji: '🍲', recipe: [
        { ingredient: 'گوشت گوسفندی با استخوان', amount: '۴۰۰ گرم' },
        { ingredient: 'نخود', amount: '۱ پیمانه' },
        { ingredient: 'لوبیا سفید', amount: '½ پیمانه' },
        { ingredient: 'سیب زمینی', amount: '۲ عدد' },
        { ingredient: 'گوجه فرنگی', amount: '۲ عدد' },
        { ingredient: 'پیاز', amount: '۱ عدد' },
        { ingredient: 'لیمو عمانی', amount: '۲ عدد' }
    ]},
    { id: 13, name: 'میرزا قاسمی', category: 'غذاهای محلی', emoji: '🍆', recipe: [
        { ingredient: 'بادمجان', amount: '۴ عدد' },
        { ingredient: 'گوجه فرنگی', amount: '۳ عدد' },
        { ingredient: 'سیر', amount: '۴ حبه' },
        { ingredient: 'تخم مرغ', amount: '۲ عدد' },
        { ingredient: 'روغن', amount: '۳ قاشق غذاخوری' },
        { ingredient: 'نمک و فلفل', amount: 'به اندازه دلخواه' }
    ]},
    { id: 14, name: 'کشک بادمجان', category: 'غذاهای محلی', emoji: '🍆', recipe: [
        { ingredient: 'بادمجان', amount: '۴ عدد' },
        { ingredient: 'کشک', amount: '۱ پیمانه' },
        { ingredient: 'پیاز داغ', amount: '۳ قاشق غذاخوری' },
        { ingredient: 'سیر داغ', amount: '۲ قاشق غذاخوری' },
        { ingredient: 'نعنا داغ', amount: '۱ قاشق غذاخوری' },
        { ingredient: 'گردو', amount: '۵۰ گرم' }
    ]},
    { id: 15, name: 'کوفته تبریزی', category: 'غذاهای محلی', emoji: '🧆', recipe: [
        { ingredient: 'گوشت چرخ کرده', amount: '۳۰۰ گرم' },
        { ingredient: 'لپه', amount: '½ پیمانه' },
        { ingredient: 'برنج', amount: '۱ پیمانه' },
        { ingredient: 'پیاز', amount: '۱ عدد' },
        { ingredient: 'سبزی معطر', amount: '۱۰۰ گرم' },
        { ingredient: 'زرشک و آلو', amount: 'به اندازه دلخواه' },
        { ingredient: 'تخم مرغ', amount: '۱ عدد' }
    ]},
    { id: 16, name: 'سالاد الویه', category: 'پیش‌غذا', emoji: '🥗', recipe: [
        { ingredient: 'سیب زمینی', amount: '۳ عدد' },
        { ingredient: 'تخم مرغ', amount: '۲ عدد' },
        { ingredient: 'سینه مرغ', amount: '۲۰۰ گرم' },
        { ingredient: 'خیارشور', amount: '۴ عدد' },
        { ingredient: 'نخود فرنگی', amount: '۱ پیمانه' },
        { ingredient: 'سس مایونز', amount: '۱ پیمانه' },
        { ingredient: 'نمک و فلفل', amount: 'به اندازه دلخواه' }
    ]},
    { id: 17, name: 'لازانیا', category: 'پیش‌غذا', emoji: '🍝', recipe: [
        { ingredient: 'ورقه لازانیا', amount: '۱ بسته' },
        { ingredient: 'گوشت چرخ کرده', amount: '۴۰۰ گرم' },
        { ingredient: 'پیاز', amount: '۱ عدد' },
        { ingredient: 'سس گوجه فرنگی', amount: '۲ پیمانه' },
        { ingredient: 'پنیر موزارلا', amount: '۳۰۰ گرم' },
        { ingredient: 'پنیر پارمزان', amount: '۱۰۰ گرم' }
    ]},
    { id: 18, name: 'سوسیس بندری', category: 'پیش‌غذا', emoji: '🌭', recipe: [
        { ingredient: 'سوسیس', amount: '۴ عدد' },
        { ingredient: 'پیاز', amount: '۲ عدد' },
        { ingredient: 'سیب زمینی', amount: '۲ عدد' },
        { ingredient: 'گوجه فرنگی', amount: '۲ عدد' },
        { ingredient: 'فلفل دلمه', amount: '۱ عدد' },
        { ingredient: 'رب گوجه', amount: '۲ قاشق غذاخوری' },
        { ingredient: 'ادویه بندری', amount: '۱ قاشق چایخوری' }
    ]}
];

