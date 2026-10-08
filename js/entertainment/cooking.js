/* ============================================================
   صندوق اتحاد - آشپزی (پخت و پز)
   نسخه: 2.0
   ============================================================ */

function openCookingApp() {
    const container = document.createElement('div');
    container.id = 'cookingAppContainer';
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 3050;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        flex-direction: column;
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
        z-index: 3051;
        background: rgba(255,255,255,0.95);
        color: #333;
        border: 2px solid rgba(0,0,0,0.15);
        padding: 10px 22px;
        border-radius: 30px;
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        backdrop-filter: blur(10px);
        font-family: 'B Titr', Tahoma, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    `;
    closeBtn.onclick = function() {
        document.body.removeChild(container);
        document.body.removeChild(closeBtn);
        renderPage('menu');
    };

    container.innerHTML = `
    <style>
        #cookingAppContainer .cook-title { font-size: 32px; font-weight: bold; margin: 5px 0 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        #cookingAppContainer .cook-sub { font-size: 15px; color: #666; margin-bottom: 20px; text-align: center; }
        #cookingAppContainer .cook-buttons { display: flex; gap: 20px; justify-content: center; width: 100%; max-width: 400px; margin: 5px 0; }
        #cookingAppContainer .cook-btn { flex: 1; padding: 22px 15px; border: none; border-radius: 20px; font-size: 18px; font-weight: bold; cursor: pointer; font-family: 'B Titr', Tahoma, sans-serif; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        #cookingAppContainer .cook-btn:active { transform: scale(0.95); }
        #cookingAppContainer .cook-btn .cook-icon { font-size: 40px; }
        #cookingAppContainer .cook-btn .cook-label { font-size: 16px; }
        #cookingAppContainer .cook-btn .cook-desc { font-size: 12px; opacity: 0.85; font-weight: normal; }
        #cookingAppContainer .cook-btn-food { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        #cookingAppContainer .cook-btn-shop { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; }
        #cookingAppContainer .cook-footer { color: #999; font-size: 13px; margin-top: 20px; text-align: center; max-width: 400px; line-height: 1.8; }
    </style>

    <div style="display:flex;flex-direction:column;align-items:center;width:100%;max-width:450px;padding:10px;text-align:center;">
        <div style="font-size:70px;margin-bottom:5px;">🍽️</div>
        <div class="cook-title">پخت و پز</div>
        <div class="cook-sub">🧑‍🍳 منوی غذاهای ایرانی با تهیه مواد اولیه</div>
        
        <div class="cook-buttons">
            <button class="cook-btn cook-btn-food" onclick="openLadyFoodModal()">
                <span class="cook-icon">🍽️</span>
                <span class="cook-label">منوی غذا</span>
                <span class="cook-desc">مشاهده دستور پخت</span>
            </button>
            <button class="cook-btn cook-btn-shop" onclick="openLadyShopModal()">
                <span class="cook-icon">🛒</span>
                <span class="cook-label">تهیه مواد</span>
                <span class="cook-desc">نزدیک‌ترین فروشگاه</span>
            </button>
        </div>
        
        <div class="cook-footer">
            💡 برای مشاهده دستور پخت، روی <strong>"منوی غذا"</strong> و برای پیدا کردن فروشگاه، روی <strong>"تهیه مواد"</strong> کلیک کنید
        </div>
    </div>
    `;

    document.body.appendChild(container);
    document.body.appendChild(closeBtn);
}

function openLadyFoodModal() {
    const oldModal = document.getElementById('ladyFoodModal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'ladyFoodModal';
    modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:3100;justify-content:center;align-items:center;backdrop-filter:blur(5px);display:flex;`;
    modal.innerHTML = `
        <div style="background:white;border-radius:20px;padding:30px;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 10px 50px rgba(0,0,0,0.4);position:relative;">
            <button onclick="document.getElementById('ladyFoodModal').remove()" 
                    style="position:absolute;top:15px;left:15px;background:#f5576c;border:none;width:35px;height:35px;border-radius:50%;color:white;cursor:pointer;font-size:20px;">✕</button>
            <div style="text-align:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #eee;">
                <h2 style="color:#667eea;font-size:28px;">🍽️ منوی غذاهای ایرانی</h2>
                <p style="color:#888;font-size:13px;margin-top:5px;">برای مشاهده دستور پخت، روی هر غذا کلیک کنید</p>
            </div>
            <div id="ladyFoodList"></div>
        </div>
    `;
    document.body.appendChild(modal);
    renderLadyFoodMenu();
}

