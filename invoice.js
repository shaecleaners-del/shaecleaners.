/*=========================================
 Shae Cleaners Invoice
=========================================*/

// Tahun Footer
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// Ambil data pesanan
const order = JSON.parse(localStorage.getItem("orderTerakhir"));

if (order) {

  document.getElementById("invoiceNo").textContent = order.invoice;

  document.getElementById("invoiceDate").textContent =
    new Date().toLocaleDateString("id-ID");

  document.getElementById("cNama").textContent = order.nama;

  document.getElementById("cWa").textContent = order.wa;

  document.getElementById("cAlamat").textContent = order.alamat;

  // Isi tabel invoice
  document.getElementById("invoiceBody").innerHTML = `
<tr>
<td>${order.layanan} (${order.jenis})</td>
<td>${order.qty}</td>
<td>${order.total}</td>
<td>${order.total}</td>
</tr>
`;

  document.getElementById("subTotal").textContent = order.total;
  document.getElementById("grandTotal").textContent = order.total;
}

/*=========================================
 Salin Nomor Rekening
=========================================*/

document.querySelectorAll(".copyRek").forEach(btn => {

  btn.addEventListener("click", () => {

    navigator.clipboard.writeText(btn.dataset.rekening);

    btn.innerHTML = "✔ Tersalin";

    setTimeout(() => {

      btn.innerHTML = "Salin";

    }, 2000);

  });

});

/*=========================================
 Kirim Invoice WhatsApp
=========================================*/

const btnWA = document.getElementById("btnWhatsapp");

if (btnWA) {

  btnWA.onclick = () => {

    if (!order) return;

    const pesan = `*INVOICE SHAE CLEANERS*

📄 Invoice : ${order.invoice}

👤 Nama : ${order.nama}

🧽 Layanan : ${order.layanan}

📦 Jenis : ${order.jenis}

🔢 Qty : ${order.qty}

💰 Total : ${order.total}

💳 Pembayaran : ${order.pembayaran}

Terima kasih telah mempercayakan layanan kepada Shae Cleaners.`;

    window.open(
      `https://wa.me/${order.wa.replace(/^0/, "62")}?text=${encodeURIComponent(pesan)}`,
      "_blank"
    );

  };

}

/*=========================================
 Cetak Invoice
=========================================*/

const btnPrint = document.getElementById("btnPrint");

if (btnPrint) {

  btnPrint.onclick = () => {

    window.print();

  };

}

/*=========================================
 Download PDF
=========================================*/

const btnDownload = document.getElementById("btnDownload");

if (btnDownload) {

  btnDownload.onclick = () => {

    window.print();

  };

}

/*=========================================
 Update Status Pembayaran
=========================================*/

function updateStatus(status) {

  const badge = document.querySelector(".status");

  if (!badge) return;

  badge.className = "status";

  if (status === "Lunas") {

    badge.classList.add("success");
    badge.innerHTML =
      '<i class="fa-solid fa-circle-check"></i><span>LUNAS</span>';

  } else if (status === "Dibatalkan") {

    badge.classList.add("cancel");
    badge.innerHTML =
      '<i class="fa-solid fa-circle-xmark"></i><span>DIBATALKAN</span>';

  } else {

    badge.classList.add("paid");
    badge.innerHTML =
      '<i class="fa-solid fa-clock"></i><span>MENUNGGU PEMBAYARAN</span>';

  }

}

// Status default
updateStatus("Menunggu");

/*=========================================
 Loading Selesai
=========================================*/

window.addEventListener("load", () => {

  console.log("Invoice Shae Cleaners berhasil dimuat.");

});

import {

uploadBukti,
updateStatus

} from "./firebase.js";
const fileInput =
document.getElementById("paymentProof");

const preview =
document.getElementById("paymentPreview");

fileInput.addEventListener("change",()=>{

const file=fileInput.files[0];

if(file){

preview.src=URL.createObjectURL(file);

preview.style.display="block";

}

});

document
.getElementById("btnUploadPayment")
.onclick=async()=>{

const file=fileInput.files[0];

if(!file){

alert("Pilih bukti pembayaran.");

return;

}

const url=await uploadBukti(file);

// Simpan URL ke Firestore
await updateDoc(

doc(db,"orders",order.id),

{

paymentProof:url,

paymentStatus:"Menunggu Verifikasi"

}

);

document.getElementById("uploadInfo").innerHTML=

"✅ Bukti pembayaran berhasil dikirim.";

};