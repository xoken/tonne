import { get } from './httpClient';
import Qs from 'qs';

class AddressAPI {
  getOutputsByAddress = async (
    address: string,
    pagesize: number,
    cursor: number
  ) => {
    try {
      const { data } = await get(`address/${address}/outputs`, {
        params: { pagesize, cursor },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getOutputsByAddresses = async (
    addresses: string[],
    pagesize: number,
    cursor: number
  ) => {
    try {
      const { data } = await get(`addresses/outputs`, {
        params: {
          address: addresses,
          pagesize,
          cursor,
        },
        paramsSerializer: (params) =>
          Qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getUTXOsByAddress = async (
    address: string,
    pagesize: number,
    cursor: string
  ) => {
    try {
      const { data } = await get(`address/${address}/utxos`, {
        params: { pagesize, string },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getUTXOsByAddresses = async (
    addresses: string[],
    pagesize: number,
    cursor: string
  ) => {
    try {
      const { data } = await get(`addresses/utxos`, {
        params: {
          address: addresses,
          pagesize,
          string,
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

export const addressAPI = new AddressAPI();
