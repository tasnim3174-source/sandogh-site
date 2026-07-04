// Service Worker برای سیستم حسابداری صندوق اتحاد
const CACHE_NAME = 'sandogh-cache-v1';
const OFFLINE_URL = '/sandogh-site/index.html';

// لیست فایل‌هایی که باید کش شوند
const PRECACHE_URLS = [
    '/sandogh-site/',
    '/sandogh-site/index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// بررسی اینکه URL قابل کش شدن است یا نه
function isCacheableUrl(url) {
    try {
        const parsedUrl = new URL(url);
        // فقط URL های http و https قابل کش شدن هستند
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

// نصب Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ کش باز شد');
                return cache.addAll(PRECACHE_URLS).catch(err => {
                    console.warn('⚠️ خطا در پیش‌کش کردن برخی فایل‌ها:', err);
                    return Promise.resolve();
                });
            })
            .then(() => self.skipWaiting())
    );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ حذف کش قدیمی:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// مدیریت درخواست‌ها
self.addEventListener('fetch', (event) => {
    const requestUrl = event.request.url;
    
    // ❌ درخواست‌های غیر HTTP/HTTPS را نادیده بگیر
    // این کار خطای chrome-extension را رفع می‌کند
    if (!isCacheableUrl(requestUrl)) {
        return;
    }
    
    // ❌ درخواست‌های GitHub API را کش نکن (برای همگام‌سازی)
    if (requestUrl.includes('api.github.com')) {
        return;
    }
    
    // ❌ درخواست‌های POST و PUT و DELETE را کش نکن
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // اگر در کش موجود بود، برگردان
                if (response) {
                    return response;
                }
                
                // در غیر این صورت از شبکه بگیر
                return fetch(event.request)
                    .then((response) => {
                        // اگر پاسخ معتبر نبود، برگردان
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // پاسخ را در کش ذخیره کن (با مدیریت خطا)
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                // فقط URL های قابل کش را ذخیره کن
                                if (isCacheableUrl(event.request.url)) {
                                    cache.put(event.request, responseToCache).catch(err => {
                                        console.warn('⚠️ خطا در کش کردن:', err);
                                    });
                                }
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.warn('⚠️ خطا در دریافت از شبکه:', error);
                        
                        // اگر درخواست صفحه اصلی بود، صفحه آفلاین را برگردان
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        throw error;
                    });
            })
    );
});

// پیام‌های دریافتی
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

console.log('✅ Service Worker صندوق اتحاد بارگذاری شد');
