/*=========================================
CHAT-ADMIN.JS
Shae Cleaners
=========================================*/

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    collection,
    query,
    orderBy,
    where,
    onSnapshot,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/*=========================================
ELEMENT
=========================================*/

const customerList = document.getElementById("customerList");
const adminMessages = document.getElementById("adminMessages");
const adminMessage = document.getElementById("adminMessage");
const sendAdminMessage = document.getElementById("sendAdminMessage");
const customerName = document.getElementById("customerName");
const customerStatus = document.getElementById("customerStatus");

let adminUser = null;
let selectedUid = null;

/*=========================================
LOGIN ADMIN
=========================================*/

onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href="login.html";
        return;

    }

    adminUser = user;

    loadCustomerList();

});

/*=========================================
DAFTAR PELANGGAN
=========================================*/

function loadCustomerList(){

    const q = query(
        collection(db,"chat"),
        orderBy("createdAt","desc")
    );

    const users = new Map();

    onSnapshot(q,(snapshot)=>{

        customerList.innerHTML = "";

        snapshot.forEach((doc)=>{

            const data = doc.data();

            if(data.sender !== "user") return;

            if(users.has(data.uid)) return;

            users.set(data.uid,true);

            customerList.innerHTML += `

            <div class="customer-item"
                 onclick="openChat('${data.uid}')">

                <img src="assets/user.png">

                <div class="customer-info">

                    <h4>${data.name || "Pelanggan"}</h4>

                    <p>${data.message}</p>

                </div>

            </div>

            `;

        });

    });

}
/*=========================================
BUKA CHAT PELANGGAN
=========================================*/

window.openChat = function(uid){

    selectedUid = uid;

    customerName.textContent = "Pelanggan";
    customerStatus.textContent = "Sedang Online";

    const q = query(
        collection(db,"chat"),
        where("uid","==",uid),
        orderBy("createdAt","asc")
    );

    onSnapshot(q,(snapshot)=>{

        adminMessages.innerHTML="";

        snapshot.forEach((item)=>{

            const data=item.data();

            adminMessages.innerHTML += `

            <div class="message ${data.sender}">

                <div class="bubble">

                    ${data.message}

                </div>

                <span class="time">

                    ${formatTime(data.createdAt)}

                </span>

            </div>

            `;

        });

        adminMessages.scrollTop =
        adminMessages.scrollHeight;

    });

};


/*=========================================
KIRIM BALASAN ADMIN
=========================================*/

sendAdminMessage.addEventListener("click",sendReply);

adminMessage.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        sendReply();

    }

});

async function sendReply(){

    const text = adminMessage.value.trim();

    if(text==="") return;

    if(!selectedUid){

        alert("Pilih pelanggan terlebih dahulu.");

        return;

    }

    try{

        await addDoc(

            collection(db,"chat"),

            {

                uid:selectedUid,
                sender:"admin",
                message:text,
                read:false,
                createdAt:serverTimestamp()

            }

        );

        adminMessage.value="";

    }catch(err){

        alert(err.message);

    }

}


/*=========================================
FORMAT JAM
=========================================*/

function formatTime(timestamp){

    if(!timestamp) return "";

    const date = timestamp.toDate();

    return date.toLocaleTimeString("id-ID",{

        hour:"2-digit",
        minute:"2-digit"

    });

}


/*=========================================
PENCARIAN PELANGGAN
=========================================*/

const searchUser =
document.getElementById("searchUser");

searchUser.addEventListener("input",()=>{

    const keyword =
    searchUser.value.toLowerCase();

    document
    .querySelectorAll(".customer-item")
    .forEach((item)=>{

        const text =
        item.innerText.toLowerCase();

        item.style.display =
        text.includes(keyword)
        ? "flex"
        : "none";

    });

});


/*=========================================
EMOJI
=========================================*/

document
.querySelectorAll(".emoji")
.forEach((emoji)=>{

    emoji.addEventListener("click",()=>{

        adminMessage.value += emoji.textContent;

        adminMessage.focus();

    });

});


/*=========================================
UPLOAD FILE
=========================================*/

document
.getElementById("adminImage")
.addEventListener("change",()=>{

    alert(
    "Upload gambar akan aktif setelah Firebase Storage dikonfigurasi."
    );

});

document
.getElementById("adminFile")
.addEventListener("change",()=>{

    alert(
    "Upload dokumen akan aktif setelah Firebase Storage dikonfigurasi."
    );

});


/*=========================================
STATUS ADMIN
=========================================*/

console.log("Admin Online");


/*=========================================
READY
=========================================*/

console.log(
"Admin Live Chat Ready - Shae Cleaners"
);