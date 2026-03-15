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
        if (el && val !== undefined) {
            el.innerText = val; 
        } 
    };

    if (typeof DB === 'undefined') return;

    // --- 核心逻辑：根据你提供的 config.js 结构精确取值 ---

    // 1. 顶部 Logo/名字 (直接取自 DB.restaurant)
    const logoName = DB.restaurant ? DB.restaurant[LANG] : "GOLDEN WOK";
    // 如果你有 logo 相关的 ID 可以设置在这里

    // 2. 基础文字渲染 (这些属性在 DB 根目录下)
    safeSet("welcome", DB.welcome ? DB.welcome[LANG] : "");
    safeSet("slogan", DB.slogan ? DB.slogan[LANG] : "");
    safeSet("openingText", DB.opening ? DB.opening[LANG] : "");
    safeSet("buffetTime", DB.buffetTime ? DB.buffetTime[LANG] : "");
    safeSet("buffetPrice", DB.buffetPrice ? DB.buffetPrice[LANG] : "");
    
    // 3. 标题渲染 (平级属性)
    safeSet("menuTitle", DB.menuTitle ? DB.menuTitle[LANG] : "");
    safeSet("galleryTitle", DB.galleryTitle ? DB.galleryTitle[LANG] : "");
    safeSet("locationTitle", DB.locationTitle ? DB.locationTitle[LANG] : "");
    
    // 4. 按钮渲染 (在 orderModule 内部)
    if (DB.orderModule && DB.orderModule.orderButton) {
        safeSet("orderButton", DB.orderModule.orderButton[LANG]);
    }

    // 5. 联系方式渲染 (结构：DB.contact[LANG].address)
    if (DB.contact && DB.contact[LANG]) {
        const contactInfo = DB.contact[LANG];
        safeSet("contactAddress", contactInfo.address);
        safeSet("contactPhone", contactInfo.phone);
    }

    // --- 启动子组件 ---
    try {
        renderMenu();
        renderGallery();
        initSmoothScroll();
        initReveal();
    } catch (e) { console.error("渲染组件时出错:", e); }

    // --- 强制解除加载锁定 ---
    document.body.classList.remove('loading');
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('done');
    
    // 强制显示 reveal 元素
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }, 200);
}
function renderMenu() {
    const container = document.getElementById("menuContainer");
    if (!container || typeof DB === 'undefined' || !DB.menu) return;

    container.innerHTML = "";

    const menuHtml = DB.menu.map(cat => `
        <div class="menu-category-group reveal">
            <h3 class="category-header">
                ${cat.name[LANG]}
            </h3>
            <div class="menu-items">
                ${cat.items.map(item => {
                    if (item.type === 'complex') {
                        return `
                            <div class="menu-item-complex" style="margin-bottom: 25px;">
                                <strong style="display:block; color:#fff; font-weight:200; margin-bottom:10px; letter-spacing:1px;">
                                    ${item.title[LANG]}
                                </strong>
                                ${item.options.map(opt => `
                                    <div class="menu-item">
                                        <span class="item-name">${opt[LANG]}</span>
                                        <span class="item-dots"></span>
                                        <span class="item-price">€${opt.price}</span>
                                    </div>
                                `).join('')}
                            </div>`;
                    }
                    // 修改点 2：确保读取的是 item[LANG]，这是你普通菜品的名字
                    return `
                        <div class="menu-item">
                            <span class="item-name">${item[LANG] || ""}</span>
                            <span class="item-dots"></span>
                            <span class="item-price">€${Number(item.price).toFixed(2)}</span>
                        </div>`;
                }).join('')}
            </div>
        </div>
    `).join('');

    container.innerHTML = menuHtml;

    // 修改点 3：确保 revealObserver (旧版变量名) 重新扫描新元素
    setTimeout(() => {
        if (typeof revealObserver !== 'undefined') {
            document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        } else if (typeof initReveal === 'function') {
            initReveal();
        }
    }, 100);
}

/* --- 统一动画初始化函数 --- */
function initReveal() {
    const observerOptions = {
        threshold: 0.1, // 元素出现 10% 时触发
        rootMargin: "0px 0px -50px 0px" // 提前或延迟触发
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // 触发后停止观察，提升性能
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 重新扫描页面上所有的 reveal 元素
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
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

/* --- 5. 画廊逻辑 --- */
function renderGallery() {
    const container = document.getElementById("galleryContainer");
    if (!container || typeof DB === 'undefined') return;

    // 尝试两个可能的路径：直接在 DB 下，或者在 DB.restaurant 下
    const galleryData = DB.gallery || (DB.restaurant && DB.restaurant.gallery);
    
    if (!galleryData || !Array.isArray(galleryData)) {
        console.warn("未找到画廊图片数据");
        return;
    }

    container.innerHTML = galleryData.map((img, i) => `
        <div class="gallery-slide-item" onclick="handleGalleryClick(${i}, this)">
            <img src="images/${img}" alt="Gallery ${i}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Missing'">
        </div>
    `).join('');
    
    // 初始化画廊交互深度效果
    if (typeof setupDynamicDepth === 'function') setupDynamicDepth();
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
