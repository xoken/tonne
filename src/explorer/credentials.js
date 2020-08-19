if (
  localStorage.getItem("firstrun") !== undefined ||
  localStorage.getItem("firstrun") !== "" ||
  localStorage.getItem("firstrun") !== null
) {
  localStorage.setItem(
    "sessionkey",
    "5b994061187267751c4572c8c23897ecd84b58f40f87c145e836cf5aaa03108c"
  );
  localStorage.setItem("firstrun", "completed");
  localStorage.setItem("username", "ExplorerUser");
  localStorage.setItem("password", "OTQ2Nzc1MDIwNDA5MDcyMTM2Ng");
  localStorage.setItem("hostname", "sb1.xoken.org");
  localStorage.setItem("port", 9091);
  localStorage.setItem("callsremaining", 10000);
}

function authprompt() {
  localStorage.setItem("username", "ExplorerUser");
  localStorage.setItem("password", "OTQ2Nzc1MDIwNDA5MDcyMTM2Ng");
  localStorage.setItem("hostname", "sb1.xoken.org");
  localStorage.setItem("port", 9091);
  httpsauth();
}
