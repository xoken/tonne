const indexPath = path.join("file://", __dirname, "index.html");
const heightpagePath = path.join("file://", __dirname, "blockheight.html");
const trasactionPath = path.join("file://", __dirname, "transaction.html");
const refreshpage = document.getElementById("refreshpage");
const logo = (document.getElementById("logo").href = indexPath);
var blockparam, backblock;
var flag;
var result;
var currentblockhash, numberoftransactions;
var batches,
  currentbatchnum = 1,
  numberofpages,
  pagearray = [0],
  index,
  pagearrlength = 5,
  selected = 1,
  txcache = [],
  numofdisplayedpages,
  serverpagenumber = 1,
  txfinished = 0,
  fixedarrlength = 5;
var txnumber,
  transactionsperpage = 10;

var params = new URL(global.location).searchParams;
if (params.get("blockhash") != undefined) {
  blockparam = params.get("blockhash");
  console.log(blockparam);
  flag = 0;
} else if (params.get("blockheight")) {
  blockparam = params.get("blockheight");
  console.log(blockparam);
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
  document.getElementById("back").innerHTML =
    "<a class='btn btn-primary' href='" +
    indexPath +
    "?blockhei=" +
    rjdecoded.block.height +
    "'>Back</a>";
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
  document.getElementById("txcount").innerHTML = rjdecoded.block.txCount;
  document.getElementById("coinbasetx").innerHTML = rjdecoded.block.coinbaseTx;
  document.getElementById("size").innerHTML = rjdecoded.block.size + " Bytes";
  document.getElementById("coinbasemessage").innerHTML =
    rjdecoded.block.coinbaseMessage;
  document.getElementById("guessedminer").innerHTML =
    rjdecoded.block.guessedMiner;
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
  document.getElementById("bhnonce").innerHTML = rjdecoded.block.header.nonce;
  if (params.get("txindex") != undefined) {
    console.log(params.get("txindex"));
    selected = Math.ceil(
      (parseInt(params.get("txindex"), 10) + 1) / transactionsperpage
    );
    console.log(selected + "selected back");
    currentbatchnum = Math.ceil(selected / fixedarrlength);
    console.log(currentbatchnum + "currentbatchnum back");

    numberofpages = Math.ceil(numberoftransactions / transactionsperpage);

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

    httpsreq(
      "Bearer " + localStorage.getItem("sessionkey") + "",
      "v1/block/txids/" +
        currentblockhash +
        "/?pagenumber=" +
        currentbatchnum +
        "&pagesize=50",
      "enterednumcaching"
    );
  } else {
    currentbatchnum = 1;
    httpsreq(
      "Bearer " + localStorage.getItem("sessionkey") + "",
      "v1/block/txids/" +
        currentblockhash +
        "/?pagenumber=" +
        currentbatchnum +
        "&pagesize=50",
      "paginationinitialisation"
    );
  }
}

refreshpage.innerHTML =
  "<a class='btn btn-primary' href='" +
  global.location +
  "'>Refresh Page</a><br />";

const pagescontainer = document.getElementById("pagination");
var txsection = document.getElementById("transactionsection");
var enteredpagearea = document.getElementById("enteredpagenumber");
const pagebutton = document.getElementById("pagebutton");

