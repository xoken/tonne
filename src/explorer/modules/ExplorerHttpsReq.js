import { addressAPI, blockAPI, chainAPI, transactionAPI } from 'nipkow-sdk';
import { setConfig } from '../../shared/modules/Authenticator';

export default class ExplorerHttpsReq {
  static async httpsreq(...reqparameter) {
    const callsRemaining = Number(localStorage.getItem('callsRemaining'));
    if (callsRemaining === 3) {
      const nexaHost = localStorage.getItem('nexaHost');
      const nexaPort = localStorage.getItem('nexaPort');
      const username = localStorage.getItem('userName');
      const password = localStorage.getItem('password');
      await setConfig(nexaHost, nexaPort, username, password);
    }
    let tobeReturned;
    switch (reqparameter[0]) {
      case 'getOutputsByAddress':
        tobeReturned = addressAPI
          .getOutputsByAddress(reqparameter[1], reqparameter[2], reqparameter[3])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getBlockByBlockHash':
        tobeReturned = blockAPI
          .getBlockByBlockHash(reqparameter[1])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getBlockByBlockHeight':
        tobeReturned = blockAPI
          .getBlockByBlockHeight(reqparameter[1])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getBlocksByBlockHeights':
        tobeReturned = blockAPI
          .getBlocksByBlockHeights(reqparameter[1])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getTXIDByHash':
        tobeReturned = blockAPI
          .getTXIDByHash(reqparameter[1], reqparameter[2], reqparameter[3])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getChainInfo':
        tobeReturned = chainAPI
          .getChainInfo()
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getTransactionByTxID':
        tobeReturned = transactionAPI
          .getTransactionByTxID(reqparameter[1])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      default:
        console.log('typo in request');
    }
    return tobeReturned;
  }
}
