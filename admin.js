/*=========================================
 SHAE CLEANERS ADMIN PANEL
=========================================*/
import { auth } from "./firebase-config.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="login.html";

}

});
// Tahun Footer
document.getElementById("year").textContent =
new Date().getFullYear();

/*=========================================
 LOAD ORDER
=========================================*/

let orders = JSON.parse(localStorage.getItem("orders")) || [];

const lastOrder = JSON.parse(localStorage.getItem("orderTerakhir"));

if(lastOrder){

    if(!orders.find(item=>item.invoice===lastOrder.invoice)){

        orders.push(lastOrder);

        localStorage.setItem("orders",JSON.stringify(orders));

    }

}

/*=========================================
 FORMAT RUPIAH
=========================================*/

function rupiah(nilai){

return "Rp " + Number(nilai.toString().replace(/\D/g,""))
.toLocaleString("id-ID");

}

/*=========================================
 DASHBOARD
=========================================*/

function dashboard(){

document.getElementById("totalOrder").innerHTML =
orders.length;

document.getElementById("customerTotal").innerHTML =
orders.length;

let total = 0;

orders.forEach(item=>{

total += Number(item.total.replace(/\D/g,""));

});

document.getElementById("pendapatan").innerHTML =
rupiah(total);

let proses = orders.filter(item=>

item.status!="Selesai"

).length;

document.getElementById("progressOrder").innerHTML =
proses;

}

dashboard();

/*=========================================
 TABEL ORDER
=========================================*/

function tampilOrder(){

const tbody = document.getElementById("orderTable");

tbody.innerHTML="";

if(orders.length==0){

tbody.innerHTML=`
<tr>
<td colspan="6">
Belum ada data pesanan.
</td>
</tr>`;

return;

}

orders.forEach((item,index)=>{

tbody.innerHTML +=`

<tr>

<td>${item.invoice}</td>

<td>${item.nama}</td>

<td>${item.layanan}</td>

<td>${item.total}</td>

<td>

<span class="badge ${statusClass(item.status)}">

${item.status}

</span>

</td>

<td>

<button
class="btn-primary edit"
data-index="${index}">

Edit

</button>

<button
class="btn-danger delete"
data-index="${index}">

Hapus

</button>

</td>

</tr>

`;

});

}

tampilOrder();

/*=========================================
 STATUS BADGE
=========================================*/

function statusClass(status){

switch(status){

case "Menunggu Konfirmasi":

return "pending";

case "Dikonfirmasi":

return "process";

case "Teknisi Berangkat":

return "process";

case "Proses Cleaning":

return "process";

case "Selesai":

return "finish";

default:

return "cancel";

}

}
/*=========================================
 EDIT STATUS PESANAN
=========================================*/

document.getElementById("btnUpdateStatus").onclick = () => {

    const invoice = document.getElementById("invoiceStatus").value.trim();
    const status = document.getElementById("statusOrder").value;

    const index = orders.findIndex(item => item.invoice === invoice);

    if (index === -1) {
        alert("Invoice tidak ditemukan.");
        return;
    }

    orders[index].status = status;

    localStorage.setItem("orders", JSON.stringify(orders));

    if (lastOrder && lastOrder.invoice === invoice) {
        lastOrder.status = status;
        localStorage.setItem(
            "orderTerakhir",
            JSON.stringify(lastOrder)
        );
    }

    tampilOrder();
    dashboard();

    alert("Status berhasil diperbarui.");

};

/*=========================================
 HAPUS PESANAN
=========================================*/

document.addEventListener("click", function(e){

    if(e.target.classList.contains("delete")){

        const index = e.target.dataset.index;

        if(confirm("Hapus pesanan ini?")){

            orders.splice(index,1);

            localStorage.setItem(
                "orders",
                JSON.stringify(orders)
            );

            tampilOrder();
            dashboard();

        }

    }

});

/*=========================================
 DATA PELANGGAN
=========================================*/

function tampilCustomer(){

const tbody=document.getElementById("customerTable");

tbody.innerHTML="";

if(orders.length===0){

tbody.innerHTML=
"<tr><td colspan='4'>Belum ada data pelanggan.</td></tr>";

return;

}

orders.forEach(item=>{

tbody.innerHTML+=`

<tr>

<td>${item.nama}</td>

<td>${item.wa}</td>

<td>${item.alamat}</td>

<td>1 Order</td>

</tr>

`;

});

}

tampilCustomer();

/*=========================================
 DATA INVOICE
=========================================*/

function tampilInvoice(){

const tbody=document.getElementById("invoiceTable");

tbody.innerHTML="";

orders.forEach(item=>{

tbody.innerHTML+=`

<tr>

<td>${item.invoice}</td>

<td>${item.tanggal}</td>

<td>${item.total}</td>

<td>${item.pembayaran}</td>

<td>${item.status}</td>

</tr>

`;

});

}

tampilInvoice();

/*=========================================
 GRAFIK PENDAPATAN
=========================================*/

const ctx=document.getElementById("incomeChart");

if(ctx){

let total=0;

orders.forEach(item=>{

total+=Number(item.total.replace(/\D/g,""));

});

document.getElementById("todayIncome").innerHTML=
rupiah(total);

document.getElementById("monthIncome").innerHTML=
rupiah(total);

document.getElementById("allIncome").innerHTML=
rupiah(total);

new Chart(ctx,{

type:"bar",

data:{

labels:["Hari Ini","Bulan Ini","Total"],

datasets:[{

label:"Pendapatan",

data:[total,total,total],

borderWidth:1

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

});

}

/*=========================================
 PROMO
=========================================*/

document.getElementById("btnPromo").onclick=()=>{

const nama=document.getElementById("promoNama").value;

const kode=document.getElementById("promoKode").value;

const diskon=document.getElementById("promoDiskon").value;

if(!nama||!kode||!diskon){

alert("Lengkapi data promo.");

return;

}

alert(

`Promo berhasil dibuat

${nama}

Kode : ${kode}

Diskon : ${diskon}%`

);

};

/*=========================================
 AUTO REFRESH
=========================================*/

setInterval(()=>{

dashboard();

},5000);

console.log("Admin Dashboard Shae Cleaners aktif.");
import { realtimeOrder } from "./firebase.js";

realtimeOrder((orders)=>{

console.log(orders);

// tampilkan ke tabel

});