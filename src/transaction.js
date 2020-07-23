const transactionPath = path.join('file://', __dirname, 'transaction.html');
const addressPath = path.join('file://', __dirname, 'address.html');
const indexPath = path.join('file://', __dirname, 'index.html');
const heightpagePath = path.join('file://', __dirname, 'blockheight.html');
var result,transactionparam,selectedparam;
const logo = document.getElementById('logo').href = indexPath;
//result = global.location.search.match(/\?transaction\=/i);
//result = global.location.search.match(/\?transaction\=*\/i);
//transactionparam = global.location.search.replace(result, '');

var params = new URL(global.location).searchParams;
transactionparam = params.get('transaction');


//note to self : remove the following code if you enable httpsauth();
httpsreq('Bearer '+localStorage.getItem("sessionkey")+'','v1/transaction/'+transactionparam+'','printresults');

function printresults(){
  var inputs,outputs;
  document.getElementById('back').innerHTML = "<a class='btn btn-primary' href='"+heightpagePath+"?blockheight="+rjdecoded.tx.blockHeight+"&txindex="+rjdecoded.tx.txIndex+"'>Back</a>";
  function inps(inindex){if (rjdecoded.tx.tx.txInps[inindex].address == '') {return "Newly minted coin";}else {return "<a href='"+addressPath+"?address="+rjdecoded.tx.tx.txInps[inindex].address+"'>"+rjdecoded.tx.tx.txInps[inindex].address+"</a> via<br /><a class='inputvia' href='"+transactionPath+"?transaction="+rjdecoded.tx.tx.txInps[inindex].outpointTxID+"'>"+rjdecoded.tx.tx.txInps[inindex].outpointTxID+"</a>"}}
  inputs = Object.keys(rjdecoded.tx.tx.txInps).length;
  outputs = Object.keys(rjdecoded.tx.tx.txOuts).length;
  document.getElementById('blocktitle').innerHTML = "(#"+rjdecoded.tx.blockHeight+")";
  document.getElementById('blockhash').innerHTML = "Block - <a href='"+heightpagePath+"?blockhash="+rjdecoded.tx.blockHash+"'>"+rjdecoded.tx.blockHash+"</a>";
  document.getElementById('txversion').innerHTML = rjdecoded.tx.tx.txVersion;
document.getElementById('title').innerHTML = "Transaction - "+rjdecoded.tx.txId;
document.getElementById('txid').innerHTML = rjdecoded.tx.txId;
document.getElementById('txlocktime').innerHTML = rjdecoded.tx.tx.txLockTime;
document.getElementById('noofinputs').innerHTML = inputs;
document.getElementById('noofoutputs').innerHTML = outputs;
document.getElementById('inputaddress').innerHTML = "<tr><td></td><td class='tdpadd'><b>Inputs:</b></td></tr>";
document.getElementById('outputaddress').innerHTML = "<tr><td></td><td class='tdpadd'><b>Outputs:</b></td></tr>"
for(var j=0;j<inputs;j++){
  document.getElementById('inputaddress').innerHTML +="<tr><td class='tdnum'>"+(j+1)+".</td><td class='tdpadd'>"+inps(j)+"<hr /></td><td></td></tr>";
}
for(var z=0;z<outputs;z++){
document.getElementById('outputaddress').innerHTML +="<tr><td class='tdnum'>"+(z+1)+".</td><td class='tdpadd'><a href='"+addressPath+"?address="+rjdecoded.tx.tx.txOuts[z].address+"'>"+rjdecoded.tx.tx.txOuts[z].address+"</a> <br /><p>Script:</p><div class='scriptborder'>"+rjdecoded.tx.tx.txOuts[z].lockingScript+"</div><hr /></td><td></td></tr>";
}
}
