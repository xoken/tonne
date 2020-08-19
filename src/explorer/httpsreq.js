var rjdecoded;
console.log(localStorage.getItem("sessionkey"));
function httpsreq(functionname, ...reqparameter) {
  if (
    localStorage.getItem("callsremaining") == null ||
    localStorage.getItem("callsremaining") == 3
  ) {
    httpsauth();
  }
  localStorage.setItem(
    "callsremaining",
    parseInt(localStorage.getItem("callsremaining"), 10) - 1
  );

  console.log(reqparameter[0]);
  switch (reqparameter[0]) {
    case "getOutputsByAddress":
      apis.addressAPI
        .getOutputsByAddress(reqparameter[1], reqparameter[2], reqparameter[3])
        .then(data => {
          rjdecoded = data;
          window[functionname]();
        })

        //searchresultsmessage();

        .catch(err => {
          console.log(err);
        });
      break;
    case "getBlockByBlockHash":
      apis.blockAPI
        .getBlockByBlockHash(reqparameter[1])
        .then(data => {
          rjdecoded = data;
          window[functionname]();
        })

        //searchresultsmessage();

        .catch(err => {
          console.log(err);
        });
      break;
    case "getBlockByBlockHeight":
      apis.blockAPI
        .getBlockByBlockHeight(reqparameter[1])
        .then(data => {
          rjdecoded = data;
          window[functionname]();
        })

        //searchresultsmessage();

        .catch(err => {
          console.log(err);
        });
      break;
    case "getBlocksByBlockHeights":
      apis.blockAPI
        .getBlocksByBlockHeights(reqparameter[1])
        .then(data => {
          rjdecoded = data;
          window[functionname]();
        })

        //searchresultsmessage();

        .catch(err => {
          console.log(err);
        });
      break;
    case "getTXIDByHash":
      apis.blockAPI
        .getTXIDByHash(reqparameter[1], reqparameter[2], reqparameter[3])
        .then(data => {
          rjdecoded = data;
          window[functionname]();
        })

        //searchresultsmessage();

        .catch(err => {
          console.log(err);
        });
      break;
    case "getChainInfo":
      apis.chainAPI
        .getChainInfo()
        .then(data => {
          rjdecoded = data;
          window[functionname]();
        })

        //searchresultsmessage();

        .catch(err => {
          console.log(err);
        });
      break;
    case "getTransactionByTxID":
      apis.transactionAPI
        .getTransactionByTxID(reqparameter[1])
        .then(data => {
          rjdecoded = data;
          window[functionname]();
        })

        //searchresultsmessage();

        .catch(err => {
          console.log(err);
        });
      break;
    default:
      console.log("typo in request");
  }
}
