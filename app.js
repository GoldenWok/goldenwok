let LANG = "gr";
let currentImgIndex = 0;

/* --- 1. 光标逻辑 (性能优化版) --- */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        requestAnimationFrame(() => {
            cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
            follower.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        });

        const target = e.target;
        const isClickable = target.closest('a, button, .lang span, .logo-group, .nav-item, .category-header, .lb-btn, .gallery-slide-item, #overlayImg');

        if (isClickable) {
            cursor.classList.add('is-hovering');
            follower.classList.add('is-hovering');
        } else {
            cursor.classList.remove('is-hovering');
            follower.classList.remove('is-hovering');
        }
    });

    window.addEventListener('mousedown', () => cursor.style.transform += ' scale(0.7)');
    window.addEventListener('mouseup', () => cursor.style.transform = cursor.style.transform.replace(' scale(0.7)', ''));
}

/* --- 2. 精准跳转逻辑 (唯一版本) --- */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-item, .logo-group');

    navLinks.forEach(link => {
        link.onclick = function(e) {
            // 获取目标 ID (针对 logo-group 默认回顶)
            let targetId = this.getAttribute('href');
            if (!targetId && this.classList.contains('logo-group')) targetId = "body";
            
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                e.preventDefault();
                e.stopPropagation();

                // 动态计算 Offset：Header 的高度 + 额外间距
                const headerHeight = document.getElementById('header').offsetHeight;
                const offset = headerHeight + 20; 
                
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新 URL 不跳转
                if(targetId !== "body") window.history.pushState(null, null, targetId);
            }
        };
    });
}

/* --- 3. 渲染逻辑 --- */
function setLang(lang) {
    LANG = lang;
    document.body.style.opacity = "0";
    setTimeout(() => {
        renderWebsite();
        document.body.style.opacity = "1";
    }, 400);
}

function renderWebsite() {
    const safeSet = (id, val) => { 
        const el = document.getElementById(id);
        if (el && val !== undefined) el.innerText = val; 
    };

    // 基础文字渲染
    if (window.DB) {
        safeSet("welcome", DB.welcome[LANG]);
        safeSet("slogan", DB.slogan[LANG]);
        safeSet("openingText", DB.opening[LANG]);
        safeSet("buffetTime", DB.buffetTime[LANG]);
        safeSet("buffetPrice", DB.buffetPrice[LANG]);
        safeSet("menuTitle", DB.menuTitle[LANG]);
        safeSet("galleryTitle", DB.galleryTitle[LANG]);
        safeSet("locationTitle", DB.locationTitle[LANG]);
        
        // 修复点餐按钮：同时设置文字和链接
        const orderBtn = document.getElementById("orderButton");
        if (orderBtn && DB.orderModule) {
            orderBtn.innerText = DB.orderModule.orderButton[LANG] || "ORDER ONLINE";
            if (DB.orderModule.link) orderBtn.href = DB.orderModule.link;
        }

        const contact = DB.contact[LANG];
        if (contact) {
            safeSet("contactAddress", contact.address);
            safeSet("contactPhone", contact.phone);
        }
    }

    // 渲染组件
    renderMenu();
    renderGallery();
    initSmoothScroll();
    initCursor();
}
function renderMenu() {
    const container = document.getElementById("menuContainer");
    if (!container || !window.DB || !DB.menu) return;

    container.innerHTML = DB.menu.map(cat => `
        <div class="menu-card reveal">
            <h3 class="category-header" onclick="toggleMenuCategory(this)">
                ${cat.name[LANG]}
                <span class="arrow-icon"></span>
            </h3>
            <div class="menu-items-wrapper" style="max-height: 0; overflow: hidden; transition: all 0.5s ease;">
                <div class="menu-items">
                    ${cat.items.map(item => {
                        if (item.type === "complex") {
                            return `<div class="menu-item-group"><strong>${item.title[LANG]}</strong></div>` + 
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
        </div>
    `).join('');
}

/* --- 4. 画廊与灯箱 --- */
function renderGallery() {
    const container = document.getElementById("galleryContainer");
    if (!container) return;
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

function openFullImage(index) {
    currentImgIndex = index;
    const overlay = document.getElementById("imageOverlay");
    const img = document.getElementById("overlayImg");
    
    img.src = `images/${DB.gallery[index]}`;
    overlay.style.display = "flex";

    // 保证光标在最前
    const c1 = document.querySelector('.cursor');
    const c2 = document.querySelector('.cursor-follower');
    document.body.appendChild(c1);
    document.body.appendChild(c2);

    setTimeout(() => overlay.classList.add('active'), 10);
}

function closeImage() {
    const overlay = document.getElementById("imageOverlay");
    overlay.classList.remove('active');
    setTimeout(() => { overlay.style.display = "none"; }, 400);
}
function moveGallery(direction) {
    const container = document.getElementById("galleryContainer");
    if (!container) return;
    // 每次滑动 300px
    container.scrollBy({
        left: direction * 300,
        behavior: 'smooth'
    });
}

function changeFullImage(direction, event) {
    if (event) event.stopPropagation();
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

/* --- 5. 交互工具 --- */
function toggleMenuCategory(headerElement) {
    const wrapper = headerElement.nextElementSibling;
    const isActive = headerElement.classList.contains('active');
    
    // 关闭其他已打开的 (可选)
    document.querySelectorAll('.category-header').forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.style.maxHeight = "0px";
    });

    if (!isActive) {
        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        headerElement.classList.add('active');
    }
}
function setupDynamicDepth() {
    const container = document.getElementById("galleryContainer");
    if (!container) return;
    const update = () => {
        const items = document.querySelectorAll('.gallery-slide-item');
        const centerX = container.getBoundingClientRect().left + container.offsetWidth / 2;
        items.forEach(item => {
            const itemCenter = item.getBoundingClientRect().left + item.offsetWidth / 2;
            if (Math.abs(centerX - itemCenter) < item.offsetWidth / 3) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
    };
    container.addEventListener('scroll', update);
    setTimeout(update, 500);
}

function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* --- 6. 全局生命周期 --- */
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

window.addEventListener('DOMContentLoaded', () => {
    renderWebsite();
    document.body.classList.remove('loading');
});

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader) setTimeout(() => loader.classList.add('done'), 1000);
});
