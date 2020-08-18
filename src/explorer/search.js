const inpath = path.join("file://", __dirname, "index.html");
const blhpath = path.join("file://", __dirname, "blockheight.html");
const addpath = path.join("file://", __dirname, "address.html");
const txpath = path.join("file://", __dirname, "transaction.html");

var searchterm = document.getElementById("search");
var searchbutton = document.getElementById("searchbtn");
var searchmesssage = document.getElementById("searchmsg");
var searchnegative = document.getElementById("searchnegative");

searchbutton.addEventListener("click", function() {
  if (searchterm.value != "") {
    if (searchterm.value.length < 26) {
      window.location.replace(
        blhpath + "?blockheight=" + searchterm.value + ""
      );
    } else if (searchterm.value.length >= 26 && searchterm.value.length <= 35) {
      window.location.replace(addpath + "?address=" + searchterm.value + "");
    } else if (searchterm.value.length == 64) {
      //  if (searchterm.value.substring(0, 3) == "000") {
      //    window.location.replace(
      //      blhpath + "?blockhash=" + searchterm.value + ""
      //    );
      //  } else {
      window.location.replace(txpath + "?transaction=" + searchterm.value + "");
      //  }
    } else {
      searchresultsmessage();
    }
  }
});

function searchresultsmessage() {
  searchmesssage.innerHTML = "No results found";
  searchnegative.style.visibility = "hidden";
}
