/* --- 全局变量 --- */
let LANG = "gr"; 
let currentImgIndex = 0;

/* --- 1. 光标逻辑 --- */
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
        const isClickable = target.closest('a, button, .lang-switcher span, .logo-group, .nav-item, .category-header, .lb-btn, .gallery-slide-item');

        if (isClickable) {
            cursor.classList.add('is-hovering');
            follower.classList.add('is-hovering');
        } else {
            cursor.classList.remove('is-hovering');
            follower.classList.remove('is-hovering');
        }
    });
}

/* --- 2. 精准跳转 --- */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-item, .logo-group');
    navLinks.forEach(link => {
        link.onclick = function(e) {
            let targetId = this.getAttribute('href');
            if (!targetId && this.classList.contains('logo-group')) targetId = "body";
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight;
                const offset = headerHeight + 20;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                if(targetId !== "body") window.history.pushState(null, null, targetId);
            }
        };
    });
}

/* --- 3. 核心渲染 --- */
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

    if (typeof DB !== 'undefined') {
        // 1. 获取 restaurant 核心数据
        const info = DB.restaurant; 

        // 基础信息渲染
        safeSet("welcome", info.welcome[LANG]);
        safeSet("slogan", info.slogan[LANG]);
        safeSet("openingText", info.opening[LANG]);
        safeSet("buffetTime", info.buffetTime[LANG]);
        safeSet("buffetPrice", info.buffetPrice[LANG]);
        
        // 2. 修正：这些标题直接在 DB 下，不在 restaurant 下
        safeSet("menuTitle", DB.menuTitle[LANG]);
        safeSet("galleryTitle", DB.galleryTitle[LANG]);
        safeSet("locationTitle", DB.locationTitle[LANG]);
        
        // 3. 按钮渲染
        const orderBtn = document.getElementById("orderButton");
        if (orderBtn && info.orderModule) {
            orderBtn.innerText = info.orderModule.orderButton[LANG] || "ORDER ONLINE";
        }

        // 4. 【核心修复点】联系方式渲染
        // 你的数据结构是 DB.restaurant.contact[LANG].address
        if (info.contact && info.contact[LANG]) {
            const contactData = info.contact[LANG];
            safeSet("contactAddress", contactData.address);
            safeSet("contactPhone", contactData.phone);
        }
    }

    // 渲染其他组件
    renderMenu();
    renderGallery();
    initSmoothScroll();
    initReveal();
}

function renderMenu() {
    const container = document.getElementById("menuContainer");
    if (!container || typeof DB === 'undefined' || !DB.menu) return;

    container.innerHTML = DB.menu.map(cat => `
        <div class="menu-card reveal">
            <h3 class="category-header" onclick="toggleMenuCategory(this)">
                ${cat.name[LANG]}
                <span class="arrow-icon"></span>
            </h3>
            <div class="menu-items-wrapper" style="max-height: 0; overflow: hidden; transition: all 0.5s ease;">
                <div class="menu-items">
                    ${cat.items.map(item => {
                        // 增加对 10. 包子 (complex 类型) 的兼容渲染
                        if (item.type === 'complex') {
                            return `
                                <div class="menu-item-complex" style="margin-bottom: 15px;">
                                    <div class="item-name" style="font-weight: 500; margin-bottom: 5px;">${item.title[LANG]}</div>
                                    ${item.options.map(opt => `
                                        <div class="menu-item sub-option" style="padding-left: 15px; border-bottom: 1px dashed #333;">
                                            <span class="item-name">${opt[LANG]}</span>
                                            <span class="item-dots"></span>
                                            <span class="item-price">€${opt.price}</span>
                                        </div>
                                    `).join('')}
                                </div>`;
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

/* --- 4. 交互工具 --- */
function toggleMenuCategory(headerElement) {
    const wrapper = headerElement.nextElementSibling;
    const isActive = headerElement.classList.contains('active');
    
    document.querySelectorAll('.category-header').forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.style.maxHeight = "0px";
    });

    if (!isActive) {
        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        headerElement.classList.add('active');
    }
}

function moveGallery(direction) {
    const container = document.getElementById("galleryContainer");
    if (container) container.scrollBy({ left: direction * 300, behavior: 'smooth' });
}

function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if(entry.isIntersecting) entry.target.classList.add('is-visible'); 
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* --- 5. 画廊逻辑 --- */
function renderGallery() {
    const container = document.getElementById("galleryContainer");
    if (!container || typeof DB === 'undefined') return;
    
    // 修正 gallery 路径，它在 info (restaurant) 里面
    const galleryData = DB.restaurant.gallery;
    if(!galleryData) return;

    container.innerHTML = galleryData.map((img, i) => `
        <div class="gallery-slide-item" onclick="handleGalleryClick(${i}, this)">
            <img src="images/${img}" alt="Gallery">
        </div>
    `).join('');
    setupDynamicDepth();
}

function handleGalleryClick(index, el) {
    if (el.classList.contains('is-active')) openFullImage(index);
    else {
        const container = document.getElementById("galleryContainer");
        container.scrollTo({
            left: el.offsetLeft - (container.offsetWidth / 2 - el.offsetWidth / 2),
            behavior: 'smooth'
        });
    }
}

function openFullImage(index) {
    currentImgIndex = index;
    const galleryData = DB.restaurant.gallery;
    const overlay = document.getElementById("imageOverlay");
    const img = document.getElementById("overlayImg");
    img.src = `images/${galleryData[index]}`;
    overlay.style.display = "flex";
    setTimeout(() => overlay.classList.add('active'), 10);
}

function closeImage() {
    const overlay = document.getElementById("imageOverlay");
    overlay.classList.remove('active');
    setTimeout(() => { overlay.style.display = "none"; }, 400);
}

function setupDynamicDepth() {
    const container = document.getElementById("galleryContainer");
    if (!container) return;
    const update = () => {
        const items = document.querySelectorAll('.gallery-slide-item');
        const centerX = container.getBoundingClientRect().left + container.offsetWidth / 2;
        items.forEach(item => {
            const itemCenter = item.getBoundingClientRect().left + item.offsetWidth / 2;
            item.classList.toggle('is-active', Math.abs(centerX - itemCenter) < item.offsetWidth / 3);
        });
    };
    container.addEventListener('scroll', update);
    setTimeout(update, 500);
}

/* --- 6. 全局生命周期 --- */
window.addEventListener('DOMContentLoaded', () => {
    renderWebsite();
    initCursor();
    
    const map = document.getElementById("googleMap");
    if (map) {
        // 更新为正确的 Google Maps Embed 链接格式（示例，需填入你的具体地标）
        map.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3146.123456789!2d23.712345678!3d37.945678901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd1440000001%3A0x1234567890abcdef!2zTGVvZi4gQW5kcmVhIFNpZ2dyb3UgMjA3LCBOZWEgU215cm5pIDE3MSAyMQ!5e0!3m2!1sen!2sgr!4v1710000000000!5m2!1sen!2sgr";
    }
    document.body.classList.remove('loading');
});

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
});

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader) setTimeout(() => loader.classList.add('done'), 800);
});
