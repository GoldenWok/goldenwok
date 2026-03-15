let LANG = "gr";
let currentImgIndex = 0;

/* --- 1. 核心渲染 (带防崩溃保护) --- */
function renderWebsite() {
    const safeSet = (id, val) => { 
        const el = document.getElementById(id);
        if (el && val) el.innerText = val; 
    };

    // 检查 DB 是否存在
    if (!window.DB) {
        console.error("config.js 未能加载，请检查文件路径或语法！");
        return;
    }

    try {
        // 渲染基础文字
        if (DB.welcome) safeSet("welcome", DB.welcome[LANG]);
        if (DB.slogan) safeSet("slogan", DB.slogan[LANG]);
        if (DB.opening) safeSet("openingText", DB.opening[LANG]);
        if (DB.buffetTime) safeSet("buffetTime", DB.buffetTime[LANG]);
        if (DB.buffetPrice) safeSet("buffetPrice", DB.buffetPrice[LANG]);
        if (DB.menuTitle) safeSet("menuTitle", DB.menuTitle[LANG]);
        if (DB.galleryTitle) safeSet("galleryTitle", DB.galleryTitle[LANG]);
        if (DB.locationTitle) safeSet("locationTitle", DB.locationTitle[LANG]);
        
        // 点餐按钮
        const orderBtn = document.getElementById("orderButton");
        if (orderBtn && DB.orderModule && DB.orderModule.orderButton) {
            orderBtn.innerText = DB.orderModule.orderButton[LANG];
        }

        // 联系信息 (匹配你的 config 结构)
        if (DB.contact && DB.contact[LANG]) {
            safeSet("contactAddress", DB.contact[LANG].address);
            safeSet("contactPhone", DB.contact[LANG].phone);
        }

        // 导航栏
        document.querySelectorAll('.nav-item').forEach(item => {
            const text = item.getAttribute(`data-text-${LANG}`);
            if (text) item.innerText = text;
        });

    } catch (e) {
        console.error("基础渲染出错，但将尝试加载图片:", e);
    }

    // 无论文字是否出错，都强制尝试加载图片和地图
    renderGallery();
    renderMenu();
    initSmoothScroll();
    initReveal();
}

/* --- 2. 图片画廊渲染 (修复图片消失) --- */
function renderGallery() {
    const container = document.getElementById("galleryContainer");
    if (!container || !window.DB || !DB.gallery) {
        console.warn("找不到图片数据或容器");
        return;
    }

    container.innerHTML = DB.gallery.map((img, i) => `
        <div class="gallery-slide-item" onclick="handleGalleryClick(${i}, this)">
            <img src="images/${img}" alt="Golden Wok Gallery" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Missing'">
        </div>
    `).join('');
    
    if (typeof setupDynamicDepth === 'function') setupDynamicDepth();
}

/* --- 3. 菜单渲染 --- */
function renderMenu() {
    const container = document.getElementById("menuContainer");
    if (!container || !window.DB || !DB.menu) return;

    container.innerHTML = DB.menu.map(cat => `
        <div class="menu-card reveal">
            <h3 class="category-header" onclick="toggleMenuCategory(this)">
                ${cat.name[LANG] || ""}
                <span class="arrow-icon"></span>
            </h3>
            <div class="menu-items-wrapper" style="max-height: 0; overflow: hidden; transition: all 0.5s ease;">
                <div class="menu-items">
                    ${cat.items.map(item => `
                        <div class="menu-item">
                            <span class="item-name">${item[LANG] || ""}</span>
                            <span class="item-dots"></span>
                            <span class="item-price">€${item.price || ""}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

/* --- 4. 地图修复 (Λεωφ. Ανδρέα Συγγρού 207) --- */
function initMap() {
    const map = document.getElementById("googleMap");
    if (map) {
        // 使用该地址的官方嵌入 URL
        const address = encodeURIComponent("Leof. Andrea Siggrou 207, Nea Smyrni 171 21");
        map.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${address}`;
        // 注意：如果没有 API Key，请使用下面的通用链接：
        map.src = "https://www.google.com/maps?q=Leof.+Andrea+Siggrou+207,Nea+Smyrni+17121&output=embed";
    }
}

/* --- 5. 生命周期管理 --- */
window.addEventListener('DOMContentLoaded', () => {
    // 强制显示 Body (防止加载死锁)
    document.body.classList.remove('loading');
    document.body.style.opacity = "1";

    renderWebsite();
    initMap(); // 单独初始化地图
    initCursor();
});

// 以下是其他必需的辅助函数 (保持不变)
function toggleMenuCategory(h) {
    const w = h.nextElementSibling;
    const active = h.classList.contains('active');
    document.querySelectorAll('.category-header').forEach(el => {
        el.classList.remove('active');
        el.nextElementSibling.style.maxHeight = "0";
    });
    if (!active) {
        w.style.maxHeight = w.scrollHeight + "px";
        h.classList.add('active');
    }
}

function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if(entry.isIntersecting) entry.target.classList.add('is-visible'); 
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function handleGalleryClick(index, el) {
    if (el.classList.contains('is-active')) {
        currentImgIndex = index;
        const overlay = document.getElementById("imageOverlay");
        const img = document.getElementById("overlayImg");
        img.src = `images/${DB.gallery[index]}`;
        overlay.style.display = "flex";
        setTimeout(() => overlay.classList.add('active'), 10);
    } else {
        const container = document.getElementById("galleryContainer");
        container.scrollTo({
            left: el.offsetLeft - (container.offsetWidth / 2 - el.offsetWidth / 2),
            behavior: 'smooth'
        });
    }
}

function closeImage() {
    const o = document.getElementById("imageOverlay");
    o.classList.remove('active');
    setTimeout(() => o.style.display = "none", 400);
}

function moveGallery(d) {
    const c = document.getElementById("galleryContainer");
    if (c) c.scrollBy({ left: d * 300, behavior: 'smooth' });
}

function setLang(l) {
    LANG = l;
    renderWebsite();
}

function initCursor() {
    const c = document.querySelector('.cursor');
    const f = document.querySelector('.cursor-follower');
    if(!c) return;
    window.addEventListener('mousemove', e => {
        c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        f.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
}
