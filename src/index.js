const indexPath = path.join('file://', __dirname, 'index.html');
const heightpagePath = path.join('file://', __dirname, 'blockheight.html');

const resultsrow = document.getElementById('rowstoinsert');
const blockhand = document.getElementsByClassName('blockheights');
const logo = document.getElementById('logo').href = indexPath;
var date,result,backpagenum,blockhei='';
var heightlist='';
var size;
var syncedblocksheight;
var numberofpages,pagearray,index,pagearrlength=9,selected = 1;



result = global.location.search.match(/\?blockhei\=/i);
blockhei = global.location.search.replace(result, '');

function summary(){
syncedblocksheight = rjdecoded.chainInfo.blocksSynced;
numberofpages = Math.ceil(syncedblocksheight/10);
pagearray = [1,2,3,4,5,6,7,'-',numberofpages];
document.getElementById('summarysection').innerHTML = "<tr><td><b>Chainwork</b><br />"+rjdecoded.chainInfo.chainwork+"</td><td><b>Blocks Synced</b><br />"+rjdecoded.chainInfo.blocksSynced+"</td><td><b>Chain Tip</b><br />"+rjdecoded.chainInfo.chainTip+"</td></tr><tr><td><b>Chain</b><br />"+rjdecoded.chainInfo.chain+"</td><td><b>Synced Block Hash</b><br /><a style='word-break:break-all;'>"+rjdecoded.chainInfo.syncedBlockHash+"</a></td><td><b>Chain Tip Hash</b><br /><a style='word-break:break-all;'>"+rjdecoded.chainInfo.chainTipHash+"</a></td></tr>";
if (blockhei!='') {
  selected = (numberofpages - Math.ceil(blockhei/10));
  if (selected <= (pagearrlength-2)) {
    index = 1;
  }
  else if (selected >= (numberofpages-(pagearrlength-2))) {
    index = pagearrlength;
  }
}
updatepagearray();
updateheightlist();
printpagination();
httpsreq('Bearer '+localStorage.getItem("sessionkey")+'','v1/block/heights/?'+heightlist+'','printresults');
}


if (localStorage.getItem("username")!=undefined || localStorage.getItem("username")!='') {
checksession();
}

function checksession(){
if((localStorage.getItem("callsremaining") == null) || (localStorage.getItem("callsremaining") <= 3)){
  httpsauth();
  setTimeout(checksession, 3000);
}
else {
  httpsreq('Bearer '+localStorage.getItem("sessionkey")+'','v1/chain/info','summary');
}
}

var enteredpagearea = document.getElementById('enteredpagenumber');
const pagebutton = document.getElementById('pagebutton');
const pagescontainer = document.getElementById('pagination');

pagebutton.addEventListener('click', function(){
  if ((enteredpagearea.value!='') && (enteredpagearea.value <= numberofpages)) {
    selected = enteredpagearea.value;
    updateheightlist();
    httpsreq('Bearer '+localStorage.getItem("sessionkey")+'','v1/block/heights/?'+heightlist+'','printresults');
    console.log(selected);
    if (selected <= (pagearrlength-2)) {
      index = 1;
    }
    else if (selected >= (numberofpages-(pagearrlength-2))) {
      index = pagearrlength;
    }
    updatepagearray();
  }
})


function updateheightlist(){
  var tempheight = syncedblocksheight - ((selected - 1) * 10);
  heightlist = '';
  for(var c=0;c<10;c++)
  {
  heightlist += "height="+tempheight;
  if(c!=9){heightlist += "&";}
  tempheight-=1;
  }

}

function addlistener(){
var clickedpage = document.getElementsByClassName('page-link');
for (var a = 0; a < clickedpage.length; a++) {
    clickedpage[a].addEventListener('click', function(){
      selected = this.id;
      updateheightlist();
      updatepagearray();
      httpsreq('Bearer '+localStorage.getItem("sessionkey")+'','v1/block/heights/?'+heightlist+'','printresults');

    })
}
}

function updatepagearray(){
  if (numberofpages > pagearrlength) {
  var b,tempindex;
  if (pagearray.indexOf(parseInt(selected)) >= 0) {
    index = pagearray.indexOf(parseInt(selected));
  }

  if (((index <= (Math.floor(pagearrlength/2))) && (selected <= (Math.ceil(numberofpages/3)))) && (selected <= (pagearrlength-2)))
  {
    pagearray[pagearrlength-2] = '-';
    for(b=0;b<(pagearrlength-2);b++){
      pagearray[b] = b+1;
    }
  }
  else if(((index >= (Math.floor(pagearrlength/2))) && (selected >= (Math.ceil((numberofpages/3)*2)))) && (selected >= (numberofpages-(Math.floor(pagearrlength/3)+2))))
  {
    var temppages = numberofpages;
    pagearray[1] = '-';
    for(b=pagearrlength-1;b>=2;b--){
      pagearray[b] = temppages--;
    }
  }
  else
  {

    tempindex = (selected-2);
    pagearray[pagearrlength-2] = '-';
    pagearray[1] = '-';
    for(b=2;b<(pagearrlength-2);b++){
      pagearray[b] = tempindex++;
    }
  }
}
printpagination();
}

function printpagination(){
  pagescontainer.innerHTML = '';
  for(var i=0;i<pagearrlength;i++){
    if (pagearray[i]==selected) {
      pagescontainer.insertAdjacentHTML('beforeend', "<li class='page-item active'><a class='page-link' id='"+pagearray[i]+"'>"+pagearray[i]+"</a></li>");
    }
    else if(pagearray[i]!='-'){
      pagescontainer.insertAdjacentHTML('beforeend', "<li class='page-item'><a class='page-link' id='"+pagearray[i]+"'>"+pagearray[i]+"</a></li>");
    }
    else{
      pagescontainer.insertAdjacentHTML('beforeend', "<li class='page-item disabled'><a class='emptypagelink' id='"+pagearray[i]+"'>...</a></li>");
    }
}
addlistener();
}


function printresults(){
  resultsrow.innerHTML = '';
  resultsrow.innerHTML ="<tr class='thborder'><th>Height</th><th>Timestamp (UTC)</th><th>Age</th><th>Block Version</th><th>Transactions</th></tr>";
  size = Object.keys(rjdecoded.blocks).length;
  var todaysdate, age;
    for(var i=size-1;i>=0;i--){

  date = new Date(rjdecoded.blocks[i].header.blockTimestamp*1000);
  todaysdate = ((Date.now() - rjdecoded.blocks[i].header.blockTimestamp));
  age = new Date(todaysdate);
  resultsrow.innerHTML += "<tr class='tablerowbottom'><td class='blockheights'><a href='"+heightpagePath+"?blockheight="+rjdecoded.blocks[i].height+"'>"+rjdecoded.blocks[i].height+"</a></td><td>"+date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()+"<br />"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"</td><td>"+age.getHours()+":"+age.getMinutes()+":"+age.getSeconds()+"</td><td>"+rjdecoded.blocks[i].header.blockVersion+"</td><td>"+rjdecoded.blocks[i].txCount+"</td></tr>";

  }
}
