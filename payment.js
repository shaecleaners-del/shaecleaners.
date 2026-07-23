document
.getElementById("btnBayar")
.onclick = async () => {

const res = await fetch("/create-transaction",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

invoice:order.invoice,

nama:order.nama,

total:order.total

})

});

const data = await res.json();

snap.pay(data.token,{

onSuccess:function(result){

alert("Pembayaran berhasil.");

},

onPending:function(result){

alert("Menunggu pembayaran.");

},

onError:function(result){

alert("Pembayaran gagal.");

},

onClose:function(){

alert("Transaksi dibatalkan.");

}

});

};