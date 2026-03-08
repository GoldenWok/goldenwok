let LANG = "zh"

function setLang(lang){
LANG = lang
renderWebsite()
}

function renderWebsite(){

document.getElementById("siteTitle").innerText = DB.restaurant[LANG]
document.getElementById("welcome").innerText = DB.welcome[LANG]
document.getElementById("slogan").innerText = DB.slogan[LANG]
document.getElementById("menuTitle").innerText = DB.menuTitle[LANG]
document.getElementById("openingText").innerText =
DB.opening[LANG]

document.getElementById("buffetTime").innerText =
DB.buffetTime[LANG]

document.getElementById("buffetPrice").innerText =
DB.buffetPrice[LANG]

document.getElementById("orderTitle").innerText =
DB.orderModule.title[LANG]

document.getElementById("orderButton").innerText =
DB.orderModule.orderButton[LANG]
document.getElementById("locationTitle").innerText = DB.locationTitle[LANG]

document.getElementById("contactTitle").innerText = DB.contact[LANG].title
document.getElementById("contactPhone").innerText = DB.contact[LANG].phone
document.getElementById("contactAddress").innerText = DB.contact[LANG].address

document.getElementById("collapseBtn").innerText =
DB.collapseAll[LANG]

updateCollapseText()

renderMenu()

}
function renderMenu(){

const container = document.getElementById("menuContainer");
container.innerHTML="";

/* 创建三列 */
const columns = [];

for(let i=0;i<3;i++){
    const col = document.createElement("div");
    col.className="menu-column";
    container.appendChild(col);
    columns.push(col);
}

/* 菜单轮流分配到列 */
DB.menu.forEach((cat,index)=>{

const card = document.createElement("div");
card.className="menu-card";

/* 构建卡片HTML */
let html = `<h3>${cat.name[LANG]}</h3>`;
html += `<div class="menu-items">`;

cat.items.forEach(item=>{

if(item.type==="complex"){

html+=`<div class="menu-item complex-title">
${item.title[LANG]}
</div>`;

item.options.forEach(op=>{
html+=`
<div class="menu-item">
<span>${op[LANG]}</span>
<span>€${op.price}</span>
</div>`;
});

}else{

html+=`
<div class="menu-item">
<span>${item[LANG]}</span>
<span>€${item.price}</span>
</div>`;
}

});

html += `</div>`;
card.innerHTML = html;

/* 点击展开 */
card.addEventListener("click",()=>{
card.classList.toggle("open");
});

/* 轮流放入三列 */
columns[index % 3].appendChild(card);

});

}

function collapseAll(){

document.querySelectorAll(".menu-card").forEach(card=>{
card.classList.remove("open")
})

}

function updateCollapseText(){

const btn = document.getElementById("collapseBtn")

if(btn){
btn.innerText = DB.collapseAll[LANG]
}

}

let index=0

function showImages(){

const images=document.querySelectorAll("#galleryTrack img")
const total=images.length

images.forEach(img=>{
img.style.display="none"
img.classList.remove("active")
})

let left=(index-1+total)%total
let center=index
let right=(index+1)%total

images[left].style.display="block"
images[center].style.display="block"
images[right].style.display="block"

images[center].classList.add("active")

}

function nextSlide(){

const images=document.querySelectorAll("#galleryTrack img")

index=(index+1)%images.length

showImages()

}

function prevSlide(){

const images=document.querySelectorAll("#galleryTrack img")

index=(index-1+images.length)%images.length

showImages()

}

function openImage(img){

document.getElementById("lightbox").style.display="flex"
document.getElementById("lightboxImg").src=img.src

}

function closeImage(){

document.getElementById("lightbox").style.display="none"

}

window.addEventListener("load",showImages)

window.onload = ()=>{
renderWebsite()
}
