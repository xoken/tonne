const crypto = require("crypto");
var fs = require("fs");
var readtext = fs.readFileSync("assets/wordlist/english.txt", {
  encoding: "utf8",
  flag: "r",
});
const indexPath = path.join("file://", __dirname, "index.html");
const logo = (document.getElementById("logo").href = indexPath);
var words = readtext.split("\n");
var data,
  randomnumber,
  temp,
  rindex,
  counter = 0;
var alphabetul = "";
var mnemonic = document.getElementById("mnemonic");
var suggestion = document.getElementById("suggestions");
var mnemoniccount = 12;
document.getElementById("backspc").addEventListener("click", function () {
  backspace();
});
var alphabetarray = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

mix();
function mix() {
  var index = alphabetarray.length - 1;
  for (var i = 0; i < alphabetarray.length; i++) {
    if (counter == alphabetarray.length * 20) {
      printalphabets(alphabetarray);
      break;
    }
    crypto.randomBytes(5, (err, buf) => {
      if (err) throw err;
      counter += 1;
      data = buf.toString("hex");
      randomnumber = parseInt(data, 16);
      rindex = randomnumber % 26;
      //console.log(rindex);
      temp = alphabetarray[index];
      alphabetarray[index] = alphabetarray[rindex];
      alphabetarray[rindex] = temp;
      //console.log(alphabetarray);
      index -= 1;
      if (0 == counter % 26) {
        mix();
      }
    });
  }
}

function printalphabets(array) {
  for (var a = 0; a < array.length; a++) {
    alphabetul += "<li class='letter'>" + array[a] + "</li>";
  }
  document.getElementById("alphabets").innerHTML = alphabetul;
  letteraddlistener();
}

function letteraddlistener() {
  var splitwords;
  var letters = document.getElementsByClassName("letter");
  for (var c = 0; c < letters.length; c++) {
    letters[c].addEventListener("click", function () {
      mnemonic.textContent += this.textContent;
      splitwords = mnemonic.textContent.split(" ");
      document.getElementById("wordsremaining").textContent =
        "(" + splitwords.length + " of 12)";
      wordsuggest(
        splitwords[splitwords.length - 1].length,
        splitwords[splitwords.length - 1]
      );
    });
  }
}

function wordsuggest(len, cont) {
  var count = 0;
  var tempsuggestion = "";
  suggestion.innerHTML = "";
  if (len != 0) {
    for (var w = 0; w < words.length; w++) {
      if (words[w].substring(0, len) == cont) {
        tempsuggestion += "<li class='wordlist'>" + words[w] + "</li>";
        count += 1;
      }
    }
    if (count <= 36) {
      suggestion.innerHTML += tempsuggestion;
    }
  }
  wordaddlistener();
}

function wordaddlistener() {
  var wordlist = document.getElementsByClassName("wordlist");
  var splitwords, tempmnemonic;
  for (var d = 0; d < wordlist.length; d++) {
    wordlist[d].addEventListener("click", function () {
      tempmnemonic = mnemonic.textContent;
      splitwords = tempmnemonic.split(" ");
      splitwords[splitwords.length - 1] = this.textContent;
      mnemonic.textContent = "";
      document.getElementById("wordsremaining").textContent =
        "(" + splitwords.length + " of 12)";
      for (var n = 0; n < splitwords.length; n++) {
        mnemonic.textContent += splitwords[n] + " ";
      }
      suggestion.innerHTML = "";
      if (splitwords.length == mnemoniccount) {
        document.getElementById("alphabets").style.display = "none";
        document.getElementById("backspc").style.display = "none";
      }
    });
  }
}

function backspace() {
  if (mnemonic.textContent.length != 0) {
    var splitwords;
    mnemonic.textContent = mnemonic.textContent.substring(
      0,
      mnemonic.textContent.length - 1
    );
    splitwords = mnemonic.textContent.split(" ");
    if (mnemonic.textContent.length != 0) {
      document.getElementById("wordsremaining").textContent =
        "(" + splitwords.length + " of 12)";
    } else {
      document.getElementById("wordsremaining").textContent = "(0 of 12)";
    }
    wordsuggest(
      splitwords[splitwords.length - 1].length,
      splitwords[splitwords.length - 1]
    );
  }
}
