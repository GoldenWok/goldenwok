let LANG = "gr"


function setLang(lang){
LANG = lang
renderWebsite()
}


function renderWebsite(){

document.getElementById("siteTitle").innerText = DB.restaurant[LANG]
document.getElementById("welcome").innerText = DB.welcome[LANG]
document.getElementById("slogan").innerText = DB.slogan[LANG]
document.getElementById("menuTitle").innerText = DB.menuTitle[LANG]
document.getElementById("openingText").innerText = DB.opening[LANG]

document.getElementById("buffetTime").innerText = DB.buffetTime[LANG]
document.getElementById("buffetPrice").innerText = DB.buffetPrice[LANG]

document.getElementById("orderTitle").innerText = DB.orderModule.title[LANG]
document.getElementById("orderButton").innerText = DB.orderModule.orderButton[LANG]

document.getElementById("galleryTitle").innerText =DB.galleryTitle[LANG]
  
document.getElementById("locationTitle").innerText = DB.locationTitle[LANG]

document.getElementById("contactTitle").innerText = DB.contact[LANG].title
document.getElementById("contactPhone").innerText = DB.contact[LANG].phone
document.getElementById("contactAddress").innerText = DB.contact[LANG].address

document.getElementById("collapseBtn").innerText = DB.collapseAll[LANG]

if(DB.galleryTitle){
document.getElementById("galleryTitle").innerText = DB.galleryTitle[LANG]
}

updateCollapseText()

renderMenu()

}


/* ===== MENU ===== */

function renderMenu(){

const container = document.getElementById("menuContainer")
container.innerHTML=""

const columns=[]

for(let i=0;i<3;i++){

const col=document.createElement("div")
col.className="menu-column"

container.appendChild(col)

columns.push(col)

}

DB.menu.forEach((cat,index)=>{

const card=document.createElement("div")
card.className="menu-card"

let html=`<h3>${cat.name[LANG]}</h3>`
html+=`<div class="menu-items">`

cat.items.forEach(item=>{

if(item.type==="complex"){

html+=`<div class="menu-item complex-title">
${item.title[LANG]}
</div>`

item.options.forEach(op=>{

html+=`
<div class="menu-item">
<span>${op[LANG]}</span>
<span>€${op.price}</span>
</div>
`

})

}else{

html+=`
<div class="menu-item">
<span>${item[LANG]}</span>
<span>€${item.price}</span>
</div>
`

}

})

html+=`</div>`

card.innerHTML=html

card.addEventListener("click",()=>{
card.classList.toggle("open")
})

columns[index % 3].appendChild(card)

})

}


/* ===== COLLAPSE ===== */

function collapseAll(){

document.querySelectorAll(".menu-card").forEach(card=>{
card.classList.remove("open")
})

}

function updateCollapseText(){

const btn=document.getElementById("collapseBtn")

if(btn){
btn.innerText = DB.collapseAll[LANG]
}

}


/* ===== GALLERY ===== */

let index=0

// function showImages(){

// const images=document.querySelectorAll("#galleryTrack img")
// const total=images.length

// images.forEach(img=>{
// img.style.display="none"
// img.classList.remove("active")
// })

// let left=(index-1+total)%total
// let center=index
// let right=(index+1)%total

// images[left].style.display="block"
// images[center].style.display="block"
// images[right].style.display="block"

// images[center].classList.add("active")

// }

function showImages(){

const images=document.querySelectorAll("#galleryTrack img")
const total=images.length

images.forEach(img=>{
img.style.display="none"
img.classList.remove("active")
})

/* mobile */
if(window.innerWidth < 768){

images[index].style.display="block"
images[index].classList.add("active")

}

/* desktop */
else{

let left=(index-1+total)%total
let center=index
let right=(index+1)%total

images[left].style.display="block"
images[center].style.display="block"
images[right].style.display="block"

images[center].classList.add("active")

}

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


/* ===== LIGHTBOX ===== */

function openImage(img){

document.getElementById("lightbox").style.display="flex"
document.getElementById("lightboxImg").src=img.src

}

function closeImage(){

document.getElementById("lightbox").style.display="none"

}

document.getElementById("lightbox").onclick=closeImage


/* ===== MOBILE SWIPE ===== */

let startX=0
let endX=0

const gallery=document.getElementById("galleryTrack")

if(gallery){

gallery.addEventListener("touchstart",e=>{
startX=e.touches[0].clientX
})

gallery.addEventListener("touchend",e=>{
endX=e.changedTouches[0].clientX
handleSwipe()
})

}

function handleSwipe(){

const diff=startX-endX

if(Math.abs(diff)<50) return

if(diff>0){
nextSlide()
}else{
prevSlide()
}

}


/* ===== LOAD ===== */

window.addEventListener("load",()=>{

renderWebsite()
showImages()

})






window.addEventListener("resize",showImages)







