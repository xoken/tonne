const indexPath = path.join("file://", __dirname, "index.html");
const logo = (document.getElementById("logo").href = indexPath);

var cryptolist = document.getElementById("cryptolist");
var cryptologo = document.getElementById("cryptologo");
var sendcur = document.getElementById("sendcur");
var receivecur = document.getElementById("receivecur");
var popupcontent = document.getElementById("popupcontent");
var pop = document.getElementById("pop");

var cryptolistarray = [
  {
    currencyName: "Bitcoin SV",
    tickerSymbol: "BSV",
    backgroundcolor: "#eab300",
    color: "white",
  },
  {
    currencyName: "Bitcoin",
    tickerSymbol: "BTC",
    backgroundcolor: "#f7931a",
    color: "white",
  },
  {
    currencyName: "Bitcoin Cash",
    tickerSymbol: "BCH",
    backgroundcolor: "#8dc351",
    color: "white",
  },
  {
    currencyName: "Cardano",
    tickerSymbol: "ADA",
    backgroundcolor: "#3102b3",
    color: "white",
  },
];

for (var i = 0; i < cryptolistarray.length; i++) {
  cryptolist.innerHTML +=
    "<tr class='cryptolistitems' id='" +
    cryptolistarray[i].tickerSymbol +
    "'><td>" +
    cryptolistarray[i].currencyName +
    "</td><td style='background-color:" +
    cryptolistarray[i].backgroundcolor +
    ";'>" +
    cryptolistarray[i].tickerSymbol +
    "</td></tr>";
}

sendcur.style.background = cryptolistarray[0].backgroundcolor;
receivecur.style.background = cryptolistarray[0].backgroundcolor;
sendcur.style.setProperty("color", cryptolistarray[0].color, "important");
receivecur.style.setProperty("color", cryptolistarray[0].color, "important");
cryptologo.innerHTML = "<img src='../assets/images/bsv.png'>";
sendcur.setAttribute("onclick", "spopup('bsv');");
receivecur.setAttribute("onclick", "rpopup('bsv');");
document
  .querySelector(".cryptolistitems")
  .firstChild.classList.add("lightgreybackground");
document
  .querySelector(".cryptolistitems")
  .lastChild.classList.add("originalposofticker");

var cryptolistitems = document.getElementsByClassName("cryptolistitems");
for (var a = 0; a < cryptolistitems.length; a++) {
  cryptolistitems[a].addEventListener("mouseover", function () {
    var index = cryptolistarray.findIndex(
      (element) => element.tickerSymbol === this.id
    );
    document
      .querySelector(".lightgreybackground")
      .classList.remove("lightgreybackground");
    document
      .querySelector(".originalposofticker")
      .classList.remove("originalposofticker");
    this.firstChild.classList.add("lightgreybackground");
    this.lastChild.classList.add("originalposofticker");
    sendcur.style.background = cryptolistarray[index].backgroundcolor;
    receivecur.style.background = cryptolistarray[index].backgroundcolor;
    sendcur.style.setProperty(
      "color",
      cryptolistarray[index].color,
      "important"
    );
    receivecur.style.setProperty(
      "color",
      cryptolistarray[index].color,
      "important"
    );
    cryptologo.innerHTML =
      "<img src='../assets/images/" + this.id.toLowerCase() + ".png'>";
    sendcur.setAttribute("onclick", "spopup('" + this.id.toLowerCase() + "');");
    receivecur.setAttribute(
      "onclick",
      "rpopup('" + this.id.toLowerCase() + "');"
    );
  });
}

function spopup(ticker) {
  pop.style.display = "block";
  popupcontent.innerHTML =
    "<div class='form-group'><label for='receiveraddress'><h5>Send " +
    ticker.toUpperCase() +
    " to the Address</h5></label><input type='text' class='form-control' id='receiveraddress' placeholder='1xxxxxxxxxxxxxxxxxxxxxxxx'/></div>";
}
function popupclose() {
  pop.style.display = "none";
}

function rpopup(ticker) {
  pop.style.display = "block";
  popupcontent.innerHTML =
    "<div class='form-group'><label for='youraddress'><h5>Your " +
    ticker.toUpperCase() +
    " Address</h5></label><input type='text' class='form-control' id='youraddress' placeholder='1xxxxxxxxxxxxxxxxxxxxxxxx'/></div>";
}
