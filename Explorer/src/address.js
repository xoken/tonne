const path = require('path');
const indexPath = path.join('file://', __dirname, 'index.html');
const heightpagePath = path.join('file://', __dirname, 'address.html');
var result,address;
const logo = document.getElementById('logo').href = indexPath;
result = global.location.search.match(/\?address\=/i);

address = global.location.search.replace(result, '');



//note to self : remove the following code if you enable httpsauth();
httpsreq('Bearer '+localStorage.getItem("sessionkey")+'','v1/address/'+address+'/outputs/?pagesize=10','printresults');


function printresults(){
var addsummarysection = document.getElementById('addressummary');
var txlist = document.getElementById('txlist');
txlist.innerHTML = '';
document.getElementById('address').innerHTML = address;
document.getElementById('title').innerHTML = "Address - "+address;
//document.getElementById('nooftransactions').innerHTML = Object.keys(rjdecoded.outputs).length;
for(var i=0;i<Object.keys(rjdecoded.outputs).length;i++){
txlist.innerHTML += "<tr><td>"+rjdecoded.outputs[i].outputTxHash+"</td></tr>";
}
}
