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
    // 内部函数：只有当 val 有效时才更新内容
    const safeSet = (id, val) => { 
        const el = document.getElementById(id);
        if (el && val && val.toString().trim() !== "") {
            el.innerText = val; 
        }
    };

    if (window.DB) {
        // 渲染基础文字
        safeSet("welcome", DB.welcome[LANG]);
        safeSet("slogan", DB.slogan[LANG]);
        safeSet("openingText", DB.opening[LANG]);
        safeSet("buffetTime", DB.buffetTime[LANG]);
        safeSet("buffetPrice", DB.buffetPrice[LANG]);
        safeSet("menuTitle", DB.menuTitle[LANG]);
        safeSet("galleryTitle", DB.galleryTitle[LANG]);
        safeSet("locationTitle", DB.locationTitle[LANG]);
        
        // 渲染点餐按钮
        const orderBtn = document.getElementById("orderButton");
        if (orderBtn && DB.orderModule) {
            const btnText = DB.orderModule.orderButton[LANG];
            if (btnText) orderBtn.innerText = btnText;
        }

        // 渲染联系信息 (针对你的 config 结构)
        if (DB.contact && DB.contact[LANG]) {
            safeSet("contactAddress", DB.contact[LANG].address);
            safeSet("contactPhone", DB.contact[LANG].phone);
        }

        // 导航栏
        document.querySelectorAll('.nav-item').forEach(item => {
            const newText = item.getAttribute(`data-text-${LANG}`);
            if (newText) item.innerText = newText;
        });

        // 渲染组件
        renderMenu();
        renderGallery();
    }

    // 无论 DB 是否加载成功，都要执行的初始化
    initSmoothScroll();
    initReveal();
    initCursor();
}

function renderMenu() {
    const container = document.getElementById("menuContainer");
    if (!container || !window.DB || !DB.menu) return;

    try {
        container.innerHTML = DB.menu.map(cat => `
            <div class="menu-card reveal">
                <h3 class="category-header" onclick="toggleMenuCategory(this)">
                    ${cat.name[LANG] || ""}
                    <span class="arrow-icon"></span>
                </h3>
                <div class="menu-items-wrapper" style="max-height: 0; overflow: hidden; transition: all 0.5s ease;">
                    <div class="menu-items" style="padding: 20px 0;">
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
    } catch (e) {
        console.error("菜单渲染出错:", e);
    }
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
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* --- 5. 画廊逻辑 (保持原样) --- */
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
    const overlay = document.getElementById("imageOverlay");
    const img = document.getElementById("overlayImg");
    img.src = `images/${DB.gallery[index]}`;
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

/* --- 6. 全局生命周期 (合并后的唯一版本) --- */
/* --- 3. 生命周期与地图修复 --- */
window.addEventListener('DOMContentLoaded', () => {
    // 强制先移除一次 loading 确保不白屏
    document.body.classList.remove('loading');
    
    // 执行渲染
    renderWebsite();

    // 修正地图链接 (Golden Wok Nea Smyrni 官方嵌入码)
    const map = document.getElementById("googleMap");
    if (map) {
        map.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3146.471549420455!2d23.70997197665799!3d37.94396010246416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bc6382103333%3A0xc621b44ec0f7d56e!2sGolden%20Wok!5e0!3m2!1sel!2sgr!4v1710520000000!5m2!1sel!2sgr";
    }
});

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader) setTimeout(() => loader.classList.add('done'), 800);
});
