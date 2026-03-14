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
    // 安全填充函数
    const safeSet = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val || "";
    };

    safeSet("siteTitle", DB.restaurant?.[LANG]);
    safeSet("welcome", DB.welcome?.[LANG]);
    safeSet("slogan", DB.slogan?.[LANG]);
    
    // 营业时间与自助
    safeSet("orderTitle", DB.orderModule?.title?.[LANG]);
    safeSet("openingText", DB.opening?.[LANG]);
    safeSet("buffetTime", DB.buffetTime?.[LANG]);
    safeSet("buffetPrice", DB.buffetPrice?.[LANG]);
    safeSet("orderButton", DB.orderModule?.orderButton?.[LANG]);
    
    // 标题
    safeSet("menuTitle", DB.menuTitle?.[LANG]);
    safeSet("galleryTitle", DB.galleryTitle?.[LANG]);
    safeSet("locationTitle", DB.locationTitle?.[LANG]);
    
    const contact = DB.contact?.[LANG];
    if (contact) {
        safeSet("contactAddress", contact.address);
        safeSet("contactPhone", contact.phone);
    }

    renderMenu();
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
