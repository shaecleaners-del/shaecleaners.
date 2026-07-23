/*=========================================
ALAMAT.JS
Shae Cleaners
=========================================*/

import { auth, db } from "./firebase.js";

import {
onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
collection,
addDoc,
query,
where,
getDocs,
doc,
deleteDoc,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const labelAlamat = document.getElementById("labelAlamat");
const namaPenerima = document.getElementById("namaPenerima");
const nomorHp = document.getElementById("nomorHp");
const alamatLengkap = document.getElementById("alamatLengkap");
const kecamatan = document.getElementById("kecamatan");
const kota = document.getElementById("kota");
const provinsi = document.getElementById("provinsi");
const kodePos = document.getElementById("kodePos");

const saveAlamat = document.getElementById("saveAlamat");
const alamatList = document.getElementById("alamatList");

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

loadAlamat();

});


/*=========================================
SIMPAN ALAMAT
=========================================*/

saveAlamat.addEventListener("click",async()=>{

if(!currentUser) return;

if(

labelAlamat.value==="" ||

namaPenerima.value==="" ||

nomorHp.value==="" ||

alamatLengkap.value===""

){

alert("Lengkapi data alamat.");

return;

}

try{

await addDoc(

collection(db,"alamat"),

{

uid:currentUser.uid,

label:labelAlamat.value,

nama:namaPenerima.value,

phone:nomorHp.value,

alamat:alamatLengkap.value,

kecamatan:kecamatan.value,

kota:kota.value,

provinsi:provinsi.value,

kodepos:kodePos.value,

utama:false,

createdAt:Date.now()

}

);

alert("Alamat berhasil disimpan.");

clearForm();

loadAlamat();

}catch(err){

alert(err.message);

}

});


function clearForm(){

labelAlamat.value="";

namaPenerima.value="";

nomorHp.value="";

alamatLengkap.value="";

kecamatan.value="";

kota.value="";

provinsi.value="";

kodePos.value="";

}
/*=========================================
LOAD DAFTAR ALAMAT
=========================================*/

async function loadAlamat(){

if(!currentUser) return;

alamatList.innerHTML="";

try{

const q=query(

collection(db,"alamat"),

where("uid","==",currentUser.uid)

);

const snapshot=await getDocs(q);

if(snapshot.empty){

alamatList.innerHTML=`

<div class="alamat-item">

<div class="alamat-info">

<h4>Belum Ada Alamat</h4>

<p>Silakan tambahkan alamat baru.</p>

</div>

</div>

`;

return;

}

snapshot.forEach((item)=>{

const data=item.data();

alamatList.innerHTML+=`

<div class="alamat-item">

<div class="alamat-info">

<h4>${data.label}</h4>

<p>

<b>${data.nama}</b><br>

${data.phone}<br>

${data.alamat}<br>

${data.kecamatan}, ${data.kota}<br>

${data.provinsi} ${data.kodepos}

</p>

${data.utama ? '<span class="badge-primary">Alamat Utama</span>' : ''}

</div>

<div class="alamat-action">

<button
class="btn-primary"
onclick="setPrimary('${item.id}')">

Utama

</button>

<button
class="btn-edit"
onclick="editAlamat('${item.id}')">

Edit

</button>

<button
class="btn-delete"
onclick="hapusAlamat('${item.id}')">

Hapus

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
HAPUS ALAMAT
=========================================*/

window.hapusAlamat=async(id)=>{

const ok=confirm("Hapus alamat ini?");

if(!ok) return;

try{

await deleteDoc(

doc(db,"alamat",id)

);

loadAlamat();

}catch(err){

alert(err.message);

}

};


/*=========================================
JADIKAN ALAMAT UTAMA
=========================================*/

window.setPrimary=async(id)=>{

const q=query(

collection(db,"alamat"),

where("uid","==",currentUser.uid)

);

const snapshot=await getDocs(q);

for(const item of snapshot.docs){

await updateDoc(

doc(db,"alamat",item.id),

{

utama:false

}

);

}

await updateDoc(

doc(db,"alamat",id),

{

utama:true

}

);

alert("Alamat utama berhasil diperbarui.");

loadAlamat();

};


/*=========================================
EDIT ALAMAT
=========================================*/

window.editAlamat=(id)=>{

alert(

"Fitur edit alamat akan tersedia pada update berikutnya."

);

};


/*=========================================
AUTO REFRESH
=========================================*/

setInterval(()=>{

if(currentUser){

loadAlamat();

}

},30000);
/*=========================================
PILIH ALAMAT UNTUK ORDER
=========================================*/

window.pilihAlamat = async (id) => {

    try{

        const q = query(
            collection(db,"alamat"),
            where("uid","==",currentUser.uid)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach((item)=>{

            if(item.id===id){

                const data=item.data();

                localStorage.setItem(
                    "selectedAddress",
                    JSON.stringify(data)
                );

            }

        });

        window.location.href="order.html";

    }catch(err){

        alert(err.message);

    }

};


/*=========================================
AMBIL ALAMAT TERPILIH
Digunakan di order.html
=========================================*/

window.getSelectedAddress = ()=>{

    const data =
    localStorage.getItem("selectedAddress");

    if(!data) return null;

    return JSON.parse(data);

};


/*=========================================
SIMPAN LOKASI GPS
=========================================*/

function simpanLokasi(lat,lng){

localStorage.setItem("latitude",lat);

localStorage.setItem("longitude",lng);

}


/*=========================================
AMBIL GPS HP
=========================================*/

function getCurrentLocation(){

if(!navigator.geolocation){

alert("Browser tidak mendukung GPS.");

return;

}

navigator.geolocation.getCurrentPosition(

(position)=>{

const lat=position.coords.latitude;

const lng=position.coords.longitude;

simpanLokasi(lat,lng);

console.log("GPS:",lat,lng);

},

(error)=>{

console.log(error);

alert("Izin lokasi ditolak.");

}

);

}

getCurrentLocation();


/*=========================================
HITUNG JARAK
=========================================*/

function hitungJarak(lat1,lon1,lat2,lon2){

const R=6371;

const dLat=(lat2-lat1)*Math.PI/180;

const dLon=(lon2-lon1)*Math.PI/180;

const a=

Math.sin(dLat/2)*Math.sin(dLat/2)+

Math.cos(lat1*Math.PI/180)*

Math.cos(lat2*Math.PI/180)*

Math.sin(dLon/2)*

Math.sin(dLon/2);

const c=

2*Math.atan2(

Math.sqrt(a),

Math.sqrt(1-a)

);

return R*c;

}


/*=========================================
CONTOH
Lokasi kantor Shae Cleaners
=========================================*/

const OFFICE_LAT=-6.1700;

const OFFICE_LNG=106.6400;

const myLat=

parseFloat(localStorage.getItem("latitude"));

const myLng=

parseFloat(localStorage.getItem("longitude"));

if(myLat && myLng){

const km=

hitungJarak(

OFFICE_LAT,

OFFICE_LNG,

myLat,

myLng

);

console.log(

"Jarak pelanggan:",

km.toFixed(1),

"KM"

);

}