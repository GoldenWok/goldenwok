let LANG = "gr";

/* --- 1. 光标逻辑 (事件委托版) --- */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // 1. 实时跟随
        // 使用 requestAnimationFrame 保证丝滑
        requestAnimationFrame(() => {
            cursor.style.left = x + 'px';
            cursor.style.top = y + 'px';
            follower.style.left = x + 'px';
            follower.style.top = y + 'px';
        });

        // 2. 智能探测变色
        // 使用 elementFromPoint 探测鼠标下的元素，看它是否“可点击”
        const target = e.target;
        const isClickable = target.closest('a, button, .lang span, .gallery-slide-item, .menu-item, .lb-btn, #overlayImg, .cta-gold-btn');

        if (isClickable) {
            cursor.classList.add('is-hovering');
            follower.classList.add('is-hovering');
        } else {
            cursor.classList.remove('is-hovering');
            follower.classList.remove('is-hovering');
        }
    });

    // 针对灯箱开启时的特殊处理
    window.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
    });
    window.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
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

  document.querySelectorAll('.nav-item').forEach(item => {
        const key = `text-${LANG}`; // 匹配 HTML 中的 data-text-zh 等
        const newText = item.getAttribute(`data-${key}`);
        if (newText) item.innerText = newText;
    });

    renderMenu();
    renderGallery();
    initCursor(); // 确保新渲染的元素也能触发光标变色
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
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // 使用 translate3d 提高渲染性能，并保持中心对齐
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        follower.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

        // 探测是否悬停在可点击元素上
        const target = e.target;
        const clickable = target.closest('a, button, .lang span, .gallery-slide-item, .menu-item, .lb-btn, #overlayImg, .cta-gold-btn');

        if (clickable) {
            cursor.classList.add('is-hovering');
            follower.classList.add('is-hovering');
        } else {
            cursor.classList.remove('is-hovering');
            follower.classList.remove('is-hovering');
        }
    });
}

// 修改你的打开灯箱函数
function openFullImage(index) {
    currentImgIndex = index;
    const overlay = document.getElementById("imageOverlay");
    const img = document.getElementById("overlayImg");
    
    img.src = `images/${DB.gallery[index]}`;
    overlay.style.display = "flex";

    // --- 暴力修复核心：把光标节点移动到 body 的最后面，确保它在大图之上 ---
    const c1 = document.querySelector('.cursor');
    const c2 = document.querySelector('.cursor-follower');
    document.body.appendChild(c1);
    document.body.appendChild(c2);

    setTimeout(() => overlay.classList.add('active'), 10);
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
/* --- 菜单折叠交互逻辑 --- */
function toggleMenuCategory(headerElement) {
    const wrapper = headerElement.nextElementSibling; // 找到对应的 .menu-items-wrapper
    const arrow = headerElement.querySelector('.arrow-icon');
    
    // 如果当前是收起的
    if (!wrapper.style.maxHeight || wrapper.style.maxHeight === "0px") {
        // 先关闭其他所有已打开的分类 (可选，打造手风琴效果)
        document.querySelectorAll('.menu-items-wrapper').forEach(el => {
            el.style.maxHeight = "0px";
            el.previousElementSibling.classList.remove('active');
        });

        // 展开当前
        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        headerElement.classList.add('active');
    } else {
        // 收起当前
        wrapper.style.maxHeight = "0px";
        headerElement.classList.remove('active');
    }
}

/* --- 补充：平滑滚动到锚点 --- */
// 当点击导航栏 a 标签时，平滑跳转
document.querySelectorAll('.nav-item').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // 减去 header 的高度
                behavior: 'smooth'
            });
        }
    });
});

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
