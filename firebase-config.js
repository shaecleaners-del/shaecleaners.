// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const firebaseConfig = {

apiKey: "AIzaSyDJuYtGMSCNe4eSNo6T5MNNEJcdYW46X1s",

authDomain: "shae-cleaners.firebaseapp.com",

projectId: "shae-cleaners",

storageBucket: "shae-cleaners.firebasestorage.app",

messagingSenderId: "886460432923",

appId: "1:886460432923:web:700f4cfcf087f3be436ebe"
measurementId: "G-CN3EBFK8B2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);