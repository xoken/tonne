function testapis(...reqparameter) {
  switch (reqparameter[0]) {
    case "getOutputsByAddress":
      apis.addressAPI
        .getOutputsByAddress(reqparameter[1], reqparameter[2], reqparameter[3])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getOutputsByAddresses":
      apis.addressAPI
        .getOutputsByAddresses(
          reqparameter[1],
          reqparameter[2],
          reqparameter[3]
        )
        .then((data) => {
          console.log(data);
        });
      break;
    case "getUTXOsByAddress":
      apis.addressAPI
        .getUTXOsByAddress(reqparameter[1], reqparameter[2], reqparameter[3])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getUTXOsByAddresses":
      apis.addressAPI
        .getUTXOsByAddresses(reqparameter[1], reqparameter[2], reqparameter[3])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getTransactionByTxID":
      apis.transactionAPI.getTransactionByTxID(reqparameter[1]).then((data) => {
        console.log(data);
      });
      break;
    case "getTransactionsByTxIDs":
      apis.transactionAPI
        .getTransactionsByTxIDs(reqparameter[1])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getRawTransactionByTxID":
      apis.transactionAPI
        .getRawTransactionByTxID(reqparameter[1])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getRawTransactionByTxIDs":
      apis.transactionAPI
        .getRawTransactionByTxIDs(reqparameter[1])
        .then((data) => {
          console.log(data);
        });
      break;
    case "broadcastRawTransaction":
      apis.transactionAPI
        .broadcastRawTransaction(reqparameter[1])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getSpendStatusByOutpoint":
      apis.transactionAPI
        .getSpendStatusByOutpoint(reqparameter[1])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getSpendStatusByOutpoint":
      apis.transactionAPI
        .getSpendStatusByOutpoint(reqparameter[1])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getBlockByBlockHeight":
      apis.blockAPI.getBlockByBlockHeight(reqparameter[1]).then((data) => {
        console.log(data);
      });
      break;
    case "getBlocksByBlockHeights":
      apis.blockAPI.getBlocksByBlockHeights(reqparameter[1]).then((data) => {
        console.log(data);
      });
      break;
    case "getBlockByBlockHash":
      apis.blockAPI.getBlockByBlockHash(reqparameter[1]).then((data) => {
        console.log(data);
      });
      break;
    case "getBlocksByBlockHashes":
      apis.blockAPI.getBlocksByBlockHashes(reqparameter[1]).then((data) => {
        console.log(data);
      });
      break;
    case "getTXIDByHash":
      apis.blockAPI
        .getTXIDByHash(reqparameter[1], reqparameter[2], reqparameter[3])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getChainInfo":
      apis.chainAPI.getChainInfo().then((data) => {
        console.log(data);
      });
      break;
    case "getBlockHeaders":
      apis.chainAPI
        .getBlockHeaders(reqparameter[1], reqparameter[2])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getMerkleBranchByTXID":
      apis.merkleBranchAPI
        .getMerkleBranchByTXID(reqparameter[1])
        .then((data) => {
          console.log(data);
        });
      break;
    case "login":
      apis.authAPI.login(reqparameter[1], reqparameter[2]).then((data) => {
        console.log(data);
      });
      break;
    case "getOutputsByScriptHash":
      apis.scriptHashAPI
        .getOutputsByScriptHash(reqparameter[1], reqparameter[2])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getOutputsByScriptHashes":
      apis.scriptHashAPI
        .getOutputsByScriptHashes(reqparameter[1])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getUTXOsByScriptHash":
      apis.scriptHashAPI
        .getUTXOsByScriptHash(reqparameter[1], reqparameter[2])
        .then((data) => {
          console.log(data);
        });
      break;
    case "getUTXOsByScriptHashes":
      apis.scriptHashAPI
        .getUTXOsByScriptHashes(reqparameter[1])
        .then((data) => {
          console.log(data);
        });
      break;
    case "addUser":
      apis.userAPI
        .addUser(
          reqparameter[1],
          reqparameter[2],
          reqparameter[3],
          reqparameter[4]
        )
        .then((data) => {
          console.log(data);
        });
      break;
    case "getUser":
      apis.userAPI.getUser(reqparameter[1]).then((data) => {
        console.log(data);
      });
      break;
    case "getCurrentUser":
      apis.userAPI.getCurrentUser().then((data) => {
        console.log(data);
      });
      break;
    case "updateUser":
      apis.userAPI
        .updateUser(
          reqparameter[1],
          reqparameter[2],
          reqparameter[3],
          reqparameter[4],
          reqparameter[5],
          reqparameter[6],
          reqparameter[7]
        )
        .then((data) => {
          console.log(data);
        });
      break;
    case "deleteUser":
      apis.userAPI.deleteUser(reqparameter[1]).then((data) => {
        console.log(data);
      });
      break;
    default:
      console.log("typo in request");
  }
}

//calls
testapis("getOutputsByAddress", "1AyAQ9nmeJnAsjpVtPefbDd7oyVitaAKik", 10);
