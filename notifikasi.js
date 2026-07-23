/*=========================================
NOTIFIKASI.JS
Shae Cleaners
=========================================*/

import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
collection,
query,
where,
orderBy,
getDocs,
updateDoc,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const notifList = document.getElementById("notifList");
const emptyNotif = document.getElementById("emptyNotif");

const readAllBtn = document.getElementById("readAllBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");

let currentUser = null;
let allNotif = [];

/*=========================================
LOGIN
=========================================*/

onAuthStateChanged(auth, (user)=>{

if(!user){

window.location.href="login.html";
return;

}

currentUser=user;

loadNotification();

});


/*=========================================
LOAD NOTIFIKASI
=========================================*/

async function loadNotification(){

notifList.innerHTML="";

try{

const q=query(

collection(db,"notifications"),

where("uid","==",currentUser.uid),

orderBy("createdAt","desc")

);

const snapshot=await getDocs(q);

allNotif=[];

if(snapshot.empty){

emptyNotif.style.display="block";

return;

}

emptyNotif.style.display="none";

snapshot.forEach((item)=>{

const data=item.data();

allNotif.push({

id:item.id,

...data

});

renderNotification(data,item.id);

});

}catch(err){

console.log(err);

}

}


/*=========================================
RENDER
=========================================*/

function renderNotification(data,id){

notifList.innerHTML+=`

<div class="notif-card ${data.read ? "" : "unread"}">

<div class="notif-icon ${data.type}">

<i class="${getIcon(data.type)}"></i>

</div>

<div class="notif-content">

<h4>${data.title}</h4>

<p>${data.message}</p>

<span>${formatDate(data.createdAt)}</span>

</div>

</div>

`;

}


/*=========================================
ICON
=========================================*/

function getIcon(type){

switch(type){

case "order":

return "fa-solid fa-cart-shopping";

case "promo":

return "fa-solid fa-tags";

default:

return "fa-solid fa-circle-info";

}

}


/*=========================================
FORMAT WAKTU
=========================================*/

function formatDate(timestamp){

const date=new Date(timestamp);

return date.toLocaleString("id-ID");

}
/*=========================================
TANDAI SEMUA SUDAH DIBACA
=========================================*/

readAllBtn.addEventListener("click", async()=>{

try{

for(const item of allNotif){

await updateDoc(

doc(db,"notifications",item.id),

{

read:true

}

);

}

alert("Semua notifikasi telah dibaca.");

loadNotification();

}catch(err){

alert(err.message);

}

});


/*=========================================
HAPUS SEMUA
=========================================*/

deleteAllBtn.addEventListener("click",async()=>{

const ok=confirm(
"Yakin ingin menghapus semua notifikasi?"
);

if(!ok) return;

try{

for(const item of allNotif){

await deleteDoc(

doc(db,"notifications",item.id)

);

}

loadNotification();

}catch(err){

alert(err.message);

}

});


/*=========================================
FILTER NOTIFIKASI
=========================================*/

document
.querySelectorAll(".filter-btn")
.forEach((btn)=>{

btn.addEventListener("click",()=>{

document
.querySelectorAll(".filter-btn")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

const type=btn.dataset.filter;

notifList.innerHTML="";

if(type==="all"){

allNotif.forEach(item=>{

renderNotification(item,item.id);

});

return;

}

allNotif
.filter(item=>item.type===type)
.forEach(item=>{

renderNotification(item,item.id);

});

});

});


/*=========================================
AUTO REFRESH
=========================================*/

setInterval(()=>{

if(currentUser){

loadNotification();

}

},30000);


/*=========================================
JUMLAH BELUM DIBACA
=========================================*/

function unreadCount(){

const total=allNotif.filter(

item=>!item.read

).length;

const badge=document.getElementById("notifBadge");

if(!badge) return;

badge.textContent=total;

badge.style.display=
total>0 ? "flex" : "none";

}


/*=========================================
UPDATE BADGE
=========================================*/

const oldLoad=loadNotification;

loadNotification=async()=>{

await oldLoad();

unreadCount();

};


/*=========================================
READY
=========================================*/

console.log(

"Notification System Ready"

);