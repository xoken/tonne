const path = require("path");
const indexPath = path.join("file://", __dirname, "index.html");
const heightpagePath = path.join("file://", __dirname, "blockheight.html");
const trasactionPath = path.join("file://", __dirname, "transaction.html");
var jsonreq = "";
var jsonreq1 = "";
const refreshpage = document.getElementById("refreshpage");
const logo = (document.getElementById("logo").href = indexPath);
//var sjdecoded,rjdecoded;
var blockparam;
var flag;
var result;
var fullresp = "";
var sessionflag = 0,
  dataflag = 1;
var firstfourbytes = 0;
var sessionresponse,
  sessionresponseflag = 0;
var rresponseflag = 0;
var sbuffer = "",
  rbuffer = "";
var currentblockhash, numberoftransactions;
result = global.location.search.match(/\?blockhash\=/i);
if (result == "?blockhash=") {
  blockparam = global.location.search.replace(result, "");
  flag = 0;
} else {
  result = global.location.search.match(/\?blockheight\=/i);
  blockparam = global.location.search.replace(result, "");
  flag = 1;
}

//note to self : remove the following code if you enable httpsauth();
if (flag == 0) {
  httpsreq(
    "Bearer " + localStorage.getItem("sessionkey") + "",
    "v1/block/hash/" + blockparam + "",
    "printresults"
  );
} else {
  httpsreq(
    "Bearer " + localStorage.getItem("sessionkey") + "",
    "v1/block/height/" + blockparam + "",
    "printresults"
  );
}

function printresults() {
  currentblockhash = rjdecoded.block.hash;
  numberoftransactions = rjdecoded.block.txCount;
  date = new Date(rjdecoded.block.header.blockTimestamp * 1000);
  document.getElementById("nextblock").innerHTML =
    "<a href='" +
    heightpagePath +
    "?blockhash=" +
    rjdecoded.block.nextBlockHash +
    "'>" +
    rjdecoded.block.nextBlockHash +
    "</a>";
  document.getElementById("blocktitle").innerHTML =
    "#" + rjdecoded.block.height;
  document.getElementById("title").innerHTML =
    "Block - " + rjdecoded.block.hash;
  document.getElementById("blockhash").innerHTML =
    "Block - " + rjdecoded.block.hash;
  document.getElementById("previousblock").innerHTML =
    "<a href='" +
    heightpagePath +
    "?blockhash=" +
    rjdecoded.block.header.prevBlock +
    "'>" +
    rjdecoded.block.header.prevBlock +
    "</a>";
  document.getElementById("blockversion").innerHTML =
    rjdecoded.block.header.blockVersion;
  document.getElementById("merkleroot").innerHTML =
    rjdecoded.block.header.merkleRoot;
  document.getElementById("blockbits").innerHTML =
    rjdecoded.block.header.blockBits;
  document.getElementById("timestamp").innerHTML =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " - " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  document.getElementById("bhnonce").innerHTML = rjdecoded.block.header.bhNonce;
  httpsreq(
    "Bearer " + localStorage.getItem("sessionkey") + "",
    "v1/block/txids/" + currentblockhash + "/?pagenumber=1&pagesize=50",
    "paginationinitialisation"
  );
}

refreshpage.innerHTML =
  "<a class='btn btn-primary' href='" +
  global.location +
  "'>Refresh Page</a><br />";
document.getElementById("back").innerHTML =
  "<a class='btn btn-primary' href='" + indexPath + "'>Back</a>";
var batches,
  currentbatchnum = 1,
  numberofpages,
  pagearray = [0],
  index,
  pagearrlength,
  selected,
  txcache = [],
  numofdisplayedpages,
  serverpagenumber = 1,
  txfinished = 0,
  fixedarrlength;
var txnumber,
  transactionsperpage = 10;
const pagescontainer = document.getElementById("pagination");
var txsection = document.getElementById("transactionsection");

function addlistener() {
  var clickedpage = document.getElementsByClassName("page-link");
  for (var a = 0; a < clickedpage.length; a++) {
    clickedpage[a].addEventListener("click", function () {
      selected = this.id;
      printpagination();
      transactionprinting();
    });
  }
  if (pagearray[0] != 1) {
    document.getElementById("leftarrow").addEventListener("click", function () {
      if (pagearray[0] == 1) {
      } else {
        currentbatchnum -= 1;
        //console.log(currentbatchnum);
        var tindex = pagearray[0] - fixedarrlength;

        for (var t = 0; t < fixedarrlength; t++) {
          //console.log(tindex);
          pagearray[t] = tindex;
          tindex += 1;
        }
        printpagination();
      }
    });
  }
  if (pagearray[pagearrlength - 1] != numberofpages) {
    document
      .getElementById("rightarrow")
      .addEventListener("click", function () {
        if (
          pagearray[pagearrlength - 1] == numofdisplayedpages &&
          txfinished == 0
        ) {
          httpsreq(
            "Bearer " + localStorage.getItem("sessionkey") + "",
            "v1/block/txids/" +
              currentblockhash +
              "/?pagenumber=" +
              serverpagenumber +
              "&pagesize=50",
            "updatepaginationarray"
          );
        } else {
          currentbatchnum += 1;
          //console.log(currentbatchnum);
          var tindex = 0;
          for (
            var t = pagearray[fixedarrlength - 1] + 1;
            t <= pagearray[pagearrlength - 1] + pagearrlength;
            t++
          ) {
            if (t <= numberofpages) {
              pagearray[tindex] = t;
            } else {
              pagearray[tindex] = "";
            }
            tindex += 1;
          }
          printpagination();
        }
      });
  }
}

