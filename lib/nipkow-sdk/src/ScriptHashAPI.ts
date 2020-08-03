import { get } from './httpClient';
import Qs from 'qs';

class ScriptHashAPI {
  getOutputsByScriptHash = async (scriptHash: string, pagesize?: number) => {
    try {
      const { data } = await get(`scripthash/${scriptHash}/outputs`, {
        params: {
          pagesize,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getOutputsByScriptHashes = async (scriptHashes: string[]) => {
    try {
      const { data } = await get(`scripthashes/outputs/`, {
        params: {
          scripthash: scriptHashes,
        },
        paramsSerializer: params =>
          Qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getUTXOsByScriptHash = async (scriptHash: string, pagesize?: number) => {
    try {
      const { data } = await get(`scripthash/${scriptHash}/utxos`, {
        params: {
          pagesize,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getUTXOsByScriptHashes = async (scriptHashes: string[]) => {
    try {
      const { data } = await get(`scripthashes/utxos`, {
        params: {
          scripthash: scriptHashes,
        },
        paramsSerializer: params =>
          Qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
}

export const scriptHashAPI = new ScriptHashAPI();
