/*=========================================
PENGATURAN.JS
Shae Cleaners
=========================================*/

import { auth } from "./firebase.js";

import {
signOut

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


const darkMode =
document.getElementById("darkMode");

const notifOrder =
document.getElementById("notifOrder");

const notifPromo =
document.getElementById("notifPromo");

const language =
document.getElementById("language");

const logoutBtn =
document.getElementById("logoutBtn");


/*=========================================
LOAD PENGATURAN
=========================================*/

window.addEventListener("load",()=>{

// Dark Mode
const dark =
localStorage.getItem("darkMode");

if(dark==="true"){

document.body.classList.add("dark");

darkMode.checked=true;

}

// Notifikasi Order
const orderNotif =
localStorage.getItem("notifOrder");

if(orderNotif!==null){

notifOrder.checked=
orderNotif==="true";

}

// Promo
const promoNotif =
localStorage.getItem("notifPromo");

if(promoNotif!==null){

notifPromo.checked=
promoNotif==="true";

}

// Bahasa
const lang =
localStorage.getItem("language");

if(lang){

language.value=lang;

}

});


/*=========================================
DARK MODE
=========================================*/

darkMode.addEventListener("change",()=>{

if(darkMode.checked){

document.body.classList.add("dark");

localStorage.setItem(
"darkMode",
true
);

}else{

document.body.classList.remove("dark");

localStorage.setItem(
"darkMode",
false
);

}

});


/*=========================================
NOTIFIKASI
=========================================*/

notifOrder.addEventListener("change",()=>{

localStorage.setItem(
"notifOrder",
notifOrder.checked
);

});

notifPromo.addEventListener("change",()=>{

localStorage.setItem(
"notifPromo",
notifPromo.checked
);

});


/*=========================================
BAHASA
=========================================*/

language.addEventListener("change",()=>{

localStorage.setItem(
"language",
language.value
);

alert(
"Bahasa berhasil diperbarui."
);

});


/*=========================================
LOGOUT
=========================================*/

logoutBtn.addEventListener("click",()=>{

const ok=confirm(
"Yakin ingin keluar?"
);

if(!ok) return;

signOut(auth)

.then(()=>{

alert(
"Berhasil logout."
);

window.location.href="login.html";

})

.catch((err)=>{

alert(err.message);

});

});


/*=========================================
ANIMASI CARD
=========================================*/

document
.querySelectorAll(".setting-card")
.forEach((card,index)=>{

card.style.animationDelay=
(index*0.1)+"s";

});


/*=========================================
VERSI APLIKASI
=========================================*/

console.log(
"Shae Cleaners v1.0.0"
);