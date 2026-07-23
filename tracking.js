/*=========================================
 Shae Cleaners Tracking
=========================================*/

// Footer Tahun
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}

/*=========================================
 Ambil Data Pesanan
=========================================*/

const order = JSON.parse(localStorage.getItem("orderTerakhir"));

if (order) {

    document.getElementById("tInvoice").textContent = order.invoice;
    document.getElementById("tNama").textContent = order.nama;
    document.getElementById("tLayanan").textContent = order.layanan;
    document.getElementById("tAlamat").textContent = order.alamat;
    document.getElementById("tTanggal").textContent = order.tanggal;

    document.getElementById("estimasiTanggal").textContent = order.tanggal;
    document.getElementById("estimasiJam").textContent = order.jam;

}

/*=========================================
 Cari Invoice
=========================================*/

const btnCari = document.getElementById("btnCari");

if (btnCari) {

    btnCari.onclick = () => {

        const invoice = document
            .getElementById("invoiceInput")
            .value
            .trim();

        if (!order) {

            alert("Belum ada data pesanan.");

            return;

        }

        if (invoice === order.invoice) {

            alert("Pesanan ditemukan.");

            tampilStatus();

        } else {

            alert("Nomor invoice tidak ditemukan.");

        }

    };

}

/*=========================================
 Progress Tracking
=========================================*/

function tampilStatus() {

    const status = order.status || "Menunggu Konfirmasi";

    if (status === "Menunggu Konfirmasi") {

        document.querySelector(".step").classList.add("active");

    }

    if (status === "Dikonfirmasi") {

        document.getElementById("step2").classList.add("active");

    }

    if (status === "Teknisi Berangkat") {

        document.getElementById("step2").classList.add("active");
        document.getElementById("step3").classList.add("active");

    }

    if (status === "Proses Cleaning") {

        document.getElementById("step2").classList.add("active");
        document.getElementById("step3").classList.add("active");
        document.getElementById("step4").classList.add("active");

    }

    if (status === "Selesai") {

        document.querySelectorAll(".step").forEach(step => {

            step.classList.add("active");

        });

    }

}

/*=========================================
 Data Teknisi
=========================================*/

const teknisi = {

    nama: "Teknisi Shae Cleaners",

    hp: "081234567890",

    kendaraan: "Toyota Grand Max"

};

document.getElementById("techName").textContent = teknisi.nama;
document.getElementById("techPhone").textContent = teknisi.hp;
document.getElementById("techVehicle").textContent = teknisi.kendaraan;

document.getElementById("callTech").href =
"tel:" + teknisi.hp;

document.getElementById("waTech").href =
"https://wa.me/62" +
teknisi.hp.replace(/^0/, "");

/*=========================================
 Google Maps
=========================================*/

if (order && order.maps) {

    document.getElementById("mapsFrame").src =
        order.maps;

}

/*=========================================
 Rating
=========================================*/

const stars = document.querySelectorAll(".star");

let nilai = 0;

stars.forEach((star, index) => {

    star.onclick = () => {

        nilai = index + 1;

        stars.forEach((s, i) => {

            s.classList.toggle("active", i < nilai);

        });

    };

});

/*=========================================
 Kirim Review
=========================================*/

const btnReview =
document.getElementById("btnReview");

if (btnReview) {

    btnReview.onclick = () => {

        const review =
        document.getElementById("review").value;

        if (nilai === 0) {

            alert("Silakan pilih rating.");

            return;

        }

        alert(
            "Terima kasih atas penilaian Anda.\n\nRating : " +
            nilai +
            " ⭐"
        );

        console.log({

            rating: nilai,

            review: review

        });

    };

}

/*=========================================
 Auto Refresh Status
=========================================*/

setInterval(() => {

    if (order) {

        tampilStatus();

    }

}, 5000);

console.log("Tracking Shae Cleaners berhasil dimuat.");