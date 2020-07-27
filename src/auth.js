var https = require("https");
const path = require("path");
var sjdecoded;
var sendcredentials = "";
var soptions = {};

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

if (
  localStorage.getItem("username") == undefined ||
  localStorage.getItem("password") == undefined ||
  localStorage.getItem("hostname") == undefined ||
  localStorage.getItem("port") == undefined ||
  localStorage.getItem("username") == "" ||
  localStorage.getItem("password") == "" ||
  localStorage.getItem("hostname") == "" ||
  localStorage.getItem("port") == ""
) {
  authprompt();
  authlistener("");
  console.log("called from undefined");
} else {
  if (
    localStorage.getItem("callsremaining") == null ||
    localStorage.getItem("callsremaining") <= 3
  ) {
    httpsauth();
    console.log("httpsauth called from else in auth");
  }
}

function httpsauth() {
  sendcredentials =
    '{ "username":"' +
    localStorage.getItem("username") +
    '", "password":"' +
    localStorage.getItem("password") +
    '"}';
  soptions = {
    hostname: localStorage.getItem("hostname"),
    port: parseInt(localStorage.getItem("port"), 10),
    path: "/v1/auth",
    method: "POST",
    protocol: "https:",
    headers: {
      "Content-type": "application/json",
      "Content-Length": Buffer.byteLength(sendcredentials),
    },
  };
  const sreq = https.request(soptions, (sres) => {
    console.log(soptions);
    console.log(sendcredentials);
    console.log("STATUS: " + sres.statusCode);
    console.log("HEADERS: " + JSON.stringify(sres.headers));
    sres.setEncoding("utf8");
    sres.on("data", (chunk) => {
      console.log("BODY: " + chunk);

      try {
        sjdecoded = JSON.parse(chunk);
      } catch (e) {
        sjdecoded = {};
      }
      if (Object.keys(sjdecoded).length !== 0) {
        localStorage.setItem("sessionkey", sjdecoded.auth.sessionKey);
        localStorage.setItem("callsremaining", sjdecoded.auth.callsRemaining);
        //localStorage.setItem("callsused",sjdecoded.auth.callsUsed);
        window.location.reload();
      }
    });
    sres.on("end", () => {
      console.log("No more data in response.");
    });
  });

  sreq.on("error", (e) => {
    console.error(e.message);
    authprompt();
    authlistener("Error: Enter correct details");
    console.log("called from error");
  });

  // Write data to request body
  sreq.write(sendcredentials);
  sreq.end();
}
