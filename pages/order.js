/*=========================================
 Shae Cleaners Order System
=========================================*/
import { simpanOrder, uploadFoto, generateInvoice } from "./firebase.js";

const priceList = {

"Sofa 1 Seater":60000,
"Sofa 2 Seater":120000,
"Sofa L":250000,

"Single Bed":180000,
"Queen Bed":270000,
"King Bed":290000,

"2 Baris":250000,
"3 Baris":350000

};

const jenis = document.getElementById("jenis");
const qty = document.getElementById("qty");
const harga = document.getElementById("harga");
const total = document.getElementById("total");

function rupiah(angka){

return "Rp" + angka.toLocaleString("id-ID");

}

function hitungTotal(){

let h = priceList[jenis.value] || 0;

let q = parseInt(qty.value) || 1;

let t = h * q;

harga.value = rupiah(h);

total.value = rupiah(t);

document.getElementById("sJenis").innerHTML = jenis.value || "-";

document.getElementById("sQty").innerHTML = q;

document.getElementById("sTotal").innerHTML = rupiah(t);

}

jenis.addEventListener("change", hitungTotal);

qty.addEventListener("input", hitungTotal);

/*=========================
Ringkasan
=========================*/

document.getElementById("nama").addEventListener("input",e=>{

document.getElementById("sNama").innerHTML=e.target.value;

});

document.querySelectorAll("input[name=layanan]").forEach(item=>{

item.addEventListener("change",()=>{

document.getElementById("sLayanan").innerHTML=item.value;

});

});

document.getElementById("tanggal").addEventListener("change",e=>{

document.getElementById("sTanggal").innerHTML=e.target.value;

});

document.getElementById("jam").addEventListener("change",e=>{

document.getElementById("sJam").innerHTML=e.target.value;

});

/*=========================
Preview Foto
=========================*/

const foto=document.getElementById("foto");

const preview=document.getElementById("previewFoto");

foto.addEventListener("change",()=>{

const file=foto.files[0];

if(file){

preview.src=URL.createObjectURL(file);

preview.style.display="block";

}

});

/*=========================
Voucher
=========================*/

document.getElementById("cekVoucher").onclick=()=>{

const kode=document.getElementById("voucher").value.toUpperCase();

let diskon=0;

if(kode==="SHAE10"){

diskon=10;

}

if(kode==="SHAE20"){

diskon=20;

}

if(kode==="SHAE30"){

diskon=30;

}

const h=priceList[jenis.value]||0;

const q=parseInt(qty.value)||1;

let totalHarga=h*q;

if(diskon>0){

totalHarga-=totalHarga*diskon/100;

document.getElementById("voucherInfo").innerHTML=
`✅ Voucher ${diskon}% berhasil digunakan`;

}else{

document.getElementById("voucherInfo").innerHTML=
"❌ Voucher tidak ditemukan";

}

total.value=rupiah(totalHarga);

document.getElementById("sTotal").innerHTML=rupiah(totalHarga);

};
/*=========================================
 INVOICE NUMBER
=========================================*/

function generateInvoice(){

const now=new Date();

const y=now.getFullYear();

const m=String(now.getMonth()+1).padStart(2,"0");

const d=String(now.getDate()).padStart(2,"0");

const no=Math.floor(Math.random()*900)+100;

return `INV-${y}${m}${d}-${no}`;

}

/*=========================================
 VALIDASI FORM
=========================================*/

function validasiForm(){

if(document.getElementById("nama").value.trim()==""){

alert("Nama pelanggan wajib diisi.");

return false;

}

if(document.getElementById("wa").value.trim()==""){

alert("Nomor WhatsApp wajib diisi.");

return false;

}

if(document.getElementById("alamat").value.trim()==""){

alert("Alamat wajib diisi.");

return false;

}

if(!document.querySelector("input[name='layanan']:checked")){

alert("Silakan pilih layanan.");

return false;

}

if(document.getElementById("jenis").value==""){

alert("Silakan pilih jenis layanan.");

return false;

}

if(document.getElementById("tanggal").value==""){

alert("Silakan pilih tanggal.");

return false;

}

if(document.getElementById("jam").value==""){

alert("Silakan pilih jam.");

return false;

}

if(!document.getElementById("agree").checked){

alert("Anda harus menyetujui syarat dan ketentuan.");

return false;

}

return true;

}

/*=========================================
 SIMPAN PESANAN
=========================================*/

async function simpanPesanan() {

let fotoURL="";

const file=document.getElementById("foto").files[0];

if(file){

fotoURL=await uploadFoto(file);

}

const data={

invoice:generateInvoice(),

nama:document.getElementById("nama").value,

wa:document.getElementById("wa").value,

alamat:document.getElementById("alamat").value,

layanan:document.querySelector("input[name='layanan']:checked").value,

jenis:document.getElementById("jenis").value,

qty:Number(document.getElementById("qty").value),

harga:document.getElementById("harga").value,

total:document.getElementById("total").value,

tanggal:document.getElementById("tanggal").value,

jam:document.getElementById("jam").value,

pembayaran:document.querySelector("input[name='payment']:checked").value,

catatan:document.getElementById("catatan").value,

foto:fotoURL,

status:"Menunggu Konfirmasi"

};

const id=await simpanOrder(data);

alert("Order berhasil dikirim.");

return{

id,

...data

};

}

/*=========================================
 TOMBOL BUAT INVOICE
=========================================*/

document.getElementById("btnInvoice").onclick=()=>{

if(!validasiForm()) return;

const order=simpanPesanan();

alert(

`Invoice berhasil dibuat\n\n${order.invoice}`

);

};

/*=========================================
 KIRIM WHATSAPP
=========================================*/

document
.getElementById("btnWhatsapp")
.onclick=async()=>{

if(!validasiForm()) return;

const order=await simpanPesanan();

const pesan=`
*ORDER BARU SHAE CLEANERS*

Invoice :
${order.invoice}

Nama :
${order.nama}

Layanan :
${order.layanan}

Jenis :
${order.jenis}

Qty :
${order.qty}

Total :
${order.total}

Tanggal :
${order.tanggal}

Jam :
${order.jam}
`;

window.open(

"https://wa.me/6281234567890?text="+

encodeURIComponent(pesan),

"_blank"

);

};
/*=========================================
 CETAK
=========================================*/

document.getElementById("btnPrint").onclick=()=>{

window.print();

};

/*=========================================
 LOADING
=========================================*/

document.querySelectorAll(

"#btnInvoice,#btnWhatsapp"

).forEach(btn=>{

btn.addEventListener("click",()=>{

const loading=document.getElementById("loadingOrder");

loading.style.display="flex";

setTimeout(()=>{

loading.style.display="none";

},1500);

});

});