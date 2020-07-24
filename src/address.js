const indexPath = path.join('file://', __dirname, 'index.html');
const heightpagePath = path.join('file://', __dirname, 'blockheight.html');
const transactionPath = path.join('file://', __dirname, 'transaction.html');
const addressPath = path.join('file://', __dirname, 'address.html');
var result,address;
const logo = document.getElementById('logo').href = indexPath;
var addsummarysection = document.getElementById('addressummary');
var txlist = document.getElementById('txlist');
var addressCache = [],cachecounter=0,outputsperpage=20,pagearray=[],fixedpagearrlength=5,pagearrlength=5;
var selected = 1,batches,totalpagesavailable,currentbatchnum=1,nextcursor='';

var params = new URL(global.location).searchParams;
 if (params.get('address')!=undefined) {
   address = params.get('address');
 }

document.getElementById('address').innerHTML = address;
document.getElementById('title').innerHTML = "Address - "+address;
const pagescontainer = document.getElementById('pagination');

//note to self : remove the following code if you enable httpsauth();
httpsreq('Bearer '+localStorage.getItem("sessionkey")+'','v1/address/'+address+'/outputs/?pagesize=100','pagearrayinit');
document.getElementById('back').innerHTML = "<a class='btn btn-primary' style='color:white;' onclick='window.history.back();'>Back</a>";


function printresults(){
  txlist.innerHTML = '';
  var spendinfocolorflip=0,prevoutpointcolorflip=0;
  function spendinfocolor(spendinfocolor){if(spendinfocolor==0){spendinfocolorflip=1;return "spendinfo0";}else{spendinfocolorflip=0;return "spendinfo1";}}
  function prevoutpointcolor(prevoutpointcolor){if(prevoutpointcolor==0){prevoutpointcolorflip=1;return "prevoutpoint0";}else{prevoutpointcolorflip=0;return "prevoutpoint1";}}
  var printbreaker = 1;
  var txnumber = ((selected - 1) * outputsperpage);
  for(var i=txnumber;i<addressCache.length;i++){

    txlist.innerHTML += "<tr><td class='txslnum'>#"+(i+1)+" - <a href='"+transactionPath+"?transaction="+addressCache[i].outputTxHash+"'>"+addressCache[i].outputTxHash+"</a> - outputTxHash</td></tr><tr><td><table class='subtable'><tr><td><b>Transaction Index:</b> "+addressCache[i].txIndex+"</td><td><b>Value:</b> "+addressCache[i].value+"</td><td><b>Output Index:</b> "+addressCache[i].outputIndex+"</td><td><b>Block Height:</b> <a href='"+heightpagePath+"?blockheight="+addressCache[i].blockHeight+"'>"+addressCache[i].blockHeight+"</a></td></tr><tr><td colspan='4'><b>Block Hash:</b> <a href='"+heightpagePath+"?blockhash="+addressCache[i].blockHash+"'>"+addressCache[i].blockHash+"</a></td></tr></table></td></tr>";
    if (addressCache[i].spendInfo!=null) {
      for(var b=0;b<Object.keys(addressCache[i].spendInfo.spendData).length;b++){
        txlist.innerHTML +="<tr><td class='"+spendinfocolor(spendinfocolorflip)+"'><hr><table class='subtable'><tr><th><p><b>spendData</b></p></th></tr><tr><td><b>Spending Output Index:</b> "+addressCache[i].spendInfo.spendData[b].spendingOutputIndex+"</td><td><b>Value:</b> "+addressCache[i].spendInfo.spendData[b].value+"</td><td><b>Output Address:</b> <a href='"+addressPath+"?address="+addressCache[i].spendInfo.spendData[b].outputAddress+"'>"+addressCache[i].spendInfo.spendData[b].outputAddress+"</a></td></tr></table></td></tr>";
      }
    }
   for(var a=0;a<Object.keys(addressCache[i].prevOutpoint).length;a++){
      txlist.innerHTML += "<tr><td class='"+prevoutpointcolor(prevoutpointcolorflip)+"'><hr><table class='subtable'><tr><th><p><b>prevOutpoint</p></b></th></tr><tr><td colspan='3'><b>opTxHash:</b> <a href='"+heightpagePath+"?blockhash="+addressCache[i].prevOutpoint[a][0].opTxHash+"'>"+addressCache[i].prevOutpoint[a][0].opTxHash+"</a></td></tr><tr><td><b>opIndex:</b> "+addressCache[i].prevOutpoint[a][0].opIndex+"</td><td>"+addressCache[i].prevOutpoint[a][1]+"</td><td>"+addressCache[i].prevOutpoint[a][2]+"</td></tr></table></td></tr>";
    }

    txlist.innerHTML += "<br><br>";
    if (printbreaker==outputsperpage) {
      break;
    }

    printbreaker+=1;
  }
}



