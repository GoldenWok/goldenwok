/* =========================================
   1. 初始化与自定义光标 (Luxury Cursor)
   ========================================= */
let LANG = "gr"; 

// 获取光标元素
/* =========================================
   修正版：自定义光标逻辑 (Refined Precision Cursor)
   ========================================= */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
    // 监听鼠标移动，实现中心对齐
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // 使用 translate(-50%, -50%) 确保圆心对齐鼠标尖
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        follower.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    });

    // 为交互元素添加悬停效果 (金色变白的关键触发点)
    // 这里的选择器包含了点餐按钮 (.cta-gold-btn) 和语言切换
    const interactive = document.querySelectorAll('a, button, .cta-gold-btn, .lang span, .menu-item');
    interactive.forEach(el => {
        // 使用 mouseenter 和 mouseleave
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

// 切换语言函数
function setLang(lang) {
    LANG = lang;
    document.body.style.opacity = "0"; // 优雅转场
    setTimeout(() => {
        renderWebsite();
        document.body.style.opacity = "1";
    }, 450);
}

/* =========================================
   2. 核心渲染逻辑
   ========================================= */
function renderWebsite() {
    const safeSet = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val || "";
    };

    safeSet("siteTitle", DB.restaurant?.[LANG]);
    safeSet("welcome", DB.welcome?.[LANG]);
    safeSet("slogan", DB.slogan?.[LANG]);
    safeSet("orderTitle", DB.orderModule?.title?.[LANG]);
    safeSet("openingText", DB.opening?.[LANG]);
    safeSet("buffetTime", DB.buffetTime?.[LANG]);
    safeSet("buffetPrice", DB.buffetPrice?.[LANG]);
    safeSet("orderButton", DB.orderModule?.orderButton?.[LANG]);
    safeSet("menuTitle", DB.menuTitle?.[LANG]);
    safeSet("galleryTitle", DB.galleryTitle?.[LANG]);
    safeSet("locationTitle", DB.locationTitle?.[LANG]);
    
    const contact = DB.contact?.[LANG];
    if (contact) {
        safeSet("contactAddress", contact.address);
        safeSet("contactPhone", contact.phone);
    }

    // --- 核心修复：更正拼写并确保顺序 ---
    renderGallery(); // 确保这里拼写正确
    renderMenu();

    // 重新绑定交互监听，确保新生成的图片也能触发光标变白
    initCursorHover(); 
}

/* =========================================
   3. 菜单与滚动渐显逻辑
   ========================================= */
// 滚动观察器配置
// 在 app.js 的 revealObserver 部分修改
const observerOptions = {
    threshold: 0.05, // 降低阈值，手机上一露头就显示
    rootMargin: "0px 0px 50px 0px" 
};

// 增加一个防御逻辑：如果 3 秒后还没显示，强制显示（防止脚本卡死）
setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('is-visible');
    });
}, 3000);
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

/* =========================================
   修正版：全量渲染横向滑块 (全量、无分页)
   ========================================= */
// 渲染画廊
// 修改渲染函数中的 onclick
// 全局变量，记录当前放大图片的索引
let currentImgIndex = 0;

function renderGallery() {
    const container = document.getElementById("galleryContainer");
    if (!container || !DB.gallery) return;

    container.innerHTML = DB.gallery.map((imgName, index) => `
        <div class="gallery-slide-item" onclick="handleGalleryClick(${index}, this)">
            <img src="images/${imgName}" class="lazy-img" alt="Gallery Image">
        </div>
    `).join('');

    // 核心修复：直接调用你写的 setupDynamicDepth，不再调用 setupActiveEffect
    setupDynamicDepth(); 
}

// 核心逻辑：点击判断
function handleGalleryClick(index, el) {
    if (el.classList.contains('is-active')) {
        // 如果点的是中间图，放大
        openFullImage(index);
    } else {
        // 如果点的是旁边的图，居中它
        scrollToElement(el);
    }
}

// 辅助函数：居中滚动
function scrollToElement(el) {
    const container = document.getElementById("galleryContainer");
    const containerCenter = container.offsetWidth / 2;
    const elLeft = el.offsetLeft;
    const elWidth = el.offsetWidth;

    container.scrollTo({
        left: elLeft - (containerCenter - elWidth / 2),
        behavior: 'smooth'
    });
}

// 放大灯箱逻辑
function openFullImage(index) {
    currentImgIndex = index;
    const overlay = document.getElementById("imageOverlay");
    const img = document.getElementById("overlayImg");
    
    img.src = `images/${DB.gallery[currentImgIndex]}`;
    overlay.style.display = "flex";
    setTimeout(() => overlay.classList.add('active'), 10);
}

// 灯箱内的左右切换 (新增)
function changeFullImage(direction, event) {
    if (event) event.stopPropagation(); // 防止点击按钮时关闭了灯箱
    
    currentImgIndex = (currentImgIndex + direction + DB.gallery.length) % DB.gallery.length;
    const img = document.getElementById("overlayImg");
    img.src = `images/${DB.gallery[currentImgIndex]}`;
}

function closeImage() {
    const overlay = document.getElementById("imageOverlay");
    overlay.classList.remove('active');
    setTimeout(() => overlay.style.display = "none", 400);
}

