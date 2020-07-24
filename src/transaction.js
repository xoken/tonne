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
if (params.get('transaction')!=undefined) {
transactionparam = params.get('transaction');
}

function checknull(val){
  if (val!=null) {

  }
}

//note to self : remove the following code if you enable httpsauth();
httpsreq('Bearer '+localStorage.getItem("sessionkey")+'','v1/transaction/'+transactionparam+'','printresults');

function printresults(){
  var inputs,outputs;
  var tempoutputstring='';
  document.getElementById('back').innerHTML = "<a class='btn btn-primary' href='"+heightpagePath+"?blockheight="+rjdecoded.tx.blockHeight+"&txindex="+rjdecoded.tx.txIndex+"'>Back</a>";
  inputs = Object.keys(rjdecoded.tx.tx.txInps).length;
  outputs = Object.keys(rjdecoded.tx.tx.txOuts).length;
  document.getElementById('blocktitle').innerHTML = "(#"+rjdecoded.tx.blockHeight+")";
  document.getElementById('blockhash').innerHTML = "BlockHash - <a href='"+heightpagePath+"?blockhash="+rjdecoded.tx.blockHash+"'>"+rjdecoded.tx.blockHash+"</a>";
  document.getElementById('txversion').innerHTML = rjdecoded.tx.tx.txVersion;
  document.getElementById('title').innerHTML = "Transaction - "+rjdecoded.tx.txId;
  document.getElementById('txindex').innerHTML =  rjdecoded.tx.txIndex;
  document.getElementById('size').innerHTML = rjdecoded.tx.size;
  document.getElementById('fees').innerHTML = rjdecoded.tx.fees;
  document.getElementById('txid').innerHTML = rjdecoded.tx.txId;
  document.getElementById('txlocktime').innerHTML = rjdecoded.tx.tx.txLockTime;
  document.getElementById('noofinputs').innerHTML = inputs;
  document.getElementById('noofoutputs').innerHTML = outputs;
  for(var i=0;i<Object.keys(rjdecoded.tx.merkleBranch).length;i++){
    document.getElementById('merklebranchsection').innerHTML += "<tr><td><b>nodeValue : </b></td><td class='tdbordright'>"+rjdecoded.tx.merkleBranch[i].nodeValue+"</td><td><b>isLeftNode : </b></td><td>"+rjdecoded.tx.merkleBranch[i].isLeftNode+"</td></tr>";
  }
  document.getElementById('merklebranchsection').innerHTML += "";
  document.getElementById('inputaddress').innerHTML = "<tr><td></td><td class='tdpadd'><b>Inputs:</b></td></tr>";
  tempoutputstring = "<tr><td></td><td class='tdpadd'><b>Outputs:</b></td></tr>"
  for(var j=0;j<inputs;j++){
    document.getElementById('inputaddress').innerHTML +="<tr><td class='tdnum'>"+(j+1)+".</td><td class='tdpadd'><table class='outputinputtd'><tr><td><b>Address</b></td><td class='tdwordbreak'><a href='"+addressPath+"?address="+rjdecoded.tx.tx.txInps[j].address+"'>"+rjdecoded.tx.tx.txInps[j].address+"</a></td></tr><tr><td><b>outpointTxID</b></td><td class='tdwordbreak'><a href='"+transactionPath+"?transaction="+rjdecoded.tx.tx.txInps[j].outpointTxID+"'>"+rjdecoded.tx.tx.txInps[j].outpointTxID+"</a></td></tr><tr><td><b>value</b></td><td class='tdwordbreak'>"+rjdecoded.tx.tx.txInps[j].value+"</td></tr><tr><td><b>txInputIndex</b></td><td class='tdwordbreak'>"+rjdecoded.tx.tx.txInps[j].txInputIndex+"</td></tr><tr><td><b>outpointIndex</b></td><td class='tdwordbreak'>"+rjdecoded.tx.tx.txInps[j].outpointIndex+"</td></tr></table></td></tr>";
  }
  for(var z=0;z<outputs;z++){
    tempoutputstring +="<tr><td class='tdnum'>"+(z+1)+".</td><td class='tdpadd'><table class='outputinputtd'><tr><td><b>address</b></td><td class='tdwordbreak'><a href='"+addressPath+"?address="+rjdecoded.tx.tx.txOuts[z].address+"'>"+rjdecoded.tx.tx.txOuts[z].address+"</a></td></tr><tr><td><b>lockingScript</b></td><td class='tdwordbreak'>"+rjdecoded.tx.tx.txOuts[z].lockingScript+"</td></tr><tr><td><b>value</b></td><td class='tdwordbreak'>"+rjdecoded.tx.tx.txOuts[z].value+"</td></tr><tr><td><b>outputIndex</b></td><td class='tdwordbreak'>"+rjdecoded.tx.tx.txOuts[z].outputIndex+"</td></tr></table><br>";
    if(rjdecoded.tx.tx.txOuts[z].txSpendInfo!=null){
      tempoutputstring +="<table class='outputinputtd'><tr><td><b>spendingBlockHash</b></td><td class='tdwordbreak'><a href='"+heightpagePath+"?blockhash="+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHash+"'>"+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHash+"</a></td></tr><tr><td><b>spendingBlockHeight</b></td><td class='tdwordbreak'><a href='"+heightpagePath+"?blockheight="+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHeight+"'>"+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHeight+"</a></td></tr><tr><td><b>spendingTxId</b></td><td class='tdwordbreak'><a href='"+transactionPath+"?transaction="+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxId+"'>"+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxId+"</a></td></tr><tr><td><b>spendingTxIndex</b></td><td class='tdwordbreak'>"+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxIndex+"</td></tr></table><table class='outputinputtd'>";

      for(var b=0;b<Object.keys(rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData).length;b++){
        tempoutputstring += "<tr><br><td colspan='2'><b><h5>spendData</h5></b></td></tr><tr><td><b>spendingOutputIndex</b></td><td class='tdwordbreak'>"+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].spendingOutputIndex+"</td></tr><tr><td><b>value</b></td><td class='tdwordbreak'>"+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].value+"</td></tr><tr><td><b>outputAddress</b></td><td class='tdwordbreak'><a href='"+addressPath+"?address="+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].outputAddress+"'>"+rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].outputAddress+"</a></td></tr>";
      }
      tempoutputstring += "</table><br><br></td></tr>";
    }else {
      tempoutputstring +="<br><br></td></tr>";
    }

  }
  document.getElementById('outputaddress').innerHTML = tempoutputstring;
}
