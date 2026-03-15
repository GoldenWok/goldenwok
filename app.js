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
    let ticking = false;
    const update = () => {
        const items = document.querySelectorAll('.gallery-slide-item');
        const center = container.scrollLeft + container.offsetWidth / 2;
        items.forEach(item => {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            if (Math.abs(center - itemCenter) < 100) item.classList.add('is-active');
            else item.classList.remove('is-active');
        });
        ticking = false;
    };
    container.addEventListener('scroll', () => {
        if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    });
    setTimeout(update, 300);
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
    setTimeout(() => overlay.style.display = "none", 400);
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
