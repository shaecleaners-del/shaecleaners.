/*=========================================
PROFILE.JS
Shae Cleaners
=========================================*/
import {
getStorage,
ref,
uploadBytes,
getDownloadURL

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const storage = getStorage();
/*=========================================
UPLOAD FOTO KE FIREBASE STORAGE
=========================================*/

photoInput.addEventListener("change", async (e) => {

const file = e.target.files[0];

if (!file || !currentUser) return;

try {

const storageRef = ref(
storage,
`profile/${currentUser.uid}`
);

await uploadBytes(storageRef, file);

const url = await getDownloadURL(storageRef);

await updateProfile(currentUser, {

photoURL: url

});

await setDoc(

doc(db, "users", currentUser.uid),

{

photoURL: url

},

{

merge: true

}

);

previewPhoto.src = url;

alert("Foto profil berhasil diperbarui.");

} catch (err) {

alert(err.message);

}

});

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    updateProfile,
    updatePassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const previewPhoto = document.getElementById("previewPhoto");
const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");

const nama = document.getElementById("nama");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const alamat = document.getElementById("alamat");
const kota = document.getElementById("kota");
const kodepos = document.getElementById("kodepos");

const saveProfile = document.getElementById("saveProfile");

let currentUser = null;


/*==========================
LOAD USER
==========================*/

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href="login.html";
        return;

    }
    currentUser = user;

    displayName.textContent =
    user.displayName || "Pelanggan";

    displayEmail.textContent =
    user.email;

    nama.value =
    user.displayName || "";

    email.value =
    user.email;

    if(user.photoURL){

        previewPhoto.src =
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

            phone.value =
            data.phone || "";

            alamat.value =
            data.alamat || "";

            kota.value =
            data.kota || "";

            kodepos.value =
            data.kodepos || "";

            document.getElementById("profileOrder").textContent =
            data.totalOrder || 0;

        }

    }catch(err){

        console.log(err);

    }

});


/*==========================
SIMPAN PROFIL
==========================*/

saveProfile.addEventListener("click",async()=>{

    if(!currentUser) return;

    try{

        await updateProfile(currentUser,{

            displayName:nama.value

        });

        await setDoc(

            doc(db,"users",currentUser.uid),

            {

                nama:nama.value,

                phone:phone.value,

                alamat:alamat.value,

                kota:kota.value,

                kodepos:kodepos.value

            },

            {merge:true}

        );

        alert("Profil berhasil diperbarui.");

        displayName.textContent =
        nama.value;

    }catch(err){

        alert(err.message);

    }

});
/*=========================================
UPLOAD FOTO (Preview)
=========================================*/

const photoInput = document.getElementById("photoInput");

if(photoInput){

photoInput.addEventListener("change",(e)=>{

const file = e.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(event){

previewPhoto.src = event.target.result;

};

reader.readAsDataURL(file);

});

}


/*=========================================
UBAH PASSWORD
=========================================*/

const changePassword =
document.getElementById("changePassword");

if(changePassword){

changePassword.addEventListener("click",async()=>{

const newPassword =
document.getElementById("newPassword").value;

const confirmPassword =
document.getElementById("confirmPassword").value;

if(newPassword.length < 6){

alert("Password minimal 6 karakter.");

return;

}

if(newPassword !== confirmPassword){

alert("Konfirmasi password tidak sama.");

return;

}

try{

await updatePassword(currentUser,newPassword);

alert("Password berhasil diperbarui.");

document.getElementById("newPassword").value="";
document.getElementById("confirmPassword").value="";

}catch(err){

alert(err.message);

}

});

}


/*=========================================
STATUS AKUN
=========================================*/

if(currentUser){

document.getElementById("accountStatus").textContent="Aktif";

}

const today=new Date();

document.getElementById("memberSince").textContent=
today.getFullYear();


/*=========================================
HAPUS AKUN
=========================================*/

const deleteAccount =
document.getElementById("deleteAccount");

if(deleteAccount){

deleteAccount.addEventListener("click",async()=>{

const ok=confirm(
"Yakin ingin menghapus akun?"
);

if(!ok) return;

try{

await currentUser.delete();

alert("Akun berhasil dihapus.");

window.location.href="register.html";

}catch(err){

alert(err.message);

}

});

}


/*=========================================
ANIMASI INPUT
=========================================*/

document
.querySelectorAll("input, textarea")
.forEach((el)=>{

el.addEventListener("focus",()=>{

el.style.transform="scale(1.02)";

});

el.addEventListener("blur",()=>{

el.style.transform="scale(1)";

});

});


/*=========================================
AUTO REFRESH NAMA
=========================================*/

if(currentUser){

displayName.textContent =
currentUser.displayName || "Pelanggan";

}