function updatepaginationarray() {
  txcaching();
  if (txfinished == 0) {
    currentbatchnum += 1;
    //console.log(currentbatchnum);
    for (var t = 0; t < pagearrlength; t++) {
      numofdisplayedpages += 1;

      if (numofdisplayedpages <= numberofpages) {
        pagearray[t] = numofdisplayedpages;
      } else {
        pagearray[t] = "";
      }
    }
  }
  /*else{
  var tindex=0;
  for(var t=(pagearray[pagearrlength-1]+1);t<=(pagearray[pagearrlength-1]+pagearrlength);t++){

    if (t<=numberofpages) {
      pagearray[tindex] = t;
    }
    else {
      pagearray[tindex] = '';
    }
    tindex+=1;
  }
}*/
  printpagination();
}

function printpagination() {
  if (currentbatchnum == batches) {
    pagearrlength = numberofpages % fixedarrlength;
  } else {
    pagearrlength = fixedarrlength;
  }
  pagescontainer.innerHTML = "";
  if (pagearray[0] != 1) {
    pagescontainer.insertAdjacentHTML(
      "beforeend",
      "<li class='page-item active'><a class='arrows' id='leftarrow'><</a></li>"
    );
  }
  for (var i = 0; i < pagearrlength; i++) {
    if (pagearray[i] == selected) {
      pagescontainer.insertAdjacentHTML(
        "beforeend",
        "<li class='page-item active'><a class='page-link' id='" +
          pagearray[i] +
          "'>" +
          pagearray[i] +
          "</a></li>"
      );
    } else if (pagearray[i] != "-") {
      pagescontainer.insertAdjacentHTML(
        "beforeend",
        "<li class='page-item'><a class='page-link' id='" +
          pagearray[i] +
          "'>" +
          pagearray[i] +
          "</a></li>"
      );
    } else {
      pagescontainer.insertAdjacentHTML(
        "beforeend",
        "<li class='page-item disabled'><a class='emptypagelink' id='" +
          pagearray[i] +
          "'>...</a></li>"
      );
    }
  }
  if (pagearray[pagearrlength - 1] != numberofpages) {
    pagescontainer.insertAdjacentHTML(
      "beforeend",
      "<li class='page-item active'><a class='arrows' id='rightarrow'>></a></li>"
    );
  }
  addlistener();
}

function transactionprinting() {
  txsection.innerHTML = "";
  var printbreaker = 1;
  txnumber = (selected - 1) * transactionsperpage;
  for (var k = txnumber; k < numberoftransactions; k++) {
    txsection.innerHTML +=
      "<tr class='txrows'><td>" +
      (txnumber + printbreaker) +
      " - <a href='" +
      trasactionPath +
      "?transaction=" +
      txcache[k] +
      "'>" +
      txcache[k] +
      "</a></td></tr>";
    if (printbreaker == transactionsperpage) {
      break;
    }
    printbreaker += 1;
  }
}

function paginationinitialisation() {
  fixedarrlength = pagearrlength = 5;
  selected = 1;
  if (Object.keys(rjdecoded.txids).length > 0) {
    if (numberoftransactions >= transactionsperpage) {
      numberofpages = Math.ceil(numberoftransactions / transactionsperpage);
    } else {
      numberofpages = 1;
    }

    if (numberofpages <= pagearrlength) {
      numofdisplayedpages = numberofpages;
      pagearrlength = numberofpages;
    } else {
      numofdisplayedpages = pagearrlength;
    }
    for (var i = 0; i < pagearrlength; i++) {
      pagearray[i] = i + 1;
    }
    batches = Math.ceil(numberofpages / fixedarrlength);
    txcaching();
    transactionprinting();
    printpagination();
  }
}

function txcaching() {
  if (Object.keys(rjdecoded.txids).length > 0) {
    var tempindex;
    if (txcache.length == 0) {
      tempindex = 0;
    } else {
      tempindex = numofdisplayedpages * transactionsperpage;
    }
    for (var k = 0; k < Object.keys(rjdecoded.txids).length; k++) {
      txcache[tempindex] = rjdecoded.txids[k];
      tempindex += 1;
    }
    if (
      Math.ceil(Object.keys(rjdecoded.txids).length / transactionsperpage) <
      fixedarrlength
    ) {
      pagearrlength = Math.ceil(
        Object.keys(rjdecoded.txids).length / transactionsperpage
      );
    }
  } else {
    txfinished = 1;
  }
}
