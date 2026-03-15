let LANG = "gr";

/* --- 1. 光标逻辑 (事件委托版) --- */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        follower.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    });

    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .lang span, .gallery-slide-item, .menu-item')) {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
    });
}

/* --- 2. 渲染逻辑 --- */
function setLang(lang) {
    LANG = lang;
    document.body.style.opacity = "0";
    setTimeout(() => {
        renderWebsite();
        document.body.style.opacity = "1";
    }, 400);
}

function renderWebsite() {
    const safeSet = (id, val) => { if(document.getElementById(id)) document.getElementById(id).innerText = val || ""; };

    safeSet("siteTitle", DB.restaurant[LANG]);
    safeSet("welcome", DB.welcome[LANG]);
    safeSet("slogan", DB.slogan[LANG]);
    safeSet("openingText", DB.opening[LANG]);
    safeSet("buffetTime", DB.buffetTime[LANG]);
    safeSet("buffetPrice", DB.buffetPrice[LANG]);
    safeSet("menuTitle", DB.menuTitle[LANG]);
    safeSet("galleryTitle", DB.galleryTitle[LANG]);
    safeSet("locationTitle", DB.locationTitle[LANG]);
    safeSet("orderButton", DB.orderModule.orderButton[LANG]);
    
    const contact = DB.contact[LANG];
    safeSet("contactAddress", contact.address);
    safeSet("contactPhone", contact.phone);

    renderMenu();
    renderGallery();
}

function renderMenu() {
    const container = document.getElementById("menuContainer");
    if (!container) return;
    container.innerHTML = DB.menu.map(cat => `
        <div class="menu-card reveal">
            <h3>${cat.name[LANG]}</h3>
            <div class="menu-items">
                ${cat.items.map(item => {
                    if (item.type === "complex") {
                        return `<div class="menu-item"><strong>${item.title[LANG]}</strong></div>` + 
                               item.options.map(op => `
                                <div class="menu-item">
                                    <span class="item-name">${op[LANG]}</span>
                                    <span class="item-dots"></span>
                                    <span class="item-price">€${op.price}</span>
                                </div>`).join('');
                    }
                    return `
                        <div class="menu-item">
                            <span class="item-name">${item[LANG]}</span>
                            <span class="item-dots"></span>
                            <span class="item-price">€${item.price}</span>
                        </div>`;
                }).join('')}
            </div>
        </div>
    `).join('');
    initReveal();
}

/* --- 3. 画廊核心 --- */
function renderGallery() {
    const container = document.getElementById("galleryContainer");
    container.innerHTML = DB.gallery.map((img, i) => `
        <div class="gallery-slide-item" onclick="handleGalleryClick(${i}, this)">
            <img src="images/${img}" alt="Gallery">
        </div>
    `).join('');
    setupDynamicDepth();
}

function handleGalleryClick(index, el) {
    if (el.classList.contains('is-active')) {
        openFullImage(index);
    } else {
        const container = document.getElementById("galleryContainer");
        container.scrollTo({
            left: el.offsetLeft - (container.offsetWidth / 2 - el.offsetWidth / 2),
            behavior: 'smooth'
        });
    }
}

function setupDynamicDepth() {
    const container = document.getElementById("galleryContainer");
    if (!container) return;

    const update = () => {
        const items = document.querySelectorAll('.gallery-slide-item');
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            
            // 判断中心点距离，距离容器中轴线最近的设为激活
            if (Math.abs(centerX - itemCenter) < rect.width / 2) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
    };

    container.addEventListener('scroll', update);
    // 初始化时触发一次
    setTimeout(update, 500);
}
function moveGallery(direction) {
    const container = document.getElementById("galleryContainer");
    if (!container) return;
    
    // 计算单张图片的宽度（含 gap）
    const scrollAmount = container.offsetWidth / 3; 
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}
/* --- 4. 灯箱逻辑 --- */
let currentImgIndex = 0;
function openFullImage(index) {
    currentImgIndex = index;
    const overlay = document.getElementById("imageOverlay");
    document.getElementById("overlayImg").src = `images/${DB.gallery[index]}`;
    overlay.style.display = "flex";
    setTimeout(() => overlay.classList.add('active'), 10);
}

function openFullImage(index) {
    currentImgIndex = index;
    const overlay = document.getElementById("imageOverlay");
    const img = document.getElementById("overlayImg");
    
    img.src = `images/${DB.gallery[index]}`;
    overlay.style.display = "flex";
    
    // 强制刷新光标层级（部分浏览器需要）
    const cursor = document.querySelector('.cursor');
    if(cursor) cursor.style.zIndex = "200001"; 

    setTimeout(() => overlay.classList.add('active'), 10);
}

function closeImage() {
    const overlay = document.getElementById("imageOverlay");
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = "none";
        // 恢复正常光标层级
        document.querySelector('.cursor').style.zIndex = "100000";
    }, 400);
}

function changeFullImage(dir, e) {
    e.stopPropagation();
    currentImgIndex = (currentImgIndex + dir + DB.gallery.length) % DB.gallery.length;
    document.getElementById("overlayImg").src = `images/${DB.gallery[currentImgIndex]}`;
}

/* --- 5. 初始化 --- */
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

window.addEventListener('DOMContentLoaded', () => {
    renderWebsite();
    initCursor();
    document.body.classList.remove('loading');
});

window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('done'), 1000);
});
