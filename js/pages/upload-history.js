/* ============================================================
   صندوق اتحاد - تاریخچه آپلود فایل اکسل
   نسخه: 1.0
   ============================================================ */

// ============================================================
// ذخیره تاریخچه آپلود (در حافظه محلی)
// ============================================================
function saveUploadHistory(fileName, fileSize, status) {
    try {
        var historyKey = 'sandogh_upload_history';
        var history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        
        var now = new Date();
        var persianDate = now.toLocaleDateString('fa-IR');
        var persianTime = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        
        history.unshift({
            id: 'upload_' + Date.now(),
            fileName: fileName || 'data1.xlsx',
            fileSize: fileSize || 0,
            status: status || 'success',
            date: persianDate,
            time: persianTime,
            timestamp: now.toISOString()
        });
        
        // فقط ۲۰ مورد آخر را نگه دار
        if (history.length > 20) history = history.slice(0, 20);
        
        localStorage.setItem(historyKey, JSON.stringify(history));
        return history[0];
    } catch(e) {
        console.warn('خطا در ذخیره تاریخچه:', e);
        return null;
    }
}

// ============================================================
// دریافت تاریخچه آپلود
// ============================================================
function getUploadHistory() {
    try {
        var historyKey = 'sandogh_upload_history';
        return JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch(e) {
        return [];
    }
}

// ============================================================
// نمایش تاریخچه در صفحه
// ============================================================
function renderUploadHistory() {
    var history = getUploadHistory();
    var container = document.getElementById('uploadHistoryContainer');
    if (!container) return;
    
    if (history.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:0.85rem;">📭 هنوز فایلی آپلود نشده است.</div>';
        return;
    }
    
    var html = '';
    history.forEach(function(item, index) {
        var statusIcon = item.status === 'success' ? '✅' : '❌';
        var statusColor = item.status === 'success' ? '#10b981' : '#ef4444';
        var statusText = item.status === 'success' ? 'موفق' : 'ناموفق';
        
        html += '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-secondary);border-radius:12px;margin-bottom:8px;border-right:3px solid ' + statusColor + ';">';
        
        // شماره ردیف
        html += '<div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:900;color:#9ca3af;flex-shrink:0;">';
        html += (index + 1);
        html += '</div>';
        
        // اطلاعات فایل
        html += '<div style="flex:1;min-width:0;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">';
        html += '<div style="font-weight:800;color:var(--text-primary);font-size:0.85rem;">📄 ' + item.fileName + '</div>';
        html += '<div style="font-size:0.7rem;color:' + statusColor + ';font-weight:700;">' + statusIcon + ' ' + statusText + '</div>';
        html += '</div>';
        html += '<div style="font-size:0.7rem;color:var(--text-secondary);margin-top:4px;">';
        html += '<i class="fas fa-calendar"></i> ' + item.date;
        html += ' | <i class="fas fa-clock"></i> ' + item.time;
        if (item.fileSize > 0) {
            html += ' | <i class="fas fa-weight-hanging"></i> ' + (item.fileSize / 1024).toFixed(1) + ' KB';
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
    });
    
    container.innerHTML = html;
}

// ============================================================
// دکمه پاک کردن تاریخچه
// ============================================================
function clearUploadHistory() {
    if (!confirm('آیا مطمئن هستید که می‌خواهید تاریخچه آپلود را پاک کنید؟')) return;
    try {
        localStorage.removeItem('sandogh_upload_history');
        renderUploadHistory();
        alert('✅ تاریخچه پاک شد.');
    } catch(e) {}
}

// ============================================================
// تزریق بخش تاریخچه به صفحه آپلود
// ============================================================
function injectUploadHistory() {
    // اگر قبلاً تزریق شده، دوباره نکن
    if (document.getElementById('uploadHistorySection')) {
        renderUploadHistory();
        return;
    }
    
    // پیدا کردن المان اصلی صفحه آپلود
    var uploadArea = document.querySelector('.upload-container, #uploadArea, .excel-upload, input[type="file"]');
    if (!uploadArea) {
        // اگر پیدا نشد، بعد از ۲ ثانیه دوباره تلاش کن
        setTimeout(injectUploadHistory, 2000);
        return;
    }
    
    // پیدا کردن والد مناسب
    var parent = uploadArea.closest('.dashboard-section') || uploadArea.parentElement;
    if (!parent) return;
    
    // ساخت بخش تاریخچه
    var historyHtml = `
        <div id="uploadHistorySection" style="margin-top:20px;padding-top:20px;border-top:2px solid var(--border-color);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                <h3 style="color:var(--gold-color);font-size:1rem;margin:0;font-weight:900;">
                    <i class="fas fa-history"></i> تاریخچه آپلودها
                </h3>
                <button onclick="clearUploadHistory()" style="padding:6px 12px;border-radius:8px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.1);color:#ef4444;cursor:pointer;font-size:0.7rem;font-family:inherit;font-weight:700;">
                    <i class="fas fa-trash"></i> پاک کردن
                </button>
            </div>
            <div id="uploadHistoryContainer">
                <div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:0.85rem;">در حال بارگذاری...</div>
            </div>
        </div>
    `;
    
    parent.insertAdjacentHTML('beforeend', historyHtml);
    renderUploadHistory();
    console.log('✅ تاریخچه آپلود به صفحه اضافه شد.');
}

// ============================================================
// اجرای خودکار هنگام لود شدن صفحه آپلود
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // هر ۲ ثانیه چک می‌کند که آیا صفحه آپلود باز شده است یا نه
    setInterval(function() {
        var currentPage = window.currentPage || '';
        var hasUpload = document.querySelector('input[type="file"]');
        
        if (hasUpload && (currentPage === 'upload' || currentPage === 'admin' || currentPage === 'manage')) {
            injectUploadHistory();
        }
    }, 2000);
});

// ============================================================
// API عمومی برای استفاده در پنل مدیریت
// ============================================================
window.UploadHistory = {
    save: saveUploadHistory,
    getAll: getUploadHistory,
    render: renderUploadHistory,
    clear: clearUploadHistory,
    inject: injectUploadHistory
};
