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
function renderGallery() {
    const container = document.getElementById("galleryContainer");
    if (!container || !DB.gallery) return;

    container.innerHTML = DB.gallery.map(imgName => `
        <div class="gallery-slide-item" onclick="handleGalleryClick(this, event, 'images/${imgName}')">
            <img data-src="images/${imgName}" 
                 src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                 class="lazy-img" alt="Golden Wok">
        </div>
    `).join('');

    initLazyLoading();
    setupActiveEffect();
}

function handleGalleryClick(el, event, fullSrc) {
    // 如果点击的是已经居中的图片，则放大
    if (el.classList.contains('is-active')) {
        openFullImage(fullSrc);
    } else {
        // 如果点击的是侧边图片，则先把它推到中间
        scrollToElement(el);
    }
}

function openFullImage(src) {
    const overlay = document.getElementById("imageOverlay");
    const img = document.getElementById("overlayImg");
    img.src = src;
    overlay.style.display = "flex";
    setTimeout(() => overlay.classList.add('active'), 10);
}

function closeImage() {
    const overlay = document.getElementById("imageOverlay");
    overlay.classList.remove('active');
    setTimeout(() => overlay.style.display = "none", 400);
}

// 需求 4：按钮点击也能找到“下一张”并居中
function moveGallery(direction) {
    const container = document.getElementById("galleryContainer");
    const activeItem = document.querySelector('.gallery-slide-item.is-active');
    
    if (activeItem) {
        const target = direction > 0 ? activeItem.nextElementSibling : activeItem.previousElementSibling;
        if (target) {
            scrollToElement(target);
        } else {
            // 如果到头了，循环回到开始或结尾
            const allItems = document.querySelectorAll('.gallery-slide-item');
            scrollToElement(direction > 0 ? allItems[0] : allItems[allItems.length - 1]);
        }
    }
}
// 需求 4：按钮移动逻辑
function moveGallery(direction) {
    const container = document.getElementById("galleryContainer");
    // 每次移动一个视口的 40%，实现丝滑切换
    const moveDistance = container.offsetWidth * 0.4;
    container.scrollBy({ left: direction * moveDistance, behavior: 'smooth' });
}

function setupDynamicDepth() {
    const container = document.getElementById("galleryContainer");
    if (!container) return;

    const updateDepth = () => {
        const items = document.querySelectorAll('.gallery-slide-item');
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        items.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            
            // 计算图片中心距离容器中心的百分比 (0 到 1)
            const distanceFromCenter = Math.abs(containerCenter - itemCenter);
            const normalizedDistance = Math.min(distanceFromCenter / (containerRect.width / 1.5), 1);

            // 1. 中间 (激活态)
            if (normalizedDistance < 0.15) {
                item.classList.add('is-active');
                item.classList.remove('is-side-1', 'is-side-2');
                item.style.zIndex = "100";
            } 
            // 2. 左右两边稍小一点
            else if (normalizedDistance < 0.3) {
                item.classList.remove('is-active', 'is-side-2');
                item.classList.add('is-side-1');
                item.style.zIndex = "50"; // 层级稍低
            }
            // 3. 更左右两边变得更小
            else {
                item.classList.remove('is-active', 'is-side-1');
                item.classList.add('is-side-2');
                item.style.zIndex = "10"; // 层级最低
            }
        });
    };

    // 监听滚动，实时计算
    container.addEventListener('scroll', updateDepth);
    // 初始化
    setTimeout(updateDepth, 100);
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

// 在 app.js 中替换或添加
const slider = document.getElementById('galleryContainer');
let isDragging = false;
let startX, scrollLeft;

if (slider) {
    // 1. 鼠标拖拽逻辑
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        slider.style.scrollBehavior = 'auto'; // 拖拽时关闭平滑，防止“跟不上”
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseup', () => {
        isDragging = false;
        slider.style.scrollBehavior = 'smooth'; // 释放后恢复平滑
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // 调整滑动灵敏度
        slider.scrollLeft = scrollLeft - walk;
    });

    // 2. 需求 3：点击图片自动将其推到正中间
    slider.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-slide-item');
        if (item && !isDragging) {
            scrollToElement(item);
        }
    });
}

function scrollToElement(el) {
    const container = document.getElementById("galleryContainer");
    const containerCenter = container.offsetWidth / 2;
    const elCenter = el.offsetLeft + (el.offsetWidth / 2);
    container.scrollTo({
        left: elCenter - containerCenter,
        behavior: 'smooth'
    });
}
// 在你的 setupActiveEffect 函数中确保有这一行
function setupActiveEffect() {
    const container = document.getElementById("galleryContainer");
    
    const updateActive = () => {
        const items = document.querySelectorAll('.gallery-slide-item');
        const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            
            if (Math.abs(containerCenter - itemCenter) < 100) {
                item.classList.add('is-active');
                // 确保 JS 也能辅助锁定层级
                item.style.zIndex = "100";
            } else {
                item.classList.remove('is-active');
                item.style.zIndex = "1";
            }
        });
    };

    container.addEventListener('scroll', updateActive);
}
