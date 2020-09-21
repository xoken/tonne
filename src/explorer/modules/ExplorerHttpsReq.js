import { httpsauth } from '../../shared/modules/Authenticator';
const apis = require('nipkow-sdk');

export default class ExplorerHttpsReq {
  static async httpsreq(...reqparameter) {
    if (
      localStorage.getItem('callsremaining') === null ||
      localStorage.getItem('callsremaining') === 3
    ) {
      httpsauth();
    }
    localStorage.setItem(
      'callsremaining',
      parseInt(localStorage.getItem('callsremaining'), 10) - 1
    );
    let tobeReturned;
    console.log(reqparameter[0]);
    switch (reqparameter[0]) {
      case 'getOutputsByAddress':
        tobeReturned = apis.addressAPI
          .getOutputsByAddress(reqparameter[1], reqparameter[2], reqparameter[3])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getBlockByBlockHash':
        tobeReturned = apis.blockAPI
          .getBlockByBlockHash(reqparameter[1])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getBlockByBlockHeight':
        tobeReturned = apis.blockAPI
          .getBlockByBlockHeight(reqparameter[1])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getBlocksByBlockHeights':
        tobeReturned = apis.blockAPI
          .getBlocksByBlockHeights(reqparameter[1])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getTXIDByHash':
        tobeReturned = apis.blockAPI
          .getTXIDByHash(reqparameter[1], reqparameter[2], reqparameter[3])
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getChainInfo':
        tobeReturned = apis.chainAPI
          .getChainInfo()
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 'getTransactionByTxID':
        tobeReturned = apis.transactionAPI
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
