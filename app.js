/*=========================================
 Shae Cleaners Premium App
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       Splash Screen
    ========================== */

    const splash = document.getElementById("splash");

    window.addEventListener("load", () => {
        setTimeout(() => {
            splash.style.opacity = "0";
            splash.style.visibility = "hidden";
        }, 1800);
    });

    /* =========================
       Hero Slider
    ========================== */

    const slides = document.querySelectorAll(".slide");

    let currentSlide = 0;

    function showSlide(index){

        slides.forEach(slide=>{
            slide.classList.remove("active");
        });

        slides[index].classList.add("active");

    }

    function nextSlide(){

        currentSlide++;

        if(currentSlide>=slides.length){
            currentSlide=0;
        }

        showSlide(currentSlide);

    }

    if(slides.length>0){

        showSlide(currentSlide);

        setInterval(nextSlide,5000);

    }

    /* =========================
       Promo Slider Auto
    ========================== */

    const promoSlider = document.querySelector(".promo-slider");

    if(promoSlider){

        let scrollAmount=0;

        setInterval(()=>{

            scrollAmount += 340;

            if(scrollAmount>=promoSlider.scrollWidth){

                scrollAmount=0;

            }

            promoSlider.scrollTo({

                left:scrollAmount,

                behavior:"smooth"

            });

        },3500);

    }

    /* =========================
       Gallery Auto
    ========================== */

    const gallery=document.querySelector(".gallery-slider");

    if(gallery){

        let g=0;

        setInterval(()=>{

            g+=300;

            if(g>=gallery.scrollWidth){

                g=0;

            }

            gallery.scrollTo({

                left:g,

                behavior:"smooth"

            });

        },3000);

    }

    /* =========================
       Counter Animation
    ========================== */

    const counters=document.querySelectorAll(".count");

    counters.forEach(counter=>{

        const update=()=>{

            const target=Number(counter.dataset.target);

            const count=Number(counter.innerText);

            const speed=80;

            const inc=target/speed;

            if(count<target){

                counter.innerText=Math.ceil(count+inc);

                setTimeout(update,30);

            }else{

                counter.innerText=target;

            }

        }

        update();

    });

});
/*=========================================
 Ripple Effect
=========================================*/

document.querySelectorAll(".card,.btn-order,.promo-info a,.bottom-nav a")
.forEach(button=>{

button.addEventListener("click",function(e){

let ripple=document.createElement("span");

ripple.className="ripple-effect";

let rect=this.getBoundingClientRect();

ripple.style.left=(e.clientX-rect.left)+"px";
ripple.style.top=(e.clientY-rect.top)+"px";

this.appendChild(ripple);

setTimeout(()=>{
ripple.remove();
},600);

});

});

/*=========================================
 Bottom Navigation Active
=========================================*/

const currentPage=location.pathname.split("/").pop();

document.querySelectorAll(".bottom-nav a").forEach(link=>{

const href=link.getAttribute("href");

if(href===currentPage){

link.classList.add("active");

}

});

/*=========================================
 Dark Mode
=========================================*/

const darkBtn=document.getElementById("darkMode");

if(darkBtn){

if(localStorage.getItem("theme")=="dark"){

document.body.classList.add("dark");

}

darkBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

localStorage.setItem("theme","dark");

}else{

localStorage.setItem("theme","light");

}

});

}

/*=========================================
 Back To Top
=========================================*/

const topButton=document.createElement("button");

topButton.innerHTML='<i class="fa-solid fa-arrow-up"></i>';

topButton.className="backTop";

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topButton.classList.add("show");

}else{

topButton.classList.remove("show");

}

});

topButton.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

/*=========================================
 Lazy Loading Image
=========================================*/

const images=document.querySelectorAll("img[data-src]");

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const img=entry.target;

img.src=img.dataset.src;

img.removeAttribute("data-src");

observer.unobserve(img);

}

});

});

images.forEach(img=>{

observer.observe(img);

});

/*=========================================
 Floating WhatsApp Message
=========================================*/

const wa=document.querySelector(".floating-wa");

if(wa){

wa.href="https://wa.me/628XXXXXXXXXX?text=Halo%20Shae%20Cleaners,%20saya%20ingin%20booking%20layanan.";

}

/*=========================================
 Welcome Popup Promo
=========================================*/

setTimeout(()=>{

if(!sessionStorage.getItem("promo")){

const promo=document.createElement("div");

promo.className="popupPromo";

promo.innerHTML=`

<div class="popupBox">

<h2>🎉 Promo Spesial</h2>

<p>Dapatkan diskon hingga <b>30%</b> untuk layanan pilihan.</p>

<button id="closePromo">

Tutup

</button>

</div>

`;

document.body.appendChild(promo);

document
.getElementById("closePromo")
.onclick=()=>{

promo.remove();

};

sessionStorage.setItem("promo","1");

}

},2500);