// 外部按钮移动：每次移动一个图片身位
function moveGallery(direction) {
    const container = document.getElementById("galleryContainer");
    const activeItem = document.querySelector('.gallery-slide-item.is-active');
    
    if (activeItem) {
        const target = direction > 0 ? activeItem.nextElementSibling : activeItem.previousElementSibling;
        if (target) {
            scrollToElement(target);
        }
    }
}
function initCursorHover() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    // 重新获取所有交互元素，包括刚生成的图片和菜单
    const interactive = document.querySelectorAll('a, button, .cta-gold-btn, .lang span, .menu-item, .lazy-img');
    
    interactive.forEach(el => {
        el.style.cursor = 'none'; // 强制隐藏原生光标
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}
function initLazyLoading() {
    const images = document.querySelectorAll('.lazy-img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // 替换占位图
                img.onload = () => img.classList.add('loaded'); // 加载完后再显示
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "0px 0px 200px 0px" }); // 提前 200px 开始加载

    images.forEach(img => imageObserver.observe(img));
}

// 记得在 renderWebsite() 中调用 renderGallery();

function renderMenu() {
    const container = document.getElementById("menuContainer");
    if (!container || !DB.menu) return;
    container.innerHTML = "";

    DB.menu.forEach((cat) => {
        const card = document.createElement("div");
        card.className = "menu-card reveal"; // 赋予 reveal 类名

        let html = `<h3>${cat.name[LANG]}</h3>`;
        html += `<div class="menu-items">`;
        cat.items.forEach(item => {
            if (item.type === "complex") {
                html += `<div class="menu-item"><strong>${item.title[LANG]}</strong></div>`;
                item.options.forEach(op => {
                    html += `
                    <div class="menu-item">
                        <span class="item-name">${op[LANG]}</span>
                        <span class="item-dots"></span>
                        <span class="item-price">€${op.price}</span>
                    </div>`;
                });
            } else {
                html += `
                <div class="menu-item">
                    <span class="item-name">${item[LANG]}</span>
                    <span class="item-dots"></span>
                    <span class="item-price">€${item.price}</span>
                </div>`;
            }
        });
        html += `</div>`;
        card.innerHTML = html;
        container.appendChild(card);
        
        // 绑定观察器
        revealObserver.observe(card);
    });
}

/* =========================================
   4. 视差滚动核心逻辑
   ========================================= */
const parallaxItems = document.querySelectorAll('.parallax-item');
if(parallaxItems.length > 0){
    window.addEventListener('scroll', () => {
        parallaxItems.forEach(item => {
            const depth = item.dataset.depth || 0.2; // 默认视差系数
            const movement = window.pageYOffset * depth;
            item.style.transform = `translate3d(0, ${movement}px, 0)`;
        });
    });
}

// 头部滚动效果
const header = document.getElementById('header');
if(header){
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* =========================================
   5. 启动
   ========================================= */
window.addEventListener("DOMContentLoaded", () => {
    // 初始化页面内容
    renderWebsite();
    
    // 初始化其他滚动元素观察
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
    // 优雅加载
    document.body.classList.remove('loading');
});

window.addEventListener("load", () => {
    const loader = document.getElementById('loader');
    // 延迟 1 秒关闭，确保加载动画被看到，增加仪式感
    setTimeout(() => {
        if(loader) loader.classList.add('done');
    }, 1000);
});

// 强制所有新生成的元素也不显示光标
document.querySelectorAll('*').forEach(el => {
    el.style.cursor = 'none';
});

// 特别针对 e-food 按钮
const orderBtn = document.getElementById('orderButton');
if (orderBtn) {
    orderBtn.style.setProperty('cursor', 'none', 'important');
}

let currentPhotoIndex = 0;
const photos = ["img1.jpg", "img2.jpg", "img3.jpg"]; // 替换为你的真实路径

/* =========================================
   6. 补全缺失的画廊动态效果与灯箱逻辑
   ========================================= */

// 修复：定义 setupDynamicDepth，解决 Uncaught ReferenceError
function setupDynamicDepth() {
    const container = document.getElementById("galleryContainer");
    if (!container) return;

    const updateDepth = () => {
        const items = document.querySelectorAll('.gallery-slide-item');
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        items.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            
            // 计算图片中心距离容器中心的距离
            const distanceFromCenter = Math.abs(containerCenter - itemCenter);

            // 如果距离中心小于 150 像素，判定为激活状态
            if (distanceFromCenter < 150) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
    };

    // 监听滚动事件
    container.addEventListener('scroll', updateDepth);
    // 初始化执行一次
    setTimeout(updateDepth, 100);
}

// 修复：统一灯箱逻辑（将 openFullImage 与 photos 数组关联）
// 注意：这里直接使用 DB.gallery，不再需要手动写 photos 数组
function openFullImage(index) {
    currentImgIndex = index;
    const overlay = document.getElementById("imageOverlay");
    const img = document.getElementById("overlayImg");
    
    if (overlay && img && DB.gallery[index]) {
        img.src = `images/${DB.gallery[index]}`;
        overlay.style.display = "flex";
        setTimeout(() => overlay.classList.add('active'), 10);
    }
}

// 修复：统一灯箱切换逻辑
function changeFullImage(direction, event) {
    if (event) event.stopPropagation();
    
    currentImgIndex = (currentImgIndex + direction + DB.gallery.length) % DB.gallery.length;
    const img = document.getElementById("overlayImg");
    if (img) {
        img.src = `images/${DB.gallery[currentImgIndex]}`;
    }
}
