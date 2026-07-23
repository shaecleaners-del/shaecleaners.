/*=========================================
 SHAE CLEANERS FIREBASE
=========================================*/

import { db, storage } from "./firebase-config.js";

import {

collection,
addDoc,
getDocs,
doc,
updateDoc,
deleteDoc,
query,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

ref,
uploadBytes,
getDownloadURL

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

/*=========================================
 SIMPAN ORDER
=========================================*/

export async function simpanOrder(data){

try{

const hasil = await addDoc(

collection(db,"orders"),

{

...data,

createdAt:new Date()

}

);

return hasil.id;

}catch(err){

console.error(err);

alert("Gagal menyimpan order.");

}

}

/*=========================================
 AMBIL SEMUA ORDER
=========================================*/

export async function ambilOrder(){

const daftar=[];

const q=query(

collection(db,"orders"),

orderBy("createdAt","desc")

);

const snap=await getDocs(q);

snap.forEach(docItem=>{

daftar.push({

id:docItem.id,

...docItem.data()

});

});

return daftar;

}

/*=========================================
 REALTIME ORDER
=========================================*/

export function realtimeOrder(callback){

const q=query(

collection(db,"orders"),

orderBy("createdAt","desc")

);

return onSnapshot(q,(snapshot)=>{

const data=[];

snapshot.forEach(item=>{

data.push({

id:item.id,

...item.data()

});

});

callback(data);

});

}

/*=========================================
 UPDATE STATUS
=========================================*/

export async function updateStatus(id,status){

await updateDoc(

doc(db,"orders",id),

{

status:status

}

);

}

/*=========================================
 HAPUS ORDER
=========================================*/

export async function hapusOrder(id){

await deleteDoc(

doc(db,"orders",id)

);

}

/*=========================================
 UPLOAD FOTO
=========================================*/

export async function uploadFoto(file){

const namaFile=

Date.now()+"_"+file.name;

const storageRef=

ref(storage,"order/"+namaFile);

await uploadBytes(storageRef,file);

const url=

await getDownloadURL(storageRef);

return url;

}

/*=========================================
 GENERATE INVOICE
=========================================*/

export function generateInvoice(){

const d=new Date();

return "INV-"+

d.getFullYear()+

String(d.getMonth()+1).padStart(2,"0")+

String(d.getDate()).padStart(2,"0")+

"-"+

Math.floor(Math.random()*900+100);

}

console.log("Firebase Shae Cleaners siap digunakan.");
export async function uploadBukti(file){

const storageRef = ref(

storage,

"payment/"+Date.now()+"_"+file.name

);

await uploadBytes(storageRef,file);

return await getDownloadURL(storageRef);

}