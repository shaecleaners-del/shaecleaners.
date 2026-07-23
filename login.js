import { auth } from "./firebase-config.js";

import {

signInWithEmailAndPassword,
onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* LOGIN */

document.getElementById("btnLogin").onclick = async () => {

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

await signInWithEmailAndPassword(

auth,

email,

password

);

location.href="admin.html";

}catch(e){

document.getElementById("loginInfo").innerHTML=

"Email atau Password salah.";

}

};

/* CEK LOGIN */

onAuthStateChanged(auth,(user)=>{

if(user){

console.log("Login :",user.email);

}

});

/* LOGOUT */

window.logout = async()=>{

await signOut(auth);

location.href="login.html";

};