function pagearrayinit(){
  caching();
  if(addressCache.length > 0){
  var tempindex=1;
  if (addressCache.length<=outputsperpage) {
    totalpagesavailable = Math.ceil(addressCache.length/outputsperpage);
  }
  else{
    totalpagesavailable=1;
  }
  for(var c=0;c<totalpagesavailable;c++){
    pagearray[c] = tempindex;
    if (fixedpagearrlength==tempindex) {
      break;
    }
    tempindex+=1;
  }
  batches = Math.ceil(totalpagesavailable/fixedpagearrlength);
  currentbatchnum = Math.ceil(selected / fixedpagearrlength);
  printpagination();
  printresults();
}
else {
  searchresultsmessage();
}
}

function caching(){
  if (Object.keys(rjdecoded.outputs).length>0) {
  for(var i=0;i<Object.keys(rjdecoded.outputs).length;i++){
    addressCache[cachecounter] = rjdecoded.outputs[i];
    cachecounter+=1;
  }
  nextcursor = rjdecoded.nextCursor;
}
console.log(addressCache.length);
}

function adddataupdatepagearray(){
  caching();
  var pagenum = pagearray[(pagearray.length-1)];
  currentbatchnum = Math.ceil(pagearray[0] / fixedpagearrlength);
  currentbatchnum+=1;
  for(var t=0;t<pagearrlength;t++){
    pagenum+=1;

    if (pagenum<=totalpagesavailable) {
      pagearray[t] = pagenum;
    }
    else {
      pagearray[t] = '';
    }

  }
  printpagination();
  printresults();
}

function printpagination(){

  if(currentbatchnum==batches){
    if((totalpagesavailable % fixedpagearrlength)==0) {
      pagearrlength = fixedpagearrlength;
    }
    else {
      pagearrlength = totalpagesavailable % fixedpagearrlength;
    }
}
else {
  pagearrlength = fixedpagearrlength;
}
  pagescontainer.innerHTML = '';
  if (pagearray[0]!=1) {
    pagescontainer.insertAdjacentHTML('beforeend', "<li class='page-item active'><a class='arrows' id='leftarrow'><</a></li>");
  }
  for(var i=0;i<pagearrlength;i++){
    if (pagearray[i]==selected) {
      pagescontainer.insertAdjacentHTML('beforeend', "<li class='page-item active'><a class='page-link' id='"+pagearray[i]+"'>"+pagearray[i]+"</a></li>");
    }
    else{
      pagescontainer.insertAdjacentHTML('beforeend', "<li class='page-item'><a class='page-link' id='"+pagearray[i]+"'>"+pagearray[i]+"</a></li>");
    }

}
if (pagearray[pagearrlength-1]!=totalpagesavailable || nextcursor!=null) {
  pagescontainer.insertAdjacentHTML('beforeend', "<li class='page-item active'><a class='arrows' id='rightarrow'>></a></li>");
}
addlistener();
}




function addlistener(){
var clickedpage = document.getElementsByClassName('page-link');
for (var a = 0; a < clickedpage.length; a++) {
    clickedpage[a].addEventListener('click', function(){
      selected = this.id;
      printpagination();
      printresults();
    })
}
if (pagearray[0]!=1) {
document.getElementById('leftarrow').addEventListener('click',function(){
if (pagearray[0]==1) {

}
else{
  currentbatchnum = Math.ceil(pagearray[0] / totalpagesavailable);
currentbatchnum-=1;
  var tindex=pagearray[0]-fixedpagearrlength;


  for(var t=0;t<fixedpagearrlength;t++){
    pagearray[t] = tindex;
    tindex+=1;
  }

  printpagination();
}
})
}
if(pagearray[pagearrlength-1]!=totalpagesavailable){
document.getElementById('rightarrow').addEventListener('click',function(){
if(addressCache[(pagearray[pagearray.length-1]*outputsperpage)+1]==undefined){
  currentbatchnum = Math.ceil(pagearray[0] / fixedpagearrlength);
 currentbatchnum+=1;
  httpsreq('Bearer '+localStorage.getItem("sessionkey")+'','v1/address/'+address+'/outputs/?pagesize=100&cursor='+nextcursor+'','adddataupdatepagearray');
}
else{
  currentbatchnum = Math.ceil(pagearray[0] / fixedpagearrlength);
 currentbatchnum+=1;
  var tindex=0;
  for(var t=(pagearray[fixedpagearrlength-1]+1);t<=(pagearray[pagearrlength-1]+pagearrlength);t++){
    if (t<=totalpagesavailable) {
      pagearray[tindex] = t;
    }
    else {
      pagearray[tindex] = '';
    }
    tindex+=1;
  }
  printpagination();
}
})
}
}
