/*=========================================
FAVORITE.JS
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
getDocs,
addDoc,
deleteDoc,
doc

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const favoriteList =
document.getElementById("favoriteList");

let currentUser = null;


/*=========================================
LOGIN
=========================================*/

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser=user;

loadFavorite();

});


/*=========================================
LOAD FAVORITE
=========================================*/

async function loadFavorite(){

favoriteList.innerHTML="";

try{

const q=query(

collection(db,"favorite"),

where("uid","==",currentUser.uid)

);

const snapshot=await getDocs(q);

if(snapshot.empty){

document.getElementById("emptyFavorite").style.display="block";

return;

}

document.getElementById("emptyFavorite").style.display="none";

snapshot.forEach((item)=>{

const data=item.data();

favoriteList.innerHTML+=`

<div class="favorite-card">

<img src="${data.image}" alt="${data.nama}">

<div class="favorite-info">

<h4>${data.nama}</h4>

<p>${data.deskripsi}</p>

</div>

<div class="favorite-action">

<button
class="btn-order"
onclick="orderService('${data.link}')">

<i class="fa-solid fa-cart-shopping"></i>

Order

</button>

<button
class="btn-remove"
onclick="removeFavorite('${item.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

});

}catch(err){

console.log(err);

}

}


/*=========================================
ORDER
=========================================*/

window.orderService=(link)=>{

window.location.href=link;

};
/*=========================================
TAMBAH FAVORIT
=========================================*/

window.addFavorite = async (
nama,
deskripsi,
image,
link
)=>{

if(!currentUser){

alert("Silakan login terlebih dahulu.");

return;

}

try{

await addDoc(

collection(db,"favorite"),

{

uid:currentUser.uid,

nama:nama,

deskripsi:deskripsi,

image:image,

link:link,

createdAt:Date.now()

}

);

alert("Berhasil ditambahkan ke favorit.");

loadFavorite();

}catch(err){

alert(err.message);

}

};


/*=========================================
HAPUS FAVORIT
=========================================*/

window.removeFavorite = async(id)=>{

const ok=confirm(
"Hapus layanan dari favorit?"
);

if(!ok) return;

try{

await deleteDoc(

doc(db,"favorite",id)

);

loadFavorite();

}catch(err){

alert(err.message);

}

};


/*=========================================
CEK FAVORIT
=========================================*/

window.isFavorite = async(nama)=>{

const q=query(

collection(db,"favorite"),

where("uid","==",currentUser.uid),
where("nama","==",nama)

);

const snapshot=await getDocs(q);

return !snapshot.empty;

};


/*=========================================
AUTO REFRESH
=========================================*/

setInterval(()=>{

if(currentUser){

loadFavorite();

}

},30000);


/*=========================================
LOADING
=========================================*/

function showLoading(){

favoriteList.innerHTML=`

<div style="text-align:center;padding:30px;">

<i class="fa-solid fa-spinner fa-spin"></i>

<p>Memuat layanan favorit...</p>

</div>

`;

}

showLoading();


/*=========================================
SIMPAN LAYANAN TERAKHIR
=========================================*/

window.saveLastService=(service)=>{

localStorage.setItem(
"lastService",
service
);

};

window.getLastService=()=>{

return localStorage.getItem(
"lastService"
);

};


/*=========================================
STATISTIK
=========================================*/

console.log(
"Favorite Ready - Shae Cleaners"
);