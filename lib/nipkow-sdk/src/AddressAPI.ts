import { get } from './httpClient';
import Qs from 'qs';

export class AddressAPI {
  getOutputsByAddress = async (address: string, pagesize: number) => {
    try {
      const { data } = await get(`address/${address}/outputs`, {
        params: { pagesize },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getOutputsByAddresses = async (addresses: string[], pagesize: number) => {
    try {
      const { data } = await get(`addresses/outputs`, {
        params: {
          address: addresses,
          pagesize,
        },
        paramsSerializer: (params) =>
          Qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getUTXOsByAddress = async (address: string, pagesize: number) => {
    try {
      const { data } = await get(`address/${address}/utxos`, {
        params: { pagesize },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getUTXOsByAddresses = async (addresses: string[], pagesize: number) => {
    try {
      const { data } = await get(`addresses/utxos`, {
        params: {
          address: addresses,
          pagesize,
        },
        paramsSerializer: (params) =>
          Qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
}
