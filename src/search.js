const inpath = path.join('file://', __dirname, 'index.html');
const blhpath = path.join('file://', __dirname, 'blockheight.html');
const addpath = path.join('file://', __dirname, 'address.html');
const txpath = path.join('file://', __dirname, 'transaction.html');
const scriphpath = path.join('file://', __dirname, 'scripthash.html');

var searchterm = document.getElementById('search');
var searchbutton = document.getElementById('searchbtn');
var searchmesssage = document.getElementById('searchmsg');
var searchnegative = document.getElementById('searchnegative');

searchbutton.addEventListener('click', function(){
  if(searchterm.value!=''){
  if(searchterm.value.length < 26)
  {
    window.location.replace(blhpath+'?blockheight='+searchterm.value+'');
  }
  else if(searchterm.value.length >= 26 && searchterm.value.length <= 35){
    if (searchterm.value.substring(0,1)=='1' || searchterm.value.substring(0,1)=='3' || searchterm.value.substring(0,3)=='bc1') {
      window.location.replace(addpath+'?address='+searchterm.value+'');
    }
    else {
      searchresultsmessage();
    }
  }
  else if (searchterm.value.length == 64) {
    if (searchterm.value.substring(0,3)=='000') {
      window.location.replace(blhpath+'?blockhash='+searchterm.value+'');
    }
    else{
      window.location.replace(blhpath+'?transaction='+searchterm.value+'');
    }

  }
  else {
    searchresultsmessage();
  }
}
})

function searchresultsmessage(){
    searchmesssage.innerHTML = "No results found";
    searchnegative.style.visibility = 'hidden';
}
