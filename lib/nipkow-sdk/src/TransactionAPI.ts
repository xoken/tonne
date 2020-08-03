import { get, post } from './httpClient';
import Qs from 'qs';
class TransactionAPI {
  getTransactionByTxID = async (txId: string) => {
    try {
      const { data } = await get(`transaction/${txId}`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  getBlocksByBlockHeights = async (txIDs: string[]) => {
    try {
      const { data } = await get(`transactions`, {
        params: {
          id: txIDs,
        },
        paramsSerializer: params =>
          Qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getRawTransactionByTxID = async (txID: string) => {
    try {
      const { data } = await get(`rawtransaction/${txID}`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  getRawTransactionByTxIDs = async (txIDs: string[]) => {
    try {
      const { data } = await get(`rawtransactions`, {
        params: {
          id: txIDs,
        },
        paramsSerializer: params =>
          Qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  broadcastRawTransaction = async (hash: string) => {
    try {
      const { data } = await post(`relaytx`, {
        params: {
          rawTx: hash,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getSpendStatusByOutpoint = async (outpoint: string) => {
    try {
      const { data } = await get(`transaction/${outpoint}/index/0`);
      return data;
    } catch (error) {
      throw error;
    }
  };
}

export const transactionAPI = new TransactionAPI();
