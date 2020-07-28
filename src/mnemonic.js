const crypto = require("crypto");
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

var words = [
  "a",
  "abandon",
  "ability",
  "able",
  "abortion",
  "about",
  "above",
  "abroad",
  "absence",
  "absolute",
  "absolutely",
  "absorb",
  "abuse",
  "academic",
  "accept",
  "access",
  "accident",
  "accompany",
  "accomplish",
  "according",
  "account",
  "accurate",
  "accuse",
  "achieve",
  "achievement",
  "acid",
  "acknowledge",
  "acquire",
  "across",
  "act",
  "action",
  "active",
  "activist",
  "activity",
  "actor",
  "actress",
  "actual",
  "actually",
  "ad",
  "adapt",
  "add",
  "addition",
  "additional",
  "address",
  "adequate",
  "adjust",
  "adjustment",
  "administration",
  "administrator",
  "admire",
  "admission",
  "admit",
  "adolescent",
  "adopt",
  "adult",
  "advance",
  "advanced",
  "advantage",
  "adventure",
  "advertising",
  "advice",
  "advise",
  "adviser",
  "advocate",
  "affair",
  "affect",
  "afford",
  "afraid",
  "african",
  "african-american",
  "after",
  "afternoon",
  "again",
  "against",
  "age",
  "agency",
  "agenda",
  "agent",
  "aggressive",
  "ago",
  "agree",
  "agreement",
  "agricultural",
  "ah",
  "ahead",
  "aid",
  "aide",
  "aim",
  "air",
  "aircraft",
  "airline",
  "airport",
  "album",
  "alcohol",
  "alive",
  "all",
  "alliance",
  "allow",
  "ally",
  "almost",
  "alone",
  "along",
  "already",
  "also",
  "alter",
  "alternative",
  "although",
  "always",
  "am",
  "amazing",
  "american",
  "among",
  "amount",
  "analysis",
  "analyst",
  "analyze",
  "ancient",
  "and",
  "anger",
  "angle",
  "angry",
  "animal",
  "anniversary",
  "announce",
  "annual",
  "another",
  "answer",
  "anticipate",
  "anxiety",
  "any",
  "anybody",
  "anymore",
  "anyone",
  "anything",
  "anyway",
  "anywhere",
  "apart",
  "apartment",
  "apparent",
  "apparently",
  "appeal",
  "appear",
  "appearance",
  "apple",
  "application",
  "apply",
  "appoint",
  "appointment",
  "appreciate",
  "approach",
  "appropriate",
  "approval",
  "approve",
  "approximately",
  "arab",
  "architect",
  "area",
  "argue",
  "argument",
  "arise",
  "arm",
  "armed",
  "army",
  "around",
  "arrange",
  "arrangement",
  "arrest",
  "arrival",
  "arrive",
  "art",
  "article",
  "artist",
  "artistic",
  "as",
  "asian",
  "aside",
  "ask",
  "asleep",
  "aspect",
  "assault",
  "assert",
  "assess",
  "assessment",
  "asset",
  "assign",
  "assignment",
  "assist",
  "assistance",
  "assistant",
  "associate",
  "association",
  "assume",
  "assumption",
  "assure",
  "at",
  "athlete",
  "athletic",
  "atmosphere",
  "attach",
  "attempt",
  "attend",
  "attention",
  "attitude",
  "attorney",
  "attract",
  "attractive",
  "attribute",
  "audience",
  "author",
  "authority",
  "auto",
  "available",
  "average",
  "avoid",
  "award",
  "aware",
  "awareness",
  "away",
  "awful",
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
      console.log(rindex);
      temp = alphabetarray[index];
      alphabetarray[index] = alphabetarray[rindex];
      alphabetarray[rindex] = temp;
      console.log(alphabetarray);
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
      splitwords[splitwords.length - 1];
      wordsuggest(
        splitwords[splitwords.length - 1].length,
        splitwords[splitwords.length - 1]
      );
    });
  }
}

function wordsuggest(len, cont) {
  suggestion.innerHTML = "";
  if (len != 0) {
    for (var w = 0; w < words.length; w++) {
      if (words[w].substring(0, len) == cont) {
        suggestion.innerHTML += "<li class='wordlist'>" + words[w] + "</li>";
        if (w == 49) {
          break;
        }
      }
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
    mnemonic.textContent = mnemonic.textContent.substring(
      0,
      mnemonic.textContent.length - 1
    );
    wordsuggest(mnemonic.textContent.length, mnemonic.textContent);
  }
}
