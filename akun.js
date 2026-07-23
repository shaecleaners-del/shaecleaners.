/*========================================
  akun.js
  Shae Cleaners
========================================*/

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const profilePhoto = document.getElementById("profilePhoto");

const totalOrder = document.getElementById("totalOrder");
const pointUser = document.getElementById("pointUser");
const voucherUser = document.getElementById("voucherUser");

const logoutBtn = document.getElementById("logoutBtn");


onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href="login.html";
        return;

    }

    userName.textContent =
        user.displayName || "Pelanggan";

    userEmail.textContent =
        user.email;

    if(user.photoURL){

        profilePhoto.src =
        user.photoURL;

    }

    try{

        const ref =
        doc(db,"users",user.uid);

        const snap =
        await getDoc(ref);

        if(snap.exists()){

            const data =
            snap.data();

            totalOrder.textContent =
            data.totalOrder || 0;

            pointUser.textContent =
            data.points || 0;

            voucherUser.textContent =
            data.voucher || 0;

        }

    }catch(err){

        console.log(err);

    }

});
/*========================================
  LOAD HISTORY + LOGOUT
========================================*/

import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const historyList =
document.getElementById("historyList");


async function loadHistory(uid){

    if(!historyList) return;

    historyList.innerHTML=`
    <div class="history-card">
        <p>Memuat riwayat...</p>
    </div>
    `;

    try{

        const q=query(

            collection(db,"orders"),

            where("uid","==",uid),

            orderBy("createdAt","desc"),

            limit(10)

        );

        const snapshot=
        await getDocs(q);

        historyList.innerHTML="";

        if(snapshot.empty){

            historyList.innerHTML=`

            <div class="history-card">

            <div>

            <h3>Belum Ada Pesanan</h3>

            <p>Silakan lakukan booking layanan.</p>

            </div>

            </div>

            `;

            return;

        }

        snapshot.forEach((doc)=>{

            const data=doc.data();

            let status="pending";

            let textStatus="Menunggu";

            if(data.status==="process"){

                status="pending";

                textStatus="Diproses";

            }

            if(data.status==="done"){

                status="success";

                textStatus="Selesai";

            }

            if(data.status==="cancel"){

                status="cancel";

                textStatus="Dibatalkan";

            }

            historyList.innerHTML+=`

            <div class="history-card">

                <div>

                    <h3>${data.service}</h3>

                    <p>

                    ${data.date || "-"}

                    </p>

                </div>

                <span class="status ${status}">

                ${textStatus}

                </span>

            </div>

            `;

        });

    }

    catch(err){

        console.log(err);

    }

}


/*========================================
AUTO LOAD HISTORY
========================================*/

onAuthStateChanged(auth,(user)=>{

    if(user){

        loadHistory(user.uid);

    }

});


/*========================================
LOGOUT
========================================*/

if(logoutBtn){

logoutBtn.addEventListener("click",()=>{

const ok=confirm(

"Yakin ingin keluar?"

);

if(!ok) return;

signOut(auth)

.then(()=>{

alert("Berhasil logout");

window.location.href="login.html";

})

.catch((err)=>{

alert(err.message);

});

});

}


/*========================================
UPDATE FOTO PROFIL
========================================*/

if(profilePhoto){

profilePhoto.addEventListener("click",()=>{

window.location.href="profile.html";

});

}


/*========================================
AUTO REFRESH
========================================*/

setInterval(()=>{

const user=auth.currentUser;

if(user){

loadHistory(user.uid);

}

},30000);