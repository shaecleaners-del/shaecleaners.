/*=========================================
CHAT.JS
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
orderBy,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendMessage = document.getElementById("sendMessage");

let currentUser = null;

/*=========================================
LOGIN
=========================================*/

onAuthStateChanged(auth, (user)=>{

    if(!user){

        window.location.href="login.html";
        return;

    }

    currentUser = user;

    loadMessages();

});

/*=========================================
KIRIM PESAN
=========================================*/

sendMessage.addEventListener("click", sendChat);

messageInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        sendChat();

    }

});

async function sendChat(){

    const text = messageInput.value.trim();

    if(text==="") return;

    try{

        await addDoc(
            collection(db,"chat"),
            {

                uid:currentUser.uid,
                sender:"user",
                message:text,
                createdAt:serverTimestamp(),
                read:false

            }
        );

        messageInput.value="";

    }catch(err){

        alert(err.message);

    }

}
/*=========================================
LOAD CHAT REALTIME
=========================================*/

function loadMessages(){

    const q = query(
        collection(db,"chat"),
        where("uid","==",currentUser.uid),
        orderBy("createdAt","asc")
    );

    onSnapshot(q,(snapshot)=>{

        chatMessages.innerHTML="";

        snapshot.forEach((docSnap)=>{

            const data=docSnap.data();

            const div=document.createElement("div");

            div.className=
            `message ${data.sender}`;

            div.innerHTML=`

                <div class="bubble">

                    ${data.message}

                </div>

                <span class="time">

                    ${formatTime(data.createdAt)}

                </span>

            `;

            chatMessages.appendChild(div);

        });

        scrollBottom();

    });

}


/*=========================================
FORMAT JAM
=========================================*/

function formatTime(timestamp){

    if(!timestamp) return "";

    const date=timestamp.toDate();

    return date.toLocaleTimeString("id-ID",{

        hour:"2-digit",
        minute:"2-digit"

    });

}


/*=========================================
AUTO SCROLL
=========================================*/

function scrollBottom(){

    chatMessages.scrollTop=
    chatMessages.scrollHeight;

}


/*=========================================
EMOJI
=========================================*/

document
.querySelectorAll(".emoji")
.forEach((emoji)=>{

emoji.addEventListener("click",()=>{

messageInput.value+=emoji.textContent;

messageInput.focus();

});

});


/*=========================================
QUICK CHAT
=========================================*/

document
.querySelectorAll(".quick-btn")
.forEach((btn)=>{

btn.addEventListener("click",()=>{

messageInput.value=
btn.dataset.message;

messageInput.focus();

});

});


/*=========================================
UPLOAD GAMBAR
=========================================*/

const imageInput=
document.getElementById("imageInput");

imageInput.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file) return;

alert(
"Upload gambar akan diaktifkan setelah Firebase Storage dikonfigurasi."
);

});


/*=========================================
UPLOAD DOKUMEN
=========================================*/

const fileInput=
document.getElementById("fileInput");

fileInput.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file) return;

alert(
"Upload dokumen akan diaktifkan setelah Firebase Storage dikonfigurasi."
);

});


/*=========================================
STATUS ADMIN
=========================================*/

const adminStatus=
document.getElementById("adminStatus");

adminStatus.textContent=
"🟢 Online";


/*=========================================
READY
=========================================*/

console.log(
"Live Chat Ready - Shae Cleaners"
);