pagebutton.addEventListener("click", function () {
  if (enteredpagearea.value != "" && enteredpagearea.value <= numberofpages) {
    selected = enteredpagearea.value;
    currentbatchnum = Math.ceil(selected / fixedarrlength);
    if (txcache[(selected - 1) * transactionsperpage + 1] != undefined) {
      var tempindex, tempind;
      if (currentbatchnum == batches) {
        if (numberofpages % fixedarrlength == 0) {
          pagearrlength = fixedarrlength;
        } else {
          pagearrlength = numberofpages % fixedarrlength;
        }
      } else {
        pagearrlength = fixedarrlength;
      }
      tempindex = (currentbatchnum - 1) * fixedarrlength + 1;
      tempind = (tempindex - 1) * transactionsperpage;
      for (var b = 0; b < pagearrlength; b++) {
        pagearray[b] = tempindex;
        tempindex += 1;
      }
      printpagination();
      transactionprinting();
    } else {
      httpsreq(
        "Bearer " + localStorage.getItem("sessionkey") + "",
        "v1/block/txids/" +
          currentblockhash +
          "/?pagenumber=" +
          currentbatchnum +
          "&pagesize=50",
        "enterednumcaching"
      );
    }
  }
});

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
        currentbatchnum = Math.ceil(pagearray[0] / fixedarrlength);
        currentbatchnum -= 1;
        var tindex = pagearray[0] - fixedarrlength;
        if (txcache[(tindex - 1) * transactionsperpage + 1] == undefined) {
          httpsreq(
            "Bearer " + localStorage.getItem("sessionkey") + "",
            "v1/block/txids/" +
              currentblockhash +
              "/?pagenumber=" +
              currentbatchnum +
              "&pagesize=50",
            "updateleftpaginationarray"
          );
        } else {
          for (var t = 0; t < fixedarrlength; t++) {
            pagearray[t] = tindex;
            tindex += 1;
          }
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
          txcache[pagearray[pagearray.length - 1] * transactionsperpage + 1] ==
          undefined
        ) {
          currentbatchnum = Math.ceil(pagearray[0] / fixedarrlength);
          currentbatchnum += 1;
          httpsreq(
            "Bearer " + localStorage.getItem("sessionkey") + "",
            "v1/block/txids/" +
              currentblockhash +
              "/?pagenumber=" +
              currentbatchnum +
              "&pagesize=50",
            "updatepaginationarray"
          );
        } else {
          currentbatchnum = Math.ceil(pagearray[0] / fixedarrlength);
          currentbatchnum += 1;
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

function enterednumcaching() {
  var tempindex, tempind;
  if (
    Math.ceil(Object.keys(rjdecoded.txids).length / transactionsperpage) <
    fixedarrlength
  ) {
    pagearrlength = Math.ceil(
      Object.keys(rjdecoded.txids).length / transactionsperpage
    );
  }
  tempindex = (currentbatchnum - 1) * fixedarrlength + 1;
  tempind = (tempindex - 1) * transactionsperpage;
  for (var b = 0; b < pagearrlength; b++) {
    pagearray[b] = tempindex;
    tempindex += 1;
  }

  for (var w = 0; w < Object.keys(rjdecoded.txids).length; w++) {
    txcache[tempind] = rjdecoded.txids[w];
    tempind += 1;
  }
  printpagination();
  transactionprinting();
}

function updateleftpaginationarray() {
  var tindex = pagearray[0] - fixedarrlength;
  var tempind = (tindex - 1) * transactionsperpage;
  for (var w = 0; w < Object.keys(rjdecoded.txids).length; w++) {
    txcache[tempind] = rjdecoded.txids[w];
    tempind += 1;
  }
  for (var u = 0; u < fixedarrlength; u++) {
    pagearray[u] = tindex;
    tindex += 1;
  }
  printpagination();
}

function updatepaginationarray() {
  txcaching();
  var pagenum = pagearray[pagearray.length - 1];
  if (txfinished == 0) {
    currentbatchnum = Math.ceil(pagearray[0] / fixedarrlength);
    currentbatchnum += 1;
    for (var t = 0; t < pagearrlength; t++) {
      pagenum += 1;

      if (pagenum <= numberofpages) {
        pagearray[t] = pagenum;
      } else {
        pagearray[t] = "";
      }
    }
  }
  printpagination();
}

function printpagination() {
  if (currentbatchnum == batches) {
    if (numberofpages % fixedarrlength == 0) {
      pagearrlength = fixedarrlength;
    } else {
      pagearrlength = numberofpages % fixedarrlength;
    }
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
    } else {
      pagescontainer.insertAdjacentHTML(
        "beforeend",
        "<li class='page-item'><a class='page-link' id='" +
          pagearray[i] +
          "'>" +
          pagearray[i] +
          "</a></li>"
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
      tempindex = pagearray[pagearray.length - 1] * transactionsperpage;
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
