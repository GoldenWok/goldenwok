let LANG = "gr";

/* --- 1. 光标逻辑 (事件委托版) --- */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    // 1. 移动跟随
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        // 使用 translate3d 性能更好
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        follower.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    });

    // 2. 智能变色：使用事件委托监听所有“可点击”元素
    document.body.addEventListener('mouseover', (e) => {
        // 判定条件：a标签、button、语言切换、菜单项、画廊图片、灯箱按钮
        const isClickable = e.target.closest('a, button, .lang span, .gallery-slide-item, .menu-item, .lb-btn, #overlayImg');
        
        if (isClickable) {
            cursor.classList.add('white-mode');
            follower.classList.add('white-mode');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        cursor.classList.remove('white-mode');
        follower.classList.remove('white-mode');
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

/* --- 1. 画廊左右按钮修复 --- */
function moveGallery(direction) {
    const container = document.getElementById("galleryContainer");
    if (!container) return;

    // 每次移动大约 1/3 容器宽度的距离
    const scrollStep = container.offsetWidth / 3;
    container.scrollBy({
        left: direction * scrollStep,
        behavior: 'smooth'
    });
}

/* --- 2. 增强版灯箱开启函数 --- */
function openFullImage(index) {
    currentImgIndex = index;
    const overlay = document.getElementById("imageOverlay");
    const img = document.getElementById("overlayImg");
    
    if (img && DB.gallery[index]) {
        img.src = `images/${DB.gallery[index]}`;
        overlay.style.display = "flex";
        
        // 极致兼容：确保进入全屏瞬间原生光标消失
        document.body.style.cursor = 'none'; 
        
        setTimeout(() => overlay.classList.add('active'), 10);
    }
}

/* --- 3. 灯箱内左右切换修复 --- */
function changeFullImage(direction, event) {
    if (event) event.stopPropagation(); // 阻止点击箭头关闭灯箱
    
    currentImgIndex = (currentImgIndex + direction + DB.gallery.length) % DB.gallery.length;
    const img = document.getElementById("overlayImg");
    
    if (img) {
        img.style.opacity = "0";
        setTimeout(() => {
            img.src = `images/${DB.gallery[currentImgIndex]}`;
            img.style.opacity = "1";
        }, 200);
    }
}

/* --- 4. 动态透明度与激活状态 --- */
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
            
            // 如果图片中心接近容器中心
            if (Math.abs(centerX - itemCenter) < rect.width / 3) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
    };

    container.addEventListener('scroll', update);
    // 初始化
    setTimeout(update, 500);
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



function closeImage() {
    const overlay = document.getElementById("imageOverlay");
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = "none";
        // 恢复正常光标层级
        document.querySelector('.cursor').style.zIndex = "100000";
    }, 400);
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
