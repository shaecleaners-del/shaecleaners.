/*=========================================
 Shae Cleaners Service Worker
 Version 1.0.0
=========================================*/

const CACHE_NAME = "shae-cleaners-v1";

const urlsToCache = [

"/",
"/index.html",
"/style.css",
"/app.js",
"/manifest.json",

"/assets/logo/logo.png",

"/assets/banner/banner1.jpg",
"/assets/banner/banner2.jpg",
"/assets/banner/banner3.jpg",

"/assets/icons/home.png",
"/assets/icons/ac.png",
"/assets/icons/sofa.png",
"/assets/icons/kasur.png",
"/assets/icons/mobil.png",
"/assets/icons/kursi.png",
"/assets/icons/karpet.png",

"/pages/order.html",
"/pages/promo.html",
"/pages/profile.html",
"/pages/tracking.html"

];

/*=========================
 Install
=========================*/

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)

.then(cache => {

return cache.addAll(urlsToCache);

})

);

self.skipWaiting();

});

/*=========================
 Activate
=========================*/

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys.map(key => {

if(key !== CACHE_NAME){

return caches.delete(key);

}

})

);

})

);

self.clients.claim();

});

/*=========================
 Fetch
=========================*/

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)

.then(response => {

if(response){

return response;

}

return fetch(event.request)

.then(networkResponse => {

const clone = networkResponse.clone();

caches.open(CACHE_NAME)

.then(cache => {

cache.put(event.request, clone);

});

return networkResponse;

})

.catch(() => {

return caches.match("/index.html");

});

})

);

});

/*=========================
 Push Notification
=========================*/

self.addEventListener("push", event => {

const data = event.data
? event.data.json()
: {

title:"Shae Cleaners",

body:"Promo terbaru telah tersedia!",

icon:"assets/icons/icon-192.png"

};

event.waitUntil(

self.registration.showNotification(

data.title,

{

body:data.body,

icon:data.icon,

badge:data.icon,

vibrate:[200,100,200],

data:{

url:"/"

}

}

)

);

});

/*=========================
 Notification Click
=========================*/

self.addEventListener("notificationclick", event => {

event.notification.close();

event.waitUntil(

clients.openWindow("/")

);

});

/*=========================
 Background Sync
=========================*/

self.addEventListener("sync", event => {

if(event.tag==="sync-order"){

event.waitUntil(

console.log("Sinkronisasi pesanan berhasil.")

);

}

});