/*=========================================
 Header Shadow
=========================================*/

window.addEventListener("scroll",()=>{

const header=document.querySelector("header");

if(window.scrollY>40){

header.classList.add("shadow");

}else{

header.classList.remove("shadow");

}

});

/*=========================================
 Smooth Scroll Anchor
=========================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

document.querySelector(this.getAttribute("href")).scrollIntoView({

behavior:"smooth"

});

});

});
/*=========================================
 SHAE CLEANERS APP.JS PART 3
=========================================*/

/*=========================
 Hero Slider Swipe
=========================*/

const hero = document.querySelector(".slider");

if(hero){

let startX = 0;

hero.addEventListener("touchstart",(e)=>{

startX = e.touches[0].clientX;

});

hero.addEventListener("touchend",(e)=>{

let endX = e.changedTouches[0].clientX;

if(startX-endX>50){

nextSlide();

}

if(endX-startX>50){

currentSlide--;

if(currentSlide<0){

currentSlide=slides.length-1;

}

showSlide(currentSlide);

}

});

}

/*=========================
 Scroll Animation
=========================*/

const reveal=document.querySelectorAll(".card,.promo-card,.why-card,.testimonial-card");

function revealElement(){

reveal.forEach(el=>{

const top=el.getBoundingClientRect().top;

const visible=window.innerHeight-80;

if(top<visible){

el.classList.add("fade-up");

}

});

}

window.addEventListener("scroll",revealElement);

revealElement();

/*=========================
 Floating Button Effect
=========================*/

const floating=document.querySelector(".floating-wa");

if(floating){

setInterval(()=>{

floating.classList.toggle("zoom");

},1800);

}

/*=========================
 Install PWA
=========================*/

let deferredPrompt;

window.addEventListener("beforeinstallprompt",(e)=>{

e.preventDefault();

deferredPrompt=e;

const install=document.createElement("button");

install.innerHTML="📲 Install Aplikasi";

install.className="installApp";

document.body.appendChild(install);

install.onclick=async()=>{

install.style.display="none";

deferredPrompt.prompt();

await deferredPrompt.userChoice;

deferredPrompt=null;

}

});

/*=========================
 Online Offline
=========================*/

function updateStatus(){

const status=document.createElement("div");

status.className="netStatus";

if(navigator.onLine){

status.innerHTML="🟢 Online";

status.style.background="#16a34a";

}else{

status.innerHTML="🔴 Offline";

status.style.background="#dc2626";

}

document.body.appendChild(status);

setTimeout(()=>{

status.remove();

},2500);

}

window.addEventListener("online",updateStatus);

window.addEventListener("offline",updateStatus);

/*=========================
 Search Menu
=========================*/

const search=document.querySelector(".search-box input");

if(search){

search.addEventListener("keyup",()=>{

let value=search.value.toLowerCase();

document.querySelectorAll(".card").forEach(card=>{

let text=card.innerText.toLowerCase();

card.style.display=text.includes(value)?"block":"none";

});

});

}

/*=========================
 Auto Hide Header
=========================*/

let lastScroll=0;

window.addEventListener("scroll",()=>{

const header=document.querySelector("header");

let current=window.pageYOffset;

if(current>lastScroll){

header.style.top="-120px";

}else{

header.style.top="0";

}

lastScroll=current;

});

/*=========================
 Loading Bar
=========================*/

const loading=document.createElement("div");

loading.className="loadingBar";

document.body.appendChild(loading);

window.addEventListener("load",()=>{

loading.style.width="100%";

setTimeout(()=>{

loading.remove();

},800);

});

/*=========================
 Copy Rekening
=========================*/

document.querySelectorAll(".copyRek").forEach(btn=>{

btn.addEventListener("click",()=>{

navigator.clipboard.writeText(btn.dataset.rekening);

alert("Nomor rekening berhasil disalin");

});

});

/*=========================
 Audio Klik
=========================*/

const clickAudio=new Audio("assets/audio/click.mp3");

document.querySelectorAll("button,a,.card").forEach(item=>{

item.addEventListener("click",()=>{

clickAudio.play();

});

});

/*=========================
 Footer Year
=========================*/

const year=document.getElementById("year");

if(year){

year.innerHTML=new Date().getFullYear();

}

/*=========================
 Console
=========================*/

console.log("Shae Cleaners Premium V3 Loaded Successfully");k
/* Register Service Worker */

if ("serviceWorker" in navigator) {

window.addEventListener("load", () => {

navigator.serviceWorker

.register("sw.js")

.then(reg => {

console.log("Service Worker berhasil:", reg.scope);

})

.catch(err => {

console.log("Service Worker gagal:", err);

});

});

}