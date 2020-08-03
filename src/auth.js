var https = require("https");
const path = require("path");
var apis = require("nipkow-sdk");
console.log(apis);
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
  apis.authAPI
    .login(
      "" + localStorage.getItem("username") + "",
      "" + localStorage.getItem("password") + ""
    )
    .then((data) => {
      console.log(data.auth.sessionKey);
      if (Object.keys(data).length !== 0) {
        localStorage.setItem("sessionkey", data.auth.sessionKey);
        localStorage.setItem("callsremaining", data.auth.callsRemaining);
        window.location.reload();
      }
    })
    .catch((err) => {
      console.log(err);
      authprompt();
      authlistener("Error: Enter correct details");
      console.log("called from error");
    });
}