function renderLadyFoodMenu() {
    const foodList = document.getElementById('ladyFoodList');
    if (!foodList) return;
    const categories = [...new Set(ladyFoodItems.map(f => f.category))];
    foodList.innerHTML = categories.map(cat => `
        <div style="margin:15px 0;">
            <div style="font-size:17px;color:#764ba2;font-weight:bold;margin-bottom:12px;padding-right:12px;border-right:4px solid #764ba2;">${cat}</div>
            ${ladyFoodItems.filter(f => f.category === cat).map(item => `
                <div onclick="showLadyRecipe(${item.id})" 
                     style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;margin:8px 0;background:#f8f9fa;border-radius:12px;cursor:pointer;">
                    <div>
                        <h3 style="color:#333;margin-bottom:4px;font-size:17px;">${item.emoji} ${item.name}</h3>
                        <p style="color:#888;font-size:12px;">👩‍🍳 برای مشاهده دستور پخت کلیک کنید</p>
                    </div>
                    <span style="font-size:28px;color:#667eea;">→</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function showLadyRecipe(foodId) {
    const item = ladyFoodItems.find(f => f.id === foodId);
    if (!item) return;
    const oldModal = document.getElementById('ladyRecipeModal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'ladyRecipeModal';
    modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:3200;justify-content:center;align-items:center;backdrop-filter:blur(5px);display:flex;`;
    modal.innerHTML = `
        <div style="background:white;border-radius:20px;padding:30px;max-width:500px;width:90%;max-height:85vh;overflow-y:auto;position:relative;">
            <button onclick="document.getElementById('ladyRecipeModal').remove()" 
                    style="position:absolute;top:15px;left:15px;background:#f5576c;border:none;width:35px;height:35px;border-radius:50%;color:white;cursor:pointer;font-size:20px;">✕</button>
            <div style="text-align:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #667eea;">
                <h2 style="color:#667eea;font-size:24px;">${item.emoji} دستور پخت ${item.name}</h2>
            </div>
            <h3 style="font-size:18px;color:#333;margin:15px 0 12px;padding-bottom:10px;border-bottom:2px dashed #e0e0e0;">🧾 مواد لازم</h3>
            <ul style="list-style:none;padding:0;">
                ${item.recipe.map(r => `
                    <li style="padding:12px 18px;margin:8px 0;background:#f8f9fa;border-radius:10px;border-right:4px solid #667eea;display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:#333;font-weight:500;font-size:15px;">${r.ingredient}</span>
                        <span style="color:#667eea;font-weight:bold;font-size:15px;background:#667eea15;padding:3px 12px;border-radius:15px;">${r.amount}</span>
                    </li>
                `).join('')}
            </ul>
            <div style="text-align:center;margin-top:15px;padding-top:15px;border-top:1px dashed #e0e0e0;">
                <span style="color:#999;font-size:13px;">👩‍🍳 نوش جان!</span>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openLadyShopModal() {
    const oldModal = document.getElementById('ladyShopModal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'ladyShopModal';
    modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:3100;justify-content:center;align-items:center;backdrop-filter:blur(5px);display:flex;`;
    modal.innerHTML = `
        <div style="background:white;border-radius:20px;padding:30px;max-width:550px;width:90%;max-height:85vh;overflow-y:auto;position:relative;">
            <button onclick="document.getElementById('ladyShopModal').remove()" 
                    style="position:absolute;top:15px;left:15px;background:#f5576c;border:none;width:35px;height:35px;border-radius:50%;color:white;cursor:pointer;font-size:20px;">✕</button>
            <div style="text-align:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #11998e;">
                <h2 style="color:#11998e;font-size:26px;">🛒 تهیه مواد اولیه</h2>
                <p style="color:#888;font-size:13px;margin-top:5px;">📍 نزدیک‌ترین فروشگاه به شما را پیدا می‌کنیم</p>
            </div>

            <div style="margin:15px 0;">
                <label style="display:block;margin-bottom:8px;color:#333;font-weight:bold;font-size:15px;">🏙️ شهر خود را انتخاب کنید</label>
                <select id="ladyCitySelect" style="width:100%;padding:12px 15px;border:2px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;background:white;cursor:pointer;">
                    <option value="">-- انتخاب شهر --</option>
                    <option value="tehran">تهران</option>
                    <option value="isfahan">اصفهان</option>
                    <option value="shiraz">شیراز</option>
                    <option value="mashhad">مشهد</option>
                    <option value="tabriz">تبریز</option>
                    <option value="karaj">کرج</option>
                    <option value="ahvaz">اهواز</option>
                    <option value="qom">قم</option>
                    <option value="rasht">رشت</option>
                    <option value="kerman">کرمان</option>
                </select>
            </div>

            <div style="margin:15px 0;">
                <label style="display:block;margin-bottom:8px;color:#333;font-weight:bold;font-size:15px;">🍲 غذای مورد نظر را انتخاب کنید</label>
                <select id="ladyFoodSelect" style="width:100%;padding:12px 15px;border:2px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;background:white;cursor:pointer;">
                    <option value="">-- انتخاب غذا --</option>
                    ${ladyFoodItems.map(item => `<option value="${item.id}">${item.emoji} ${item.name}</option>`).join('')}
                </select>
            </div>

            <div id="ladyIngredientsNeeded" style="display:none;background:linear-gradient(135deg, #fff3cd, #ffeaa7);border:1px solid #f0c674;border-radius:12px;padding:14px 18px;margin:15px 0;font-size:13px;color:#856404;">
                <strong style="display:block;margin-bottom:6px;font-size:14px;">📝 مواد لازم برای این غذا:</strong>
                <span id="ladyIngredientsText" style="font-size:13px;line-height:1.8;"></span>
            </div>

            <button onclick="findLadyShops()" id="ladyFindBtn" 
                    style="width:100%;padding:16px;background:linear-gradient(135deg, #11998e 0%, #38ef7d 100%);color:white;border:none;border-radius:14px;font-size:18px;font-weight:bold;cursor:pointer;font-family:'B Titr',Tahoma,sans-serif;">
                📍 یافتن نزدیک‌ترین فروشگاه
            </button>

            <div id="ladyLocationStatus" style="margin-top:15px;padding:14px;border-radius:12px;text-align:center;font-size:14px;display:none;"></div>
            <div id="ladyShopResults" style="margin-top:20px;display:none;">
                <h3 style="color:#11998e;margin-bottom:15px;font-size:18px;text-align:center;">🏪 فروشگاه‌های نزدیک شما</h3>
                <div id="ladyShopList"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('ladyFoodSelect').onchange = function() {
        const foodId = parseInt(this.value);
        const food = ladyFoodItems.find(f => f.id === foodId);
        const ingredientsDiv = document.getElementById('ladyIngredientsNeeded');
        const ingredientsText = document.getElementById('ladyIngredientsText');
        if (food) {
            const ingredients = food.recipe.map(r => `${r.ingredient} (${r.amount})`).join('، ');
            ingredientsText.textContent = ingredients;
            ingredientsDiv.style.display = 'block';
        } else {
            ingredientsDiv.style.display = 'none';
        }
    };
}

function findLadyShops() {
    const city = document.getElementById('ladyCitySelect').value;
    const foodId = document.getElementById('ladyFoodSelect').value;
    const statusDiv = document.getElementById('ladyLocationStatus');
    const resultsDiv = document.getElementById('ladyShopResults');
    const findBtn = document.getElementById('ladyFindBtn');

    if (!city) { alert('❌ لطفاً ابتدا شهر خود را انتخاب کنید! 🏙️'); return; }
    if (!foodId) { alert('❌ لطفاً غذای مورد نظر را انتخاب کنید! 🍲'); return; }

    statusDiv.style.display = 'block';
    statusDiv.style.background = '#fff3cd';
    statusDiv.style.color = '#856404';
    statusDiv.innerHTML = '⏳ در حال دریافت موقعیت شما...';
    resultsDiv.style.display = 'none';
    findBtn.disabled = true;
    findBtn.innerHTML = '⏳ در حال جستجو...';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                statusDiv.style.background = '#d4edda';
                statusDiv.style.color = '#155724';
                statusDiv.innerHTML = '✅ موقعیت شما دریافت شد';
                displayLadyShops(city, userLat, userLng);
                findBtn.disabled = false;
                findBtn.innerHTML = '📍 یافتن نزدیک‌ترین فروشگاه';
            },
            function() {
                statusDiv.style.background = '#f8d7da';
                statusDiv.style.color = '#721c24';
                statusDiv.innerHTML = '❌ خطا در دریافت موقعیت - از موقعیت پیش‌فرض استفاده می‌شود';
                const defaultPos = getLadyDefaultCityPosition(city);
                displayLadyShops(city, defaultPos.lat, defaultPos.lng);
                findBtn.disabled = false;
                findBtn.innerHTML = '📍 یافتن نزدیک‌ترین فروشگاه';
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        statusDiv.style.background = '#f8d7da';
        statusDiv.style.color = '#721c24';
        statusDiv.innerHTML = '❌ مرورگر شما از GPS پشتیبانی نمی‌کند';
        findBtn.disabled = false;
    }
}

function getLadyDefaultCityPosition(city) {
    const positions = {
        tehran: { lat: 35.6892, lng: 51.3890 },
        isfahan: { lat: 32.6546, lng: 51.6680 },
        shiraz: { lat: 29.5918, lng: 52.5837 },
        mashhad: { lat: 36.2605, lng: 59.6168 },
        tabriz: { lat: 38.0800, lng: 46.2919 },
        karaj: { lat: 35.8355, lng: 50.9916 },
        ahvaz: { lat: 31.3183, lng: 48.6706 },
        qom: { lat: 34.6416, lng: 51.0224 },
        rasht: { lat: 37.2808, lng: 49.5832 },
        kerman: { lat: 30.2839, lng: 57.0834 }
    };
    return positions[city] || { lat: 35.6892, lng: 51.3890 };
}

function displayLadyShops(city, userLat, userLng) {
    const shops = ladyShopsData[city] || [];
    if (shops.length === 0) {
        document.getElementById('ladyShopList').innerHTML = '<p style="text-align:center;color:#888;padding:20px;">🏪 فروشگاهی در این شهر یافت نشد.</p>';
    } else {
        const shopsWithDistance = shops.map(shop => {
            const R = 6371;
            const dLat = (shop.lat - userLat) * Math.PI / 180;
            const dLng = (shop.lng - userLng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(userLat * Math.PI / 180) * Math.cos(shop.lat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = (R * c).toFixed(2);
            return { ...shop, distance: distance };
        }).sort((a, b) => a.distance - b.distance);

        document.getElementById('ladyShopList').innerHTML = shopsWithDistance.map((shop, index) => `
            <div style="background:linear-gradient(135deg, #f8f9fa, #f0f2f5);border-radius:14px;padding:18px;margin:12px 0;border-right:4px solid #11998e;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span style="font-weight:bold;color:#333;font-size:17px;">${index + 1}. ${shop.name}</span>
                    <span style="background:linear-gradient(135deg, #11998e, #38ef7d);color:white;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:bold;">${shop.distance} کیلومتر</span>
                </div>
                <div style="color:#666;font-size:14px;margin-bottom:5px;">📍 ${shop.address}</div>
                <div style="color:#888;font-size:13px;margin-bottom:10px;">📞 ${shop.phone}</div>
                <a href="https://neshan.org/maps#c${shop.lat}-${shop.lng}-15z-0p" target="_blank" 
                   style="display:inline-block;padding:8px 20px;background:linear-gradient(135deg, #667eea, #764ba2);color:white;border-radius:20px;font-size:13px;text-decoration:none;font-weight:bold;">
                    🗺️ مشاهده در نقشه
                </a>
            </div>
        `).join('');
    }
    document.getElementById('ladyShopResults').style.display = 'block';
    document.getElementById('ladyLocationStatus').style.background = '#d4edda';
    document.getElementById('ladyLocationStatus').style.color = '#155724';
    document.getElementById('ladyLocationStatus').innerHTML = '✅ فروشگاه‌های نزدیک شما پیدا شدند';
}
